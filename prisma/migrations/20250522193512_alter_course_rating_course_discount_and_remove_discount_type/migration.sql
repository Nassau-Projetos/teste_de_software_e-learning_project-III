/*
  Warnings:

  - You are about to drop the column `discountType` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `discountValue` on the `courses` table. All the data in the column will be lost.
  - Made the column `instructorId` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_instructorId_fkey`;

-- DropIndex
DROP INDEX `courses_instructorId_fkey` ON `courses`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `discountType`,
    DROP COLUMN `discountValue`,
    ADD COLUMN `discountExpiresAt` DATETIME(3) NULL,
    ADD COLUMN `discountPercentage` DECIMAL(5, 2) NULL,
    ADD COLUMN `ratingCount` INTEGER NOT NULL DEFAULT 0,
    MODIFY `instructorId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_instructorId_fkey` FOREIGN KEY (`instructorId`) REFERENCES `instructors`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
