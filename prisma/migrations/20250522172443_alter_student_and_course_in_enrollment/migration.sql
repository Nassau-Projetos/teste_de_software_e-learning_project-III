/*
  Warnings:

  - Made the column `studentId` on table `enrollments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `courseId` on table `enrollments` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `enrollments` DROP FOREIGN KEY `enrollments_courseId_fkey`;

-- DropForeignKey
ALTER TABLE `enrollments` DROP FOREIGN KEY `enrollments_studentId_fkey`;

-- DropIndex
DROP INDEX `enrollments_courseId_fkey` ON `enrollments`;

-- DropIndex
DROP INDEX `enrollments_studentId_fkey` ON `enrollments`;

-- AlterTable
ALTER TABLE `enrollments` MODIFY `studentId` VARCHAR(191) NOT NULL,
    MODIFY `courseId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `enrollments` ADD CONSTRAINT `enrollments_courseId_fkey` FOREIGN KEY (`courseId`) REFERENCES `courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
