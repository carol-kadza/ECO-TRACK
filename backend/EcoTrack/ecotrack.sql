CREATE DATABASE ecotrack_db;

use ecotrack_db;

SHOW Tables;
DESCRIBE businesses;
ALTER TABLE `users` 
ADD COLUMN `two_factor_enabled` BOOLEAN DEFAULT FALSE AFTER `password`,
ADD COLUMN `two_factor_secret` VARCHAR(255) DEFAULT NULL AFTER `two_factor_enabled`,
ADD COLUMN `two_factor_backup_codes` TEXT DEFAULT NULL AFTER `two_factor_secret`;

CREATE INDEX idx_two_factor_enabled ON users(two_factor_enabled);
SHOW COLUMNS FROM businesses LIKE 'type';
DELETE FROM users WHERE password NOT LIKE '$2a$%';
SHOW COLUMNS FROM products LIKE 'unit';
SELECT id, name, business_id FROM products;
SHOW CREATE TABLE inventorytransactions;
DESCRIBE inventorytransactions;
SHOW COLUMNS FROM inventorytransactions LIKE 'transaction_type';
ALTER TABLE businesses 
MODIFY COLUMN type ENUM('grocery', 'restaurant', 'bakery', 'cafe', 'catering', 'other') DEFAULT 'grocery';
SELECT id, name, type FROM businesses WHERE type = 'food_processing';


UPDATE businesses SET type = 'other' WHERE type = 'food_processing';