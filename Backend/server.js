const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Secure connection pool linking explicitly into target operational textile database context fields
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '', 
  database: process.env.DB_NAME || 'textile_db', 
  waitForConnections: true,
  connectionLimit: 15,
  queueLimit: 0
});

// IN-MEMORY SECURITY AUDIT TRAIL DATA STREAM POOLS REGISTER & ADVANCED SYSTEMS BUCKETS
let globalAuditTrailEventRegistry = [
  { id: 101, event: "SYSTEM_INITIALIZATION", desc: "ThreadCraft Textiles Core Services Framework initialized online successfully.", type: "SECURITY", timestamp: new Date(Date.now() - 3600000).toLocaleString() },
  { id: 102, event: "DATABASE_POOL_CONNECTED", desc: "MySQL relational pool connection allocated targeting database schema: textile_db.", type: "SYSTEM", timestamp: new Date(Date.now() - 3000000).toLocaleString() },
  { id: 103, event: "AI_FORECAST_ENGINE_READY", desc: "Predictive trend analysis matrices allocated over transactional rows logs mapping.", type: "SYSTEM", timestamp: new Date().toLocaleString() }
];

let globalProductReviewsDatabaseStream = [
  { productId: 1, id: 1, user: "KARMUGILAN K", rating: 5, comment: "Highly durable weave matrix texture, colors do not bleed during wash cycles.", date: new Date().toLocaleDateString() }
];

let simulatedActiveUserProfileRecordsMap = {
  'karmugilan@gmail.com': { name: 'KARMUGILAN K', walletPoints: 350, joinedDate: '2026-01-15' }
};

let transientAdministrativeOTPTokenBucket = null;

// PROCUREMENT LOGS PERSISTENT QUEUE SIMULATOR FOR AUTOMATED WAREHOUSE ORDERS
let automaticSupplierProcurementInvoicesLog = [
  { procurementId: 701, fabricCategory: "Cotton", metersOrdered: 500, targetSupplier: "Coimbatore Industrial Mills Ltd", status: "Dispatched & In-Transit", timestamp: new Date(Date.now() - 86400000).toLocaleString() }
];

const injectNewAuditTrailEventLog = (eventName, description, eventType) => {
  const generatedLogId = Math.floor(Math.random() * 90000) + 10000;
  globalAuditTrailEventRegistry.unshift({
    id: generatedLogId,
    event: eventName,
    desc: description,
    type: eventType || 'ACTION',
    timestamp: new Date().toLocaleString()
  });
};

// ==========================================
// 🛡️ SECURITY & IDENTITY LOGIC ENDPOINTS
// ==========================================
app.post('/api/admin/security/generate-2fa', (req, res) => {
  const cryptographicGeneratedOTP = String(Math.floor(100000 + Math.random() * 900000));
  transientAdministrativeOTPTokenBucket = cryptographicGeneratedOTP;
  injectNewAuditTrailEventLog("CYBER_2FA_TOKEN_DISPATCH", `Two-Factor authentication code [${cryptographicGeneratedOTP}] dispatched live successfully.`, "PRIVACY");
  res.json({ success: true, tokenSimEcho: cryptographicGeneratedOTP });
});

app.post('/api/admin/security/verify-2fa', (req, res) => {
  const { inputToken } = req.body;
  if (transientAdministrativeOTPTokenBucket && String(inputToken).trim() === String(transientAdministrativeOTPTokenBucket).trim()) {
    transientAdministrativeOTPTokenBucket = null;
    return res.json({ authorizedClearance: true });
  }
  res.status(401).json({ authorizedClearance: false, error: "Invalid parameters." });
});

app.get('/api/customer/profile', (req, res) => {
  res.json(simulatedActiveUserProfileRecordsMap[req.query.email || 'karmugilan@gmail.com'] || { name: 'KARMUGILAN K', walletPoints: 350 });
});

// ==========================================
// 🛍️ COMMERCIAL SYSTEM LOGISTICS
// ==========================================
app.get('/api/products', (req, res) => {
  db.query("SELECT * FROM products", (error, results) => {
    if (error) return res.status(500).json({ error: "Catalog error." });
    const mappedCatalogPayloadWithStockFlags = results.map(prod => ({
      ...prod,
      isLowStockAlertActive: prod.stock < 5,
      overallRatingScoreValueNum: prod.id === 1 ? 5 : prod.id === 2 ? 4 : 4.5
    }));
    res.json(mappedCatalogPayloadWithStockFlags);
  });
});

// ==========================================
// 🏭 NEW MODULE: AUTOMATED MATERIAL PROCUREMENT DISPATCHER ENDPOINT
// ==========================================
app.get('/api/admin/procurement/logs', (req, res) => {
  res.json(automaticSupplierProcurementInvoicesLog);
});

