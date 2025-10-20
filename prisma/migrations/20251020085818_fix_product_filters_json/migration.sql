/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `category` ADD COLUMN `slug` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `flags` JSON NULL,
    ADD COLUMN `ingredients` JSON NULL,
    ADD COLUMN `maxPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `minPrice` DECIMAL(10, 2) NULL,
    ADD COLUMN `variants` JSON NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Category_slug_key` ON `Category`(`slug`);

-- CreateIndex
CREATE INDEX `Category_slug_idx` ON `Category`(`slug`);
