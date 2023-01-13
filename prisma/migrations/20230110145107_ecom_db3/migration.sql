-- AlterTable
ALTER TABLE `customers` ADD COLUMN `gender` ENUM('Female', 'Male') NOT NULL DEFAULT 'Male';
