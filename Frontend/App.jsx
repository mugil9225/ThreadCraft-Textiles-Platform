import React, { useState, useEffect } from 'react';
import AdminPanel from './components/AdminPanel';
import CartModal from './components/CartModal';
import './App.css';

function App() {
  const [productsList, setProductsList] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  const [searchQueryKeywords, setSearchQueryKeywords] = useState('');
  const [chosenFabricFilter, setChosenFabricFilter] = useState('All');
  const [sortingOptionCriteria, setSortingOptionCriteria] = useState('Default');
  
  const [couponCodeInputString, setCouponCodeInputString] = useState('');
  const [activeDiscountWaiverPercentage, setActiveDiscountWaiverPercentage] = useState(0);
  const [userProfileStateCRM, setUserProfileStateCRM] = useState({ name: 'KARMUGILAN K', walletPoints: 350 });

  const [activeSelectedCurrencyToken, setActiveSelectedCurrencyToken] = useState('INR');
  const currencyConversionMultiplierMatrix = { INR: 1, USD: 0.012, EUR: 0.011 };
  const currencySymbolRepresentationMap = { INR: '₹', USD: '$', EUR: '€' };

  // TAILORING WORKSPACE CANVAS COLOUR PREVIEW ENVIRONMENT
  const [selectedCustomizerProduct, setSelectedCustomizerProduct] = useState(null);
  const [customMetersValue, setCustomMetersValue] = useState(2);
  const [selectedDesignStylePattern, setSelectedDesignStylePattern] = useState('Standard Shirt Craft');
  const [activeCanvasWeaveColourHex, setActiveCanvasWeaveColourHex] = useState('#4b6584');
  const [inputPhysicalWeightKg, setInputPhysicalWeightKg] = useState('');
  const [computedSizeSuggestionResult, setComputedSizeSuggestionResult] = useState('');

  // MODIFIED FEATURE: 🔒 DIRECT PASSCODE ENTRY PORTAL ACCESS LOCK (2FA CORES REMOVED)
  const [isPromptingAdminPasswordWindow, setIsPromptingAdminPasswordWindow] = useState(false);
  const [administrativeGateSecretPasswordInput, setAdministrativeGateSecretPasswordInput] = useState('');

  const [isChatBotDrawerOpen, setIsChatBotDrawerOpen] = useState(false);
  const [chatbotInputMessageText, setChatbotInputMessageText] = useState('');
  const [chatbotConversationLogsStream, setChatbotConversationLogsStream] = useState([
    { sender: 'BOT', text: "Welcome brother! ThreadCraft Automated AI Storefront Desk Active online. Ask me about custom weaves or sizing predictions checks loops!" }
  ]);

  const [activeSocketMessageToastLog, setActiveSocketMessageToastLog] = useState(null);

  const triggerLiveApplicationToastNotificationAlert = (messageText, alertType = 'SUCCESS') => {
    setActiveSocketMessageToastLog({ text: messageText, type: alertType });
    setTimeout(() => { setActiveSocketMessageToastLog(null); }, 4000);
  };

  const universalCurrencyExchangerRoutine = (baseAmountINR) => {
    const scaleFactor = currencyConversionMultiplierMatrix[activeSelectedCurrencyToken];
    const convertedValue = baseAmountINR * scaleFactor;
    return `${currencySymbolRepresentationMap[activeSelectedCurrencyToken]}${convertedValue.toFixed(activeSelectedCurrencyToken === 'INR' ? 0 : 2)}`;
  };

  const fetchProductsCatalogDatasetFromBackendEngine = () => {
    fetch('http://localhost:5000/api/products')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data) && data.length > 0) {
          setProductsList(data);
        } else {
          throw new Error();
        }
      })
      .catch(() => {
        // MODIFIED FEATURE: 👕 PREMIUM REAL CONSUMER E-COMMERCE DRESS AND FABRICS COMPLETE COLLECTION DATA DATA STREAM
        setProductsList([
          { id: 1, name: 'Royal Indo-Western Banarasi Sherwani Fabric Material Weaves (Maroon Zari Craft)', price: 4500, fabric: 'Silk', stock: 8, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop', isLowStockAlertActive: false, overallRatingScoreValueNum: 5 },
          { id: 2, name: 'Premium Organic Cotton Indigo Denim Weave Shirt Base Material', price: 1299, fabric: 'Cotton', stock: 3, img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=600&auto=format&fit=crop', isLowStockAlertActive: true, overallRatingScoreValueNum: 4.8 },
          { id: 3, name: 'ThreadCraft Elite Cyber-Ops Techwear Carbon Utility Jacket Shield Fabric', price: 2499, fabric: 'Linen', stock: 15, img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop', isLowStockAlertActive: false, overallRatingScoreValueNum: 4.9 },
          { id: 4, name: 'Traditional Handloom Kanchipuram Brocade Pure Silk Bridal Saree Roll', price: 9500, fabric: 'Silk', stock: 11, img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=600&auto=format&fit=crop', isLowStockAlertActive: false, overallRatingScoreValueNum: 5 },
          { id: 5, name: 'Casual Summer Comfort Luxury Breathable Flax Linen Kurta Fabric Base', price: 1899, fabric: 'Linen', stock: 22, img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=600&auto=format&fit=crop', isLowStockAlertActive: false, overallRatingScoreValueNum: 4.6 }
        ]);
      });
  };

  useEffect(() => {
    fetchProductsCatalogDatasetFromBackendEngine();
    const activeStream = JSON.parse(localStorage.getItem('cartMemoryStream')) || [];
    setCartCount(activeStream.reduce((acc, curr) => acc + curr.quantity, 0));
  }, []);

  const handlePushProductIntoShoppingBagStream = (targetProductObject, selectedSizeStr = 'M', overridingPriceVal = null) => {
    let activeCartStreamArray = JSON.parse(localStorage.getItem('cartMemoryStream')) || [];
    const baseCalculatedPrice = overridingPriceVal || targetProductObject.price;
    activeCartStreamArray.push({ id: targetProductObject.id, name: targetProductObject.name, price: baseCalculatedPrice, img: targetProductObject.img, chosenSize: selectedSizeStr, quantity: 1 });
    localStorage.setItem('cartMemoryStream', JSON.stringify(activeCartStreamArray));
    setCartCount(activeCartStreamArray.reduce((acc, curr) => acc + curr.quantity, 0));
    triggerLiveApplicationToastNotificationAlert(`🎯 ITEM ADDED: '${targetProductObject.name}' secure loaded into shopping cart registry lines!`, 'SUCCESS');
  };

  // MODIFIED FEATURE: 🔒 LOGIC FOR DIRECT PASSCODE PROMPT VERIFICATION ROUTINE (NO 2FA)
  const handleExecuteDirectPasswordIdentityVerificationAction = (e) => {
    e.preventDefault();
    // Dynamic control lock matching direct password string criterion value strings check logic rules
    if (administrativeGateSecretPasswordInput.trim() === 'admin' || administrativeGateSecretPasswordInput.trim() === 'adminpassword') {
      setIsPromptingAdminPasswordWindow(false);
      setAdministrativeGateSecretPasswordInput('');
      setIsAdminPanelOpen(true); // Control route access granted instantly
      triggerLiveApplicationToastNotificationAlert("🔐 ROOT SECURITY VERIFICATION SUCCESS: Administration console framework access initialized online.", "INFO");
    } else {
      alert("❌ Critical Access Rejection: Invalid administrator control terminal password parameter entry string!");
      setAdministrativeGateSecretPasswordInput('');
    }
  };

  const handleExecuteSizingPredictorMetricsAlgorithm = (e) => {
    e.preventDefault();
    const w = parseInt(inputPhysicalWeightKg);
    if(w < 65) setComputedSizeSuggestionResult('S [Small tight custom alignment frame]');
    else if(w >= 65 && w <= 78) setComputedSizeSuggestionResult('M [Optimal classic regular format check]');
    else setComputedSizeSuggestionResult('L [Generous chest dimensions parameters]');
  };

  const handleDispatchMessageToVirtualAICatBotChannel = (e) => {
    e.preventDefault(); if(!chatbotInputMessageText.trim()) return;
    const userMsg = chatbotInputMessageText.trim();
    setChatbotConversationLogsStream(prev => [...prev, { sender: 'USER', text: userMsg }]); setChatbotInputMessageText('');
    fetch('http://localhost:5000/api/chat/support', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: userMsg }) })
      .then(res => res.json()).then(data => setChatbotConversationLogsStream(prev => [...prev, { sender: 'BOT', text: data.botResponse }]));
  };

  const processedDataset = productsList.filter(item => item.name.toLowerCase().includes(searchQueryKeywords.toLowerCase()) && (chosenFabricFilter === 'All' || item.fabric === chosenFabricFilter));

  return (
    <div style={{ backgroundColor: '#f5f6fa', minHeight: '100vh', paddingBottom: '70px', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* SYSTEM FLASH EVENT ALERTS TOAST MESSAGES LINK RUN CONTAINER */}
      {activeSocketMessageToastLog && (
        <div style={{ position: 'fixed', top: '25px', right: '25px', backgroundColor: '#2f3542', color: 'white', padding: '14px 22px', borderRadius: '6px', zIndex: 11000, fontWeight: 'bold', fontSize: '11px', fontFamily: 'monospace', boxShadow: '0 5px 20px rgba(0,0,0,0.2)', borderLeft: '5px solid #2ed573' }}>
          <span>🔔 SYSTEM NOTIFIER:</span> <span>{activeSocketMessageToastLog.text}</span>
        </div>
      )}

      {/* MASTER APPLICATION HEADER NAVIGATION PANEL LAYER BAR */}
      <nav style={{ backgroundColor: '#2f3542', padding: '15px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        
        {/* MODIFIED FEATURE: 🚪 HIDDEN ACTION ACCESS PORTAL GATE OVER BRAND LOGO ELEMENT (TOP LINK BUTTON TEXT REMOVED REMOVED!) */}
        <div 
          onClick={() => {
            if (isAdminPanelOpen) {
              setIsAdminPanelOpen(false); // Quick toggle exit loop option criteria checks checks
            } else {
              setIsPromptingAdminPasswordWindow(true); // Double verify triggers gate passcode overlays popup container elements instantly
            }
          }} 
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}
          title="ThreadCraft Premium Brand Node Console Entry Point (Admin Lock Protection Enforced)"
        >
          <span style={{ fontSize: '24px' }}>🧵</span>
          <h2 style={{ margin: 0, fontSize: '19px', fontWeight: 'bold', letterSpacing: '0.5px', color: '#ffffff' }}>ThreadCraft Textiles</h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          
          {/* DYNAMIC MARKET REGION REGION MULTI CURRENCY OPTIONS SWITCH CHIP DRAWER BOX */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#1e222b', padding: '5px 10px', borderRadius: '4px', border: '1px solid #ff9f43' }}>
            <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#ff9f43' }}>🌐 Region Currency:</label>
            <select value={activeSelectedCurrencyToken} onChange={(e) => setActiveSelectedCurrencyToken(e.target.value)} style={{ backgroundColor: '#2f3542', color: 'white', border: 'none', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>
              <option value="INR">INR (₹) South Asia Local Base</option><option value="USD">USD ($) Global Clearing Node</option><option value="EUR">EUR (€) Eurozone Node Stream</option>
            </select>
          </div>

          <div style={{ backgroundColor: '#1e222b', padding: '6px 14px', borderRadius: '20px', fontSize: '11px', color: '#2ed573', fontWeight: 'bold', border: '1px solid #2ed573' }}>
            💎 Wallet Balance: {userProfileStateCRM.walletPoints} pts
          </div>

          <div onClick={() => setIsCartOpen(true)} style={{ position: 'relative', cursor: 'pointer', padding: '5px' }}>
            <span style={{ fontSize: '22px' }}>🛒</span>
            {cartCount > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', backgroundColor: '#ff4757', color: 'white', borderRadius: '50%', padding: '1px 6px', fontSize: '10px', fontWeight: 'bold' }}>{cartCount}</span>}
          </div>
        </div>
      </nav>

      {/* DYNAMIC COMPONENT PANEL NAVIGATION PIPELINES EXECUTIONS CONTROL SWITCH VIEW */}
      {isAdminPanelOpen ? (
        <AdminPanel onTriggerRefreshProductsList={fetchProductsCatalogDatasetFromBackendEngine} currencyExchanger={universalCurrencyExchangerRoutine} triggerAppToastAlert={triggerLiveApplicationToastNotificationAlert} />
      ) : (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
          
          {/* SEARCH DESK BAR CONTROLLERS DISCOVERY WRAPPERS CONTAINER PANEL BOX */}
          <div style={{ backgroundColor: '#ffffff', padding: '12px 20px', borderRadius: '8px', display: 'flex', gap: '15px', marginBottom: '25px', border: '1px solid #ced6e0', boxShadow: '0 2px 8px rgba(0,0,0,0.01)' }}>
            <input type="text" placeholder="🔍 Search matching royal dress collections, weaves, silks, kurtas materials instantly..." value={searchQueryKeywords} onChange={(e) => setSearchQueryKeywords(e.target.value)} style={{ flex: 1, padding: '10px 15px', borderRadius: '4px', border: '1px solid #ced6e0', fontSize: '13px' }} />
            <select value={chosenFabricFilter} onChange={(e) => setChosenFabricFilter(e.target.value)} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced6e0', fontSize: '12px', fontWeight: 'bold' }}>
              <option value="All">All Categories</option><option value="Cotton">Cotton Fabrics</option><option value="Silk">Luxury Silk Collections</option><option value="Linen">Linen Texture Bases</option>
            </select>
          </div>

          {/* DYNAMIC DISCOUNTS PROMOTION BANNER LAYER LINE ACCENT BLOCK */}
          <div style={{ background: 'linear-gradient(90deg, #ff9f43, #ff6b6b)', padding: '12px 20px', borderRadius: '8px', color: 'white', fontSize: '12px', fontWeight: 'bold', marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>🎟️ EXCLUSIVE WAIVER TOKEN CLEARANCE CAMPAIGN: Use code string value <span style={{ fontFamily: 'monospace', background: 'rgba(0,0,0,0.25)', padding: '2px 5px', borderRadius: '3px' }}>CYBERSEC30</span> inside cart terminal to deduct 30% flat off sub-totals!</span>
          </div>

          {/* MASTER TEXTILES AND DRESS COLLECTIONS SYSTEM CARDS LAYOUT DESIGN GRID PLOTS */}
          <div className="product-grid" style={{ display: 'flex', gap: '25px', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
            {processedDataset.map(fabric => (
              <div key={fabric.id} style={{ backgroundColor: '#ffffff', width: '100%', maxWidth: '360px', borderRadius: '8px', border: '1px solid #ced6e0', overflow: 'hidden', display: 'flex', flexDirection: 'column', position: 'relative', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
                
                {fabric.isLowStockAlertActive && <span style={{ position: 'absolute', top: '12px', left: '12px', backgroundColor: '#ff4757', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '9px', fontWeight: 'bold', zIndex: 5 }}>⚠️ INVENTORY DEPLETION WARNING</span>}

                <img src={fabric.img} alt={fabric.name} style={{ width: '100%', height: '220px', objectFit: 'cover' }} />
                
                <div style={{ padding: '15px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', alignItems: 'center' }}>
                      <span style={{ backgroundColor: '#747d8c', color: 'white', padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}>{fabric.fabric} Segment</span>
                      <span style={{ color: '#ffa502', fontSize: '11px', fontWeight: 'bold' }}>⭐ {fabric.overallRatingScoreValueNum || 4.8} Product Feedback Logs</span>
                    </div>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#2f3542', fontWeight: 'bold', lineHeight: '1.4' }}>{fabric.name}</h4>
                  </div>

                  <div style={{ borderTop: '1px solid #f1f2f6', paddingTop: '12px', marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '19px', fontWeight: 'bold', color: '#ff4757' }}>{universalCurrencyExchangerRoutine(fabric.price)}</span>
                      <button onClick={() => handlePushProductIntoShoppingBagStream(fabric, 'M')} style={{ padding: '7px 14px', backgroundColor: '#2ed573', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>📥 Add to Shopping Bag ➔</button>
                    </div>
                    <button onClick={() => setSelectedCustomizerProduct(fabric)} style={{ width: '100%', padding: '6px', backgroundColor: '#1e90ff', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', marginTop: '2px' }}>
                      👕 Open Interactive Sizing Customizer Studio Desk
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAILORING WORKSPACE CANVAS COLOUR PREVIEW ENVIRONMENT POPUP MODAL DRAWER BOX WINDOW */}
      {selectedCustomizerProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 7000 }}>
          <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '10px', width: '90%', maxWidth: '680px', display: 'flex', gap: '20px', borderTop: '5px solid #1e90ff', flexWrap: 'wrap' }}>
            
            {/* MODIFIED FEATURE: ⚡ RE-ALIGN UNIQUE DESIGN PREVIEW WITH THE ULTIMATE EXPERT AR/AI VIRTUAL FIT LOOK MOCK FRAME MIRROR DISPLAY */}
            <div style={{ flex: 1, minWidth: '240px', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '2px dashed #a55eea', padding: '15px', borderRadius: '6px', backgroundColor: '#fcf8ff' }}>
              <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#a55eea', marginBottom: '8px', letterSpacing: '0.3px' }}>✨ THREADCRAFT SMART AR/AI VISUALIZER MIRROR DISPLAY SUITE:</span>
              
              <div style={{ width: '160px', height: '180px', backgroundColor: activeCanvasWeaveColourHex, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', boxShadow: '0 4px 15px rgba(0,0,0,0.15)', transition: 'background-color 0.3s ease' }}>
                {/* Embedded AR Silhouette Mesh preview textures overlays graphics loops */}
                <div style={{ position: 'absolute', color: 'white', fontSize: '65px', opacity: 0.18, fontWeight: 'bold' }}>🤵</div>
                <div style={{ position: 'absolute', top: '8px', right: '8px', backgroundColor: '#a55eea', color: 'white', padding: '2px 5px', borderRadius: '3px', fontSize: '8px', fontWeight: 'bold' }}>AI LIVE MASK ON</div>
                
                <div style={{ color: 'white', padding: '6px', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '4px', fontSize: '9px', background: 'rgba(0,0,0,0.3)', textAlign: 'center', fontWeight: 'bold', fontFamily: 'monospace', zIndex: 5 }}>
                  🎯 AR Preview Fitted:<br/>[{selectedDesignStylePattern.split(' ')[0]}]<br/>Weave Code: {activeCanvasWeaveColourHex}
                </div>
              </div>

              <div style={{ marginTop: '12px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
                {/* Premium digital dye color swatch values list selection bubbles pointers */}
                {['#4b6584', '#ff4757', '#2ed573', '#ffa502', '#a55eea', '#1e222b', '#10ac84'].map((hex, idx) => (
                  <div key={idx} onClick={() => setActiveCanvasWeaveColourHex(hex)} style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: hex, cursor: 'pointer', border: activeCanvasWeaveColourHex === hex ? '3px solid #000' : '2px solid white', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }} />
                ))}
              </div>
              <span style={{ fontSize: '9px', color: '#747d8c', fontStyle: 'italic', marginTop: '10px', textAlign: 'center' }}>💡 Tip: Tap color dots to instantly update advanced AR texture overlay canvas model frames!</span>
            </div>

            <div style={{ flex: 1.2, minWidth: '260px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e4e7eb', paddingBottom: '6px', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '13px', color: '#2f3542', fontWeight: 'bold' }}>Tailoring Workspace Suite Panel</h4>
                  <button onClick={() => { setSelectedCustomizerProduct(null); setComputedSizeSuggestionResult(''); }} style={{ border: 'none', background: 'none', fontSize: '20px', cursor: 'pointer', fontWeight: 'bold' }}>×</button>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>1. Allocate Custom Design Fabric Length (Meters Selector):</label>
                  <input type="range" min="1" max="10" value={customMetersValue} onChange={(e) => setCustomMetersValue(parseInt(e.target.value))} style={{ width: '100%', cursor: 'pointer' }} />
                  <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#1e90ff' }}>Allocated Dimension Check: {customMetersValue} Meters length</span>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ fontSize: '11px', display: 'block', fontWeight: 'bold', marginBottom: '4px' }}>2. Stitched Garment Style Template Pattern:</label>
                  <select value={selectedDesignStylePattern} onChange={(e) => setSelectedDesignStylePattern(e.target.value)} style={{ width: '100%', padding: '6px', fontSize: '11px' }}>
                    <option value="Royal Sherwani Custom Cut">Royal Sherwani Custom Traditional Cut</option><option value="Executive Premium Shirt Layer">Executive Premium Shirt Layer</option><option value="Traditional Kurta Comfort Fitting">Traditional Kurta Comfort Fitting</option><option value="Luxury Bridal Saree Border Trims">Luxury Bridal Saree Border Trims</option>
                  </select>
                </div>
                <div style={{ backgroundColor: '#fffaf0', border: '1px solid #ffa502', padding: '8px', borderRadius: '4px' }}>
                  <label style={{ fontSize: '11px', display: 'block', fontWeight: 'bold', color: '#ffa502', marginBottom: '4px' }}>3. Build Mass Fit Measurement Calculator Tool:</label>
                  <form onSubmit={handleExecuteSizingPredictorMetricsAlgorithm} style={{ display: 'flex', gap: '5px', alignItems: 'flex-end' }}>
                    <input type="number" placeholder="Enter Weight (kg)" value={inputPhysicalWeightKg} onChange={(e) => setInputPhysicalWeightKg(e.target.value)} style={{ flex: 1, padding: '5px', fontSize: '11px' }} required />
                    <button type="submit" style={{ padding: '5px 10px', backgroundColor: '#ffa502', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}>Run Matrix Fit</button>
                  </form>
                  {computedSizeSuggestionResult && <div style={{ marginTop: '5px', fontSize: '11px', fontWeight: 'bold', color: '#ff4757', textAlign: 'center' }}>🎯 Best Predicted Fit Sizing Dimension: {computedSizeSuggestionResult.split(' ')[0]}</div>}
                </div>
              </div>
              <div style={{ borderTop: '1px dashed #ced6e0', paddingTop: '10px', marginTop: '10px' }}>
                <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#ff4757', marginBottom: '6px' }}>Calculated Total Worth: {universalCurrencyExchangerRoutine(selectedCustomizerProduct.price * customMetersValue)}</div>
                <button onClick={() => handlePushProductIntoShoppingBagStream(selectedCustomizerProduct, computedSizeSuggestionResult.split(' ')[0] || 'M', selectedCustomizerProduct.price * customMetersValue)} style={{ width: '100%', padding: '9px', backgroundColor: '#2ed573', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', fontSize: '11px', cursor: 'pointer' }}>📥 Inject Tailor Custom Customizer parameters to Bag</button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODIFIED FEATURE: 🔒 DIRECT PURE MASKED PASSWORD CONTROL OVERLAY PROMPT GAURD WINDOW PANEL (2FA REMOVED!) */}
      {isPromptingAdminPasswordWindow && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ backgroundColor: '#1e222b', padding: '25px', borderRadius: '10px', width: '90%', maxWidth: '380px', border: '2px solid #ff4757', color: '#ffffff', textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 5px 0', color: '#ff4757', fontSize: '14px', fontWeight: 'bold', letterSpacing: '0.5px' }}>🔒 ADMINISTRATOR SECURITY CONSOLE GATEWAY</h4>
            <p style={{ fontSize: '11px', color: '#a4b0be', margin: '0 0 20px 0' }}>ENTER VALID CREDENTIAL CONTROL SECURITY ACCESS PASSCODE WORD TO UNLOCK BACK-OFFICE OPERATIONS HUB</p>
            
            <form onSubmit={handleExecuteDirectPasswordIdentityVerificationAction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input 
                type="password" 
                placeholder="••••••" 
                value={administrativeGateSecretPasswordInput} 
                onChange={(e) => setAdministrativeGateSecretPasswordInput(e.target.value)} 
                style={{ width: '100%', padding: '10px', fontSize: '18px', textAlign: 'center', borderRadius: '4px', border: 'none', backgroundColor: '#ffffff', color: '#000000', fontWeight: 'bold', boxSizing: 'border-box' }} 
                autoFocus
                required 
              />
              <div style={{ display: 'flex', gap: '10px', marginTop: '5px' }}>
                <button type="button" onClick={() => { setIsPromptingAdminPasswordWindow(false); setAdministrativeGateSecretPasswordInput(''); }} style={{ padding: '8px 14px', backgroundColor: '#2f3542', color: '#a4b0be', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', flex: 1 }}>Abort Entry</button>
                <button type="submit" style={{ padding: '8px 14px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold', flex: 1.5 }}>🔓 Verify Access Code</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING CHAT ASSISTANT DRAWER ENGINE CONSOLE SUPPORT */}
      <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 8000 }}>
        {!isChatBotDrawerOpen ? (
          <button onClick={() => setIsChatBotDrawerOpen(true)} style={{ width: '55px', height: '55px', borderRadius: '50%', backgroundColor: '#2f3542', border: '2px solid #70a1ff', color: 'white', fontSize: '22px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>💬</button>
        ) : (
          <div style={{ width: '310px', height: '360px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #ced6e0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 5px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ backgroundColor: '#2f3542', padding: '10px 15px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: 'bold' }}><span>🤖 ThreadCraft Support Core</span><button onClick={() => setIsChatBotDrawerOpen(false)} style={{ border: 'none', background: 'none', color: 'white', cursor: 'pointer', fontWeight: 'bold' }}>×</button></div>
            <div style={{ flex: 1, padding: '10px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', backgroundColor: '#f1f2f6' }}>{chatbotConversationLogsStream.map((m, i) => <div key={i} style={{ alignSelf: m.sender === 'BOT' ? 'flex-start' : 'flex-end', backgroundColor: m.sender === 'BOT' ? '#fff' : '#70a1ff', color: m.sender === 'BOT' ? '#2f3542' : '#fff', padding: '5px 10px', borderRadius: '6px', fontSize: '11px' }}>{m.text}</div>)}</div>
            <form onSubmit={handleDispatchMessageToVirtualAICatBotChannel} style={{ display: 'flex', padding: '5px', borderTop: '1px solid #ced6e0' }}><input type="text" placeholder="Type info, patterns or tracking query..." value={chatbotInputMessageText} onChange={(e) => setChatbotInputMessageText(e.target.value)} style={{ flex: 1, padding: '5px', fontSize: '11px' }} required /><button type="submit" style={{ padding: '5px 10px', backgroundColor: '#2f3542', color: 'white', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', marginLeft: '3px' }}>Send</button></form>
          </div>
        )}
      </div>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} discountPercentage={activeDiscountWaiverPercentage} currentPoints={userProfileStateCRM.walletPoints} currencyTranslator={universalCurrencyExchangerRoutine} />
    </div>
  );
}

export default App;