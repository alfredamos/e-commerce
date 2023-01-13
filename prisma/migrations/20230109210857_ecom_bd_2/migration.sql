-- AlterTable
ALTER TABLE `customers` ADD COLUMN `userType` ENUM('Customer', 'Admin') NOT NULL DEFAULT 'Customer';
