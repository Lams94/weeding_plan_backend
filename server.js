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

const scopedNotFound = (res, label = 'Resource') => {
  res.status(404).json({ error: `${label} not found for this wedding` });
};

async function updateScoped(model, id, weddingId, data, options = {}) {
  const result = await prisma[model].updateMany({
    where: { id, weddingId },
    data
  });
  if (result.count === 0) return null;
  return prisma[model].findUnique({
    where: { id },
    ...options
  });
}

const ROLES = {
  SUPER_USER: 'super_user',
  COUPLE: 'couple',
  WEDDING_PLANNER: 'wedding_planner',
  VENDOR: 'vendor',
  GUEST: 'guest',
  BENEFICIARY: 'beneficiary'
};

const VALID_ROLES = new Set(Object.values(ROLES));

const canUseGlobalWeddingRoute = (method, role) => {
  if (method === 'GET') {
    return [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER, ROLES.BENEFICIARY].includes(role);
  }
  if (method === 'POST') {
    return [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER].includes(role);
  }
  return false;
};

function roleDenied(res) {
  res.status(403).json({ error: 'Access denied for this role' });
}

function requireAnyRole(req, res, roles) {
  if (roles.includes(req.accessRole)) return true;
  roleDenied(res);
  return false;
}

function canAccessProjectApi(req) {
  const role = req.accessRole;
  const method = req.method;
  const path = req.path;
  const isWrite = !['GET', 'HEAD', 'OPTIONS'].includes(method);
  const projectEditors = [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER];

  if (path === '/api/agenda') {
    return isWrite
      ? projectEditors.includes(role)
      : [...projectEditors, ROLES.VENDOR, ROLES.GUEST, ROLES.BENEFICIARY].includes(role);
  }
  if (path.startsWith('/api/agenda/')) return projectEditors.includes(role);

  if (path === '/api/messages') {
    return method === 'POST'
      ? [...projectEditors, ROLES.VENDOR].includes(role)
      : [...projectEditors, ROLES.VENDOR, ROLES.GUEST].includes(role);
  }

  if (path === '/api/thoughts') {
    if (isWrite) return [ROLES.SUPER_USER, ROLES.COUPLE].includes(role);
    return [ROLES.SUPER_USER, ROLES.COUPLE].includes(role)
      || (role === ROLES.WEDDING_PLANNER && Boolean(req.wedding?.plannerCanSeePrivateThoughts));
  }

  if (path === '/api/access-profiles' || path.startsWith('/api/access-profiles/')) {
    return projectEditors.includes(role);
  }

  if (path === '/api/guests' || path.startsWith('/api/guests/')) {
    return projectEditors.includes(role);
  }

  if (path === '/api/tables') {
    return isWrite ? projectEditors.includes(role) : [...projectEditors, ROLES.VENDOR].includes(role);
  }
  if (path.startsWith('/api/tables/')) return projectEditors.includes(role);

  if (path === '/api/tracks' || path.startsWith('/api/tracks/')) {
    return [...projectEditors, ROLES.VENDOR].includes(role);
  }

  if (path === '/api/vendors') {
    return isWrite ? projectEditors.includes(role) : [...projectEditors, ROLES.VENDOR].includes(role);
  }
  if (path.startsWith('/api/vendors/') || path.startsWith('/api/vendor-payments/')) {
    return projectEditors.includes(role);
  }

  if (path === '/api/budget-documents') {
    return isWrite
      ? projectEditors.includes(role)
      : [...projectEditors, ROLES.BENEFICIARY].includes(role);
  }
  if (path.startsWith('/api/budget-documents/')) {
    return method === 'GET'
      ? [...projectEditors, ROLES.BENEFICIARY].includes(role)
      : projectEditors.includes(role);
  }

  return false;
}

