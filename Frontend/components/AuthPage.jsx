import React, { useState } from 'react';

function AuthPage({ onLoginSuccess }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleFormSubmitAction = (e) => {
    e.preventDefault();
    const targetEndpointURL = isLoginView ? 'login' : 'signup';
    
    fetch(`http://localhost:5000/api/auth/${targetEndpointURL}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => {
      if (!res.ok) return res.json().then(err => { throw new Error(err.error); });
      return res.json();
    })
    .then(data => {
      if (isLoginView) {
        alert(`👋 Welcome Back ${data.userName}! Session authenticated.`);
        localStorage.setItem('customerToken', data.token);
        localStorage.setItem('customerName', data.userName);
        onLoginSuccess(data.userName);
      } else {
        alert("🎉 Account Registered Successfully! Please switch to login screen.");
        setIsLoginView(true);
      }
      setFormData({ name: '', email: '', password: '' });
    })
    .catch(err => {
      alert(`❌ Auth Exception: ${err.message}`);
    });
  };

  return (
    <div style={{ padding: '30px', maxWidth: '400px', margin: '50px auto', border: '1px solid #ced6e0', borderRadius: '8px', boxShadow: '0 4px 15px rgba(0,0,0,0.06)', backgroundColor: '#ffffff', fontFamily: 'sans-serif' }}>
      <h3 style={{ textAlign: 'center', color: '#2f3542', marginBottom: '20px' }}>
        {isLoginView ? '🔐 ThreadCraft Customer Sign In' : '📝 Create ThreadCraft Account'}
      </h3>
      <form onSubmit={handleFormSubmitAction} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {!isLoginView && (
          <input type="text" placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced6e0' }} required />
        )}
        <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced6e0' }} required />
        <input type="password" placeholder="Password String" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ced6e0' }} required />
        <button type="submit" style={{ padding: '12px', backgroundColor: '#ff4757', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isLoginView ? 'Login Session' : 'Register Account'}
        </button>
      </form>
      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#747d8c' }}>
        {isLoginView ? "New customer to our hub? " : "Already have an active account? "}
        <span onClick={() => setIsLoginView(!isLoginView)} style={{ color: '#70a1ff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}>
          {isLoginView ? 'Register Here' : 'Login Here'}
        </span>
      </p>
    </div>
  );
}

export default AuthPage;