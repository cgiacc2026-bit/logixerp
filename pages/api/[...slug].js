// In-memory mock API backend for LogixERP in AI Studio

let inMemoryExpenses = [
  { id: "1", expense_name: "Office Supplies", expense_amount: 350, created_at: "2026-08-01", updated_at: "2026-08-01" },
  { id: "2", expense_name: "Internet & Utility", expense_amount: 180, created_at: "2026-08-03", updated_at: "2026-08-03" },
  { id: "3", expense_name: "Raw Material Transport", expense_amount: 1200, created_at: "2026-08-05", updated_at: "2026-08-05" },
  { id: "4", expense_name: "Equipment Maintenance", expense_amount: 450, created_at: "2026-08-07", updated_at: "2026-08-07" },
];

let inMemoryProducts = [
  { id: "1", product_name: "Running Shoes", product_selling_price: "85", product_cost_price: "45", product_quantity: "34" },
  { id: "2", product_name: "Smart Watch", product_selling_price: "150", product_cost_price: "80", product_quantity: "22" },
  { id: "3", product_name: "Cotton Hoodie", product_selling_price: "60", product_cost_price: "28", product_quantity: "45" },
  { id: "4", product_name: "Leather Wallet", product_selling_price: "40", product_cost_price: "18", product_quantity: "15" },
];

let inMemoryInventory = [
  { id: "1", inventory_name: "Sole Rubber", inventory_price: 15, least_critical_amount: 20, inventory_quantity: 120 },
  { id: "2", inventory_name: "Shoe Fabric Mesh", inventory_price: 22, least_critical_amount: 30, inventory_quantity: 85 },
  { id: "3", inventory_name: "Silicon Wristbands", inventory_price: 8, least_critical_amount: 15, inventory_quantity: 200 },
  { id: "4", inventory_name: "Fleece Fabric Roll", inventory_price: 18, least_critical_amount: 10, inventory_quantity: 50 },
];

let inMemoryStandards = [
  { id: "1", standard_name: "Running Shoes Standard", standard_items: [{ inventory_name: "Sole Rubber", inventory_quantity: 2 }] },
  { id: "2", standard_name: "Smart Watch Standard", standard_items: [{ inventory_name: "Silicon Wristbands", inventory_quantity: 1 }] },
  { id: "3", standard_name: "Cotton Hoodie Standard", standard_items: [{ inventory_name: "Fleece Fabric Roll", inventory_quantity: 1 }] },
];

let inMemoryJournalEntries = [
  { id: "1", created_at: "2026-08-01", account: "Cash", debit: 5000, credit: 0 },
  { id: "2", created_at: "2026-08-01", account: "Sales Revenue", debit: 0, credit: 5000 },
  { id: "3", created_at: "2026-08-02", account: "Inventory", debit: 1800, credit: 0 },
  { id: "4", created_at: "2026-08-02", account: "Accounts Payable", debit: 0, credit: 1800 },
  { id: "5", created_at: "2026-08-05", account: "Utilities Expense", debit: 350, credit: 0 },
  { id: "6", created_at: "2026-08-05", account: "Cash", debit: 0, credit: 350 },
];

