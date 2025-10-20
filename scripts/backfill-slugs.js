require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

function slugify(name) {
  return String(name || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

(async () => {
  const prisma = new PrismaClient();
  try {
    const categories = await prisma.category.findMany({ select: { id: true, name: true, slug: true } });
    const used = new Set();
    for (const c of categories) {
      if (c.slug) { used.add(c.slug); continue; }
      const base = slugify(c.name);
      let candidate = base || `cat-${c.id}`;
      let i = 1;
      while (used.has(candidate)) {
        candidate = `${base}-${i++}`;
      }
      used.add(candidate);
      await prisma.category.update({ where: { id: c.id }, data: { slug: candidate } });
    }
    console.log('✅ Backfill slugs done');
  } catch (e) {
    console.error('Backfill error:', e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
})();