const defaultPlanningTasks = [
  ['J-365', 'Définir le budget de base', 'Valider l’enveloppe globale avec les mariés et les bénéficiaires.'],
  ['J-300', 'Réserver le lieu', 'Comparer les lieux, bloquer la date et suivre l’acompte.'],
  ['J-240', 'Sélectionner les prestataires', 'Traiteur, photo, vidéo, musique, décoration et coordination.'],
  ['J-180', 'Construire la liste invités', 'Ajouter les invités, groupes, RSVP et besoins alimentaires.'],
  ['J-120', 'Valider contrats et acomptes', 'Contrôler les contrats prestataires et les premiers paiements.'],
  ['J-60', 'Finaliser plan de table et timings', 'Construire le plan de salle et le timing cérémonie/réception.'],
  ['J-30', 'Contrôler factures et soldes', 'Vérifier les montants payés, restes à payer et confirmations.'],
  ['Jour J', 'Coordination terrain', 'Suivre l’accueil invités, les prestataires et les imprévus.']
];

app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'wedding-plan-backend' });
});

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Database health check failed:', error);
    res.status(500).json({
      status: 'error',
      database: 'unreachable',
      message: error.message
    });
  }
});

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

app.get('/api/public/invitations/:weddingId/:guestId', async (req, res) => {
  try {
    const [wedding, guest] = await Promise.all([
      prisma.wedding.findUnique({
        where: { id: req.params.weddingId },
        select: {
          id: true,
          name: true,
          date: true,
          brideName: true,
          groomName: true,
          venueAddress: true,
          invitationTitle: true,
          invitationMessage: true,
          invitationDetails: true,
          invitationDesignUrl: true,
          invitationBackText: true,
          invitationStyle: true,
          rsvpConfirmedMessage: true,
          rsvpDeclinedMessage: true,
          agenda: {
            where: {
              OR: [
                { audience: 'all' },
                { audience: 'guest' }
              ]
            },
            orderBy: { orderIndex: 'asc' }
          }
        }
      }),
      prisma.guest.findFirst({
        where: { id: req.params.guestId, weddingId: req.params.weddingId },
        select: { id: true, name: true, status: true, groupName: true, circle: true, calendarGroup: true }
      })
    ]);

    if (!wedding || !guest) return scopedNotFound(res, 'Invitation');
    res.json({ wedding, guest });
  } catch (error) {
    console.error('Error fetching public invitation:', error);
    res.status(500).json({ error: 'Failed to fetch invitation' });
  }
});

app.post('/api/public/invitations/:weddingId/:guestId/rsvp', async (req, res) => {
  try {
    const status = req.body.status === 'Declined' ? 'Declined' : 'Confirmed';
    const result = await prisma.guest.updateMany({
      where: { id: req.params.guestId, weddingId: req.params.weddingId },
      data: { status }
    });
    if (result.count === 0) return scopedNotFound(res, 'Invitation');

    const guest = await prisma.guest.findUnique({ where: { id: req.params.guestId } });
    io.emit('guestUpdated', guest);
    res.json({ ok: true, guest });
  } catch (error) {
    console.error('Error updating public RSVP:', error);
    res.status(500).json({ error: 'Failed to update RSVP' });
  }
});

app.use((req, res, next) => {
  if (!req.path.startsWith('/api')) return next();

  const role = String(req.headers['x-access-role'] || '').trim();
  if (!VALID_ROLES.has(role)) {
    return res.status(401).json({ error: 'A valid x-access-role header is required.' });
  }

  req.accessRole = role;

  if (req.path === '/api/weddings') {
    return canUseGlobalWeddingRoute(req.method, role) ? next() : roleDenied(res);
  }

  if (req.path.startsWith('/api/weddings/')) {
    return requireAnyRole(req, res, [ROLES.SUPER_USER, ROLES.COUPLE, ROLES.WEDDING_PLANNER]) ? next() : undefined;
  }

  next();
});