// ==========================================
// 💳 TRANSACTION SECURE PROCESSING & REORDER TRIGGER
// ==========================================
app.post('/api/checkout', (req, res) => {
  const { totalAmount, cartItems, userEmail, paymentMethod, currencyContextMeta } = req.body;
  if (!cartItems || cartItems.length === 0) return res.status(400).json({ error: "Empty stream" });
  const targetedClientEmailKey = userEmail || 'karmugilan@gmail.com';

  db.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: "Pool failure." });
    connection.beginTransaction((txErr) => {
      if (txErr) { connection.release(); return res.status(500).json({ error: "Transaction exception." }); }

      const orderInsertionMasterQueryStr = "INSERT INTO orders (total_amount, payment_method, status) VALUES (?, ?, 'Pending')";
      connection.query(orderInsertionMasterQueryStr, [totalAmount, paymentMethod || 'Stripe Dynamic Gateway Gate'], (orderErr, orderResult) => {
        if (orderErr) return connection.rollback(() => { connection.release(); res.status(500).json({ error: orderErr.message }); });
        const assignedOrderId = orderResult.insertId;
        const itemsData = cartItems.map(item => [assignedOrderId, item.id, item.quantity, item.price]);
        
        connection.query("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?", [itemsData], (itemsErr) => {
          if (itemsErr) return connection.rollback(() => { connection.release(); res.status(500).json({ error: itemsErr.message }); });

          let productUpdateExecutionPromises = cartItems.map(item => {
            return new Promise((resolve, reject) => {
              // Decrement local inventory volumes
              connection.query("UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?", [item.quantity, item.id], (upErr) => {
                if(upErr) return reject(upErr);
                
                // Fetch fresh stock to execute autonomous automated safety limit checkers routines
                connection.query("SELECT name, stock, fabric FROM products WHERE id = ?", [item.id], (fetchErr, fetchRes) => {
                  if(!fetchErr && fetchRes && fetchRes[0] && fetchRes[0].stock < 5) {
                    const lowStockItem = fetchRes[0];
                    const targetMetersToReorderNum = 300;
                    const generatedInvoiceId = Math.floor(Math.random() * 9000) + 1000;
                    
                    // Core Auto-Procurement Payload injection loop
                    automaticSupplierProcurementInvoicesLog.unshift({
                      procurementId: generatedInvoiceId,
                      fabricCategory: lowStockItem.fabric || 'Cotton',
                      metersOrdered: targetMetersToReorderNum,
                      targetSupplier: lowStockItem.fabric === 'Silk' ? "Kanchipuram Silk Elite Weavers Coop" : "Coimbatore Industrial Mills Ltd",
                      status: "Auto-Triggered: Awaiting Shipment Raw Roll",
                      timestamp: new Date().toLocaleString()
                    });

                    injectNewAuditTrailEventLog(
                      "SUPPLIER_PROCUREMENT_DISPATCH", 
                      `CRITICAL STORAGE DEPLETION DETECTED: Product '${lowStockItem.name}' inventory dropped below threshold alert margin down to (${lowStockItem.stock} Nos remaining!). Automated procurement matrix successfully dispatched pipeline refill logs invoice order #${generatedInvoiceId} targeting wholesale weaving hubs allocations systems.`, 
                      "SYSTEM"
                    );
                  }
                  resolve();
                });
              });
            });
          });

          Promise.all(productUpdateExecutionPromises)
            .then(() => {
              connection.commit((commitErr) => {
                if (commitErr) return connection.rollback(() => { connection.release(); res.status(500).json({ error: "Commit exception" }); });
                connection.release();
                
                const pointsGained = Math.floor(totalAmount / 100);
                if(simulatedActiveUserProfileRecordsMap[targetedClientEmailKey]) {
                  simulatedActiveUserProfileRecordsMap[targetedClientEmailKey].walletPoints += pointsGained;
                }

                injectNewAuditTrailEventLog("FINANCIAL_GATEWAY_CLEARANCE", `Order ID #${assignedOrderId} processed completely. Settlement Value: ₹${totalAmount}.00.`, "COMMERCE");
                res.json({ message: "Checkout complete!", orderId: assignedOrderId, walletGains: pointsGained });
              });
            })
            .catch(pErr => {
              connection.rollback(() => { connection.release(); res.status(500).json({ error: pErr.message }); });
            });
        });
      });
    });
  });
});

// ==========================================
// 📊 ADVERTISING ANALYTICS CONTROL & ADVANCED FORECAST LOGS
// ==========================================
app.get('/api/admin/analytics', (req, res) => {
  db.query("SELECT IFNULL(SUM(total_amount), 0) AS totalRevenue, COUNT(id) AS totalOrdersCount FROM orders", (err1, revenueResultsGrid) => {
    db.query("SELECT IFNULL(p.fabric, 'Cotton') AS fabric, IFNULL(SUM(oi.quantity), 0) AS unitsSold FROM order_items oi INNER JOIN products p ON oi.product_id = p.id GROUP BY p.fabric", (err2, fabricDistributionResultsGrid) => {
      res.json({
        totalRevenue: revenueResultsGrid && revenueResultsGrid[0] ? parseFloat(revenueResultsGrid[0].totalRevenue) : 0,
        totalOrdersCount: revenueResultsGrid && revenueResultsGrid[0] ? parseInt(revenueResultsGrid[0].totalOrdersCount) : 0,
        fabricMetrics: fabricDistributionResultsGrid || []
      });
    });
  });
});

app.get('/api/admin/audit-logs', (req, res) => { res.json(globalAuditTrailEventRegistry); });
app.get('/api/reviews/:productId', (req, res) => { res.json(globalProductReviewsDatabaseStream.filter(rev => rev.productId === parseInt(req.params.productId))); });
app.post('/api/reviews', (req, res) => { const { productId, user, rating, comment } = req.body; const freshReviewObject = { productId: parseInt(productId), id: globalProductReviewsDatabaseStream.length + 1, user: user || "KARMUGILAN K", rating: parseInt(rating) || 5, comment: comment || "", date: new Date().toLocaleDateString() }; globalProductReviewsDatabaseStream.unshift(freshReviewObject); res.json({ success: true, newlyCommittedReview: freshReviewObject }); });
app.post('/api/chat/support', (req, res) => { const { message } = req.body; const promptText = message ? message.toLowerCase().trim() : ''; let reply = "I am your ThreadCraft Assistant. Ask me about tracking, predictions or procurement systems!"; if (promptText.includes('order')) reply = "📦 Tracking Info: Monitor live step progressions horizontal charts in user order logs panel."; else if (promptText.includes('trend') || promptText.includes('ai')) reply = "🔮 AI Analytics Engine: Access administrative trends modules forecasting macro market product moving share shifts ratios."; res.json({ botResponse: reply }); });

app.get('/api/admin/orders', (req, res) => {
  db.query(`SELECT o.id AS primary_order_id, o.total_amount, o.status, o.payment_method, o.created_at, oi.quantity AS purchased_qty, oi.price AS item_price, p.name AS product_name FROM orders o LEFT JOIN order_items oi ON o.id = oi.order_id LEFT JOIN products p ON oi.product_id = p.id ORDER BY o.created_at DESC`, (error, queryDataRowsOutputArray) => {
    if (error) return res.status(500).json({ error: "Fault logs." });
    const groupedCorporateOrdersLedgerSummaryMap = queryDataRowsOutputArray.reduce((consolidationAccumulatorArray, currentRowObject) => {
      let activeTargetOrderReferenceObject = consolidationAccumulatorArray.find(item => item.id === currentRowObject.primary_order_id);
      if (!activeTargetOrderReferenceObject) {
        activeTargetOrderReferenceObject = { id: currentRowObject.primary_order_id, total_amount: currentRowObject.total_amount, status: currentRowObject.status, payment_method: currentRowObject.payment_method || 'Cash on Delivery', created_at: currentRowObject.created_at, items: [] };
        consolidationAccumulatorArray.push(activeTargetOrderReferenceObject);
      }
      if (currentRowObject.product_name) { activeTargetOrderReferenceObject.items.push({ name: currentRowObject.product_name, quantity: currentRowObject.purchased_qty, price: currentRowObject.item_price }); }
      return consolidationAccumulatorArray;
    }, []);
    res.json(groupedCorporateOrdersLedgerSummaryMap);
  });
});

app.put('/api/admin/orders/:id', (req, res) => {
  const targetOrderIdParameterKey = req.params.id;
  const { status } = req.body;
  db.query("UPDATE orders SET status = ? WHERE id = ?", [status, targetOrderIdParameterKey], (error) => {
    if (error) return res.status(500).json({ error: "Modifier track crash logs." });
    injectNewAuditTrailEventLog("LOGISTICS_STATUS_MUTATION", `Order ID #${targetOrderIdParameterKey} status modified to checkpoint level: '${status}'.`, "ADMIN");
    res.json({ success: true, message: "Order logistics tracking updated live standard!" });
  });
});

app.post('/api/admin/products', (req, res) => {
  const { name, price, fabric, stock, img } = req.body;
  db.query("INSERT INTO products (name, price, fabric, stock, img) VALUES (?, ?, ?, ?, ?)", [name, parseFloat(price), fabric || 'Cotton', parseInt(stock) || 30, img], (error, result) => {
    if (error) return res.status(500).json({ error: "Failure" });
    injectNewAuditTrailEventLog("PRODUCT_CATALOG_APPEND", `Pudhiya cloth item '${name}' added into products catalog registry.`, "ADMIN");
    res.json({ message: "Product added!", newlyAddedProductId: result.insertId });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Advanced Multi-Currency 2FA Core Backend Engine running on Port channel ${PORT}`));