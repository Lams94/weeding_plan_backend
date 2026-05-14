import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // --- AGENDA STATE ---
  await prisma.agendaItem.createMany({
    data: [
      { time: '10:00', title: 'Mise en Beauté', description: 'Suite Prestige. Hair & Makeup artist arrival. Breakfast service arranged.', isRestricted: false, isDone: true, orderIndex: 1 },
      { time: '13:30', title: 'Séance Photo (Vue Privée)', description: 'First look in the private gardens. Exclusive access only. Security detail assigned.', isRestricted: true, isDone: false, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBThzbb7OGhcNnN_z_JcRoKphDzEfy877pVzH_x-y5s_9up1mVMhINNN54HmOY41lVjHNTIXrZwCaRz1vsTNJ6JPfkKbgiVaYJi_2uyyik9P37kH9obZ1Pa7E57pPxa9S7IrtbSXohvLUO8GAWOrz2pq2BXSrkvB2QEIO1BBU8LfAwQsUmr-K9ofgK5MjNeVetlUDL8Q2eS93OoVE1lobQAdDRyrNP3ccyiXfpBhnAKK88emdLZ5V-CfrmLLlyvVlW1RBTakz6exjWd', orderIndex: 2 },
      { time: '16:00', title: 'Cérémonie', description: 'Main hall. Guests seated by 15:45. Orchestral prelude begins.', isRestricted: false, isDone: false, orderIndex: 3 }
    ]
  });

  // --- MESSAGES STATE ---
  await prisma.message.createMany({
    data: [
      { sender: 'Florist Team', time: '12:45', text: '"Centerpieces are in place in the grand hall. Waiting for final lighting check."', isImportant: false, senderColor: 'primary' },
      { sender: 'DJ / Sound', time: '13:10', text: '"Musique prête pour l\'entrée du gâteau. Cue is locked."', isImportant: true, senderColor: 'tertiary' },
      { sender: 'Catering Mgt', time: '13:15', text: '"Champagne tower construction beginning in the foyer."', isImportant: false, senderColor: 'primary' }
    ]
  });

  // --- TABLES STATE ---
  const t1 = await prisma.table.create({
    data: { name: 'T1 - Famille', topPos: 'top-20', leftPos: 'left-20', sizeClass: 'w-32 h-32', chairs: 4 }
  });
  const t2 = await prisma.table.create({
    data: { name: 'T2 - Honneur', topPos: 'top-20', leftPos: 'right-40', sizeClass: 'w-40 h-40', chairs: 6 }
  });
  const t3 = await prisma.table.create({
    data: { name: 'T3 - Amis', topPos: 'bottom-32', leftPos: 'left-1/2 -translate-x-1/2', sizeClass: 'w-32 h-32', chairs: 4 }
  });

  // --- GUESTS STATE ---
  await prisma.guest.createMany({
    data: [
      { name: 'Eleanor Vance', circle: 'Family', status: 'Confirmed', agendaVis: true, diet: false, groupName: 'Vance Family', email: 'eleanor@example.com' },
      { name: 'Theodore Montague', circle: 'VIP', status: 'Pending', agendaVis: false, diet: false, groupName: 'Groom Friends', email: 'theo@example.com' },
      { name: 'Sophia Laurent', circle: 'Friends', status: 'Confirmed', agendaVis: true, diet: true, groupName: 'Bride Friends', email: 'sophia@example.com', tableId: t1.id },
      { name: 'Arthur Pendelton', circle: 'Family', status: 'Declined', agendaVis: false, diet: false, groupName: 'Pendelton Family', email: 'arthur@example.com' },
      { name: 'Isabella Rossi', circle: 'Friends', status: 'Pending', agendaVis: true, diet: false, groupName: 'Bride Friends', email: 'bella@example.com', tableId: t2.id },
    ]
  });

  // --- VENDORS STATE ---
  await prisma.vendor.createMany({
    data: [
      { role: 'Floral Design', name: 'Maison Botanique', status: 'Confirmed', budget: 12500, paid: 6250, phone: '+33 6 12 34 56 78', isCritical: true },
      { role: 'Gastronomy', name: 'Chef Laurent Dubois', status: 'Pending Menu', budget: 45000, paid: 15000, phone: '+33 6 98 76 54 32', isCritical: true },
      { role: 'Photography', name: 'Studio Lumière', status: 'Confirmed', budget: 8500, paid: 8500, phone: '+33 6 11 22 33 44', isCritical: false },
      { role: 'Sound & Light', name: 'Aura Productions', status: 'Setup Phase', budget: 15000, paid: 5000, phone: '+33 6 99 88 77 66', isCritical: true }
    ]
  });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
