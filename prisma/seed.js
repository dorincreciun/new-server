"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function upsertByKey(model, items) {
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
    ]);
    // Seed SizeOptions
    await upsertByKey(prisma.sizeOption, [
        { key: '25cm', label: '25cm' },
        { key: '30cm', label: '30cm' },
        { key: '35cm', label: '35cm' },
    ]);
    // Seed Flags
    await upsertByKey(prisma.flag, [
        { key: 'spicy', label: 'Picant' },
        { key: 'vegetarian', label: 'Vegetarian' },
    ]);
    // Seed Ingredients
    await upsertByKey(prisma.ingredient, [
        { key: 'mozzarella', label: 'Mozzarella' },
        { key: 'tomato', label: 'Tomato' },
    ]);
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
//# sourceMappingURL=seed.js.map