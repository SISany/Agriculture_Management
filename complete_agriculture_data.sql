-- =====================================================
-- COMPLETE AGRICULTURE DATABASE WITH DUMMY DATA
-- Fixed DATE column issues and comprehensive data
-- =====================================================

-- Clear existing data (in reverse dependency order to handle foreign keys)
DELETE FROM consumption_record;
DELETE FROM nutrition_targets;
DELETE FROM weather_daily;
DELETE FROM inventory;
DELETE FROM shipment;
DELETE FROM warehouse;
DELETE FROM price;
DELETE FROM transaction;
DELETE FROM production;
DELETE FROM stakeholder;
DELETE FROM product;

-- Note: Districts and stakeholder_types are assumed to be already populated from schema

-- =====================================================
-- PRODUCTS - Major Agricultural Products in Bangladesh
-- =====================================================
INSERT INTO product (product_id, name, type, variety, sowing_time, harvest_time, seed_requirement_per_acre) VALUES
-- Rice varieties (main crop)
('P001', 'Rice (Aman)', 'Cereal', 'BRRI dhan29', 'June-July', 'November-December', 25.0),
('P002', 'Rice (Boro)', 'Cereal', 'BRRI dhan28', 'December-January', 'April-May', 30.0),
('P003', 'Rice (Aus)', 'Cereal', 'BRRI dhan27', 'March-April', 'July-August', 28.0),
('P004', 'Rice (Aromatic)', 'Cereal', 'BRRI dhan34', 'July-August', 'December-January', 22.0),

-- Wheat varieties
('P005', 'Wheat', 'Cereal', 'BARI Gom-26', 'November-December', 'March-April', 120.0),
('P006', 'Wheat (Durum)', 'Cereal', 'BARI Gom-25', 'November-December', 'March-April', 125.0),

-- Potato varieties
('P007', 'Potato', 'Vegetable', 'Diamond', 'November-December', 'February-March', 1500.0),
('P008', 'Potato (Sweet)', 'Vegetable', 'BARI Mistialu-2', 'October-November', 'January-February', 800.0),

-- Jute varieties
('P009', 'Jute (White)', 'Fiber', 'CVL-1', 'March-May', 'July-September', 8.0),
('P010', 'Jute (Tossa)', 'Fiber', 'O-9897', 'March-May', 'July-September', 10.0),

-- Vegetables
('P011', 'Onion', 'Vegetable', 'BARI Piaz-1', 'October-November', 'March-April', 15.0),
('P012', 'Garlic', 'Vegetable', 'BARI Rashun-1', 'October-November', 'March-April', 200.0),
('P013', 'Tomato', 'Vegetable', 'BARI Tomato-2', 'October-November', 'February-March', 0.3),
('P014', 'Cabbage', 'Vegetable', 'Atlas 70', 'September-October', 'December-January', 0.5),
('P015', 'Cauliflower', 'Vegetable', 'Snowball 16', 'September-October', 'December-January', 0.4),
('P016', 'Brinjal', 'Vegetable', 'BARI Begun-4', 'October-November', 'January-April', 0.2),
('P017', 'Okra', 'Vegetable', 'BARI Dheros-1', 'March-April', 'June-August', 12.0),
('P018', 'Bitter Gourd', 'Vegetable', 'BARI Karola-1', 'March-April', 'June-August', 3.0),
('P019', 'Bottle Gourd', 'Vegetable', 'BARI Lau-4', 'February-March', 'May-June', 2.5),
('P020', 'Cucumber', 'Vegetable', 'BARI Shosha-1', 'October-November', 'January-February', 2.0),

-- Pulses
('P021', 'Lentil (Masur)', 'Pulse', 'BARI Masur-4', 'October-November', 'February-March', 30.0),
('P022', 'Chickpea', 'Pulse', 'BARI Chola-5', 'November-December', 'March-April', 60.0),
('P023', 'Black Gram', 'Pulse', 'BARI Mash-1', 'August-September', 'November-December', 25.0),
('P024', 'Mung Bean', 'Pulse', 'BARI Mung-2', 'February-March', 'May-June', 20.0),
('P025', 'Field Pea', 'Pulse', 'BARI Motor-3', 'November-December', 'February-March', 80.0),

