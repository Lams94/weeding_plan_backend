import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import http from 'http';
import { Server } from 'socket.io';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const prisma = new PrismaClient();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

app.use(cors());
app.use(express.json());

// --- CONFIGURATION UPLOAD APK (MULTER) ---
const downloadDir = path.join(__dirname, 'public', 'downloads');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, downloadDir);
  },
  filename: function (req, file, cb) {
    // On force toujours le nom app-release.apk pour que le lien de téléchargement soit constant
    cb(null, 'PrestigeWeddingApp.apk');
  }
});
const upload = multer({ storage: storage });

// Servir les fichiers statiques (l'APK)
app.use('/api/downloads', express.static(downloadDir));

// Route Upload APK (Dev Dash)
app.post('/api/upload-apk', upload.single('apkFile'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Aucun fichier reçu" });
  }
  res.json({ 
    message: "APK uploadé avec succès", 
    downloadUrl: `/api/downloads/PrestigeWeddingApp.apk` 
  });
});

// --- WEDDINGS (SAAS PROJECTS) ---
app.get('/api/weddings', async (req, res) => {
  const weddings = await prisma.wedding.findMany({ 
    orderBy: { createdAt: 'desc' },
    include: {
      agenda: { orderBy: { time: 'asc' } },
      vendors: true,
      guests: true
    }
  });
  res.json(weddings);
});

app.post('/api/weddings', async (req, res) => {
  const wedding = await prisma.wedding.create({ data: req.body });
  res.json(wedding);
});

app.put('/api/weddings/:id', async (req, res) => {
  const allowedFields = [
    'name',
    'date',
    'theme',
    'ownerRole',
    'brideName',
    'groomName',
    'plannerName',
    'beneficiaries',
    'baseBudget',
    'onboardingComplete'
  ];
  const data = Object.fromEntries(
    Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
  );

  if (typeof data.baseBudget === 'string') data.baseBudget = Number(data.baseBudget) || 0;
  if (typeof data.date === 'string' && data.date) data.date = new Date(data.date);

  const wedding = await prisma.wedding.update({
    where: { id: req.params.id },
    data
  });
  res.json(wedding);
});

// Middleware SaaS Multi-Projets (Bloquant)
app.use(async (req, res, next) => {
  // Certaines routes globales (ex: lister les mariages) ne nécessitent pas de projet actif
  if (req.path === '/api/weddings') return next();

  const weddingId = req.headers['x-wedding-id'];
  
  if (!weddingId) {
    return res.status(400).json({ error: "Un identifiant de mariage (x-wedding-id) est obligatoire." });
  }
  
  req.weddingId = weddingId;
  next();
});

// --- GUESTS ---
app.get('/api/guests', async (req, res) => {
  const guests = await prisma.guest.findMany({ where: { weddingId: req.weddingId } });
  res.json(guests);
});

app.post('/api/guests', async (req, res) => {
  const { weddingId, ...guestData } = req.body;
  const guest = await prisma.guest.create({ data: { ...guestData, weddingId: req.weddingId } });
  io.emit('guestCreated', guest); // Notification temps réel
  res.json(guest);
});

app.put('/api/guests/:id', async (req, res) => {
  try {
    const guest = await prisma.guest.update({
      where: { id: req.params.id },
      data: req.body,
    });
    io.emit('guestUpdated', guest); // Notification temps réel
    res.json(guest);
  } catch (error) {
    console.error("Error updating guest:", error);
    res.status(500).json({ error: "Failed to update guest" });
  }
});

// --- TABLES ---
app.get('/api/tables', async (req, res) => {
  const tables = await prisma.table.findMany({ where: { weddingId: req.weddingId } });
  res.json(tables);
});

// --- AGENDA ---
app.get('/api/agenda', async (req, res) => {
  const items = await prisma.agendaItem.findMany({ 
    where: { weddingId: req.weddingId },
    orderBy: { time: 'asc' } 
  });
  res.json(items);
});

app.post('/api/agenda', async (req, res) => {
  const item = await prisma.agendaItem.create({
    data: {
      time: req.body.time || '',
      title: req.body.title || 'Nouvelle tâche',
      description: req.body.description || '',
      isRestricted: Boolean(req.body.isRestricted),
      isDone: Boolean(req.body.isDone),
      orderIndex: Number(req.body.orderIndex) || 0,
      weddingId: req.weddingId
    }
  });
  io.emit('agendaCreated', item);
  res.json(item);
});

