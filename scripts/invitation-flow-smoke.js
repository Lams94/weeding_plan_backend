import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const PORT = process.env.INVITATION_TEST_PORT || '3991';
const API_BASE_URL = `http://127.0.0.1:${PORT}`;

let serverProcess;
let wedding;
let guest;

async function waitForServer() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const res = await fetch(`${API_BASE_URL}/health`);
      if (res.ok) return;
    } catch {
      // Server still booting.
    }
    await wait(500);
  }
  throw new Error('Le serveur de test ne répond pas sur /health.');
}

function startServer() {
  serverProcess = spawn(process.execPath, ['server.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PORT
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  serverProcess.stdout.on('data', data => process.stdout.write(`[server] ${data}`));
  serverProcess.stderr.on('data', data => process.stderr.write(`[server] ${data}`));
}

async function createFixture() {
  wedding = await prisma.wedding.create({
    data: {
      name: 'Test Faire-Part Codex',
      brideName: 'Camille',
      groomName: 'Noah',
      onboardingComplete: true,
      invitationTitle: 'Vous êtes invités',
      invitationMessage: 'Camille et Noah vous invitent à célébrer leur mariage.',
      invitationDetails: 'Cérémonie, dîner et soirée.',
      invitationBackText: 'Merci de répondre avant la fin du mois.',
      invitationStyle: 'linen'
    }
  });

  guest = await prisma.guest.create({
    data: {
      name: 'Invité Smoke Test',
      email: 'smoke-test@example.com',
      circle: 'VIP',
      status: 'Pending',
      weddingId: wedding.id
    }
  });
}

async function assertInvitationCanBeOpened() {
  const res = await fetch(`${API_BASE_URL}/api/public/invitations/${wedding.id}/${guest.id}`);
  if (!res.ok) {
    throw new Error(`Ouverture faire-part échouée: HTTP ${res.status} ${await res.text()}`);
  }

  const invitation = await res.json();
  if (invitation.wedding.id !== wedding.id) throw new Error('Le faire-part ne renvoie pas le bon mariage.');
  if (invitation.guest.id !== guest.id) throw new Error("Le faire-part ne renvoie pas le bon invité.");
  if (invitation.guest.status !== 'Pending') throw new Error('Le statut initial RSVP devrait être Pending.');
}

async function assertRsvp(status) {
  const res = await fetch(`${API_BASE_URL}/api/public/invitations/${wedding.id}/${guest.id}/rsvp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (!res.ok) {
    throw new Error(`Réponse RSVP ${status} échouée: HTTP ${res.status} ${await res.text()}`);
  }

  const updatedGuest = await prisma.guest.findUnique({ where: { id: guest.id } });
  if (updatedGuest.status !== status) {
    throw new Error(`Statut RSVP attendu ${status}, reçu ${updatedGuest.status}.`);
  }
}

async function cleanup() {
  if (guest?.id) await prisma.guest.deleteMany({ where: { id: guest.id } });
  if (wedding?.id) await prisma.wedding.deleteMany({ where: { id: wedding.id } });
  await prisma.$disconnect();
  if (serverProcess) serverProcess.kill();
}

async function main() {
  try {
    startServer();
    await waitForServer();
    await createFixture();
    await assertInvitationCanBeOpened();
    await assertRsvp('Confirmed');
    await assertRsvp('Declined');
    console.log('OK - Parcours faire-part public + RSVP validé.');
  } catch (error) {
    console.error('\nTest faire-part échoué.');
    console.error(error.message);
    console.error('\nÀ vérifier: le schéma Prisma doit être appliqué sur une base de test avec les champs invitation*.'); 
    process.exitCode = 1;
  } finally {
    await cleanup();
  }
}

main();