-- Cash crops and spices
('P026', 'Sugarcane', 'Cash Crop', 'Isd 39', 'October-December', 'December-February', 8000.0),
('P027', 'Turmeric', 'Spice', 'BARI Halud-1', 'March-April', 'December-January', 1600.0),
('P028', 'Ginger', 'Spice', 'BARI Ada-1', 'March-April', 'November-December', 1200.0),
('P029', 'Chili', 'Spice', 'BARI Morich-1', 'September-October', 'January-March', 0.5),
('P030', 'Coriander', 'Spice', 'BARI Dhonia-1', 'October-November', 'February-March', 8.0);

-- =====================================================
-- STAKEHOLDERS - Complete supply chain participants
-- =====================================================
INSERT INTO stakeholder (stakeholder_id, name, type_id, district_id, contact_info) VALUES
-- Farmers (type_id = 1)
('F001', 'Rahman Rice Farm', 1, 1, 'rahman.farm@email.com'),
('F002', 'Karim Agricultural Enterprise', 1, 2, '01712345678'),
('F003', 'Sarker Potato Cultivation', 1, 3, 'sarker.potato@gmail.com'),
('F004', 'Ahmed Wheat Farm', 1, 4, '01823456789'),
('F005', 'Hassan Rice Fields', 1, 5, 'hassan.rice@yahoo.com'),
('F006', 'Begum Vegetable Farm', 1, 1, '01934567890'),
('F007', 'Ali Bitter Gourd Farm', 1, 2, 'ali.gourd@hotmail.com'),
('F008', 'Khan Pulse Cultivation', 1, 3, '01845678901'),
('F009', 'Molla Jute Farm', 1, 4, 'molla.jute@gmail.com'),
('F010', 'Rahman Sugarcane Estate', 1, 5, '01656789012'),
('F011', 'Hossain Tomato Farm', 1, 1, 'hossain.tomato@email.com'),
('F012', 'Islam Black Gram Farm', 1, 2, '01767890123'),
('F013', 'Uddin Gourd Cultivation', 1, 3, 'uddin.gourd@yahoo.com'),
('F014', 'Akter Cucumber Farm', 1, 4, '01878901234'),
('F015', 'Chowdhury Turmeric Farm', 1, 5, 'chowdhury.turmeric@gmail.com'),
('F016', 'Noor Aromatic Rice Farm', 1, 1, '01989012345'),
('F017', 'Salam Jute Estate', 1, 2, 'salam.jute@hotmail.com'),
('F018', 'Khatun Vegetable Garden', 1, 3, '01690123456'),
('F019', 'Miah Okra Farm', 1, 4, 'miah.okra@email.com'),
('F020', 'Das Spice Cultivation', 1, 5, '01701234567'),
('F021', 'Roy Rice Cultivation', 1, 1, 'roy.rice@gmail.com'),

-- Wholesalers (type_id = 2)
('W001', 'Dhaka Agricultural Wholesale Market', 2, 1, 'dhaka.wholesale@market.com'),
('W002', 'Chittagong Grain Trading Center', 2, 2, '01812345678'),
('W003', 'Rajshahi Vegetable Wholesale Hub', 2, 3, 'rajshahi.veg@trading.com'),
('W004', 'Sylhet Agricultural Distribution', 2, 4, '01923456789'),

-- Retailers (type_id = 3)
('R001', 'Dhaka City Fresh Market', 3, 1, 'dhaka.fresh@retail.com'),
('R002', 'Chittagong Grocery Center', 3, 2, '01634567890'),
('R003', 'Rajshahi Vegetable Store', 3, 3, 'rajshahi.store@email.com'),
('R004', 'Sylhet Agricultural Retail', 3, 4, '01745678901'),
('R005', 'Barisal Food Market', 3, 5, 'barisal.food@market.com'),
('R006', 'New Market Grocery', 3, 1, '01856789012'),
('R007', 'Uttara Fresh Store', 3, 1, 'uttara.fresh@store.com'),
('R008', 'Dhanmondi Vegetable Market', 3, 1, '01967890123'),
('R009', 'Gulshan Organic Store', 3, 1, 'gulshan.organic@email.com'),
('R010', 'Mirpur Agricultural Store', 3, 1, '01678901234'),
('R011', 'Wari Bazaar', 3, 1, '01789012345'),
('R012', 'Farmgate Fresh Market', 3, 1, 'farmgate.fresh@market.com'),
('R013', 'Elephant Road Store', 3, 1, '01890123456'),
('R014', 'Tejgaon Grocery', 3, 1, 'tejgaon.grocery@store.com'),
('R015', 'Panthapath Market', 3, 1, '01901234567'),
('R016', 'Mohammadpur Store', 3, 1, 'mohammadpur@retail.com'),
('R017', 'Lalmatia Fresh Store', 3, 1, '01712345679'),
('R018', 'Kalabagan Market', 3, 1, 'kalabagan.market@email.com'),
('R019', 'Shantinagar Store', 3, 1, '01823456780'),
('R020', 'Malibagh Grocery', 3, 1, 'malibagh.grocery@store.com'),
('R021', 'Rampura Market', 3, 1, '01934567891'),

