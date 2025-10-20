const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Date pentru generarea produselor pizza
const pizzaNames = [
  // Pizza clasice
  'Pizza Margherita', 'Pizza Quattro Stagioni', 'Pizza Capricciosa', 'Pizza Quattro Formaggi',
  'Pizza Diavola', 'Pizza Boscaiola', 'Pizza Napoletana', 'Pizza Romana',
  'Pizza Siciliana', 'Pizza Marinara', 'Pizza Funghi', 'Pizza Prosciutto',
  
  // Pizza cu carne
  'Pizza Pepperoni', 'Pizza BBQ Chicken', 'Pizza Meat Lovers', 'Pizza Salami',
  'Pizza Bacon & Cheese', 'Pizza Ham & Pineapple', 'Pizza Sausage', 'Pizza Beef',
  'Pizza Chicken Supreme', 'Pizza Turkey & Ham', 'Pizza Pork Belly', 'Pizza Lamb',
  
  // Pizza vegetariene
  'Pizza Vegetariana', 'Pizza Garden Fresh', 'Pizza Mediterranean', 'Pizza Veggie Supreme',
  'Pizza Spinach & Ricotta', 'Pizza Eggplant', 'Pizza Zucchini', 'Pizza Artichoke',
  'Pizza Broccoli', 'Pizza Cauliflower', 'Pizza Bell Peppers', 'Pizza Onion',
  
  // Pizza cu fructe de mare
  'Pizza Frutti di Mare', 'Pizza Shrimp', 'Pizza Calamari', 'Pizza Tuna',
  'Pizza Anchovy', 'Pizza Salmon', 'Pizza Crab', 'Pizza Lobster',
  
  // Pizza speciale
  'Pizza Truffle', 'Pizza Gorgonzola', 'Pizza Brie', 'Pizza Goat Cheese',
  'Pizza Buffalo', 'Pizza Hawaiian', 'Pizza Tex-Mex', 'Pizza Indian Spicy',
  'Pizza Thai', 'Pizza Chinese', 'Pizza Mexican', 'Pizza Greek',
  
  // Pizza cu sosuri speciale
  'Pizza Pesto', 'Pizza Alfredo', 'Pizza Carbonara', 'Pizza Arrabbiata',
  'Pizza Aglio e Olio', 'Pizza Marinara Special', 'Pizza White Sauce', 'Pizza Spicy Red',
  
  // Pizza cu topping-uri unice
  'Pizza Arugula', 'Pizza Sun-dried Tomatoes', 'Pizza Olives', 'Pizza Capers',
  'Pizza Roasted Garlic', 'Pizza Caramelized Onions', 'Pizza Roasted Peppers', 'Pizza Fresh Basil',
  
  // Pizza cu crust special
  'Pizza Thin Crust', 'Pizza Thick Crust', 'Pizza Stuffed Crust', 'Pizza Gluten-Free',
  'Pizza Whole Wheat', 'Pizza Cauliflower Crust', 'Pizza Keto', 'Pizza Low-Carb',
  
  // Pizza cu dimensiuni speciale
  'Pizza Personal', 'Pizza Small', 'Pizza Medium', 'Pizza Large', 'Pizza Extra Large',
  'Pizza Family Size', 'Pizza Party Size', 'Pizza Mini', 'Pizza Slice',
  
  // Pizza cu stiluri regionale
  'Pizza Chicago Deep Dish', 'Pizza New York Style', 'Pizza Detroit Style', 'Pizza California',
  'Pizza Neapolitan', 'Pizza Roman', 'Pizza Sicilian', 'Pizza Genovese',
  
  // Pizza cu ingrediente premium
  'Pizza Premium', 'Pizza Gourmet', 'Pizza Artisan', 'Pizza Craft',
  'Pizza Signature', 'Pizza Chef Special', 'Pizza House Special', 'Pizza Restaurant Special'
];

