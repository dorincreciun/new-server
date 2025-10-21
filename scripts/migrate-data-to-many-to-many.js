const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function migrateDataToManyToMany() {
  try {
    console.log('Încep migrarea datelor către relații many-to-many...');
    
    // Obține toate produsele cu datele JSON existente
    const products = await prisma.product.findMany({
      select: {
        id: true,
        flags: true,
        ingredients: true,
        variants: true
      }
    });

    console.log(`Am găsit ${products.length} produse pentru migrare`);

    // Creează catalogul de flaguri
    const flagMap = new Map();
    const ingredientMap = new Map();
    const doughTypeMap = new Map();
    const sizeOptionMap = new Map();

    // Colectează toate valorile unice
    for (const product of products) {
      // Procesează flaguri
      if (product.flags && Array.isArray(product.flags)) {
        for (const flag of product.flags) {
          if (typeof flag === 'string' && !flagMap.has(flag)) {
            const created = await prisma.flag.create({
              data: { key: flag, label: flag }
            });
            flagMap.set(flag, created.id);
          }
        }
      }

      // Procesează ingrediente
      if (product.ingredients && Array.isArray(product.ingredients)) {
        for (const ingredient of product.ingredients) {
          if (typeof ingredient === 'string' && !ingredientMap.has(ingredient)) {
            const created = await prisma.ingredient.create({
              data: { key: ingredient, label: ingredient }
            });
            ingredientMap.set(ingredient, created.id);
          }
        }
      }

      // Procesează variante
      if (product.variants && typeof product.variants === 'object') {
        const variants = product.variants;
        
        // Procesează tipuri de aluat
        if (variants.crust && Array.isArray(variants.crust)) {
          for (const crust of variants.crust) {
            if (typeof crust === 'string' && !doughTypeMap.has(crust)) {
              const created = await prisma.doughType.create({
                data: { key: crust, label: crust }
              });
              doughTypeMap.set(crust, created.id);
            }
          }
        }

        // Procesează mărimi
        if (variants.size && Array.isArray(variants.size)) {
          for (const size of variants.size) {
            if (typeof size === 'string' && !sizeOptionMap.has(size)) {
              const created = await prisma.sizeOption.create({
                data: { key: size, label: size }
              });
              sizeOptionMap.set(size, created.id);
            }
          }
        }
      }
    }

    console.log(`Am creat ${flagMap.size} flaguri, ${ingredientMap.size} ingrediente, ${doughTypeMap.size} tipuri de aluat, ${sizeOptionMap.size} mărimi`);

    // Creează relațiile many-to-many
    for (const product of products) {
      // Creează relații pentru flaguri
      if (product.flags && Array.isArray(product.flags)) {
        for (const flag of product.flags) {
          if (typeof flag === 'string' && flagMap.has(flag)) {
            await prisma.productFlag.create({
              data: {
                productId: product.id,
                flagId: flagMap.get(flag)
              }
            }).catch(() => {
              // Ignoră erorile de duplicat
            });
          }
        }
      }

      // Creează relații pentru ingrediente
      if (product.ingredients && Array.isArray(product.ingredients)) {
        for (const ingredient of product.ingredients) {
          if (typeof ingredient === 'string' && ingredientMap.has(ingredient)) {
            await prisma.productIngredient.create({
              data: {
                productId: product.id,
                ingredientId: ingredientMap.get(ingredient)
              }
            }).catch(() => {
              // Ignoră erorile de duplicat
            });
          }
        }
      }

      // Creează relații pentru variante
      if (product.variants && typeof product.variants === 'object') {
        const variants = product.variants;
        const basePrice = 25; // Preț de bază

        // Creează variante pentru combinații de crust și size
        if (variants.crust && variants.size) {
          for (const crust of variants.crust) {
            for (const size of variants.size) {
              if (typeof crust === 'string' && typeof size === 'string') {
                const price = basePrice + (variants.crust.indexOf(crust) * 5) + (variants.size.indexOf(size) * 10);
                
                await prisma.productVariant.create({
                  data: {
                    productId: product.id,
                    doughTypeId: doughTypeMap.get(crust),
                    sizeOptionId: sizeOptionMap.get(size),
                    price: price,
                    isDefault: variants.crust.indexOf(crust) === 0 && variants.size.indexOf(size) === 0
                  }
                });
              }
            }
          }
        }
      }
    }

    console.log('Migrarea datelor s-a finalizat cu succes!');
    
    // Afișează statistici
    const flagCount = await prisma.productFlag.count();
    const ingredientCount = await prisma.productIngredient.count();
    const variantCount = await prisma.productVariant.count();
    
    console.log(`\nStatistici finale:`);
    console.log(`- Relații flaguri: ${flagCount}`);
    console.log(`- Relații ingrediente: ${ingredientCount}`);
    console.log(`- Variante produse: ${variantCount}`);

  } catch (error) {
    console.error('Eroare la migrarea datelor:', error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateDataToManyToMany();