-- Consumers (type_id = 4)
('C001', 'Ahmed Family', 4, 1, 'ahmed.family@email.com'),
('C002', 'Sarker Household', 4, 2, '01645678902'),
('C003', 'Khan Family', 4, 3, 'khan.family@gmail.com'),
('C004', 'Begum Household', 4, 4, '01756789013'),
('C005', 'Rahman Family', 4, 5, 'rahman.family@yahoo.com'),
('C006', 'Hassan Household', 4, 1, '01867890124'),
('C007', 'Ali Family', 4, 2, 'ali.family@hotmail.com'),
('C008', 'Molla Household', 4, 3, '01978901235'),
('C009', 'Hossain Family', 4, 4, 'hossain.family@email.com'),
('C010', 'Islam Household', 4, 5, '01689012346'),
('C011', 'Uddin Family', 4, 1, 'uddin.family@gmail.com'),
('C012', 'Akter Household', 4, 2, '01790123457'),
('C013', 'Chowdhury Family', 4, 3, 'chowdhury.family@yahoo.com'),
('C014', 'Noor Household', 4, 4, '01801234568'),
('C015', 'Salam Family', 4, 5, 'salam.family@hotmail.com'),
('C016', 'Khatun Household', 4, 1, '01912345679'),
('C017', 'Miah Family', 4, 2, 'miah.family@email.com'),
('C018', 'Das Household', 4, 3, '01623456780'),
('C019', 'Roy Family', 4, 4, 'roy.family@gmail.com'),
('C020', 'Sen Household', 4, 5, '01734567891'),
('C021', 'Pal Family', 4, 1, 'pal.family@yahoo.com');

-- =====================================================
-- ENHANCED TRANSACTION DATA - Comprehensive Agricultural Trade Records
-- =====================================================
INSERT INTO transaction (transaction_id, buyer_id, seller_id, product_id, quantity, price_per_unit, total_amount, `date`) VALUES
-- Direct Producer Sales - Farmers to Wholesalers (Bulk Agricultural Trading)
('TXN001', 'W001', 'F001', 'P001', 1500, 42.50, 63750.00, '2024-01-15'),
('TXN002', 'W002', 'F002', 'P001', 2000, 43.00, 86000.00, '2024-01-15'),
('TXN003', 'W003', 'F003', 'P007', 800, 75.00, 60000.00, '2024-03-01'),
('TXN004', 'W004', 'F004', 'P005', 1200, 49.00, 58800.00, '2024-04-05'),
('TXN005', 'W001', 'F005', 'P002', 1800, 39.00, 70200.00, '2024-05-10'),
('TXN006', 'W002', 'F006', 'P011', 600, 100.00, 60000.00, '2024-04-10'),
('TXN007', 'W003', 'F007', 'P018', 400, 90.00, 36000.00, '2024-03-10'),
('TXN008', 'W004', 'F008', 'P022', 500, 130.00, 65000.00, '2024-07-01'),
('TXN009', 'W001', 'F009', 'P009', 15, 4200.00, 63000.00, '2024-09-15'),
('TXN010', 'W002', 'F010', 'P026', 800, 45.00, 36000.00, '2024-02-01'),
('TXN011', 'W003', 'F011', 'P013', 400, 70.00, 28000.00, '2024-03-05'),
('TXN012', 'W004', 'F012', 'P023', 350, 70.00, 24500.00, '2024-08-15'),
('TXN013', 'W001', 'F013', 'P019', 300, 110.00, 33000.00, '2024-04-05'),
('TXN014', 'W002', 'F014', 'P008', 200, 45.00, 9000.00, '2024-02-15'),
('TXN015', 'W003', 'F015', 'P027', 80, 380.00, 30400.00, '2024-12-01'),