// --- WEDDINGS (SAAS PROJECTS) ---
app.get('/api/weddings', async (req, res) => {
  try {
    const weddings = await prisma.wedding.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        agenda: { orderBy: { time: 'asc' } },
        vendors: { include: { payments: { orderBy: { paidAt: 'desc' } }, documents: { orderBy: { createdAt: 'desc' } } } },
        guests: true,
        thoughts: true,
        accessProfiles: true,
        budgetDocuments: { orderBy: { createdAt: 'desc' } }
      }
    });
    res.json(weddings);
  } catch (error) {
    console.error('Error fetching weddings:', error);
    res.status(500).json({ error: 'Failed to fetch weddings', message: error.message });
  }
});

app.post('/api/weddings', async (req, res) => {
  try {
    const name = typeof req.body.name === 'string' && req.body.name.trim()
      ? req.body.name.trim()
      : 'Nouveau mariage';
    const wedding = await prisma.wedding.create({
      data: {
        name,
        date: req.body.date ? new Date(req.body.date) : null,
        theme: req.body.theme || 'theme-linen-pure',
        ownerRole: req.body.ownerRole || 'wedding_planner',
        brideName: req.body.brideName || null,
        groomName: req.body.groomName || null,
        plannerName: req.body.plannerName || null,
        beneficiaries: req.body.beneficiaries || null,
        baseBudget: Number(req.body.baseBudget) || 0,
        onboardingComplete: Boolean(req.body.onboardingComplete),
        plannerAccessEnabled: Boolean(req.body.plannerAccessEnabled),
        plannerDelegationMode: req.body.plannerDelegationMode || 'none',
        plannerCanSeePrivateThoughts: Boolean(req.body.plannerCanSeePrivateThoughts),
        plannerCanSeeCoupleDirectMessages: Boolean(req.body.plannerCanSeeCoupleDirectMessages),
        vendorDelegationMode: req.body.vendorDelegationMode || 'couple',
        venueAddress: req.body.venueAddress || null,
        venueAccessTime: req.body.venueAccessTime || null,
        vendorInstructions: req.body.vendorInstructions || null,
        invitationTitle: req.body.invitationTitle || null,
        invitationMessage: req.body.invitationMessage || null,
        invitationDetails: req.body.invitationDetails || null,
        invitationDesignUrl: req.body.invitationDesignUrl || null,
        invitationBackText: req.body.invitationBackText || null,
        invitationStyle: req.body.invitationStyle || 'linen',
        rsvpConfirmedMessage: req.body.rsvpConfirmedMessage || null,
        rsvpDeclinedMessage: req.body.rsvpDeclinedMessage || null,
        agenda: {
          create: defaultPlanningTasks.map(([time, title, description], index) => ({
            time,
            title,
            description,
            orderIndex: index + 1,
            isRestricted: title.toLowerCase().includes('factures'),
            isDone: false
          }))
        },
        tables: {
          create: [
            { name: 'T1 - Famille', topPos: 'top-20', leftPos: 'left-20', sizeClass: 'w-32 h-32', chairs: 4 },
            { name: 'T2 - Honneur', topPos: 'top-20', leftPos: 'right-40', sizeClass: 'w-40 h-40', chairs: 6 },
            { name: 'T3 - Amis', topPos: 'bottom-32', leftPos: 'left-1/2 -translate-x-1/2', sizeClass: 'w-32 h-32', chairs: 4 }
          ]
        }
      },
      include: {
        agenda: { orderBy: { orderIndex: 'asc' } },
        vendors: { include: { payments: { orderBy: { paidAt: 'desc' } }, documents: { orderBy: { createdAt: 'desc' } } } },
        guests: true,
        tables: true,
        thoughts: true,
        accessProfiles: true,
        budgetDocuments: { orderBy: { createdAt: 'desc' } }
      }
    });
    res.json(wedding);
  } catch (error) {
    console.error('Error creating wedding:', error);
    res.status(500).json({ error: 'Failed to create wedding', message: error.message });
  }
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
    'onboardingComplete',
    'plannerAccessEnabled',
    'plannerDelegationMode',
    'plannerCanSeePrivateThoughts',
    'plannerCanSeeCoupleDirectMessages',
    'vendorDelegationMode',
    'venueAddress',
    'venueAccessTime',
    'vendorInstructions',
    'invitationTitle',
    'invitationMessage',
    'invitationDetails',
    'invitationDesignUrl',
    'invitationBackText',
    'invitationStyle',
    'rsvpConfirmedMessage',
    'rsvpDeclinedMessage'
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
  if (req.path === '/api/weddings' || req.path.startsWith('/api/weddings/')) return next();

  const weddingId = req.headers['x-wedding-id'];
  
  if (!weddingId) {
    return res.status(400).json({ error: "Un identifiant de mariage (x-wedding-id) est obligatoire." });
  }

  const wedding = await prisma.wedding.findUnique({
    where: { id: weddingId },
    select: {
      id: true,
      plannerAccessEnabled: true,
      plannerCanSeePrivateThoughts: true,
      plannerCanSeeCoupleDirectMessages: true
    }
  });

  if (!wedding) return scopedNotFound(res, 'Wedding');
  
  req.weddingId = weddingId;
  req.wedding = wedding;
  if (!canAccessProjectApi(req)) return roleDenied(res);
  next();
});

