/*
  Warnings:

  - You are about to drop the column `status` on the `courses` table. All the data in the column will be lost.
  - The values [INTERMEDIATE] on the enum `courses_level` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `CourseCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseModule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CourseRating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `CourseModule` DROP FOREIGN KEY `CourseModule_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `CourseRating` DROP FOREIGN KEY `CourseRating_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `courses` DROP FOREIGN KEY `courses_courseCategoryId_fkey`;

-- DropIndex
DROP INDEX `courses_courseCategoryId_fkey` ON `courses`;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `status`,
    ADD COLUMN `statusId` INTEGER NOT NULL DEFAULT 1,
    MODIFY `level` ENUM('BEGINNER', 'INTERMEDIARY', 'ADVANCED') NOT NULL;

-- DropTable
DROP TABLE `CourseCategory`;

-- DropTable
DROP TABLE `CourseModule`;

-- DropTable
DROP TABLE `CourseRating`;

-- CreateTable
CREATE TABLE `courseCategories` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `icon` VARCHAR(191) NOT NULL,
    `courseCount` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courseStatus` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courseModules` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NULL DEFAULT CURRENT_TIMESTAMP(3),
    `publishedAt` DATE NULL,
    `courseId` VARCHAR(191) NOT NULL,
    `statusId` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `courseRatings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `value` INTEGER NOT NULL,
    `courseId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_courseCategoryId_fkey` FOREIGN KEY (`courseCategoryId`) REFERENCES `courseCategories`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courses` ADD CONSTRAINT `courses_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `courseStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courseModules` ADD CONSTRAINT `courseModules_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courseModules` ADD CONSTRAINT `courseModules_statusId_fkey` FOREIGN KEY (`statusId`) REFERENCES `courseStatus`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `courseRatings` ADD CONSTRAINT `courseRatings_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
