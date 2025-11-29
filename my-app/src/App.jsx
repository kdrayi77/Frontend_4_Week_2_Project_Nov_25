import React from 'react';
import PincodeLookup from './components/PincodeLookup';

export default function App() {
  return (
    <div className="app-root">
      <div className="card">
        <h1 className="title">Pincode Lookup</h1>
        <PincodeLookup />
      </div>
    </div>
  );
}
