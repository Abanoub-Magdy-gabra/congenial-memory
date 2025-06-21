/*
  # Insert Sample Data for Restaurant POS System

  1. Sample Categories
  2. Sample Menu Items
  3. Sample Delivery Zones
  4. Sample Tables
  5. Sample Customers
  6. Sample Staff
  7. Sample Drivers
  8. Sample Inventory Items
  9. Sample Suppliers
*/

-- Insert Categories
INSERT INTO categories (name, name_en, description, icon, sort_order) VALUES
('الوجبات الرئيسية', 'Main Dishes', 'الأطباق الرئيسية والوجبات الكاملة', 'utensils', 1),
('المشروبات', 'Beverages', 'المشروبات الساخنة والباردة', 'coffee', 2),
('الحلويات', 'Desserts', 'الحلويات والمعجنات', 'star', 3),
('المقبلات', 'Appetizers', 'المقبلات والسلطات', 'package', 4),
('المشاوي', 'Grills', 'اللحوم والدجاج المشوي', 'flame', 5);

-- Insert Menu Items
INSERT INTO menu_items (category_id, name, name_en, description, price, cost_price, preparation_time, calories, is_available, is_popular, is_vegetarian, is_spicy, allergens, ingredients) VALUES
((SELECT id FROM categories WHERE name = 'الوجبات الرئيسية'), 'شاورما دجاج', 'Chicken Shawarma', 'شاورما دجاج طازجة مع الخضار والصوص الخاص', 15.00, 8.00, 10, 450, true, true, false, false, ARRAY['جلوتين'], ARRAY['دجاج', 'خبز', 'طماطم', 'خيار', 'صوص الثوم']),
((SELECT id FROM categories WHERE name = 'الوجبات الرئيسية'), 'برجر لحم', 'Beef Burger', 'برجر لحم بقري مشوي مع الجبن والخضار الطازجة', 25.00, 12.00, 15, 650, true, true, false, false, ARRAY['جلوتين', 'ألبان'], ARRAY['لحم بقري', 'خبز برجر', 'جبن', 'خس', 'طماطم', 'بصل']),
((SELECT id FROM categories WHERE name = 'الوجبات الرئيسية'), 'بيتزا مارجريتا', 'Margherita Pizza', 'بيتزا كلاسيكية بالطماطم والجبن والريحان', 35.00, 15.00, 20, 800, true, false, true, false, ARRAY['جلوتين', 'ألبان'], ARRAY['عجينة بيتزا', 'صوص طماطم', 'جبن موتزاريلا', 'ريحان']),
((SELECT id FROM categories WHERE name = 'المشروبات'), 'عصير برتقال طازج', 'Fresh Orange Juice', 'عصير برتقال طبيعي 100% بدون إضافات', 8.00, 3.00, 3, 120, true, false, true, false, ARRAY[]::text[], ARRAY['برتقال طازج']),
((SELECT id FROM categories WHERE name = 'المشروبات'), 'شاي مغربي', 'Moroccan Tea', 'شاي مغربي بالنعناع الطازج', 5.00, 1.50, 5, 25, true, false, true, false, ARRAY[]::text[], ARRAY['شاي أخضر', 'نعناع', 'سكر']),
((SELECT id FROM categories WHERE name = 'المشروبات'), 'قهوة تركي', 'Turkish Coffee', 'قهوة تركية أصيلة', 7.00, 2.00, 8, 50, true, false, true, false, ARRAY[]::text[], ARRAY['قهوة تركية', 'سكر']),
((SELECT id FROM categories WHERE name = 'الحلويات'), 'كنافة بالجبن', 'Cheese Kunafa', 'كنافة تقليدية محشوة بالجبن مع القطر', 12.00, 6.00, 15, 350, true, false, true, false, ARRAY['جلوتين', 'ألبان', 'مكسرات'], ARRAY['عجينة كنافة', 'جبن', 'قطر', 'فستق']),
((SELECT id FROM categories WHERE name = 'الحلويات'), 'أم علي', 'Om Ali', 'حلوى مصرية تقليدية بالحليب والمكسرات', 10.00, 4.00, 12, 280, true, false, true, false, ARRAY['ألبان', 'مكسرات'], ARRAY['لبن', 'عجين', 'مكسرات', 'زبيب']),
((SELECT id FROM categories WHERE name = 'المقبلات'), 'سلطة خضراء', 'Green Salad', 'سلطة خضراء طازجة مع الخضار الموسمية', 8.00, 3.00, 5, 80, true, false, true, false, ARRAY[]::text[], ARRAY['خس', 'طماطم', 'خيار', 'جزر', 'زيت زيتون']),
((SELECT id FROM categories WHERE name = 'المقبلات'), 'حمص بالطحينة', 'Hummus with Tahini', 'حمص كريمي بالطحينة وزيت الزيتون', 6.00, 2.50, 3, 150, true, false, true, true, ARRAY[]::text[], ARRAY['حمص', 'طحينة', 'ثوم', 'ليمون', 'زيت زيتون']);

