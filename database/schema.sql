-- ============================================================
-- REFORM PHASE — Database Schema (MySQL)
-- Database: gymapp
-- ============================================================

CREATE DATABASE IF NOT EXISTS `gymapp`;
USE `gymapp`;

-- 1. Plans Table
CREATE TABLE IF NOT EXISTS `plans` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `duration_days` INT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Initial default plan tiers
INSERT INTO `plans` (`id`, `name`, `price`, `duration_days`) VALUES
(1, 'Monthly', 999.00, 30),
(2, 'Quarterly', 2499.00, 90),
(3, 'Annual', 7999.00, 365)
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`), `price`=VALUES(`price`), `duration_days`=VALUES(`duration_days`);

-- 2. Members Table
CREATE TABLE IF NOT EXISTS `members` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `phone` VARCHAR(15) DEFAULT NULL,
  `email` VARCHAR(100) DEFAULT NULL,
  `plan_type` VARCHAR(50) DEFAULT NULL,
  `join_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 3. Attendance Table
CREATE TABLE IF NOT EXISTS `attendance` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NOT NULL,
  `date` DATE NOT NULL,
  `status` ENUM('present','absent') DEFAULT 'absent',
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_attendance` (`member_id`,`date`),
  CONSTRAINT `attendance_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 4. Fees Table
CREATE TABLE IF NOT EXISTS `fees` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `member_id` INT NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `due_date` DATE NOT NULL,
  `paid_date` DATE DEFAULT NULL,
  `status` ENUM('paid','unpaid') DEFAULT 'unpaid',
  PRIMARY KEY (`id`),
  KEY `member_id` (`member_id`),
  CONSTRAINT `fees_ibfk_1` FOREIGN KEY (`member_id`) REFERENCES `members` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