app.put('/api/agenda/:id', async (req, res) => {
  const item = await prisma.agendaItem.update({
    where: { id: req.params.id },
    data: req.body,
  });
  io.emit('agendaUpdated', item); // Notification temps réel
  res.json(item);
});

// --- MESSAGES ---
app.get('/api/messages', async (req, res) => {
  const messages = await prisma.message.findMany({ 
    where: { weddingId: req.weddingId },
    orderBy: { createdAt: 'asc' } 
  });
  res.json(messages);
});

app.post('/api/messages', async (req, res) => {
  const { weddingId, ...msgData } = req.body;
  const message = await prisma.message.create({ data: { ...msgData, weddingId: req.weddingId } });
  io.emit('messageCreated', message); // Notification temps réel
  res.json(message);
});

// --- TRACKS API (DJ Live Deck) ---
app.get('/api/tracks', async (req, res) => {
  const tracks = await prisma.track.findMany({ 
    where: { weddingId: req.weddingId },
    orderBy: { orderIndex: 'asc' } 
  });
  res.json(tracks);
});

app.post('/api/tracks', async (req, res) => {
  const { weddingId, ...trackData } = req.body;
  const track = await prisma.track.create({ data: { ...trackData, weddingId: req.weddingId } });
  io.emit('trackCreated', track);
  res.json(track);
});

app.put('/api/tracks/:id', async (req, res) => {
  const track = await prisma.track.update({
    where: { id: req.params.id },
    data: req.body,
  });
  io.emit('trackUpdated', track);
  res.json(track);
});

// --- VENDORS ---
app.get('/api/vendors', async (req, res) => {
  const vendors = await prisma.vendor.findMany({
    where: { weddingId: req.weddingId },
    include: { payments: { orderBy: { paidAt: 'desc' } } }
  });
  res.json(vendors);
});

app.post('/api/vendors', async (req, res) => {
  const { weddingId, ...vendorData } = req.body;
  const vendor = await prisma.vendor.create({ data: { ...vendorData, weddingId: req.weddingId } });
  res.json(vendor);
});

app.put('/api/vendors/:id', async (req, res) => {
  const vendor = await prisma.vendor.update({
    where: { id: req.params.id },
    data: req.body,
    include: { payments: { orderBy: { paidAt: 'desc' } } }
  });
  res.json(vendor);
});

app.post('/api/vendors/:id/payments', async (req, res) => {
  const amount = Number(req.body.amount) || 0;
  const payment = await prisma.vendorPayment.create({
    data: {
      vendorId: req.params.id,
      weddingId: req.weddingId,
      label: req.body.label || 'Paiement prestataire',
      amount,
      kind: req.body.kind || 'acompte',
      status: req.body.status || 'paid',
      paidAt: req.body.paidAt ? new Date(req.body.paidAt) : new Date(),
      dueDate: req.body.dueDate ? new Date(req.body.dueDate) : null
    }
  });

  const aggregate = await prisma.vendorPayment.aggregate({
    where: { vendorId: req.params.id, status: 'paid' },
    _sum: { amount: true }
  });
  const vendor = await prisma.vendor.update({
    where: { id: req.params.id },
    data: { paid: aggregate._sum.amount || 0 },
    include: { payments: { orderBy: { paidAt: 'desc' } } }
  });

  io.emit('vendorPaymentCreated', { payment, vendor });
  res.json({ payment, vendor });
});

app.delete('/api/vendor-payments/:id', async (req, res) => {
  const payment = await prisma.vendorPayment.delete({
    where: { id: req.params.id }
  });
  const aggregate = await prisma.vendorPayment.aggregate({
    where: { vendorId: payment.vendorId, status: 'paid' },
    _sum: { amount: true }
  });
  const vendor = await prisma.vendor.update({
    where: { id: payment.vendorId },
    data: { paid: aggregate._sum.amount || 0 },
    include: { payments: { orderBy: { paidAt: 'desc' } } }
  });

  io.emit('vendorPaymentDeleted', { paymentId: req.params.id, vendor });
  res.json({ ok: true, vendor });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