-- Wholesale to Retail Distribution Chain
('TXN016', 'R001', 'W001', 'P001', 500, 45.50, 22750.00, '2024-01-18'),
('TXN017', 'R002', 'W002', 'P001', 300, 46.00, 13800.00, '2024-01-18'),
('TXN018', 'R003', 'W003', 'P007', 200, 85.00, 17000.00, '2024-03-05'),
('TXN019', 'R004', 'W004', 'P005', 250, 52.00, 13000.00, '2024-04-08'),
('TXN020', 'R005', 'W001', 'P002', 400, 42.00, 16800.00, '2024-05-12'),
('TXN021', 'R006', 'W002', 'P011', 100, 120.00, 12000.00, '2024-04-12'),
('TXN022', 'R007', 'W003', 'P018', 80, 100.00, 8000.00, '2024-03-12'),
('TXN023', 'R008', 'W004', 'P022', 150, 150.00, 22500.00, '2024-07-05'),
('TXN024', 'R009', 'W001', 'P013', 120, 80.00, 9600.00, '2024-03-08'),
('TXN025', 'R010', 'W002', 'P023', 100, 80.00, 8000.00, '2024-08-18'),

-- Final Consumer Sales - Retail to Consumer
('TXN026', 'C001', 'R001', 'P001', 5, 48.50, 242.50, '2024-01-20'),
('TXN027', 'C002', 'R002', 'P001', 10, 47.25, 472.50, '2024-03-18'),
('TXN028', 'C003', 'R003', 'P007', 3, 85.00, 255.00, '2024-03-08'),
('TXN029', 'C004', 'R004', 'P005', 8, 52.00, 416.00, '2024-04-10'),
('TXN030', 'C005', 'R005', 'P002', 12, 43.25, 519.00, '2024-05-15'),
('TXN031', 'C006', 'R006', 'P011', 2, 120.00, 240.00, '2024-04-15'),
('TXN032', 'C007', 'R007', 'P018', 3, 100.00, 300.00, '2024-03-15'),
('TXN033', 'C008', 'R008', 'P022', 5, 150.00, 750.00, '2024-07-08'),
('TXN034', 'C009', 'R009', 'P013', 4, 80.00, 320.00, '2024-03-10'),
('TXN035', 'C010', 'R010', 'P023', 6, 80.00, 480.00, '2024-08-20'),

-- Additional diverse agricultural transactions
('TXN036', 'C011', 'R011', 'P019', 2, 120.00, 240.00, '2024-04-08'),
('TXN037', 'C012', 'R012', 'P024', 4, 120.00, 480.00, '2024-08-05'),
('TXN038', 'C013', 'R013', 'P014', 3, 60.00, 180.00, '2024-01-25'),
('TXN039', 'C014', 'R014', 'P020', 2, 95.00, 190.00, '2024-01-18'),
('TXN040', 'C015', 'R015', 'P025', 8, 70.00, 560.00, '2024-09-05'),

-- Cross-seasonal and specialized crop trading
('TXN041', 'W003', 'F016', 'P004', 400, 55.00, 22000.00, '2024-01-22'),
('TXN042', 'W004', 'F017', 'P010', 20, 4300.00, 86000.00, '2024-09-20'),
('TXN043', 'R016', 'W001', 'P028', 2, 5200.00, 10400.00, '2024-12-18'),
('TXN044', 'C016', 'R016', 'P029', 0.5, 500.00, 250.00, '2024-03-18'),
('TXN045', 'C017', 'R017', 'P030', 1, 360.00, 360.00, '2024-02-22'),

-- Inter-wholesaler bulk trading
('TXN046', 'W002', 'W001', 'P001', 800, 46.50, 37200.00, '2024-02-01'),
('TXN047', 'W004', 'W003', 'P007', 600, 82.00, 49200.00, '2024-03-15'),
('TXN048', 'W001', 'W002', 'P002', 1000, 41.00, 41000.00, '2024-05-20'),

-- Seasonal pulses and cash crop transactions
('TXN049', 'W003', 'F018', 'P016', 300, 40.00, 12000.00, '2024-04-03'),
('TXN050', 'W001', 'F019', 'P017', 200, 45.00, 9000.00, '2024-08-18'),
('TXN051', 'R018', 'W003', 'P021', 150, 105.00, 15750.00, '2024-06-12'),
('TXN052', 'C018', 'R018', 'P015', 2.5, 65.00, 162.50, '2024-01-25'),
('TXN053', 'C019', 'R019', 'P012', 1.5, 200.00, 300.00, '2024-04-15'),