// --- GUESTS ---
app.get('/api/guests', async (req, res) => {
  const guests = await prisma.guest.findMany({ where: { weddingId: req.weddingId } });
  res.json(guests);
});

// --- PRIVATE COUPLE THOUGHTS ---
app.get('/api/thoughts', async (req, res) => {
  const where = { weddingId: req.weddingId };
  if (req.accessRole === ROLES.WEDDING_PLANNER) where.sharedWithPlanner = true;
  const thoughts = await prisma.weddingThought.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });
  res.json(thoughts);
});

app.post('/api/thoughts', async (req, res) => {
  const thought = await prisma.weddingThought.create({
    data: {
      weddingId: req.weddingId,
      title: req.body.title || 'Nouvelle pensée',
      content: req.body.content || '',
      imageUrl: req.body.imageUrl || null,
      sharedWithPlanner: Boolean(req.body.sharedWithPlanner)
    }
  });
  res.json(thought);
});

// --- ACCESS PROFILES ---
app.get('/api/access-profiles', async (req, res) => {
  const profiles = await prisma.projectAccess.findMany({
    where: { weddingId: req.weddingId },
    orderBy: { createdAt: 'desc' }
  });
  res.json(profiles);
});

app.post('/api/access-profiles', async (req, res) => {
  const profile = await prisma.projectAccess.create({
    data: {
      weddingId: req.weddingId,
      role: req.body.role || 'guest',
      displayName: req.body.displayName || null,
      email: req.body.email || null,
      vendorId: req.body.vendorId || null,
      guestId: req.body.guestId || null,
      isSuperUser: Boolean(req.body.isSuperUser),
      permissions: req.body.permissions || {}
    }
  });
  res.json(profile);
});

app.put('/api/access-profiles/:id', async (req, res) => {
  const allowedFields = ['role', 'displayName', 'email', 'vendorId', 'guestId', 'isSuperUser', 'permissions'];
  const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
  const profile = await updateScoped('projectAccess', req.params.id, req.weddingId, data);
  if (!profile) return scopedNotFound(res, 'Access profile');
  res.json(profile);
});

app.post('/api/guests', async (req, res) => {
  const { weddingId, ...guestData } = req.body;
  const guest = await prisma.guest.create({
    data: {
      ...guestData,
      calendarGroup: req.body.calendarGroup || req.body.groupName || req.body.circle || null,
      weddingId: req.weddingId
    }
  });
  io.emit('guestCreated', guest); // Notification temps réel
  res.json(guest);
});

