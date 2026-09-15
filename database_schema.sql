-- =============================================================================
-- LogixERP Database Schema (PostgreSQL / MySQL compatible)
-- =============================================================================

-- 1. جدول المستخدمين (Users)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_starter BOOLEAN DEFAULT TRUE,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. جدول بيانات المنشأة / الشركة (Firms / Companies)
CREATE TABLE IF NOT EXISTS firms (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_sub_type VARCHAR(100) NOT NULL, -- نوع النشاط (صناعي، تجاري، خدمي)
    business_capital DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    tin_number VARCHAR(100) NOT NULL, -- الرقم الضريبي
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. جدول المواد الخام والمخزون الأولي (Inventory Items)
CREATE TABLE IF NOT EXISTS inventory_items (
    id SERIAL PRIMARY KEY,
    firm_id INT REFERENCES firms(id) ON DELETE CASCADE,
    inventory_name VARCHAR(255) NOT NULL,
    inventory_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    inventory_quantity DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    least_critical_amount DECIMAL(12, 2) NOT NULL DEFAULT 10.00, -- الحد الأدنى للتنبيه
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. جدول معايير التصنيع (Production Standards)
CREATE TABLE IF NOT EXISTS standards (
    id SERIAL PRIMARY KEY,
    firm_id INT REFERENCES firms(id) ON DELETE CASCADE,
    standard_name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. جدول تفاصيل المواد الداخلة في معيار التصنيع (Standard BOM Items)
CREATE TABLE IF NOT EXISTS standard_items (
    id SERIAL PRIMARY KEY,
    standard_id INT REFERENCES standards(id) ON DELETE CASCADE,
    inventory_id INT REFERENCES inventory_items(id) ON DELETE RESTRICT,
    required_quantity DECIMAL(12, 2) NOT NULL DEFAULT 1.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. جدول المنتجات الجاهزة والمخزون التام (Products / Finished Goods)
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    firm_id INT REFERENCES firms(id) ON DELETE CASCADE,
    standard_id INT REFERENCES standards(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    product_cost_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- تكلفة الإنتاج
    product_selling_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00, -- سعر البيع
    product_quantity INT NOT NULL DEFAULT 0, -- الكمية المتوفرة
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. جدول المصروفات التشغيلية (Expenses)
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    firm_id INT REFERENCES firms(id) ON DELETE CASCADE,
    expense_name VARCHAR(255) NOT NULL,
    expense_amount DECIMAL(12, 2) NOT NULL,
    expense_category VARCHAR(100) DEFAULT 'General',
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. جدول دليل الحسابات (Chart of Accounts)
CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    firm_id INT REFERENCES firms(id) ON DELETE CASCADE,
    account_code VARCHAR(50) NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_type VARCHAR(50) NOT NULL CHECK (account_type IN ('ASSET', 'LIABILITY', 'EQUITY', 'REVENUE', 'EXPENSE')),
    current_balance DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. جدول قيود اليومية المحاسبية (Journal Entries Header)
CREATE TABLE IF NOT EXISTS journal_entries (
    id SERIAL PRIMARY KEY,
    firm_id INT REFERENCES firms(id) ON DELETE CASCADE,
    entry_number VARCHAR(100) UNIQUE,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. جدول أطراف قيد اليومية - مدين ودائن (Journal Entry Lines)
CREATE TABLE IF NOT EXISTS journal_entry_lines (
    id SERIAL PRIMARY KEY,
    journal_entry_id INT REFERENCES journal_entries(id) ON DELETE CASCADE,
    account_id INT REFERENCES accounts(id) ON DELETE RESTRICT,
    debit DECIMAL(15, 2) DEFAULT 0.00,
    credit DECIMAL(15, 2) DEFAULT 0.00,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. جدول المبيعات وحركات بيع المنتجات (Sales Orders)
CREATE TABLE IF NOT EXISTS sales (
    id SERIAL PRIMARY KEY,
    firm_id INT REFERENCES firms(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE RESTRICT,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    customer_name VARCHAR(255),
    sale_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- بيانات أولية وتجريبية (Seed Data)
-- =============================================================================

-- مستخدم تجريبي
INSERT INTO users (id, name, email, password_hash, is_starter, role)
VALUES (1, 'Admin User', 'cgiacc2026@gmail.com', 'P0182671648n$', FALSE, 'admin')
ON CONFLICT (id) DO NOTHING;

-- منشأة تجريبية
INSERT INTO firms (id, user_id, business_name, business_sub_type, business_capital, tin_number, currency)
VALUES (1, 1, 'Logix Footwear & Apparel', 'Manufacturing', 50000.00, 'TIN-987654321', 'USD')
ON CONFLICT (id) DO NOTHING;

-- مواد خام في المخزن
INSERT INTO inventory_items (id, firm_id, inventory_name, inventory_price, inventory_quantity, least_critical_amount) VALUES
(1, 1, 'Sole Rubber', 15.00, 120.00, 20.00),
(2, 1, 'Shoe Fabric Mesh', 22.00, 85.00, 30.00),
(3, 1, 'Silicon Wristbands', 8.00, 200.00, 15.00),
(4, 1, 'Fleece Fabric Roll', 18.00, 50.00, 10.00)
ON CONFLICT (id) DO NOTHING;

-- معايير التصنيع
INSERT INTO standards (id, firm_id, standard_name, description) VALUES
(1, 1, 'Running Shoes Standard', 'Standard recipe to produce running sneakers'),
(2, 1, 'Smart Watch Standard', 'Standard assembly for smart watches')
ON CONFLICT (id) DO NOTHING;

-- المنتجات تامة الصنع
INSERT INTO products (id, firm_id, standard_id, product_name, product_cost_price, product_selling_price, product_quantity) VALUES
(1, 1, 1, 'Running Shoes', 45.00, 85.00, 34),
(2, 1, 2, 'Smart Watch', 80.00, 150.00, 22),
(3, 1, NULL, 'Cotton Hoodie', 28.00, 60.00, 45)
ON CONFLICT (id) DO NOTHING;

-- مصروفات تجريبية
INSERT INTO expenses (id, firm_id, expense_name, expense_amount, expense_category) VALUES
(1, 1, 'Office Supplies', 350.00, 'Operations'),
(2, 1, 'Internet & Utility', 180.00, 'Utilities'),
(3, 1, 'Raw Material Transport', 1200.00, 'Logistics')
ON CONFLICT (id) DO NOTHING;

-- دليل الحسابات المالي
INSERT INTO accounts (id, firm_id, account_code, account_name, account_type, current_balance) VALUES
(1, 1, '101', 'Cash in Hand', 'ASSET', 18500.00),
(2, 1, '102', 'Inventory Asset', 'ASSET', 10000.00),
(3, 1, '201', 'Accounts Payable', 'LIABILITY', 4200.00),
(4, 1, '301', 'Owner Capital', 'EQUITY', 21300.00),
(5, 1, '401', 'Sales Revenue', 'REVENUE', 16850.00),
(6, 1, '501', 'Cost of Goods Sold', 'EXPENSE', 3420.00),
(7, 1, '502', 'General Expenses', 'EXPENSE', 2000.00)
ON CONFLICT (id) DO NOTHING;
