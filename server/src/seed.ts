import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.shul.count();
  if (count > 0) {
      console.log('Shuls already seeded');
      return;
  }
  const hendon = await prisma.shul.create({
    data: {
      name: 'Hendon Adath',
      area: 'Hendon',
      address: 'Brent Street'
    }
  });

  const golders = await prisma.shul.create({
    data: {
      name: 'Golders Green Shul',
      area: 'Golders Green',
      address: 'Dunstan Road'
    }
  });

  console.log('Seeded shuls:', hendon, golders);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
