-- Clear existing sample data first (in reverse dependency order)
DELETE FROM consumption_record WHERE stakeholder_id IN ('S001', 'S002', 'S003', 'S004');
DELETE FROM nutrition_targets WHERE product_id IN ('P001', 'P002', 'P003');
DELETE FROM weather_daily WHERE weather_id IN ('W001', 'W002', 'W003', 'W004', 'W005');
DELETE FROM price WHERE product_id IN ('P001', 'P002', 'P003');
DELETE FROM transaction WHERE transaction_id IN ('T001', 'T002', 'T003');
DELETE FROM stakeholder WHERE stakeholder_id IN ('S001', 'S002', 'S003', 'S004');
DELETE FROM production WHERE production_id IN ('PR001', 'PR002', 'PR003');
DELETE FROM product WHERE product_id IN ('P001', 'P002', 'P003');

-- Note: Districts and stakeholder_types are already inserted in the schema
-- Insert sample products (matching the actual table structure)
INSERT IGNORE INTO product (product_id, name, type, variety, sowing_time, harvest_time, seed_requirement_per_acre) VALUES
('P001', 'Rice', 'Cereal', 'BRRI dhan29', 'June-July', 'November-December', 25.0),
('P002', 'Wheat', 'Cereal', 'BARI Gom-26', 'November-December', 'March-April', 120.0),
('P003', 'Potato', 'Vegetable', 'Diamond', 'November-December', 'February-March', 1500.0);

-- Add sample production data
INSERT IGNORE INTO production (production_id, product_id, district_id, date, acreage, quantity_produced) VALUES
('PR001', 'P001', 1, '2024-08-01', 100, 2500),
('PR002', 'P002', 2, '2024-08-01', 150, 4500),
('PR003', 'P003', 3, '2024-08-01', 80, 1200);

-- Add sample stakeholders
INSERT IGNORE INTO stakeholder (stakeholder_id, name, type_id, district_id, contact_info) VALUES
('S001', 'Rahman Farm', 1, 1, 'rahman@email.com'),
('S002', 'Dhaka Wholesale Market', 2, 1, '01712345678'),
('S003', 'City Retail Store', 3, 2, 'citystore@email.com'),
('S004', 'Ahmed Consumer', 4, 1, '01898765432');

-- Add sample transactions
INSERT IGNORE INTO transaction (transaction_id, buyer_id, seller_id, product_id, quantity, price_per_unit, total_amount, date) VALUES
('T001', 'S002', 'S001', 'P001', 100, 45.50, 4550.00, '2024-08-15'),
('T002', 'S003', 'S002', 'P001', 50, 48.00, 2400.00, '2024-08-16'),
('T003', 'S004', 'S003', 'P002', 25, 52.00, 1300.00, '2024-08-17');

-- Add sample price data
INSERT IGNORE INTO price (product_id, district_id, date, price_per_unit) VALUES
('P001', 1, '2024-08-15', 45.50),
('P001', 2, '2024-08-15', 46.00),
('P002', 1, '2024-08-15', 51.00),
('P002', 2, '2024-08-15', 52.00),
('P003', 1, '2024-08-15', 85.00);

-- Add sample weather data
INSERT IGNORE INTO weather_daily (weather_id, district_id, date, rainfall, temperature) VALUES
('W001', 1, '2024-08-15', 15.5, 32.5),
('W002', 2, '2024-08-15', 8.2, 31.8),
('W003', 3, '2024-08-15', 22.1, 30.9),
('W004', 1, '2024-08-16', 5.0, 33.2),
('W005', 2, '2024-08-16', 12.8, 32.1);

-- Add nutrition targets
INSERT IGNORE INTO nutrition_targets (product_id, month, year, per_capita_requirement) VALUES
('P001', 8, 2024, 15.5),
('P002', 8, 2024, 12.0),
('P003', 8, 2024, 8.5);

-- Add consumption records
INSERT IGNORE INTO consumption_record (stakeholder_id, product_id, date, quantity) VALUES
('S004', 'P001', '2024-08-15', 5),
('S004', 'P002', '2024-08-16', 3),
('S004', 'P003', '2024-08-17', 2);
