import React from 'react';
import { useCart } from '../Context/CartContext';

function Navbar({ onCartClick }) {
  // CORRECT DESIGN LOGIC PATHWAYS: Safely extract array content structures stream from context hook
  const { cartItems } = useCart();

  // Mathematical matrix calculations fallback check aggregate mapping total numbers calculations parameters
  const safeCartArrayStream = Array.isArray(cartItems) ? cartItems : [];
  
  // Real-time calculation summing up individual items volumes quantity values locked inside state fields arrays
  const dynamicallyCalculatedTotalCartItemsCount = safeCartArrayStream.reduce((acc, currentItemObject) => {
    return acc + (currentItemObject.quantity || 0);
  }, 0);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 30px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      fontFamily: 'sans-serif',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '24px' }}>🧵</span>
        <h1 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#2f3542', letterSpacing: '0.5px' }}>
          ThreadCraft Textiles
        </h1>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', position: 'relative', cursor: 'pointer' }} onClick={onCartClick}>
        {/* Modern Shopping Bag Vector Layout Visual Icon slot */}
        <div style={{ fontSize: '24px', color: '#2f3542', transition: 'transform 0.2s' }}>🛒</div>
        
        {/* DYNAMIC COUNT BUBBLE POPPER BADGE MATRIX: Bound metrics parameters triggers check auto evaluation updates */}
        {dynamicallyCalculatedTotalCartItemsCount > 0 && (
          <span className="cart-badge-count" style={{
            position: 'absolute',
            top: '-8px',
            right: '-10px',
            backgroundColor: '#ff4757',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 7px',
            fontSize: '11px',
            fontWeight: 'bold',
            boxShadow: '0 2px 4px rgba(255, 71, 87, 0.4)',
            animation: 'popIn 0.3s ease-out'
          }}>
            {dynamicallyCalculatedTotalCartItemsCount}
          </span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;