-- Insert Delivery Zones
INSERT INTO delivery_zones (name, areas, delivery_fee, estimated_time, min_order_amount) VALUES
('المنطقة الأولى', ARRAY['المعادي', 'دجلة', 'زهراء المعادي'], 15.00, 30, 50.00),
('المنطقة الثانية', ARRAY['الدقي', 'المهندسين', 'الزمالك'], 20.00, 45, 75.00),
('المنطقة الثالثة', ARRAY['مدينة نصر', 'هليوبوليس', 'النزهة'], 25.00, 60, 100.00),
('المنطقة الرابعة', ARRAY['6 أكتوبر', 'الشيخ زايد', 'المقطم'], 30.00, 75, 150.00);

-- Insert Tables
INSERT INTO tables (number, capacity, location, status) VALUES
(1, 4, 'indoor', 'available'),
(2, 2, 'indoor', 'available'),
(3, 6, 'indoor', 'available'),
(4, 4, 'indoor', 'available'),
(5, 8, 'vip', 'available'),
(6, 4, 'outdoor', 'available'),
(7, 2, 'outdoor', 'available'),
(8, 4, 'outdoor', 'available'),
(9, 6, 'indoor', 'available'),
(10, 4, 'indoor', 'available'),
(11, 2, 'indoor', 'available'),
(12, 4, 'vip', 'available'),
(13, 8, 'outdoor', 'available'),
(14, 6, 'indoor', 'available'),
(15, 4, 'indoor', 'available'),
(16, 2, 'outdoor', 'available'),
(17, 4, 'indoor', 'available'),
(18, 6, 'vip', 'available'),
(19, 4, 'outdoor', 'available'),
(20, 2, 'indoor', 'available');

-- Insert Sample Customers
INSERT INTO customers (name, phone, email, birth_date, loyalty_points, total_orders, total_spent, category, status) VALUES
('أحمد محمد علي', '01234567890', 'ahmed.mohamed@email.com', '1985-05-15', 225, 45, 2250.00, 'vip', 'active'),
('فاطمة حسن', '01098765432', 'fatma.hassan@email.com', '1990-08-22', 140, 28, 1400.00, 'regular', 'active'),
('محمد أحمد', '01555123456', NULL, NULL, 15, 3, 150.00, 'new', 'active'),
('سارة علي', '01777888999', 'sara.ali@email.com', '1992-08-22', 335, 67, 3350.00, 'vip', 'active'),
('خالد محمود', '01666555444', NULL, NULL, 60, 12, 600.00, 'regular', 'inactive');

-- Insert Customer Addresses
INSERT INTO customer_addresses (customer_id, label, type, street, area, building, floor, apartment, landmark, is_default) VALUES
((SELECT id FROM customers WHERE phone = '01234567890'), 'المنزل', 'home', 'شارع النيل، المعادي', 'المعادي', 'مبنى 15', '3', '301', 'بجوار مسجد النور', true),
((SELECT id FROM customers WHERE phone = '01234567890'), 'العمل', 'work', 'شارع التحرير، وسط البلد', 'وسط البلد', 'برج النيل', '10', '1005', NULL, false),
((SELECT id FROM customers WHERE phone = '01098765432'), 'المنزل', 'home', 'شارع الجمهورية، وسط البلد', 'وسط البلد', 'مبنى 20', '5', '502', NULL, true),
((SELECT id FROM customers WHERE phone = '01777888999'), 'المنزل', 'home', 'شارع التحرير، الدقي', 'الدقي', 'برج الياسمين', '8', '801', 'أمام محطة المترو', true);

-- Insert Staff
INSERT INTO staff (name, email, phone, position, department, salary, hire_date, status, permissions, work_schedule) VALUES
('أحمد محمد علي', 'ahmed.mohamed@restaurant.com', '01234567890', 'رئيس الطهاة', 'المطبخ', 8000.00, '2023-01-15', 'active', ARRAY['kitchen_management', 'menu_edit', 'inventory_view'], '{"startTime": "08:00", "endTime": "18:00", "workDays": ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"]}'),
('فاطمة حسن', 'fatma.hassan@restaurant.com', '01098765432', 'مديرة الخدمة', 'الخدمة', 6000.00, '2023-03-20', 'active', ARRAY['service_management', 'orders_view', 'customer_management'], '{"startTime": "10:00", "endTime": "22:00", "workDays": ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"]}'),
('محمد أحمد', 'mohamed.ahmed@restaurant.com', '01555123456', 'نادل', 'الخدمة', 3500.00, '2023-06-10', 'active', ARRAY['orders_create', 'pos_access'], '{"startTime": "14:00", "endTime": "24:00", "workDays": ["الخميس", "الجمعة", "السبت", "الأحد"]}'),
('سارة عبدالله', 'sara.abdullah@restaurant.com', '01777888999', 'محاسبة', 'المحاسبة', 5500.00, '2023-02-01', 'on-leave', ARRAY['financial_reports', 'payroll_management', 'inventory_cost'], '{"startTime": "09:00", "endTime": "17:00", "workDays": ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء"]}'),
('خالد عمر', 'khaled.omar@restaurant.com', '01666555444', 'طباخ', 'المطبخ', 4000.00, '2023-08-15', 'active', ARRAY['kitchen_access', 'inventory_view'], '{"startTime": "06:00", "endTime": "16:00", "workDays": ["السبت", "الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس"]}');

-- Insert Drivers
INSERT INTO drivers (name, phone, license_number, vehicle_type, vehicle_plate, status, current_orders, total_deliveries, rating) VALUES
('محمد أحمد', '01555123456', 'DL123456', 'دراجة نارية', 'ABC-1234', 'busy', 2, 156, 4.8),
('أحمد علي', '01666789012', 'DL789012', 'دراجة نارية', 'DEF-5678', 'available', 0, 89, 4.6),
('خالد محمود', '01777456789', 'DL456789', 'سيارة', 'GHI-9012', 'available', 1, 203, 4.9),
('عمر حسن', '01888321654', 'DL321654', 'دراجة نارية', 'JKL-3456', 'offline', 0, 45, 4.3);

-- Insert Suppliers
INSERT INTO suppliers (name, contact_person, phone, email, address) VALUES
('مزرعة الأمل', 'أحمد محمد', '01234567890', 'info@alamal-farm.com', 'طريق القاهرة الإسكندرية الصحراوي'),
('شركة الألبان المصرية', 'فاطمة علي', '01098765432', 'sales@egyptian-dairy.com', 'شارع الجمهورية، وسط البلد'),
('سوق الخضار', 'محمد حسن', '01555123456', NULL, 'سوق العبور، القاهرة'),
('الجزارة الحديثة', 'خالد أحمد', '01777888999', 'orders@modern-butcher.com', 'شارع النيل، المعادي'),
('مطاحن مصر', 'سارة محمود', '01666555444', 'info@egypt-mills.com', 'المنطقة الصناعية، 6 أكتوبر'),
('شركة المشروبات', 'عمر علي', '01888321654', 'sales@beverages-co.com', 'شارع التحرير، الدقي'),
('شركة الملح المصرية', 'نادية حسن', '01999876543', 'contact@egypt-salt.com', 'الإسكندرية');

-- Insert Inventory Items
INSERT INTO inventory (name, category, current_stock, minimum_stock, unit, cost_price, supplier_id, status) VALUES
('دجاج مشوي', 'دواجن', 5.00, 10.00, 'كيلو', 45.00, (SELECT id FROM suppliers WHERE name = 'مزرعة الأمل'), 'low-stock'),
('جبن موتزاريلا', 'منتجات ألبان', 2.00, 8.00, 'كيلو', 85.00, (SELECT id FROM suppliers WHERE name = 'شركة الألبان المصرية'), 'low-stock'),
('طماطم', 'خضروات', 3.00, 15.00, 'كيلو', 8.00, (SELECT id FROM suppliers WHERE name = 'سوق الخضار'), 'low-stock'),
('خس', 'خضروات', 0.00, 5.00, 'كيلو', 6.00, (SELECT id FROM suppliers WHERE name = 'سوق الخضار'), 'out-of-stock'),
('لحم بقري', 'لحوم', 25.00, 10.00, 'كيلو', 180.00, (SELECT id FROM suppliers WHERE name = 'الجزارة الحديثة'), 'in-stock'),
('أرز أبيض', 'أخرى', 50.00, 20.00, 'كيلو', 12.00, (SELECT id FROM suppliers WHERE name = 'مطاحن مصر'), 'in-stock'),
('كوكاكولا', 'مشروبات', 48.00, 24.00, 'علبة', 3.00, (SELECT id FROM suppliers WHERE name = 'شركة المشروبات'), 'in-stock'),
('ملح', 'توابل', 8.00, 5.00, 'كيلو', 4.00, (SELECT id FROM suppliers WHERE name = 'شركة الملح المصرية'), 'in-stock');