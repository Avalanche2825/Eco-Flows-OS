"use client";

import React, { useState } from "react";

const PRODUCTS = [
  {id:1,e:'🌞',n:'Solar Garden Light',d:'Weather-proof solar LED lights. No wiring needed.',p:1299,pts:800,c:'solar',s:45},
  {id:2,e:'⚡',n:'300W Solar Panel',d:'21% efficiency monocrystalline. 25-year warranty.',p:12999,pts:5000,c:'solar',s:12},
  {id:3,e:'🔋',n:'Solar Inverter 2kW',d:'Grid-tie inverter with WiFi monitoring & auto-switch.',p:18500,pts:7500,c:'solar',s:8},
  {id:4,e:'🚿',n:'Low-Flow Tap Aerator',d:'Reduces flow to 4L/min. Maintains pressure. Easy fit.',p:349,pts:200,c:'water',s:120},
  {id:5,e:'📊',n:'Smart Water Meter',d:'AI-powered leak detection with mobile alerts.',p:2899,pts:1200,c:'water',s:30},
  {id:6,e:'🌧️',n:'Rainwater Harvesting Kit',d:'Complete system with 500L storage tank.',p:8999,pts:3500,c:'water',s:15},
  {id:7,e:'🔌',n:'Smart Energy Plug',d:'Monitor and schedule device power remotely.',p:799,pts:400,c:'energy',s:80},
  {id:8,e:'💡',n:'LED Bulb Pack (6)',d:'12W, 1200 lumens. Replaces 80W incandescent.',p:599,pts:300,c:'energy',s:200},
  {id:9,e:'📈',n:'Home Energy Monitor',d:'Real-time whole-house tracking + AI insights.',p:3499,pts:1500,c:'energy',s:25},
  {id:10,e:'🧴',n:'Eco Cleaning Kit',d:'Plant-based biodegradable cleaners. Plastic-free.',p:699,pts:350,c:'general',s:60},
  {id:11,e:'🌱',n:'Compost Starter Kit',d:'Kitchen bin + starter microbes + guide book.',p:1199,pts:600,c:'general',s:40},
  {id:12,e:'♻️',n:'Reusable Bag Set (5)',d:'Heavy-duty jute bags with reinforced handles.',p:299,pts:150,c:'general',s:150},
];

const BALANCE = 2840;