app.put('/api/guests/:id', async (req, res) => {
  try {
    const guest = await updateScoped('guest', req.params.id, req.weddingId, req.body);
    if (!guest) return scopedNotFound(res, 'Guest');
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

app.post('/api/tables', async (req, res) => {
  try {
    const table = await prisma.table.create({
      data: {
        name: req.body.name || 'Nouvelle table',
        topPos: String(req.body.topPos ?? '50'),
        leftPos: String(req.body.leftPos ?? '50'),
        sizeClass: req.body.sizeClass || 'round:96',
        chairs: Number(req.body.chairs) || 8,
        weddingId: req.weddingId
      }
    });
    io.emit('tableCreated', table);
    res.json(table);
  } catch (error) {
    console.error('Error creating table:', error);
    res.status(500).json({ error: 'Failed to create table' });
  }
});

app.put('/api/tables/:id', async (req, res) => {
  try {
    const allowed = ['name', 'topPos', 'leftPos', 'sizeClass', 'chairs'];
    const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowed.includes(key)));
    if (data.topPos != null) data.topPos = String(data.topPos);
    if (data.leftPos != null) data.leftPos = String(data.leftPos);
    if (data.chairs != null) data.chairs = Number(data.chairs) || 0;
    const table = await updateScoped('table', req.params.id, req.weddingId, data);
    if (!table) return scopedNotFound(res, 'Table');
    io.emit('tableUpdated', table);
    res.json(table);
  } catch (error) {
    console.error('Error updating table:', error);
    res.status(500).json({ error: 'Failed to update table' });
  }
});

app.delete('/api/tables/:id', async (req, res) => {
  try {
    await prisma.guest.updateMany({ where: { weddingId: req.weddingId, tableId: req.params.id }, data: { tableId: null } });
    const result = await prisma.table.deleteMany({ where: { id: req.params.id, weddingId: req.weddingId } });
    if (result.count === 0) return scopedNotFound(res, 'Table');
    io.emit('tableDeleted', { id: req.params.id });
    res.json({ ok: true });
  } catch (error) {
    console.error('Error deleting table:', error);
    res.status(500).json({ error: 'Failed to delete table' });
  }
});

// --- AGENDA ---
app.get('/api/agenda', async (req, res) => {
  const where = { weddingId: req.weddingId };
  if (req.accessRole === ROLES.GUEST) {
    const guestGroup = String(req.headers['x-guest-group'] || '');
    where.OR = [
      { audience: 'all' },
      { audience: ROLES.GUEST, guestGroup: null },
      { audience: ROLES.GUEST, guestGroup }
    ];
  } else if (req.accessRole === ROLES.VENDOR) {
    where.OR = [
      { audience: 'all' },
      { audience: ROLES.VENDOR }
    ];
  } else if (req.accessRole === ROLES.BENEFICIARY) {
    where.OR = [
      { audience: 'all' },
      { audience: ROLES.BENEFICIARY }
    ];
  }

  const items = await prisma.agendaItem.findMany({ 
    where,
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
      audience: req.body.audience || 'all',
      guestGroup: req.body.guestGroup || null,
      vendorRole: req.body.vendorRole || null,
      weddingId: req.weddingId
    }
  });
  io.emit('agendaCreated', item);
  res.json(item);
});

app.put('/api/agenda/:id', async (req, res) => {
  const item = await updateScoped('agendaItem', req.params.id, req.weddingId, req.body);
  if (!item) return scopedNotFound(res, 'Agenda item');
  io.emit('agendaUpdated', item); // Notification temps réel
  res.json(item);
});