export default function handler(req, res) {
  const { slug } = req.query;
  const path = Array.isArray(slug) ? slug.join("/") : slug || "";

  // Auth: Sign In
  if (path === "auth/signin") {
    return res.status(200).json({
      "access-token": "demo-token-logixerp-12345",
      credentials: {
        is_starter: false,
        email: req.body?.email || "admin@example.com",
      },
    });
  }

  // Auth: Sign Up
  if (path === "auth/signup") {
    return res.status(200).json({
      "access-token": "demo-token-logixerp-12345",
      credentials: {
        is_starter: true,
        email: req.body?.email || "newuser@example.com",
      },
    });
  }

  // Firm Definition
  if (path === "firmDefinition/defineFirm") {
    return res.status(200).json({
      message: "Firm defined successfully",
      data: req.body,
    });
  }

  // Dashboard Summary
  if (path === "firmDefinition/chartDefinition") {
    return res.status(200).json({
      capital: "$28,500",
      income: "$16,850",
      expense: "$5,420",
      max_sold_product: {
        name: "Running Shoes",
        count: "53 units",
      },
      product_percentages: [
        { product_name: "Shoes", percentage: 53 },
        { product_name: "Watch", percentage: 27 },
        { product_name: "Hoodie", percentage: 17 },
        { product_name: "Other", percentage: 3 },
      ],
      incomeArray: [18, 12, 19, 27, 29, 22, 25],
      expenseArray: [12, 8, 14, 18, 15, 11, 13],
      finalDateArray: ["1 Aug", "2 Aug", "3 Aug", "4 Aug", "5 Aug", "6 Aug", "7 Aug"],
    });
  }

  // Expenses
  if (path === "expense/manage") {
    if (req.method === "POST") {
      const newExpense = {
        id: String(inMemoryExpenses.length + 1),
        expense_name: req.body?.expense_name || "New Expense",
        expense_amount: Number(req.body?.expense_amount) || 0,
        created_at: new Date().toISOString().substring(0, 10),
        updated_at: new Date().toISOString().substring(0, 10),
      };
      inMemoryExpenses = [newExpense, ...inMemoryExpenses];
      return res.status(200).json({ message: "Expense added", foundExpense: inMemoryExpenses });
    }
    return res.status(200).json({ foundExpense: inMemoryExpenses });
  }

  // Inventory
  if (path === "inventory/manage") {
    if (req.method === "POST") {
      const newItem = {
        id: String(inMemoryInventory.length + 1),
        inventory_name: req.body?.inventory_name || "New Item",
        inventory_price: Number(req.body?.inventory_price) || 0,
        least_critical_amount: Number(req.body?.least_critical_amount) || 10,
        inventory_quantity: Number(req.body?.inventory_quantity) || 0,
      };
      inMemoryInventory = [newItem, ...inMemoryInventory];
      return res.status(200).json({ message: "Item added", data: inMemoryInventory });
    }
    return res.status(200).json({ data: inMemoryInventory });
  }

  // Standards
  if (path === "standard/manage") {
    if (req.method === "POST") {
      const newStd = {
        id: String(inMemoryStandards.length + 1),
        standard_name: req.body?.standard_name || "New Standard",
        standard_items: req.body?.standard_items || [],
      };
      inMemoryStandards = [newStd, ...inMemoryStandards];
      return res.status(200).json({ message: "Standard added", standard: inMemoryStandards });
    }
    return res.status(200).json({ standard: inMemoryStandards });
  }

  // Products & Stocks
  if (path.startsWith("product/manage")) {
    if (req.method === "POST") {
      const body = req.body || {};
      if (body.product_quantity || body.product_standard) {
        const newProduct = {
          id: String(inMemoryProducts.length + 1),
          product_name: body.product_standard || "Produced Good",
          product_selling_price: String(body.product_selling_price || "100"),
          product_cost_price: String(body.product_expense || "50"),
          product_quantity: String(body.product_quantity || "10"),
        };
        inMemoryProducts = [newProduct, ...inMemoryProducts];
      }
      return res.status(200).json({ message: "Product updated", foundProduct: inMemoryProducts });
    }
    return res.status(200).json({ foundProduct: inMemoryProducts });
  }

  // Journal Entry
  if (path.startsWith("journalEntry/manage")) {
    return res.status(200).json({ data: inMemoryJournalEntries });
  }

  // General Ledger
  if (path.startsWith("generalLedger/manage")) {
    return res.status(200).json({
      asset_general_ledger: [
        { transaction_date: "2026-08-01", debit: 5000, credit: 0, balance_debit: 5000, balance_credit: 0, description: "Initial Cash Deposit" },
        { transaction_date: "2026-08-03", debit: 3200, credit: 0, balance_debit: 8200, balance_credit: 0, description: "Customer Payment" },
        { transaction_date: "2026-08-05", debit: 0, credit: 1200, balance_debit: 7000, balance_credit: 0, description: "Equipment Purchase" },
      ],
      expense_general_ledger: [
        { transaction_date: "2026-08-02", debit: 180, credit: 0, balance_debit: 180, balance_credit: 0, description: "Internet Bill" },
        { transaction_date: "2026-08-06", debit: 350, credit: 0, balance_debit: 530, balance_credit: 0, description: "Office Stationery" },
      ],
    });
  }

  // Trial Balance
  if (path.startsWith("trialBalance/manage")) {
    return res.status(200).json({
      asset: { account: "Asset (Cash & Inventory)", debit: 28500, credit: 0 },
      liability: { account: "Liabilities (Payables)", debit: 0, credit: 4200 },
      capital: { account: "Capital (Equity)", debit: 0, credit: 21300 },
      expense: { account: "Operating Expenses", debit: 5420, credit: 0 },
      revenue: { account: "Sales Revenue", debit: 0, credit: 8420 },
      debit_sum: 33920,
      credit_sum: 33920,
    });
  }

  // Income Statement
  if (path.startsWith("incomeStatement/manage")) {
    return res.status(200).json({
      revenue: { transaction_name: "Sales Revenue", balance: 16850 },
      inventory_expense: { transaction_name: "Cost of Goods Sold", balance: 3420 },
      other_expense: { transaction_name: "Operating Expenses", balance: 2000 },
      expense_sum: 5420,
      net_income: 11430,
    });
  }

  // Balance Sheet
  if (path.startsWith("balanceSheet/manage")) {
    return res.status(200).json({
      cash: { account_name: "Cash in Hand & Bank", account_balance: 18500 },
      inventory: { account_name: "Raw Material & Finished Stock", account_balance: 10000 },
      assetSum: 28500,
      stock: { account_name: "Owner's Equity", account_balance: 17070 },
      earning_or_loss: { account_name: "Retained Earnings", account_balance: 11430 },
      net_stock: 28500,
    });
  }

  // Default fallback for any other route
  return res.status(200).json({ status: "ok", data: [] });
}
