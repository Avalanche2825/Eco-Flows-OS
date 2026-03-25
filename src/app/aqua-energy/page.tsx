"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";

export default function AquaEnergyPage() {
  const [live, setLive] = useState({ w: 0, f: "0.0", e: "0.0", p: "0.0" });
  const [alertShown, setAlertShown] = useState(false);
  const [aqMode, setAqMode] = useState<'w' | 'e'>('w');
  
  const aqChartRef = useRef<any>(null);
  const trendChartRef = useRef<any>(null);
  const aqCanvasRef = useRef<HTMLCanvasElement>(null);
  const trendCanvasRef = useRef<HTMLCanvasElement>(null);
  const chartJsLoaded = useRef(false);

  const liveUp = useCallback(() => {
    const w = Math.round(80 + Math.random() * 120);
    const f = (2 + Math.random() * 5).toFixed(1);
    const e = (1.5 + Math.random() * 3).toFixed(1);
    const p = (2 + Math.random() * 4).toFixed(1);
    
    setLive({ w, f, e, p });
    
    if (w > 185) {
      setAlertShown(prev => {
        if (!prev) {
          setTimeout(() => setAlertShown(false), 5000);
          return true;
        }
        return prev;
      });
    }
  }, []);

  useEffect(() => {
    liveUp();
    const id = setInterval(liveUp, 2000);
    return () => clearInterval(id);
  }, [liveUp]);

  const buildAqChart = useCallback((mode: 'w' | 'e') => {
    if (!chartJsLoaded.current || !aqCanvasRef.current) return;
    const Chart = (window as any).Chart;
    if (!Chart) return;
    
    if (aqChartRef.current) aqChartRef.current.destroy();
    
    const isW = mode === 'w';
    const hrs = Array.from({ length: 24 }, (_, i) => i + ':00');
    const d = Array.from({ length: 24 }, (_, i) => isW ? Math.round(50 + Math.sin(i / 3) * 30 + Math.random() * 40) : +(1 + Math.sin(i / 4) * .8 + Math.random() * 1.5).toFixed(1));
    
    aqChartRef.current = new Chart(aqCanvasRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: hrs,
        datasets: [{
          label: isW ? 'Water (L)' : 'Energy (kW)',
          data: d,
          borderColor: isW ? '#26d4b4' : '#f5a623',
          backgroundColor: isW ? 'rgba(38,212,180,0.1)' : 'rgba(245,166,35,0.1)',
          fill: true,
          tension: .4,
          pointRadius: 2,
          pointBackgroundColor: isW ? '#26d4b4' : '#f5a623'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8fbc92', font: { family: 'Space Grotesk', size: 11 } } }
        },
        scales: {
          x: { ticks: { color: '#3d6b41', font: { size: 9 }, maxTicksLimit: 8 }, grid: { color: 'rgba(74,200,80,0.04)' } },
          y: { ticks: { color: '#3d6b41', font: { size: 10 } }, grid: { color: 'rgba(74,200,80,0.04)' } }
        }
      }
    });
  }, []);

  const buildTrendChart = useCallback(() => {
    if (!chartJsLoaded.current || !trendCanvasRef.current) return;
    const Chart = (window as any).Chart;
    if (!Chart) return;
    
    if (trendChartRef.current) trendChartRef.current.destroy();
    
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    trendChartRef.current = new Chart(trendCanvasRef.current.getContext('2d'), {
      type: 'line',
      data: {
        labels: days,
        datasets: [
          {
            label: 'Water (×10L)',
            data: Array.from({ length: 30 }, () => Math.round(120 + Math.random() * 60)),
            borderColor: '#26d4b4',
            tension: .4,
            pointRadius: 0,
            yAxisID: 'y'
          },
          {
            label: 'Energy (kWh)',
            data: Array.from({ length: 30 }, () => +(15 + Math.random() * 8).toFixed(1)),
            borderColor: '#f5a623',
            tension: .4,
            pointRadius: 0,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#8fbc92', font: { family: 'Space Grotesk', size: 11 } } }
        },
        scales: {
          x: { ticks: { color: '#3d6b41', font: { size: 8 }, maxTicksLimit: 8 }, grid: { color: 'rgba(74,200,80,0.04)' } },
          y: { ticks: { color: '#26d4b4', font: { size: 9 } }, grid: { color: 'rgba(74,200,80,0.04)' } },
          y1: { position: 'right', ticks: { color: '#f5a623', font: { size: 9 } }, grid: { drawOnChartArea: false } }
        }
      }
    });
  }, []);

  const handleChartLoad = useCallback(() => {
    chartJsLoaded.current = true;
    buildAqChart(aqMode);
    buildTrendChart();
  }, [buildAqChart, buildTrendChart, aqMode]);

  useEffect(() => {
    if (chartJsLoaded.current) {
      buildAqChart(aqMode);
    }
  }, [aqMode, buildAqChart]);

  return (
    <>
      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js" 
        onLoad={handleChartLoad} 
        strategy="lazyOnload"
      />
      <div className="page animate-fade-up">
        <div className="page-header">
          <div>
            <div className="page-tag">Real-Time Monitoring</div>
            <div className="page-title">Aqua-Energy <span>Dashboard</span></div>
            <div className="page-sub">Live water & electricity usage — updates every 2 seconds</div>
          </div>
          <div className="live-badge"><div className="ld"></div>LIVE · Updating</div>
        </div>

        <div className="alert-bar" id="alert-bar" style={{ display: alertShown ? 'flex' : 'none' }}>
          ⚠️ <strong>High Usage Alert:</strong> Water consumption is 40% above your daily average right now.
        </div>

        <div className="live-grid">
          <div className="live-card w">
            <div className="lv-label"><div className="lv-pip" style={{background: 'var(--teal)'}}></div>Water Usage</div>
            <div><span className="lv-val" style={{color: 'var(--teal)'}}>{live.w || '—'}</span><span className="lv-unit">L</span></div>
            <div className="lv-sub">Current consumption</div>
          </div>
          <div className="live-card w">
            <div className="lv-label"><div className="lv-pip" style={{background: 'var(--teal)'}}></div>Flow Rate</div>
            <div><span className="lv-val" style={{color: 'var(--teal)'}}>{live.f || '—'}</span><span className="lv-unit">L/min</span></div>
            <div className="lv-sub">Avg today: 4.2 L/min</div>
          </div>
          <div className="live-card e">
            <div className="lv-label"><div className="lv-pip" style={{background: 'var(--amber)'}}></div>Electricity</div>
            <div><span className="lv-val" style={{color: 'var(--amber)'}}>{live.e || '—'}</span><span className="lv-unit">kW</span></div>
            <div className="lv-sub">Current draw</div>
          </div>
          <div className="live-card e">
            <div className="lv-label"><div className="lv-pip" style={{background: 'var(--amber)'}}></div>Active Load</div>
            <div><span className="lv-val" style={{color: 'var(--amber)'}}>{live.p || '—'}</span><span className="lv-unit">kW</span></div>
            <div className="lv-sub">Peak today: 3.8 kW</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <div className="chart-head">
              <div><div className="chart-title">24-Hour Consumption</div><div className="chart-sub">Hourly breakdown today</div></div>
              <div className="ctabs">
                <button className={`ctab ${aqMode === 'w' ? 'active' : ''}`} onClick={() => setAqMode('w')}>Water</button>
                <button className={`ctab ${aqMode === 'e' ? 'active' : ''}`} onClick={() => setAqMode('e')}>Energy</button>
              </div>
            </div>
            <div style={{ height: '200px', position: 'relative' }}>
              <canvas ref={aqCanvasRef}></canvas>
            </div>
          </div>
          <div className="chart-card">
            <div className="chart-head"><div><div className="chart-title">30-Day Trends</div><div className="chart-sub">Water & energy over the month</div></div></div>
            <div style={{ height: '200px', position: 'relative' }}>
              <canvas ref={trendCanvasRef}></canvas>
            </div>
          </div>
        </div>

        <div className="bottom-grid">
          <div className="card">
            <div className="sec-lbl">Today's Insights</div>
            <div className="insight-item" style={{borderColor: 'var(--teal)'}}>
              <div className="insight-t" style={{color: 'var(--teal)'}}>💧 Water Peak: 7–9 AM</div>
              <div className="insight-b">Daily total: 142L · Avg flow: 4.2 L/min · 12% below yesterday</div>
            </div>
            <div className="insight-item" style={{borderColor: 'var(--amber)'}}>
              <div className="insight-t" style={{color: 'var(--amber)'}}>⚡ Energy Peak: 6–8 PM</div>
              <div className="insight-b">Daily total: 18.4 kWh · Peak load: 3.8 kW · 5% above avg</div>
            </div>
            <div className="insight-item" style={{borderColor: 'var(--green)'}}>
              <div className="insight-t" style={{color: 'var(--green)'}}>🌞 Solar Offset: 62%</div>
              <div className="insight-b">11.4 kWh from solar · Grid draw: 7.0 kWh · Saving ₹108 today</div>
            </div>
          </div>
          <div className="card">
            <div className="sec-lbl">Efficiency Tips</div>
            <div className="tip-item">
              <div className="tip-icon" style={{background: 'rgba(74,200,80,0.12)'}}>⚡</div>
              <div><div className="tip-t">Run dishwasher after 10 PM</div><div className="tip-b">Avoid peak tariff rates · Saves <strong style={{color: 'var(--green)'}}>₹45/day</strong></div></div>
            </div>
            <div className="tip-item">
              <div className="tip-icon" style={{background: 'rgba(38,212,180,0.12)'}}>🚿</div>
              <div><div className="tip-t">Low-flow showerhead</div><div className="tip-b">Saves <strong style={{color: 'var(--teal)'}}>12L per shower</strong> with no pressure loss</div></div>
            </div>
            <div className="tip-item">
              <div className="tip-icon" style={{background: 'rgba(245,166,35,0.12)'}}>❄️</div>
              <div><div className="tip-t">AC at 24°C vs 22°C</div><div className="tip-b">Saves <strong style={{color: 'var(--amber)'}}>18% energy</strong> — small change, big impact</div></div>
            </div>
            <div className="tip-item">
              <div className="tip-icon" style={{background: 'rgba(255,107,107,0.12)'}}>🌱</div>
              <div><div className="tip-t">Water plants at dawn or dusk</div><div className="tip-b">Reduces evaporation · Saves <strong style={{color: 'var(--coral)'}}>30% garden water</strong></div></div>
            </div>
          </div>
          <div className="card">
            <div className="sec-lbl">Daily Statistics</div>
            <div className="stat-row"><span className="stat-row-lbl">Water today</span><span className="stat-row-val" style={{color: 'var(--teal)'}}>142 L</span></div>
            <div className="stat-row"><span className="stat-row-lbl">Energy today</span><span className="stat-row-val" style={{color: 'var(--amber)'}}>18.4 kWh</span></div>
            <div className="stat-row"><span className="stat-row-lbl">Solar generated</span><span className="stat-row-val" style={{color: 'var(--green)'}}>11.4 kWh</span></div>
            <div className="stat-row"><span className="stat-row-lbl">Grid draw</span><span className="stat-row-val" style={{color: 'var(--text2)'}}>7.0 kWh</span></div>
            <div className="stat-row"><span className="stat-row-lbl">Money saved today</span><span className="stat-row-val" style={{color: 'var(--green)'}}>₹108</span></div>
            <div className="stat-row"><span className="stat-row-lbl">CO₂ avoided</span><span className="stat-row-val" style={{color: 'var(--coral)'}}>9.4 kg</span></div>
            <div className="stat-row"><span className="stat-row-lbl">vs yesterday (water)</span><span className="stat-row-val" style={{color: 'var(--green)'}}>↓ 12%</span></div>
            <div className="stat-row"><span className="stat-row-lbl">vs yesterday (energy)</span><span className="stat-row-val" style={{color: 'var(--coral)'}}>↑ 5%</span></div>
          </div>
        </div>
      </div>
    </>
  );
}