// --- MESSAGES ---
app.get('/api/messages', async (req, res) => {
  const where = { weddingId: req.weddingId };
  if (req.query.channel) where.channel = String(req.query.channel);
  if (req.query.audience) where.audience = String(req.query.audience);
  if (req.query.vendorId) where.vendorId = String(req.query.vendorId);
  if (req.query.guestId) where.guestId = String(req.query.guestId);
  if (req.accessRole === ROLES.WEDDING_PLANNER && !req.wedding.plannerCanSeeCoupleDirectMessages) {
    where.NOT = [{ channel: 'couple_direct' }, { isPrivate: true }];
  }
  if (req.accessRole === ROLES.VENDOR) {
    where.OR = [
      { audience: ROLES.VENDOR },
      { channel: 'planner_vendor' },
      { channel: 'day_logistics' }
    ];
  }
  if (req.accessRole === ROLES.GUEST) {
    where.OR = [
      { audience: ROLES.GUEST },
      { channel: 'day_logistics' }
    ];
  }
  const messages = await prisma.message.findMany({ 
    where,
    orderBy: { createdAt: 'asc' } 
  });
  res.json(messages);
});

app.post('/api/messages', async (req, res) => {
  const { weddingId, ...msgData } = req.body;
  const channel = req.body.channel || 'backstage';
  if (channel === 'couple_direct') {
    const canWriteCoupleDirect = [ROLES.SUPER_USER, ROLES.COUPLE].includes(req.accessRole)
      || (req.accessRole === ROLES.WEDDING_PLANNER && req.wedding.plannerCanSeeCoupleDirectMessages);
    if (!canWriteCoupleDirect) return roleDenied(res);
  }
  if (req.accessRole === ROLES.VENDOR && !['planner_vendor', 'day_logistics'].includes(channel)) {
    return roleDenied(res);
  }
  const message = await prisma.message.create({
    data: {
      ...msgData,
      channel,
      audience: req.body.audience || 'planner',
      isPrivate: Boolean(req.body.isPrivate),
      weddingId: req.weddingId
    }
  });
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
  const track = await updateScoped('track', req.params.id, req.weddingId, req.body);
  if (!track) return scopedNotFound(res, 'Track');
  io.emit('trackUpdated', track);
  res.json(track);
});

// --- VENDORS ---
app.get('/api/vendors', async (req, res) => {
  const vendors = await prisma.vendor.findMany({
    where: { weddingId: req.weddingId },
    include: {
      payments: { orderBy: { paidAt: 'desc' } },
      documents: { orderBy: { createdAt: 'desc' } }
    }
  });
  res.json(vendors);
});

app.post('/api/vendors', async (req, res) => {
  const { weddingId, ...vendorData } = req.body;
  const vendor = await prisma.vendor.create({
    data: {
      ...vendorData,
      accessRole: req.body.accessRole || req.body.role || null,
      accessEnabled: Boolean(req.body.accessEnabled),
      canMessageCouple: Boolean(req.body.canMessageCouple),
      canMessagePlanner: req.body.canMessagePlanner !== false,
      canSeeGuestList: Boolean(req.body.canSeeGuestList),
      canSeeFloorPlan: Boolean(req.body.canSeeFloorPlan || String(req.body.role || '').toLowerCase().includes('dj')),
      canSeeMusicStudio: Boolean(req.body.canSeeMusicStudio || String(req.body.role || '').toLowerCase().includes('dj')),
      weddingId: req.weddingId
    }
  });
  res.json(vendor);
});

app.put('/api/vendors/:id', async (req, res) => {
  const vendor = await updateScoped('vendor', req.params.id, req.weddingId, req.body, {
    include: {
      payments: { orderBy: { paidAt: 'desc' } },
      documents: { orderBy: { createdAt: 'desc' } }
    }
  });
  if (!vendor) return scopedNotFound(res, 'Vendor');
  res.json(vendor);
});

app.post('/api/vendors/:id/payments', async (req, res) => {
  const vendorExists = await prisma.vendor.findFirst({
    where: { id: req.params.id, weddingId: req.weddingId },
    select: { id: true }
  });
  if (!vendorExists) return scopedNotFound(res, 'Vendor');

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
    include: {
      payments: { orderBy: { paidAt: 'desc' } },
      documents: { orderBy: { createdAt: 'desc' } }
    }
  });

  io.emit('vendorPaymentCreated', { payment, vendor });
  res.json({ payment, vendor });
});