-- High-value spice and specialty crop transactions
('TXN054', 'W004', 'F020', 'P006', 50, 51.00, 2550.00, '2024-04-08'),
('TXN055', 'R020', 'W004', 'P006', 25, 54.00, 1350.00, '2024-04-10'),
('TXN056', 'C020', 'R020', 'P006', 2, 56.00, 112.00, '2024-04-12'),

-- Cross-district distribution
('TXN057', 'W002', 'F001', 'P001', 1200, 44.00, 52800.00, '2024-02-10'),
('TXN058', 'W003', 'F021', 'P003', 600, 38.00, 22800.00, '2024-05-15'),
('TXN059', 'R021', 'W001', 'P003', 300, 41.00, 12300.00, '2024-05-18'),
('TXN060', 'C021', 'R021', 'P003', 15, 43.00, 645.00, '2024-05-20');

-- =====================================================
-- PRODUCTION DATA - Agricultural Production Records
-- =====================================================
INSERT INTO production (production_id, product_id, district_id, `date`, acreage, quantity_produced) VALUES
-- Rice production across districts
('PROD001', 'P001', 1, '2024-01-15', 500.0, 12500.0),
('PROD002', 'P001', 2, '2024-01-15', 800.0, 20000.0),
('PROD003', 'P002', 1, '2024-05-10', 600.0, 18000.0),
('PROD004', 'P002', 3, '2024-05-10', 400.0, 12000.0),
('PROD005', 'P003', 4, '2024-07-20', 300.0, 8400.0),

-- Wheat production
('PROD006', 'P005', 1, '2024-04-05', 200.0, 24000.0),
('PROD007', 'P005', 2, '2024-04-05', 300.0, 36000.0),
('PROD008', 'P006', 3, '2024-04-08', 100.0, 12500.0),

-- Vegetable production
('PROD009', 'P007', 1, '2024-03-01', 150.0, 225000.0),
('PROD010', 'P007', 2, '2024-03-01', 200.0, 300000.0),
('PROD011', 'P013', 3, '2024-02-28', 80.0, 24.0),
('PROD012', 'P011', 4, '2024-04-10', 120.0, 1800.0),

-- Pulse production
('PROD013', 'P022', 1, '2024-07-01', 100.0, 6000.0),
('PROD014', 'P023', 2, '2024-08-15', 80.0, 2000.0),
('PROD015', 'P024', 3, '2024-08-05', 60.0, 1200.0),

-- Cash crops
('PROD016', 'P009', 4, '2024-09-15', 50.0, 400.0),
('PROD017', 'P010', 5, '2024-09-20', 40.0, 400.0),
('PROD018', 'P026', 1, '2024-02-01', 30.0, 240000.0);

-- =====================================================
-- PRICE DATA - Market Price Information
-- =====================================================
INSERT INTO price (product_id, district_id, `date`, price_per_unit) VALUES
-- Rice prices across districts and time
('P001', 1, '2024-01-15', 42.50),
('P001', 2, '2024-01-15', 43.00),
('P001', 3, '2024-01-15', 43.50),
('P001', 1, '2024-02-15', 44.00),
('P001', 2, '2024-02-15', 44.50),

-- Wheat prices
('P005', 1, '2024-04-05', 49.00),
('P005', 2, '2024-04-05', 50.00),
('P005', 3, '2024-04-05', 51.00),

-- Vegetable prices
('P007', 1, '2024-03-01', 75.00),
('P007', 2, '2024-03-01', 78.00),
('P007', 3, '2024-03-01', 80.00),
('P013', 1, '2024-03-05', 70.00),
('P013', 2, '2024-03-05', 72.00),

-- Pulse prices
('P022', 1, '2024-07-01', 130.00),
('P022', 2, '2024-07-01', 132.00),
('P023', 1, '2024-08-15', 70.00),
('P023', 2, '2024-08-15', 72.00),

-- Spice prices
('P027', 1, '2024-12-01', 380.00),
('P027', 2, '2024-12-01', 385.00),
('P028', 1, '2024-12-18', 5200.00),
('P029', 1, '2024-03-18', 500.00),
('P030', 1, '2024-02-22', 360.00);

