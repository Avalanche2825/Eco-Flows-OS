"use client";

import React, { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from "recharts";

const CITIES = {
  RJ: ["Jaipur", "Jodhpur", "Udaipur", "Kota", "Bikaner"],
  MH: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad"],
  KA: ["Bengaluru", "Mysuru", "Hubli", "Mangaluru", "Belagavi"],
  TN: ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem"],
  GJ: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar"],
  UP: ["Lucknow", "Agra", "Varanasi", "Kanpur", "Allahabad"],
  DL: ["New Delhi", "Dwarka", "Rohini", "Saket", "Noida"],
  WB: ["Kolkata", "Siliguri", "Asansol", "Durgapur", "Darjeeling"],
  KL: ["Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"],
  AP: ["Hyderabad", "Visakhapatnam", "Vijayawada", "Guntur", "Tirupati"],
};

export default function HydroSolarPage() {
  const [locState, setLocState] = useState("");
  const [city, setCity] = useState("");
  const [roof, setRoof] = useState(80);
  const [weather, setWeather] = useState("sunny");
  const [rain, setRain] = useState(500);
  const [bill, setBill] = useState(3200);

  const [results, setResults] = useState<{
    solar: number;
    water: number;
    savings: number;
    co2: number;
    panels: number;
    systemCost: number;
    payback: string;
    roi25: number;
    chartData: { name: string; solar: number; water: number }[];
  } | null>(null);

  const availableCities = locState ? CITIES[locState as keyof typeof CITIES] : [];

  const handleAnalyze = () => {
    const r = roof || 80;
    const rn = rain || 500;
    
    const mult = { sunny: 5.5, partly: 4.2, cloudy: 3.0 };
    const wMult = mult[weather as keyof typeof mult] || 5.5;

    const solar = Math.round((r * wMult * 365) / 1000);
    const water = Math.round((r * rn * 0.85) / 1000);
    const monthlySolar = Math.round((solar * 8) / 12);
    const monthlyWater = Math.round((water * 3) / 12);
    const savings = monthlySolar + monthlyWater;
    const co2 = Math.round(solar * 0.82);
    const panels = Math.round(r / 3);
    const systemCost = panels * 12000;
    const payback = (systemCost / savings / 12).toFixed(1);
    const roi25 = Math.round(savings * 12 * 25 - systemCost);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sm = [0.7, 0.8, 1, 1.1, 1.15, 1, 0.9, 0.9, 1, 1.05, 0.85, 0.7];
    const wm = [0.05, 0.05, 0.1, 0.15, 0.25, 0.75, 1.2, 1.1, 0.65, 0.25, 0.08, 0.05];

    const chartData = months.map((m, i) => ({
      name: m,
      solar: Math.round((solar / 12) * sm[i]),
      water: Math.round((water / 12) * wm[i] * 2),
    }));

    setResults({ solar, water, savings, co2, panels, systemCost, payback, roi25, chartData });
  };

  const isRoofChanged = roof !== 80 || rain !== 500 || bill !== 3200;

  return (
    <div className="animate-fade-up">
      <div className="page-header">
        <div className="page-tag">AI-Powered Analysis</div>
        <div className="page-title">
          HydroSolar <span>Analyzer</span>
        </div>
        <div className="page-sub">
          Calculate your solar energy potential & rainwater harvesting capacity based on your property
        </div>
      </div>

      <div className="step-pills">
        <div className="step-pill done">
          <div className="dot"></div>Location Selected
        </div>
        <div className={`step-pill ${isRoofChanged ? "done" : ""}`}>
          <div className="dot"></div>Property Details
        </div>
        <div className={`step-pill ${results ? "done" : ""}`}>
          <div className="dot"></div>AI Analysis
        </div>
      </div>

      <div className="hs-main-grid">
        {/* FORM */}
        <div className="card">
          <div className="card-title">☀️ Property Details</div>
          
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">State</label>
              <select className="form-select" value={locState} onChange={(e) => { setLocState(e.target.value); setCity(""); }}>
                <option value="">Select State</option>
                <option value="RJ">Rajasthan</option>
                <option value="MH">Maharashtra</option>
                <option value="KA">Karnataka</option>
                <option value="TN">Tamil Nadu</option>
                <option value="GJ">Gujarat</option>
                <option value="UP">Uttar Pradesh</option>
                <option value="DL">Delhi</option>
                <option value="WB">West Bengal</option>
                <option value="KL">Kerala</option>
                <option value="AP">Andhra Pradesh</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">City</label>
              <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)} disabled={!locState}>
                <option value="">Select City</option>
                {availableCities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Rooftop Size (sq. meters)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g. 120" 
              value={roof} 
              onChange={(e) => setRoof(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Weather Condition</label>
            <select className="form-select" value={weather} onChange={(e) => setWeather(e.target.value)}>
              <option value="sunny">☀️ Mostly Sunny</option>
              <option value="partly">⛅ Partly Cloudy</option>
              <option value="cloudy">☁️ Mostly Cloudy</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Average Annual Rainfall (mm)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g. 650" 
              value={rain} 
              onChange={(e) => setRain(Number(e.target.value))}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Monthly Electricity Bill (₹)</label>
            <input 
              type="number" 
              className="form-input" 
              placeholder="e.g. 3500" 
              value={bill} 
              onChange={(e) => setBill(Number(e.target.value))}
            />
          </div>

          <button className="analyze-btn" onClick={handleAnalyze}>
            🔍 Analyze My Property
          </button>
        </div>

        {/* RESULTS AREA */}
        <div>
          {!results ? (
            <div className="card placeholder-card">
              <div className="placeholder-icon">🌞💧</div>
              <div className="placeholder-title">Enter your property details</div>
              <div className="placeholder-sub">
                AI will calculate solar potential, rainwater capacity,<br />monthly savings and CO₂ reduction
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 animate-fade-up">
              <div className="card">
                <div className="card-title">📊 Analysis Results</div>
                <div className="results-grid">
                  <div className="res-card" style={{ background: "rgba(245,166,35,0.07)", borderColor: "rgba(245,166,35,0.25)" }}>
                    <div className="res-val" style={{ color: "var(--amber)" }}>{results.solar} kWh</div>
                    <div className="res-lbl" style={{ color: "var(--amber)" }}>Solar Energy / Year</div>
                  </div>
                  <div className="res-card" style={{ background: "rgba(38,212,180,0.07)", borderColor: "rgba(38,212,180,0.25)" }}>
                    <div className="res-val" style={{ color: "var(--teal)" }}>{results.water} m³</div>
                    <div className="res-lbl" style={{ color: "var(--teal)" }}>Rainwater / Year</div>
                  </div>
                  <div className="res-card" style={{ background: "rgba(74,200,80,0.07)", borderColor: "rgba(74,200,80,0.25)" }}>
                    <div className="res-val" style={{ color: "var(--green)" }}>₹{results.savings}</div>
                    <div className="res-lbl" style={{ color: "var(--green)" }}>Monthly Savings</div>
                  </div>
                  <div className="res-card" style={{ background: "rgba(255,107,107,0.07)", borderColor: "rgba(255,107,107,0.25)" }}>
                    <div className="res-val" style={{ color: "var(--coral)" }}>{results.co2} kg</div>
                    <div className="res-lbl" style={{ color: "var(--coral)" }}>CO₂ Reduced / Year</div>
                  </div>
                </div>

                <div className="rec-box">
                  <strong>🤖 AI Recommendation:</strong> Your {roof}m² rooftop in this location can support <strong>{results.panels} solar panels</strong> (300W each) generating {results.solar} kWh/year. Combined with a <strong>{Math.round((results.water * 1000) / 12)}L/month</strong> rainwater harvesting system, you'll save <strong>₹{results.savings}/month</strong>. System cost ~₹{(results.systemCost / 100000).toFixed(1)} lakhs with a payback of just <strong>{results.payback} years</strong>.
                </div>

                <div className="roi-grid">
                  <div className="roi-card">
                    <div className="roi-val">{results.payback} yrs</div>
                    <div className="roi-lbl">Payback Period</div>
                  </div>
                  <div className="roi-card">
                    <div className="roi-val">₹{(results.roi25 / 100000).toFixed(1)}L</div>
                    <div className="roi-lbl">25-Year ROI</div>
                  </div>
                  <div className="roi-card">
                    <div className="roi-val">{results.panels}</div>
                    <div className="roi-lbl">Solar Panels</div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="chart-title">📈 Monthly Production Forecast</div>
                <div className="w-full h-[180px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(74,200,80,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#3d6b41", fontSize: 10, fontFamily: "Space Grotesk" }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: "#3d6b41", fontSize: 10 }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "#141c14", border: "1px solid rgba(74,200,80,0.13)", borderRadius: "10px" }}
                        itemStyle={{ color: "#e8f5e9" }}
                        cursor={{ fill: "rgba(74,200,80,0.05)" }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "11px", color: "#8fbc92", fontFamily: "Space Grotesk" }} />
                      <Bar dataKey="solar" name="Solar (kWh)" fill="rgba(245,166,35,0.75)" radius={[5, 5, 0, 0]} />
                      <Bar dataKey="water" name="Water (m³)" fill="rgba(38,212,180,0.75)" radius={[5, 5, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