// --- BUDGET DOCUMENTS / QUOTES ---
app.get('/api/budget-documents', async (req, res) => {
  const documents = await prisma.budgetDocument.findMany({
    where: { weddingId: req.weddingId },
    include: { vendor: true },
    orderBy: { createdAt: 'desc' }
  });
  res.json(documents);
});

app.post('/api/budget-documents', async (req, res) => {
  const document = await prisma.budgetDocument.create({
    data: {
      weddingId: req.weddingId,
      vendorId: req.body.vendorId || null,
      title: req.body.title || 'Document budget',
      type: req.body.type || 'devis_propose',
      status: req.body.status || 'active',
      amount: req.body.amount === '' || req.body.amount == null ? null : Number(req.body.amount),
      documentUrl: req.body.documentUrl || null,
      fileName: req.body.fileName || null,
      notes: req.body.notes || null,
      declinedReason: req.body.declinedReason || null,
      isVerified: Boolean(req.body.isVerified),
      verifiedAt: req.body.isVerified ? new Date() : null,
      verifiedBy: req.body.verifiedBy || null,
      paymentId: req.body.paymentId || null,
      requestedAt: req.body.requestedAt ? new Date(req.body.requestedAt) : null,
      receivedAt: req.body.receivedAt ? new Date(req.body.receivedAt) : null
    },
    include: { vendor: true }
  });
  res.json(document);
});

app.put('/api/budget-documents/:id', async (req, res) => {
  const allowedFields = ['vendorId', 'paymentId', 'title', 'type', 'status', 'amount', 'documentUrl', 'fileName', 'notes', 'declinedReason', 'isVerified', 'verifiedAt', 'verifiedBy', 'requestedAt', 'receivedAt'];
  const data = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
  if ('amount' in data) data.amount = data.amount === '' || data.amount == null ? null : Number(data.amount);
  if ('isVerified' in data && data.isVerified && !data.verifiedAt) data.verifiedAt = new Date();
  if ('isVerified' in data && !data.isVerified) data.verifiedAt = null;
  if ('verifiedAt' in data) data.verifiedAt = data.verifiedAt ? new Date(data.verifiedAt) : null;
  if ('requestedAt' in data) data.requestedAt = data.requestedAt ? new Date(data.requestedAt) : null;
  if ('receivedAt' in data) data.receivedAt = data.receivedAt ? new Date(data.receivedAt) : null;
  const document = await updateScoped('budgetDocument', req.params.id, req.weddingId, data, {
    include: { vendor: true }
  });
  if (!document) return scopedNotFound(res, 'Budget document');
  res.json(document);
});

app.delete('/api/budget-documents/:id', async (req, res) => {
  const result = await prisma.budgetDocument.deleteMany({ where: { id: req.params.id, weddingId: req.weddingId } });
  if (result.count === 0) return scopedNotFound(res, 'Budget document');
  res.json({ ok: true });
});

app.delete('/api/vendor-payments/:id', async (req, res) => {
  const paymentToDelete = await prisma.vendorPayment.findFirst({
    where: { id: req.params.id, weddingId: req.weddingId }
  });
  if (!paymentToDelete) return scopedNotFound(res, 'Vendor payment');

  const payment = await prisma.vendorPayment.delete({
    where: { id: paymentToDelete.id }
  });
  const aggregate = await prisma.vendorPayment.aggregate({
    where: { vendorId: payment.vendorId, weddingId: req.weddingId, status: 'paid' },
    _sum: { amount: true }
  });
  const vendor = await prisma.vendor.update({
    where: { id: payment.vendorId },
    data: { paid: aggregate._sum.amount || 0 },
    include: {
      payments: { orderBy: { paidAt: 'desc' } },
      documents: { orderBy: { createdAt: 'desc' } }
    }
  });

  io.emit('vendorPaymentDeleted', { paymentId: req.params.id, vendor });
  res.json({ ok: true, vendor });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