const ingredients = [
  'mozzarella', 'tomato sauce', 'basil', 'oregano', 'garlic', 'onion',
  'pepperoni', 'salami', 'ham', 'bacon', 'chicken', 'beef', 'pork',
  'mushrooms', 'bell peppers', 'olives', 'pineapple', 'spinach', 'arugula',
  'tomatoes', 'artichokes', 'eggplant', 'zucchini', 'broccoli', 'cauliflower',
  'shrimp', 'anchovies', 'tuna', 'salmon', 'crab', 'lobster',
  'parmesan', 'ricotta', 'gorgonzola', 'brie', 'goat cheese', 'feta',
  'truffle', 'sun-dried tomatoes', 'capers', 'roasted garlic', 'caramelized onions',
  'fresh basil', 'rosemary', 'thyme', 'sage', 'chili flakes', 'black pepper'
];

const flags = [
  'vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'spicy', 'mild',
  'hot', 'premium', 'organic', 'fresh', 'artisan', 'gourmet',
  'healthy', 'low-carb', 'keto', 'protein-rich', 'low-calorie', 'high-fiber'
];

const variants = {
  size: ['small', 'medium', 'large', 'extra-large', 'personal', 'family'],
  crust: ['thin', 'thick', 'stuffed', 'gluten-free', 'whole-wheat', 'cauliflower'],
  sauce: ['tomato', 'white', 'pesto', 'bbq', 'buffalo', 'marinara'],
  cheese: ['mozzarella', 'extra-mozzarella', 'light-mozzarella', 'no-cheese']
};

const descriptions = [
  'Delicioasă pizza cu ingrediente proaspete și aromă autentică',
  'Pizza tradițională preparată după rețeta clasică',
  'Pizza premium cu ingrediente de calitate superioară',
  'Pizza artizanală preparată cu grijă și pasiune',
  'Pizza cu gust autentic și ingrediente naturale',
  'Pizza specială cu combinații unice de ingrediente',
  'Pizza gourmet cu preparare atentă și prezentare elegantă',
  'Pizza cu ingrediente organice și gust natural',
  'Pizza tradițională cu influențe moderne',
  'Pizza cu rețetă secretă și ingrediente selecte'
];

const imageBaseUrls = [
  'https://images.unsplash.com/photo-1548365328-9f547fb0953b?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542834369-f10ebf06d3cb?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541529086526-db283c563270?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544989164-31dc3c645987?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1548366086-7f1d25422a71?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543770419-c47a48b27076?q=80&w=1200&auto=format&fit=crop'
];

function generateImageUrl(index) {
  const base = imageBaseUrls[index % imageBaseUrls.length];
  // adaugă semn de întrebare pentru a evita cache rigid pe unele CDN-uri
  return `${base}&ixid=seed_${index}`;
}

// Funcție pentru generarea unui nume de pizza unic
function generateUniquePizzaName() {
  const baseName = pizzaNames[Math.floor(Math.random() * pizzaNames.length)];
  const variations = ['Classic', 'Special', 'Premium', 'Gourmet', 'Artisan', 'Signature', 'House', 'Chef'];
  const variation = variations[Math.floor(Math.random() * variations.length)];
  
  // 30% șanse să adaug o variație
  if (Math.random() < 0.3) {
    return `${baseName} ${variation}`;
  }
  return baseName;
}

// Funcție pentru generarea ingredienților
function generateIngredients() {
  const numIngredients = Math.floor(Math.random() * 6) + 3; // 3-8 ingrediente
  const shuffled = [...ingredients].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numIngredients);
}

// Funcție pentru generarea flagurilor
function generateFlags() {
  const numFlags = Math.floor(Math.random() * 4) + 1; // 1-4 flaguri
  const shuffled = [...flags].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numFlags);
}