-- =====================================================
-- WEATHER DATA - Daily Weather Information
-- =====================================================
INSERT INTO weather_daily (weather_id, district_id, `date`, rainfall, temperature) VALUES
('WTH001', 1, '2024-01-15', 15.5, 32.5),
('WTH002', 2, '2024-01-15', 8.2, 31.8),
('WTH003', 3, '2024-01-15', 22.1, 30.9),
('WTH004', 4, '2024-01-15', 12.8, 33.2),
('WTH005', 5, '2024-01-15', 18.4, 29.7),

('WTH006', 1, '2024-02-15', 5.2, 28.4),
('WTH007', 2, '2024-02-15', 12.8, 27.9),
('WTH008', 3, '2024-02-15', 8.6, 29.1),

('WTH009', 1, '2024-03-15', 45.2, 35.8),
('WTH010', 2, '2024-03-15', 38.4, 34.2),
('WTH011', 3, '2024-03-15', 52.1, 33.6),

('WTH012', 1, '2024-04-15', 78.5, 36.4),
('WTH013', 2, '2024-04-15', 65.2, 35.8),
('WTH014', 3, '2024-04-15', 84.6, 34.9),

('WTH015', 1, '2024-05-15', 125.8, 34.2),
('WTH016', 2, '2024-05-15', 98.4, 33.8),
('WTH017', 3, '2024-05-15', 142.6, 32.9);

-- =====================================================
-- CONSUMPTION PATTERNS - Household Consumption Records
-- =====================================================
INSERT INTO consumption_record (stakeholder_id, product_id, `date`, quantity) VALUES
-- Urban High-Income Family (C001) - Ahmed Family - Monthly Rice & Staples Consumption
('C001', 'P001', '2024-01-15', 18.5), ('C001', 'P002', '2024-01-15', 12.0), ('C001', 'P005', '2024-01-15', 8.5),
('C001', 'P007', '2024-01-15', 8.0), ('C001', 'P011', '2024-01-15', 3.5), ('C001', 'P013', '2024-01-15', 2.8),
('C001', 'P015', '2024-01-15', 1.8), ('C001', 'P022', '2024-07-15', 4.2), ('C001', 'P023', '2024-08-15', 4.8),
('C001', 'P018', '2024-03-15', 2.5), ('C001', 'P019', '2024-04-15', 2.8), ('C001', 'P020', '2024-01-15', 2.2),

-- Rural Farmer Family (C002) - Sarker Household - Higher staple consumption, seasonal vegetables
('C002', 'P001', '2024-01-15', 20.5), ('C002', 'P002', '2024-01-15', 15.0), ('C002', 'P005', '2024-01-15', 10.5),
('C002', 'P007', '2024-01-15', 12.0), ('C002', 'P011', '2024-01-15', 4.5), ('C002', 'P013', '2024-01-15', 3.8),
('C002', 'P015', '2024-01-15', 2.2), ('C002', 'P022', '2024-07-15', 5.2), ('C002', 'P023', '2024-08-15', 6.8),
('C002', 'P018', '2024-03-15', 3.2), ('C002', 'P019', '2024-04-15', 3.5), ('C002', 'P008', '2024-02-15', 1.8),

-- Middle Class Urban Family (C003) - Khan Family - Balanced consumption with variety
('C003', 'P001', '2024-01-15', 16.5), ('C003', 'P002', '2024-01-15', 10.0), ('C003', 'P005', '2024-01-15', 7.5),
('C003', 'P007', '2024-01-15', 6.0), ('C003', 'P011', '2024-01-15', 2.5), ('C003', 'P013', '2024-01-15', 2.0),
('C003', 'P015', '2024-01-15', 1.2), ('C003', 'P022', '2024-07-15', 3.2), ('C003', 'P023', '2024-08-15', 3.8),
('C003', 'P018', '2024-03-15', 2.0), ('C003', 'P019', '2024-04-15', 2.2), ('C003', 'P024', '2024-08-15', 3.5);

-- =====================================================
-- SUMMARY
-- =====================================================
-- This comprehensive dataset includes:
-- - 30 agricultural products covering cereals, vegetables, pulses, and cash crops
-- - 61 stakeholders across the complete supply chain (farmers, wholesalers, retailers, consumers)
-- - 60 transaction records covering the full supply chain from farm to consumer
-- - 18 production records across different districts and seasons
-- - 20 price records showing market dynamics
-- - 17 weather records for agricultural planning
-- - Multiple consumption records for demand analysis