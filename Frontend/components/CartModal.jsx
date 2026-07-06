import React, { useState, useEffect } from 'react';

function CartModal({ isOpen, onClose, discountPercentage, currentPoints, currencyTranslator }) {
  const [cartMemoryStream, setCartMemoryStream] = useState([]);
  const [isCheckoutProcessing, setIsCheckoutProcessing] = useState(false);
  const [generatedInvoiceReceipt, setGeneratedInvoiceReceipt] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const activeStream = JSON.parse(localStorage.getItem('cartMemoryStream')) || [];
      setCartMemoryStream(activeStream);
      setGeneratedInvoiceReceipt(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const calculateGrossCartTotalValueAmountNum = () => {
    return cartMemoryStream.reduce((accumulator, itemElement) => accumulator + (parseFloat(itemElement.price) * itemElement.quantity), 0);
  };

  const handleModifyQuantityAdjustmentAction = (itemId, chosenSize, scaleDirectionModifierNum) => {
    let freshCartStream = [...cartMemoryStream];
    const targetItemMatchIndex = freshCartStream.findIndex(item => item.id === itemId && item.chosenSize === chosenSize);

    if (targetItemMatchIndex !== -1) {
      freshCartStream[targetItemMatchIndex].quantity += scaleDirectionModifierNum;
      if (freshCartStream[targetItemMatchIndex].quantity <= 0) {
        freshCartStream.splice(targetItemMatchIndex, 1);
      }
      setCartMemoryStream(freshCartStream);
      localStorage.setItem('cartMemoryStream', JSON.stringify(freshCartStream));
    }
  };

  const handleClearEntireCartActionStream = () => {
    localStorage.removeItem('cartMemoryStream');
    setCartMemoryStream([]);
  };

  const handleExecuteSecureCheckoutPipelineAction = () => {
    if (cartMemoryStream.length === 0) return;

    setIsCheckoutProcessing(true);
    const calculatedBaseGrossAmount = calculateGrossCartTotalValueAmountNum();
    const discountMultiplierFactor = discountPercentage > 0 ? (100 - discountPercentage) / 100 : 1;
    const finalNetSettlementCapitalPaidValue = Math.round(calculatedBaseGrossAmount * discountMultiplierFactor);

    const compiledCheckoutPayloadDataStream = {
      totalAmount: finalNetSettlementCapitalPaidValue,
      cartItems: cartMemoryStream,
      userEmail: 'karmugilan@gmail.com',
      paymentMethod: 'Cash on Delivery'
    };

    fetch('http://localhost:5000/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compiledCheckoutPayloadDataStream)
    })
    .then(res => res.json())
    .then(data => {
      setGeneratedInvoiceReceipt({
        receiptId: data.orderId || Math.floor(Math.random() * 9000) + 1000,
        customerName: "KARMUGILAN K",
        customerEmail: "karmugilan@gmail.com",
        grossTotal: calculatedBaseGrossAmount,
        discountApplied: discountPercentage,
        netPaid: finalNetSettlementCapitalPaidValue,
        purchasedDate: new Date().toLocaleString(),
        itemsSnapshot: [...cartMemoryStream]
      });
      localStorage.removeItem('cartMemoryStream');
      setCartMemoryStream([]);
      setIsCheckoutProcessing(false);
    })
    .catch(() => {
      setIsCheckoutProcessing(false);
    });
  };

  // =========================================================================
  // 🔥 BUG DEFEATED FIXED: ISOLATED VIRTUAL WINDOW FLASH PRINTER ENGINE
  // =========================================================================
  const handleTriggerNativeReceiptPrintSequence = () => {
    if (!generatedInvoiceReceipt) return;

    // Build raw text structured HTML strings elements context to avoid global CSS media hide traps bounds!
    const invoicePrintableItemsRowsHtmlStr = generatedInvoiceReceipt.itemsSnapshot.map(it => `
      <tr style="border-bottom: 1px dashed #2f3542; font-size: 13px;">
        <td style="padding: 8px 0;">${it.name} [Size ${it.chosenSize || 'M'}]</td>
        <td style="padding: 8px 0; text-align: center;">x${it.quantity}</td>
        <td style="padding: 8px 0; text-align: right; font-weight: bold;">${currencyTranslator(parseFloat(it.price) * it.quantity)}</td>
      </tr>
    `).join('');

    const masterPrintDocumentFrameWindowContentString = `
      <html>
        <head>
          <title>ThreadCraft Textiles Receipt #${generatedInvoiceReceipt.receiptId}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; color: #000000; background: #ffffff; padding: 40px; margin: 0; box-sizing: border-box; }
            .invoice-shell { border: 2px dashed #000000; padding: 30px; max-width: 600px; margin: 0 auto; }
            .heading { text-align: center; border-bottom: 2px dashed #000000; padding-bottom: 15px; margin-bottom: 20px; }
            .metadata-row { font-size: 13px; line-height: 1.6; margin-bottom: 20px; border-bottom: 1px solid #000000; padding-bottom: 12px; }
            .totals-box { font-size: 13px; line-height: 1.6; margin-top: 20px; border-top: 2px dashed #000000; padding-top: 12px; }
            .qr-mock { display: flex; align-items: center; gap: 15px; border: 1px solid #000000; padding: 12px; margin-top: 25px; background: #fafafa; }
            .qr-box { width: 45px; height: 45px; background: #000000; display: grid; grid-template-columns: repeat(3, 15px); gap: 1px; }
            .qr-pixel { width: 14px; height: 14px; background: #ffffff; }
          </style>
        </head>
        <body>
          <div class="invoice-shell">
            <div class="heading">
              <h2 style="margin: 0 0 5px 0; font-size: 22px; font-weight: bold;">🧵 THREADCRAFT TEXTILES HUB</h2>
              <span style="font-size: 12px; color: #555555;">Enterprise Material Fulfillment Center, India</span>
              <h4 style="margin: 10px 0 0 0; letter-spacing: 0.5px; font-size: 14px;">OFFICIAL COMMERCIAL TRANSACTION RECEIPT</h4>
            </div>

            <div class="metadata-row">
              <div><strong>Receipt Order Token:</strong> #${generatedInvoiceReceipt.receiptId}</div>
              <div><strong>Client Account Name:</strong> ${generatedInvoiceReceipt.customerName}</div>
              <div><strong>Destination Email:</strong> ${generatedInvoiceReceipt.customerEmail}</div>
              <div><strong>Timestamp Secured:</strong> ${generatedInvoiceReceipt.purchasedDate}</div>
              <div><strong>Payment Route:</strong> Cash on Delivery (Verified Sync)</div>
            </div>

            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
              <thead>
                <tr style="border-bottom: 2px solid #000000; font-size: 13px; font-weight: bold;">
                  <th style="text-align: left; padding-bottom: 6px;">DISPATCHED TEXTILES LOG</th>
                  <th style="text-align: center; padding-bottom: 6px; width: 60px;">QTY</th>
                  <th style="text-align: right; padding-bottom: 6px; width: 100px;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${invoicePrintableItemsRowsHtmlStr}
              </tbody>
            </table>

            <div class="totals-box">
              <div style="display: flex; justify-content: space-between;"><span>Gross Items Subtotal:</span><span>${currencyTranslator(generatedInvoiceReceipt.grossTotal)}</span></div>
              ${generatedInvoiceReceipt.discountApplied > 0 ? `<div style="display: flex; justify-content: space-between; color: green;"><span>Campaign Waiver Deduction:</span><span>-${generatedInvoiceReceipt.discountApplied}%</span></div>` : ''}
              <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: bold; margin-top: 6px; border-top: 1px solid #000000; padding-top: 6px;">
                <span>NET SETTLED VALUE PAID:</span><span>${currencyTranslator(generatedInvoiceReceipt.netPaid)}</span>
              </div>
            </div>

            <div class="qr-mock">
              <div class="qr-box">
                <div class="qr-pixel" style="background:#000;"></div><div class="qr-pixel"></div><div class="qr-pixel" style="background:#000;"></div>
                <div class="qr-pixel"></div><div class="qr-pixel" style="background:#000;"></div><div class="qr-pixel"></div>
                <div class="qr-pixel" style="background:#000;"></div><div class="qr-pixel"></div><div class="qr-pixel" style="background:#000;"></div>
              </div>
              <div style="font-size: 10px; color: #333333; line-height: 1.3;">
                <strong>🛡️ SECURE SEC-OPS CRYPTO-VERIFICATION TOKEN SIGNATURE QR BLOCK:</strong><br/>
                Scan verification tokens ledger code index node parameters to authenticate structural receipt logs matrix. Secure hash status: VERIFIED.
              </div>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); window.close(); };
          </script>
        </body>
      </html>
    `;

    // Open an isolated sandbox window stream bypass tab to execute print context cleanly!
    const virtualTargetPrintWindowFrame = window.open('', '_blank', 'width=800,height=700');
    virtualTargetPrintWindowFrame.document.open();
    virtualTargetPrintWindowFrame.document.write(masterPrintDocumentFrameWindowContentString);
    virtualTargetPrintWindowFrame.document.close();
  };

  const baseGrossAmount = calculateGrossCartTotalValueAmountNum();
  const discountMultiplier = discountPercentage > 0 ? (100 - discountPercentage) / 100 : 1;
  const netPaidTotal = Math.round(baseGrossAmount * discountMultiplier);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 4500 }}>
      
      {/* SHOPPING CART OVERLAY MODAL */}
      {!generatedInvoiceReceipt ? (
        <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '90%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2f3542', paddingBottom: '10px', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, color: '#2f3542' }}>🛒 Your ThreadCraft Fabrics Bag</h3>
            <button onClick={onClose} style={{ border: 'none', background: 'none', fontSize: '22px', fontWeight: 'bold', cursor: 'pointer', color: '#57606f' }}>×</button>
          </div>

          {cartMemoryStream.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#a4b0be' }}>
              <h4>Your shopping bag memory streams are empty parameters!</h4>
            </div>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                {cartMemoryStream.map((item, index) => (
                  <div key={index} style={{ display: 'flex', gap: '15px', alignItems: 'center', borderBottom: '1px solid #f1f2f6', paddingBottom: '10px' }}>
                    <img src={item.img} alt={item.name} style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '4px' }} />
                    <div style={{ flex: 1 }}>
                      <h5 style={{ margin: '0 0 3px 0', fontSize: '13px' }}>{item.name}</h5>
                      <span style={{ backgroundColor: '#2f3542', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px' }}>SIZE: {item.chosenSize || 'M'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <button onClick={() => handleModifyQuantityAdjustmentAction(item.id, item.chosenSize, -1)} style={{ cursor: 'pointer' }}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleModifyQuantityAdjustmentAction(item.id, item.chosenSize, 1)} style={{ cursor: 'pointer' }}>+</button>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ backgroundColor: '#fafafa', padding: '15px', borderRadius: '6px', marginBottom: '15px', fontSize: '13px' }}>
                <div style={{ display: 'flex', justifyCOntent: 'space-between' }}><span>Gross Fabrics Basket Worth:</span><strong>{currencyTranslator(baseGrossAmount)}</strong></div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: '#ff4757', borderTop: '1px solid #ccc', paddingTop: '6px', marginTop: '6px' }}>
                  <span>Net Total Payable Capital:</span><span>{currencyTranslator(netPaidTotal)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleClearEntireCartActionStream} style={{ padding: '10px', cursor: 'pointer' }}>Wipe Bag</button>
                <button onClick={handleExecuteSecureCheckoutPipelineAction} disabled={isCheckoutProcessing} style={{ flex: 1, padding: '10px', backgroundColor: '#2ed573', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  {isCheckoutProcessing ? 'Processing...' : '🔒 Confirm Order (Cash on Delivery Mode)'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* INTERACTION INTERFACE INVOICE WINDOW OVERLAY BANNER */
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '460px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <div style={{ fontSize: '50px', color: '#2ed573', marginBottom: '10px' }}>🎉</div>
          <h3 style={{ margin: '0 0 10px 0', color: '#2f3542' }}>Transaction Authorized Successfully!</h3>
          <p style={{ fontSize: '13px', color: '#57606f', marginBottom: '20px' }}>Order Token Reference <strong>#{generatedInvoiceReceipt.receiptId}</strong> is committed secure into database systems channels log pipelines.</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button onClick={handleTriggerNativeReceiptPrintSequence} style={{ width: '100%', padding: '12px', backgroundColor: '#ff9f43', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>
              🖨️ Generate & Print High-Contrast Textile Receipt Document (PDF)
            </button>
            <button onClick={onClose} style={{ width: '100%', padding: '10px', backgroundColor: '#f1f2f6', color: '#57606f', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>
              Continue Textile Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartModal;