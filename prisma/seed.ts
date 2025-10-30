import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function upsertByKey<T extends { key: string; label?: string | null }>(
  model: any,
  items: Array<{ key: string; label?: string | null }>,
) {
  for (const item of items) {
    await model.upsert({
      where: { key: item.key },
      update: { label: item.label ?? null },
      create: { key: item.key, label: item.label ?? null },
    });
  }
}

async function main() {
  // Seed DoughTypes
  await upsertByKey(prisma.doughType, [
    { key: 'thin', label: 'Subțire' },
    { key: 'traditional', label: 'Tradițional' },
    { key: 'integral', label: 'Integral' },
    { key: 'gros', label: 'Gros' },
  ]);
  await upsertByKey(prisma.sizeOption, [
    { key: '25cm', label: '25cm' },
    { key: '30cm', label: '30cm' },
    { key: '35cm', label: '35cm' },
    { key: '40cm', label: '40cm' },
  ]);
  await upsertByKey(prisma.flag, [
    { key: 'spicy', label: 'Picant' },
    { key: 'vegetarian', label: 'Vegetarian' },
    { key: 'premium', label: 'Premium' },
    { key: 'new', label: 'Nouă!' },
    { key: 'popular', label: 'Populară' },
  ]);
  await upsertByKey(prisma.ingredient, [
    { key: 'mozzarella', label: 'Mozzarella' },
    { key: 'tomato', label: 'Tomate' },
    { key: 'salam', label: 'Salam' },
    { key: 'ciuperci', label: 'Ciuperci' },
    { key: 'bacon', label: 'Bacon' },
    { key: 'porumb', label: 'Porumb' },
    { key: 'masline', label: 'Măsline' },
    { key: 'busuioc', label: 'Busuioc' },
    { key: 'patate', label: 'Cartofi' },
    { key: 'sunca', label: 'Șuncă' },
    { key: 'ananas', label: 'Ananas' },
    { key: 'ton', label: 'Ton' },
    { key: 'ceapa', label: 'Ceapă' },
    { key: 'gorgonzola', label: 'Gorgonzola' },
    { key: 'smantana', label: 'Smântână' },
    { key: 'rosii_cherry', label: 'Roșii cherry' },
    { key: 'carciofi', label: 'Anghinare' },
    { key: 'ardei', label: 'Ardei' },
  ]);

  // Categorii
  const categoriesSeed = [
    { slug: 'clasice', name: 'Pizza Clasice' },
    { slug: 'speciale', name: 'Pizza Speciale' },
    { slug: 'vegetariene', name: 'Pizza Vegetariene' },
    { slug: 'picante', name: 'Pizza Picante' },
    { slug: 'albe', name: 'Pizza Albe' },
    { slug: 'gourmet', name: 'Pizza Gourmet' },
  ];
  for (const cat of categoriesSeed) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    });
  }

  // Nume, categorii, ingrediente, flaguri diverse
  const pizzaNames = [
    'Margherita','Quattro Formaggi','Diavola','Prosciutto e Funghi','Vegetariana','Capricciosa','Tonno','Romana','Salami','Hawaii',
    'Pollo','Carciofi','Bufalina','Speck','Rustica','Spinaci','Ortolana','Tricolore','Calzone','Mare e Monti','Salsiccia',
    'Boscaiola','Melanzane','Patate','Gamberetti',
    ...Array.from({ length: 15 }, (_, i) => `Fantasia ${i+1}`)
  ];
  const pizzaCategories = ['clasice','speciale','vegetariene','picante','albe','gourmet'];
  const pizzaFlagsOpts = [[],[],['vegetarian'],['spicy'],['premium'],['new'],['popular']];
  const pizzaIngredOpts = [
    ['mozzarella','tomato','busuioc'],['mozzarella','gorgonzola','smantana'],['salam','mozzarella','tomato'],
    ['mozzarella','sunca','ciuperci','tomato'],['mozzarella','ardei','masline','ciuperci','tomato'],['mozzarella','ciuperci','sunca','masline','tomato'],
    ['ton','ceapa','mozzarella','masline','tomato'],['mozzarella','sunca','masline','tomato'],['mozzarella','salam','tomato'],
    ['sunca','ananas','mozzarella','tomato'],['mozzarella','bacon','porumb','rosii_cherry'],['carciofi','smantana','mozzarella','rosii_cherry'],
    ['mozzarella','busuioc','rosii_cherry'],['mozzarella','bacon','smantana'],['mozzarella','rosii_cherry','porumb','bacon'],['mozzarella','smantana','ciuperci'],
    ['mozzarella','ardei','masline','porumb','tomato'],['mozzarella','ciuperci','rosii_cherry','busuioc'],['mozzarella','sunca','smantana','tomato'],
    ['bacon','ton','mozzarella','tomato'],['mozzarella','bacon','ciuperci','tomato'],['mozzarella','ciuperci','bacon','tomato'],
    ['mozzarella','smantana','rosii_cherry'],['mozzarella','bacon','patate','smantana'],['mozzarella','ton','rosii_cherry'],
    ...Array.from({ length: 15 }, () => ['mozzarella','tomato','patate','bacon'])
  ];
  const doughTypes = await prisma.doughType.findMany();
  const sizeOptions = await prisma.sizeOption.findMany();

  let totalVariants = 0;
  for (let i = 0; i < pizzaNames.length; ++i) {
    const name = pizzaNames[i] || `Pizza${i}`;
    const categorySlug = pizzaCategories[i % pizzaCategories.length] || pizzaCategories[0];
    const ingredients = pizzaIngredOpts[i] || [];
    const flags = pizzaFlagsOpts[i % pizzaFlagsOpts.length] || [];
    const category = await prisma.category.findUnique({ where: { slug: categorySlug || "" } });
    if (!category) continue;
    const product = await prisma.product.create({
      data: {
        name,
        description: `Pizza ${name} cu ${ingredients.join(', ')}`,
        basePrice: 20 + Math.random() * 10,
        minPrice: 22,
        maxPrice: 39,
        imageUrl: null,
        popularity: Math.round(Math.random() * 80),
        isCustomizable: true,
        stock: 80 + Math.floor(Math.random() * 200),
        categoryId: category.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    });
    for (const ingKey of ingredients) {
      const ingredient = await prisma.ingredient.findUnique({ where: { key: ingKey } });
      if (ingredient) {
        await prisma.productIngredient.create({ data: { productId: product.id, ingredientId: ingredient.id } });
      }
    }
    for (const flgKey of flags) {
      const flag = await prisma.flag.findUnique({ where: { key: flgKey } });
      if (flag) {
        await prisma.productFlag.create({ data: { productId: product.id, flagId: flag.id } });
      }
    }
    // 4 aluaturi × 4 mărimi = 16 variante/pizza --> 40×16=640 variante
    for (const dough of doughTypes) {
      for (const size of sizeOptions) {
        await prisma.productVariant.create({
          data: {
            productId: product.id,
            price: 18 + Math.round(13 * Math.random()),
            stock: 25 + Math.floor(Math.random() * 80),
            isDefault: size.key==='30cm' && dough.key==='traditional',
            doughId: dough.id,
            sizeId: size.id
          }
        });
        totalVariants++;
      }
    }
  }
  console.log(`Seed complet: ${pizzaNames.length} pizza × ${doughTypes.length} aluaturi × ${sizeOptions.length} mărimi = ${totalVariants} variante!`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Seed completed.');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
