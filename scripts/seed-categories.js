const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const categories = [
  { name: 'Pizza', slug: 'pizza', description: 'Pizza clasice și speciale' },
  { name: 'Paste', slug: 'paste', description: 'Paste proaspete și sosuri' },
  { name: 'Salate', slug: 'salate', description: 'Salate proaspete' },
  { name: 'Desert', slug: 'desert', description: 'Deserturi delicioase' },
  { name: 'Băuturi', slug: 'bauturi', description: 'Băuturi răcoritoare' }
];

async function seedCategories() {
  try {
    console.log('Seeding categorii...');
    for (const cat of categories) {
      await prisma.category.upsert({
        where: { slug: cat.slug },
        update: { name: cat.name, description: cat.description },
        create: cat,
      });
      console.log(`- ${cat.name} (${cat.slug})`);
    }
    console.log('Seed categorii finalizat.');
  } catch (e) {
    console.error('Eroare la seed categorii:', e);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();