// Funcție pentru generarea variantelor
function generateVariants() {
  const variantTypes = Object.keys(variants);
  const selectedVariants = {};
  
  // Selectează 1-3 tipuri de variante
  const numVariants = Math.floor(Math.random() * 3) + 1;
  const selectedTypes = variantTypes.sort(() => 0.5 - Math.random()).slice(0, numVariants);
  
  selectedTypes.forEach(type => {
    const options = variants[type];
    const numOptions = Math.floor(Math.random() * 3) + 1; // 1-3 opțiuni
    const selectedOptions = options.sort(() => 0.5 - Math.random()).slice(0, numOptions);
    selectedVariants[type] = selectedOptions;
  });
  
  return selectedVariants;
}

// Funcție pentru generarea prețurilor
function generatePrice() {
  const basePrice = Math.random() * 40 + 15; // 15-55 RON
  return Math.round(basePrice * 100) / 100; // Rotunjire la 2 zecimale
}

// Funcție pentru generarea prețurilor min/max pentru variante
function generatePriceRange(basePrice) {
  const minPrice = basePrice * 0.7; // 70% din prețul de bază
  const maxPrice = basePrice * 1.5; // 150% din prețul de bază
  
  return {
    minPrice: Math.round(minPrice * 100) / 100,
    maxPrice: Math.round(maxPrice * 100) / 100
  };
}

async function generatePizzaProducts() {
  try {
    console.log('Încep generarea produselor pizza...');
    
    // Obține categoriile existente
    const categories = await prisma.category.findMany();
    if (categories.length === 0) {
      console.log('Nu există categorii în baza de date. Te rog să creezi mai întâi categoriile.');
      return;
    }
    
    console.log(`Am găsit ${categories.length} categorii:`, categories.map(c => c.name));
    
    // Generează 350 de produse pizza
    const productsToCreate = [];
    const usedNames = new Set();
    
    for (let i = 0; i < 350; i++) {
      let name;
      let attempts = 0;
      
      // Generează un nume unic
      do {
        name = generateUniquePizzaName();
        attempts++;
      } while (usedNames.has(name) && attempts < 10);
      
      if (usedNames.has(name)) {
        name = `${name} ${i + 1}`; // Adaugă un număr dacă nu poate genera un nume unic
      }
      
      usedNames.add(name);
      
      const basePrice = generatePrice();
      const priceRange = generatePriceRange(basePrice);
      const category = categories[Math.floor(Math.random() * categories.length)];
      
      const product = {
        name,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        price: basePrice,
        stock: Math.floor(Math.random() * 50) + 10, // 10-59 bucăți
        categoryId: category.id,
        imageUrl: generateImageUrl(i),
        flags: generateFlags(),
        ingredients: generateIngredients(),
        variants: generateVariants(),
        minPrice: priceRange.minPrice,
        maxPrice: priceRange.maxPrice
      };
      
      productsToCreate.push(product);
    }
    
    console.log(`Am generat ${productsToCreate.length} produse. Încep inserarea în baza de date...`);
    
    // Inserează produsele în baza de date (în batch-uri de 50)
    const batchSize = 50;
    for (let i = 0; i < productsToCreate.length; i += batchSize) {
      const batch = productsToCreate.slice(i, i + batchSize);
      await prisma.product.createMany({
        data: batch,
        skipDuplicates: true
      });
      console.log(`Am inserat batch-ul ${Math.floor(i / batchSize) + 1}/${Math.ceil(productsToCreate.length / batchSize)}`);
    }
    
    console.log('Generarea produselor pizza s-a finalizat cu succes!');
    
    // Afișează statistici
    const totalProducts = await prisma.product.count();
    const productsByCategory = await prisma.product.groupBy({
      by: ['categoryId'],
      _count: { categoryId: true }
    });
    
    console.log(`\nStatistici:`);
    console.log(`Total produse: ${totalProducts}`);
    console.log('Produse pe categorii:');
    for (const group of productsByCategory) {
      const category = categories.find(c => c.id === group.categoryId);
      console.log(`- ${category?.name || 'Necunoscută'}: ${group._count.categoryId} produse`);
    }
    
  } catch (error) {
    console.error('Eroare la generarea produselor:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Rulează scriptul
generatePizzaProducts();

