import React, { useState } from 'react';
import List from './pages/AssignmentListing';
import Detail from './pages/AssignmentDetail';

export default function App() {
  const [v, setV] = useState('landing');
  const [id, setId] = useState(null);

  if (v === 'landing') return (
    <div className="landing-page" style={{ paddingTop: '10rem' }}>
      <div className="hero-section">
        <h1 className="hero-title">CIPHER SQL STUDIO</h1>
        <p className="hero-subtitle">Platform for practising SQL</p>
        <button className="btn primary" onClick={() => setV('listing')}>LAUNCH APP</button>
      </div>
    </div>
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>CIPHER SQL STUDIO</h1>
        <button className="btn" onClick={() => { setId(null); setV(v === 'detail' ? 'listing' : 'landing'); }}>BACK</button>
      </header>
      {v === 'listing' ? <List onSelect={i => { setId(i); setV('detail'); }} /> : <Detail id={id} />}
    </div>
  );
}