export default function EcoStorePage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [curP, setCurP] = useState<typeof PRODUCTS[0] | null>(null);
  
  const [qty, setQty] = useState(1);
  const [ptsUsed, setPtsUsed] = useState(0);
  const [toast, setToast] = useState(false);

  const filtered = PRODUCTS.filter(p => 
    (filter === 'all' || p.c === filter) &&
    (p.n.toLowerCase().includes(search.toLowerCase()) || p.d.toLowerCase().includes(search.toLowerCase()))
  );

  const openMo = (p: typeof PRODUCTS[0]) => {
    setCurP(p);
    setQty(1);
    setPtsUsed(0);
  };

  const closeMo = () => setCurP(null);

  const buyIt = () => {
    closeMo();
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const origPrice = curP ? curP.p * qty : 0;
  const disc = Math.min((ptsUsed || 0) * 0.1, origPrice * 0.5);
  const fin = origPrice - disc;
  const pct = origPrice > 0 ? Math.round((disc / origPrice) * 100) : 0;

  return (
    <div className="page-container" style={{ padding: "40px 2rem 3rem", maxWidth: "1280px" }}>
      <div className="page-tag" style={{ fontSize: "0.68rem", color: "var(--green)", textTransform: "uppercase", letterSpacing: "1.2px", fontWeight: 600, marginBottom: "8px" }}>Rewards & Discounts</div>
      <div className="page-title" style={{ fontSize: "2.4rem", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "6px" }}>
        Eco <span style={{ color: "var(--green)" }}>Store</span>
      </div>
      <div className="page-sub" style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Redeem your eco points for sustainable products — up to 50% discount
      </div>

      <div className="layout">
        <div>
          <input type="text" className="search-bar" placeholder="🔍  Search products..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="filter-row">
            <button className={`fb ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All Products</button>
            <button className={`fb ${filter === 'solar' ? 'active' : ''}`} onClick={() => setFilter('solar')}>🌞 Solar</button>
            <button className={`fb ${filter === 'water' ? 'active' : ''}`} onClick={() => setFilter('water')}>💧 Water</button>
            <button className={`fb ${filter === 'energy' ? 'active' : ''}`} onClick={() => setFilter('energy')}>⚡ Energy</button>
            <button className={`fb ${filter === 'general' ? 'active' : ''}`} onClick={() => setFilter('general')}>🌱 General</button>
          </div>
          
          <div className="prod-grid">
            {filtered.length > 0 ? filtered.map(p => (
              <div key={p.id} className="prod">
                <div className="prod-emoji">{p.e}</div>
                <div className="cat-tag">{p.c}</div>
                <div className="prod-name">{p.n}</div>
                <div className="prod-desc">{p.d}</div>
                <div className="prod-stock">In stock: {p.s}</div>
                <div className="prod-foot">
                  <div>
                    <div className="prod-price">₹{p.p.toLocaleString()}</div>
                    <div className="prod-pts">{p.pts.toLocaleString()} pts needed</div>
                  </div>
                  <button className="buy-btn" onClick={() => openMo(p)}>Buy Now</button>
                </div>
              </div>
            )) : (
              <div style={{ color: "var(--text2)", fontSize: "0.85rem", padding: "2rem" }}>No products found.</div>
            )}
          </div>
        </div>

        <div className="sidebar">
          <div className="pts-card">
            <div className="sec-lbl">Your Balance</div>
            <div className="pts-n">2,840</div>
            <div className="pts-s">eco points · 1 pt = ₹0.10 off</div>
            <div className="divider"></div>
            <div style={{ fontSize: "0.72rem", color: "var(--text2)", lineHeight: 1.8 }}>
              Max discount: <span style={{ color: "var(--green)", fontWeight: 700 }}>50%</span> per purchase<br/>
              Points value: <span style={{ color: "var(--green)", fontWeight: 700 }}>₹284</span> available<br/>
              Points to Silver: <span style={{ color: "var(--amber)", fontWeight: 700 }}>1,160 more</span>
            </div>
          </div>
          <div className="card-sm">
            <div className="sec-lbl">Unique Token</div>
            <div className="tok-id">EF-28400X-RJ-2024-A7K9M</div>
          </div>
          <div className="card-sm">
            <div className="sec-lbl">How to Earn Points</div>
            <div style={{ fontSize: "0.7rem", color: "var(--text2)", lineHeight: 2 }}>
              💧 100L water → +10 pts<br/>
              ⚡ 10 kWh saved → +5 pts<br/>
              ☀️ 100 kWh solar → +15 pts<br/>
              ⚔️ Challenge done → +50–750 pts<br/>
              📅 Daily check-in → +5 pts<br/>
              🤝 Community join → +20 pts
            </div>
          </div>
          <div className="card-sm">
            <div className="sec-lbl">Recent Purchases</div>
            <div style={{ fontSize: "0.72rem", color: "var(--text2)", lineHeight: 2 }}>
              📊 Smart Water Meter<br/><span style={{ color: "var(--text3)" }}>2 days ago · -1,200 pts</span><br/>
              💡 LED Bulb Pack (6)<br/><span style={{ color: "var(--text3)" }}>1 week ago · -300 pts</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`modal-ov ${curP ? 'open' : ''}`} onClick={closeMo}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <button className="modal-x" onClick={closeMo}>✕</button>
          
          {curP && (
            <>
              <div className="modal-t">{curP.e} {curP.n}</div>
              <label className="form-lbl">Quantity</label>
              <input type="number" className="qty-in" value={qty} min="1" max="10" onChange={e => {
                const val = Math.max(1, Math.min(10, parseInt(e.target.value)||1));
                setQty(val);
                setPtsUsed(0);
              }} />
              
              <div className="sl-row">
                <span>Eco Points to Use</span>
                <span style={{ color: "var(--green)", fontWeight: 700 }}>{ptsUsed} pts</span>
              </div>
              <input 
                type="range" 
                className="store-range" 
                min="0" 
                max={Math.min(BALANCE, curP.pts * qty)} 
                value={ptsUsed} 
                onChange={e => setPtsUsed(parseInt(e.target.value)||0)} 
              />
              
              <div className="price-box">
                <div className="pr"><span style={{ color: "var(--text2)" }}>Original Price</span><span>₹{origPrice.toLocaleString()}</span></div>
                <div className="pr"><span style={{ color: "var(--text2)" }}>Points Discount</span><span style={{ color: "var(--green)" }}>₹{disc.toFixed(0)}</span></div>
                <div className="pr"><span style={{ color: "var(--text2)" }}>Discount %</span><span style={{ color: "var(--green)" }}>{pct}%</span></div>
                <hr style={{ border: "none", borderTop: "1px solid rgba(74,200,80,0.15)", margin: "4px 0" }}/>
                <div className="pr"><span className="pf">Final Price</span><span className="pf">₹{Math.round(fin).toLocaleString()}</span></div>
              </div>
              
              <button className="confirm-btn" onClick={buyIt}>✓ Confirm Purchase</button>
            </>
          )}
        </div>
      </div>

      <div className={`toast ${toast ? 'show' : ''}`}>✓ Purchase confirmed! Order placed successfully.</div>
    </div>
  );
}
