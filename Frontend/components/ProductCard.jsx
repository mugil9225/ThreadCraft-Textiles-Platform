import React, { useState } from 'react';

function ProductCard({ product, currencyFormatter }) {
  const isOutOfStock = product.stock <= 0;
  
  // Scarcity threshold validator flag tracking low quantities blocks metrics limits arrays keys lines
  const isStockUrgencyTriggerActive = product.stock > 0 && product.stock <= 15;

  const [isQuickViewModalOpen, setIsQuickViewModalOpen] = useState(false);
  const [selectedProductSize, setSelectedProductSize] = useState('M');

  const [liveReviewsArray, setLiveReviewsArray] = useState([
    { author: "Satheesh Kumar", grading: 5, message: "Superb luxury weave patterns! Highly breathable comfort shirt texture." },
    { author: "Priya Dhanasekar", grading: 4, message: "Beautiful heavy detailing work frames layouts, color tone matching exact configurations." }
  ]);
  const [inputReviewMessageString, setInputReviewMessageString] = useState('');
  const [inputReviewAuthorName, setInputReviewAuthorName] = useState(localStorage.getItem('customerName') || 'Anonymous User');
  const [inputReviewRatingScore, setInputReviewRatingScore] = useState(5);

  const calculateDynamicProductRatingAndRecommendations = (id) => {
    const ratingsMap = {
      1: { score: 4.8, stars: '⭐⭐⭐⭐⭐', count: 124, threadCount: '300 TC Premium Cotton', washCare: 'Machine wash warm, tumble dry low soft wash routines.', comboName: 'Classic Linen Work Trousers', comboPrice: '1899', comboImg: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=200', reason: 'Matches best to shape sharp contrasting formal architectures profiles!' },
      2: { score: 4.9, stars: '⭐⭐⭐⭐⭐', count: 86, threadCount: 'Pure Kanchipuram Mulberry Silk 4 Ply', washCare: 'Dry Clean Only, iron on very low heat under soft protective cloths.', comboName: 'Zari Border Traditional Designer Blouse Fabric', comboPrice: '1499', comboImg: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200', reason: 'Frequently catalog linked together by luxury style experts to complete standard royal aesthetics outfit sets!' },
      3: { score: 4.2, stars: '⭐⭐⭐⭐', count: 53, threadCount: 'Organic Belgian Flax Linen Blend', washCare: 'Hand wash recommended, flat dry out of direct sunlight parameters.', comboName: 'Pure Organic Cotton Casual Shirt', comboPrice: '1299', comboImg: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200', reason: 'High breathability dual fabric combination best tracking profiles for summary seasons grids!' },
      4: { score: 4.5, stars: '⭐⭐⭐⭐½', count: 95, threadCount: '220 TC Combed Egyptian Fine Linen', washCare: 'Gentle cycle wash, warm steam iron configuration metrics matches.', comboName: 'Premium White Linen Kurta Match Pack', comboPrice: '2599', comboImg: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200', reason: 'Unified cultural ethnic collection set matching standard traditional events matrix allocations.' }
    };
    return ratingsMap[id] || { score: 4.0, stars: '⭐⭐⭐⭐', count: 12, threadCount: 'Standard Retail Blend', washCare: 'Normal laundry wash metrics.', comboName: 'Standard Accessories Match Pack', comboPrice: '450', comboImg: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200', reason: 'General retail accessory linkage items.' };
  };

  const reviewMetrics = calculateDynamicProductRatingAndRecommendations(product.id);

  const handleAddToCartClick = (e) => {
    if(e) e.stopPropagation();
    if (!isOutOfStock) {
      const activeCartStream = JSON.parse(localStorage.getItem('cartMemoryStream')) || [];
      const itemExistingIndex = activeCartStream.findIndex(item => item.id === product.id && item.chosenSize === selectedProductSize);

      if (itemExistingIndex !== -1) { activeCartStream[itemExistingIndex].quantity += 1; } 
      else { activeCartStream.push({ ...product, quantity: 1, chosenSize: selectedProductSize }); }

      localStorage.setItem('cartMemoryStream', JSON.stringify(activeCartStream));
      alert(`🛒 Dynamic Cart Sync: '${product.name}' [Size: ${selectedProductSize}] added to bag safely!`);
      window.location.reload();
    }
  };

  const handleCommitReviewSubmissionForm = (e) => {
    e.preventDefault();
    if (!inputReviewMessageString.trim()) return;

    const freshlyCompiledReviewObject = {
      author: inputReviewAuthorName,
      grading: parseInt(inputReviewRatingScore),
      message: inputReviewMessageString.trim()
    };

    setLiveReviewsArray([...liveReviewsArray, freshlyCompiledReviewObject]);
    setInputReviewMessageString('');
    alert("🌟 User Review Submission Verified!");
  };

  return (
    <>
      <div className="product-card" onClick={() => setIsQuickViewModalOpen(true)} style={{
        border: '1px solid #f1f2f6', borderRadius: '8px', padding: '15px', width: '280px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)', backgroundColor: 'white', textAlign: 'center',
        fontFamily: 'sans-serif', position: 'relative', cursor: 'pointer', transition: 'transform 0.2s'
      }}>
        <span style={{
          position: 'absolute', top: '10px', right: '10px', padding: '4px 8px', borderRadius: '4px',
          fontSize: '11px', fontWeight: 'bold', color: 'white', backgroundColor: isOutOfStock ? '#ff4757' : '#2ed573', zIndex: 10
        }}>
          {isOutOfStock ? '⚠️ Out of Stock' : `📦 Stock: ${product.stock} left`}
        </span>
        <img src={product.img} alt={product.name} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '6px', filter: isOutOfStock ? 'grayscale(80%)' : 'none' }} />
        <h4 style={{ margin: '15px 0 5px 0', fontSize: '15px', color: '#2f3542' }}>{product.name}</h4>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '5px', margin: '5px 0' }}>
          <span style={{ fontSize: '13px' }}>{reviewMetrics.stars}</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#ffa502' }}>{reviewMetrics.score}</span>
        </div>
        <p style={{ color: '#747d8c', fontSize: '13px', margin: '5px 0' }}>Fabric: <strong>{product.fabric}</strong></p>
        
        {/* LOCALIZED MULTI-CURRENCY TRANSLATOR COMPONENT ENFORCED DYNAMIC LABELS */}
        <p style={{ fontWeight: 'bold', color: '#ff4757', margin: '0 0 8px 0', fontSize: '16px' }}>
          {currencyFormatter(product.price)}
        </p>

        {/* MASTER ADD-ON 1 COMPONENT MODULE IMPLEMENTATION: VISUAL STOCK SCARCITY URGENCY STRIP WARNING FLUID CARD */}
        {isStockUrgencyTriggerActive && (
          <div style={{ fontSize: '11px', color: '#d35400', backgroundColor: '#fff3cd', border: '1px solid #ffeeba', padding: '4px', borderRadius: '4px', marginBottom: '12px', fontWeight: 'bold', animation: 'pulse 1.5s infinite' }}>
            🔥 SCARCITY FLASH ALERT: Only {product.stock} pieces left under database! 80+ buyers viewing!
          </div>
        )}

        <button onClick={handleAddToCartClick} disabled={isOutOfStock} style={{
          width: '100%', padding: '10px', backgroundColor: isOutOfStock ? '#ced6e0' : '#2f3542',
          color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: isOutOfStock ? 'not-allowed' : 'pointer'
        }}>
          Quick Purchase
        </button>
      </div>

      {isQuickViewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000, fontFamily: 'sans-serif' }} onClick={() => setIsQuickViewModalOpen(false)}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '820px', display: 'flex', gap: '25px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setIsQuickViewModalOpen(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', fontSize: '24px', fontWeight: 'bold', cursor: 'pointer', color: '#747d8c' }}>×</button>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <img src={product.img} alt={product.name} style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
              <div style={{ border: '1px solid #70a1ff', borderRadius: '6px', padding: '12px', backgroundColor: '#f0f6ff' }}>
                <h6 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#1e90ff', fontWeight: 'bold' }}>💡 Intelligent Style Recommendation Module ("Frequently Bought Together"):</h6>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img src={reviewMetrics.comboImg} alt="Combo suggestion" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div style={{ flex: 1, fontSize: '11px', color: '#2f3542' }}>
                    <div style={{ fontWeight: 'bold' }}>{reviewMetrics.comboName} (Value {currencyFormatter(reviewMetrics.comboPrice)})</div>
                    <div style={{ color: '#57606f', fontStyle: 'italic', marginTop: '2px' }}>💡 AI Reason: {reviewMetrics.reason}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <span style={{ backgroundColor: '#e6f2ff', color: '#1e90ff', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold', alignSelf: 'flex-start' }}>🧵 PREMIUM {product.fabric.toUpperCase()} SEGMENT</span>
              <h3 style={{ margin: 0, color: '#2f3542', fontSize: '18px' }}>{product.name}</h3>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4757' }}>{currencyFormatter(product.price)}</div>
              
              <div style={{ fontSize: '12px', color: '#57606f', backgroundColor: '#fafafa', padding: '8px', borderRadius: '4px', border: '1px solid #f1f2f6' }}>
                <div style={{ marginBottom: '4px' }}><strong>Material Architecture:</strong> {reviewMetrics.threadCount}</div>
                <div><strong>Industrial Wash Maintenance:</strong> {reviewMetrics.washCare}</div>
              </div>

              <div style={{ paddingTop: '3px' }}>
                <h5 style={{ margin: '0 0 6px 0', color: '#2f3542', fontSize: '12px' }}>📏 Select Available Tailoring Size:</h5>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {['S', 'M', 'L', 'XL', 'XXL'].map(sizeOpt => (
                    <button key={sizeOpt} onClick={() => setSelectedProductSize(sizeOpt)} style={{ width: '34px', height: '34px', borderRadius: '4px', border: '1px solid #ced6e0', backgroundColor: selectedProductSize === sizeOpt ? '#2f3542' : 'white', color: selectedProductSize === sizeOpt ? 'white' : '#2f3542', fontWeight: 'bold', fontSize: '12px' }}>{sizeOpt}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleAddToCartClick} disabled={isOutOfStock} style={{ marginTop: '5px', width: '100%', padding: '10px', backgroundColor: isOutOfStock ? '#ced6e0' : '#2ed573', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', fontSize: '13px' }}>
                {isOutOfStock ? 'Sold Out' : `🛒 Add [Size: ${selectedProductSize}] to Cart Bag`}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ProductCard;