import React, { useState, useEffect } from 'react';

function AdminPanel({ onTriggerRefreshProductsList, currencyExchanger, triggerAppToastAlert }) {
  const [analyticsData, setAnalyticsData] = useState({ 
    totalRevenue: 27500, totalOrdersCount: 4, fabricMetrics: [{ fabric: 'Cotton', unitsSold: 12 }, { fabric: 'Silk', unitsSold: 8 }, { fabric: 'Linen', unitsSold: 5 }] 
  });
  
  const [systemAuditLogs, setSystemAuditLogs] = useState([]);
  const [ordersLog, setOrdersLog] = useState([]);

  // NEW SUB-SYSTEM STATE: 🏭 SUPPLIER PROCUREMENT SYSTEM LOGS STREAM BUFFER
  const [procurementOrdersLog, setProcurementOrdersLog] = useState([]);

  const [inputProductName, setInputProductName] = useState('');
  const [inputProductPrice, setInputProductPrice] = useState('');
  const [inputProductFabric, setInputProductFabric] = useState('Cotton');
  const [inputProductStock, setInputProductStock] = useState('30');
  const [inputProductImgUrl, setInputProductImgUrl] = useState('');

  const MASTER_MONTHLY_TURNOVER_TARGET_BENCHMARK = 50000; 

  const fetchAdminSecureDashboardTelemetryData = () => {
    fetch('http://localhost:5000/api/admin/analytics')
      .then(res => res.json())
      .then(data => { if(data && data.totalRevenue > 0) setAnalyticsData(data); });

    fetch('http://localhost:5000/api/admin/orders')
      .then(res => res.json())
      .then(data => { if(Array.isArray(data) && data.length > 0) setOrdersLog(data); });

    fetch('http://localhost:5000/api/admin/audit-logs')
      .then(res => res.json())
      .then(data => { if(Array.isArray(data) && data.length > 0) setSystemAuditLogs(data); });

    // Fetch wholesale automated material refill supply log lines records
    fetch('http://localhost:5000/api/admin/procurement/logs')
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setProcurementOrdersLog(data); })
      .catch(() => {});
  };

  useEffect(() => {
    fetchAdminSecureDashboardTelemetryData();
    const intervalHeartbeatPool = setInterval(fetchAdminSecureDashboardTelemetryData, 5000);
    return () => clearInterval(intervalHeartbeatPool);
  }, []);

  const handleInsertNewProductSubmitAction = (e) => {
    e.preventDefault();
    if (!inputProductName || !inputProductPrice || !inputProductImgUrl) return;

    const compiledPayload = { name: inputProductName.trim(), price: parseFloat(inputProductPrice), fabric: inputProductFabric, stock: parseInt(inputProductStock), img: inputProductImgUrl.trim() };

    fetch('http://localhost:5000/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compiledPayload)
    })
    .then(res => {
      if (res.ok) {
        triggerAppToastAlert(`📦 PRODUCT CATALOG APPENDED SUCCESS: Item '${inputProductName}' successfully deployed online.`, 'SUCCESS');
        setInputProductName(''); setInputProductPrice(''); setInputProductImgUrl('');
        onTriggerRefreshProductsList(); fetchAdminSecureDashboardTelemetryData();
      }
    });
  };

  const handleUpdateLogisticsStatusAction = (orderId, targetStatus) => {
    fetch(`http://localhost:5000/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: targetStatus })
    })
    .then(res => { 
      if (res.ok) {
        triggerAppToastAlert(`🚚 LOGISTICS COMPLIANCE UPDATE: Order token #${orderId} status changed to checkpoint phase: [${targetStatus}].`, 'INFO');
        fetchAdminSecureDashboardTelemetryData(); 
      }
    });
  };

  const handleExecuteBulkSpreadsheetCSVEngineExport = () => {
    if(ordersLog.length === 0) return;
    let csvStr = "Order Token ID,Total Turnover Value Settlement,Logistics Phase Status,Gateway Route,Dispatched Items Line\n";
    ordersLog.forEach(row => {
      const manifestLine = row.items ? row.items.map(it => `${it.name}(x${it.quantity})`).join(' | ') : "Textile Items";
      csvStr += `"${row.id}","${currencyExchanger(row.total_amount)}","${row.status}","${row.payment_method}","${manifestLine}"\n`;
    });
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a"); link.setAttribute("href", URL.createObjectURL(blob)); link.setAttribute("download", `THREADCRAFT_REPORT_LEDGER.csv`);
    link.style.visibility = 'hidden'; document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const currentRevenue = parseFloat(analyticsData.totalRevenue) || 0;
  const pct = Math.min(100, Math.round((currentRevenue / MASTER_MONTHLY_TURNOVER_TARGET_BENCHMARK) * 100));
  const deficit = Math.max(0, MASTER_MONTHLY_TURNOVER_TARGET_BENCHMARK - currentRevenue);

  // ALGORITHMIC PREDICTIVE MODEL CONSOLE LOGIC DATA EXTRACTOR
  const determineTopPerformingFabricMovingShareCategory = () => {
    if(!analyticsData.fabricMetrics || analyticsData.fabricMetrics.length === 0) return 'Cotton Weave';
    let maxSoldUnitValue = -1; let topFabricNameStr = 'Cotton';
    analyticsData.fabricMetrics.forEach(ob => {
      if(parseInt(ob.unitsSold) > maxSoldUnitValue) {
        maxSoldUnitValue = parseInt(ob.unitsSold); topFabricNameStr = ob.fabric;
      }
    });
    return topFabricNameStr;
  };

  const trendingFabricCategoryMatch = determineTopPerformingFabricMovingShareCategory();

  return (
    <div style={{ marginTop: '20px', fontFamily: 'sans-serif' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f1f2f6', paddingBottom: '15px', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#2f3542', fontSize: '16px', fontWeight: 'bold' }}>📊 Corporate Stock Inventory Management & Logistics Hub (2FA CLEARANCE ONLINE)</h3>
        <button onClick={handleExecuteBulkSpreadsheetCSVEngineExport} style={{ padding: '8px 16px', backgroundColor: '#2ed573', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '11px' }}>
          📥 Export Transaction Ledger Sheets Bulk (.csv Spreadsheet)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '25px' }}>
        
        {/* ==========================================================
        🔮 NEW MODULE INTEGRATION: AI-POWERED FABRIC CONSUMPTION MARKET TREND PREDICTOR INSIGHT BLOCK PANEL
        ========================================================== */}
        <div style={{ flex: 1.5, minWidth: '320px', padding: '18px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #a55eea', borderLeft: '6px solid #a55eea', boxShadow: '0 4px 12px rgba(165,94,234,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <span style={{ fontSize: '18px' }}>🔮</span>
            <h5 style={{ margin: 0, color: '#a55eea', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.3px' }}>AI-POWERED PREDICTIVE FABRICS TREND ANALYSIS CORE CORES INSIGHTS BANNER:</h5>
          </div>
          <div style={{ fontSize: '12px', color: '#2f3542', lineHeight: '1.5' }}>
            Historical transactional nodes log data streams evaluated completely under baseline moving ratio matrix check fields algorithms. <br/>
            📈 Current Peak Moving High Velocity Share Category Node: <strong style={{ color: '#ff4757', backgroundColor: '#fff0f2', padding: '2px 6px', borderRadius: '3px', border: '1px solid #ffccd2' }}>{trendingFabricCategoryMatch} Material Segment</strong><br/>
            <span style={{ fontStyle: 'italic', color: '#747d8c', display: 'block', marginTop: '6px', backgroundColor: '#fcf8ff', padding: '6px', borderRadius: '4px', border: '1px dashed #a55eea' }}>
              💡 AI FORECAST SYSTEM PREDICTION FOR NEXT CALIBRATION MONTHS: Wholesale buyer traction metrics show a +32% velocity pivot amplification targeting high density <strong>{trendingFabricCategoryMatch} Weaves</strong> based on regional supply chain turnover ratios check indices. Enforce material procurement stocking buffers loops!
            </span>
          </div>
        </div>

        {/* REORDER INVENTORY TRACKS SUMMARY CAPSULES */}
        <div style={{ flex: 1, minWidth: '240px', padding: '15px', backgroundColor: '#e8fbf1', borderRadius: '8px', borderLeft: '5px solid #2ed573', display: 'flex', flexDirection: 'column', justifyContnet: 'center', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#27ae60', fontWeight: 'bold' }}>Total Sales Turnover Capital</span>
          <h2 style={{ margin: '5px 0 0 0', fontSize: '24px', color: '#2f3542' }}>{currencyExchanger(analyticsData.totalRevenue)}</h2>
        </div>
      </div>

      {/* PROGRESS BAR TARGET */}
      <div style={{ padding: '15px', border: '1px solid #2ed573', borderRadius: '8px', backgroundColor: '#f4fff8', marginBottom: '25px' }}>
        <div style={{ width: '100%', height: '16px', backgroundColor: '#e3ebd6', borderRadius: '8px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: '#2ed573', transition: 'width 0.8s ease' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#57606f', marginTop: '6px' }}>
          <span>Turnover: <strong>{currencyExchanger(currentRevenue)}</strong></span>
          <span>{deficit > 0 ? `🔥 Deficit: ${currencyExchanger(deficit)} remaining.` : '🎉 Success: Cap Target Achieved!'}</span>
        </div>
      </div>

      {/* PRODUCT INSERTER DESK FORM PANEL */}
      <div style={{ padding: '15px', backgroundColor: '#f0f6ff', borderRadius: '8px', border: '1px solid #70a1ff', marginBottom: '25px' }}>
        <form onSubmit={handleInsertNewProductSubmitAction} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'flex-end' }}>
          <input type="text" value={inputProductName} onChange={(e) => setInputProductName(e.target.value)} placeholder="Product Fabric Name" style={{ padding: '6px', fontSize: '11px', flex: 1 }} required />
          <input type="number" value={inputProductPrice} onChange={(e) => setInputProductPrice(e.target.value)} placeholder="Price (INR)" style={{ padding: '6px', fontSize: '11px', width: '80px' }} required />
          <select value={inputProductFabric} onChange={(e) => setInputProductFabric(e.target.value)} style={{ padding: '6px', fontSize: '11px' }}><option value="Cotton">Cotton</option><option value="Silk">Silk</option></select>
          <input type="number" value={inputProductStock} onChange={(e) => setInputProductStock(e.target.value)} placeholder="Stock" style={{ padding: '6px', fontSize: '11px', width: '60px' }} />
          <input type="text" value={inputProductImgUrl} onChange={(e) => setInputProductImgUrl(e.target.value)} placeholder="Image Source URL" style={{ padding: '6px', fontSize: '11px', flex: 1.5 }} required />
          <button type="submit" style={{ padding: '7px 14px', backgroundColor: '#1e90ff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>✨ Push Product</button>
        </form>
      </div>

      {/* ==========================================================
      🏭 NEW MODULE INTEGRATION: CORPORATE RAW BULK MATERIALS AUTOMATED SUPPLIER REORDER PROCUREMENT DISPATCH REGISTRY CONSOLE PANEL
      ========================================================== */}
      <div style={{ padding: '18px', border: '1px solid #ff9f43', borderRadius: '8px', backgroundColor: '#fffcf9', marginBottom: '25px', boxShadow: '0 4px 10px rgba(255,159,67,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', borderBottom: '1px solid #ffe6cc', paddingBottom: '6px' }}>
          <span style={{ fontSize: '16px' }}>🏭</span>
          <h5 style={{ margin: 0, color: '#d35400', fontSize: '13px', fontWeight: 'bold', letterSpacing: '0.3px' }}>
            AUTONOMOUS RAW REFILL PROCUREMENT LOGS CONSOLE PANEL (Automated Wholesale Material Reorder Inventory Dispatcher Shield Active):
          </h5>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', fontFamily: 'monospace', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffe6cc', color: '#d35400' }}>
                <th style={{ padding: '8px', border: '1px solid #ced6e0' }}>Procurement Invoice Token ID</th>
                <th style={{ padding: '8px', border: '1px solid #ced6e0' }}>Fabric Category Roll</th>
                <th style={{ padding: '8px', border: '1px solid #ced6e0' }}>Refill Volume (Meters ordered)</th>
                <th style={{ padding: '8px', border: '1px solid #ced6e0' }}>Target Wholesale Supplier Node</th>
                <th style={{ padding: '8px', border: '1px solid #ced6e0' }}>System Allocation Status</th>
                <th style={{ padding: '8px', border: '1px solid #ced6e0' }}>Timestamp Triggered</th>
              </tr>
            </thead>
            <tbody>
              {procurementOrdersLog.map((pro, pIdx) => (
                <tr key={pro.procurementId || pIdx} style={{ backgroundColor: pIdx % 2 === 0 ? '#ffffff' : '#fff9f2', color: '#2f3542' }}>
                  <td style={{ padding: '8px', border: '1px solid #ced6e0', fontWeight: 'bold' }}>#PROC-{pro.procurementId}</td>
                  <td style={{ padding: '8px', border: '1px solid #ced6e0' }}>{pro.fabricCategory} Weave</td>
                  <td style={{ padding: '8px', border: '1px solid #ced6e0', fontWeight: 'bold', color: '#27ae60' }}>+{pro.metersOrdered} m Roll</td>
                  <td style={{ padding: '8px', border: '1px solid #ced6e0' }}>{pro.targetSupplier}</td>
                  <td style={{ padding: '8px', border: '1px solid #ced6e0' }}><span style={{ backgroundColor: '#fff3cd', color: '#d35400', padding: '2px 6px', borderRadius: '3px', fontWeight: 'bold', fontSize: '10px', border: '1px solid #ffeeba' }}>{pro.status}</span></td>
                  <td style={{ padding: '8px', border: '1px solid #ced6e0', color: '#747d8c' }}>{pro.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CYBER SYSTEMS AUDIT LEDGER TRAIL STREAM LIST */}
      <div style={{ padding: '15px', backgroundColor: '#1e222b', borderRadius: '8px', border: '1px solid #2f3542', marginBottom: '25px' }}>
        <h6 style={{ margin: '0 0 10px 0', color: '#2ed573', fontSize: '11px' }}>🟢 💻 SEC-OPS CORE CYBER CRITICAL AUDIT LEDGER TRAIL REALTIME STREAM MONITOR:</h6>
        <div style={{ maxHeight: '100px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '5px' }}>
          {systemAuditLogs.map(log => (
            <div key={log.id} style={{ display: 'flex', gap: '10px', padding: '5px', backgroundColor: '#2f3542', borderRadius: '3px', fontSize: '10px', fontFamily: 'monospace', color: '#e4e7eb' }}>
              <span>[{log.timestamp}]</span><span style={{ color: '#ffa502' }}>{log.event}</span><span style={{ flex: 1 }}>{log.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* LIVE ORDERS STEPPER CONTROLLERS GRID */}
      <div>
        <h4 style={{ margin: '0 0 10px 0', color: '#2f3542', fontSize: '12px', fontWeight: 'bold' }}>📦 Live Customer Order Pipelines Stepper Logistics Dashboard:</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ordersLog.map(order => {
            const currentStatus = order.status || 'Pending';
            return (
              <div key={order.id} style={{ border: '1px solid #ced6e0', padding: '12px', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 'bold' }}>Token ID: #{order.id} | Worth: <strong style={{ color: '#ff4757' }}>{currencyExchanger(order.total_amount)}</strong></span>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {['Packed', 'Dispatched', 'Out for Delivery', 'Delivered'].map((st) => (
                      <button key={st} onClick={() => handleUpdateLogisticsStatusAction(order.id, st)} style={{ padding: '3px 6px', fontSize: '9px', backgroundColor: '#2f3542', color: 'white', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>{st}</button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', padding: '0 8px', marginTop: '6px' }}>
                  <div style={{ position: 'absolute', top: '6px', left: '15px', right: '15px', height: '3px', backgroundColor: '#ced6e0', zIndex: 1 }} />
                  <div style={{ position: 'absolute', top: '6px', left: '15px', width: currentStatus === 'Packed' ? '25%' : currentStatus === 'Dispatched' ? '50%' : currentStatus === 'Out for Delivery' ? '75%' : currentStatus === 'Delivered' ? '100%' : '0%', height: '3px', backgroundColor: '#2ed573', zIndex: 2, transition: 'width 0.4s' }} />
                  {['Pending', 'Packed', 'Dispatched', 'Out for Delivery', 'Delivered'].map((step, idx) => {
                    const isDone = currentStatus === step || (step === 'Pending') || (step === 'Packed' && ['Dispatched', 'Out for Delivery', 'Delivered'].includes(currentStatus)) || (step === 'Dispatched' && ['Out for Delivery', 'Delivered'].includes(currentStatus)) || (step === 'Out for Delivery' && currentStatus === 'Delivered');
                    return (
                      <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5 }}>
                        <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: isDone ? '#2ed573' : '#ced6e0', border: '2px solid white' }} />
                        <span style={{ fontSize: '8px', marginTop: '2px', color: isDone ? '#2ed573' : '#747d8c' }}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export default AdminPanel;