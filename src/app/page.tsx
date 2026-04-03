"use client";

import React, { useEffect, useState, useRef } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

// ─── Score Ring Canvas Animation
function ScoreRing({ target }: { target: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [val, setVal] = useState(0);

  useEffect(() => {
    let currentV = 0;
    const draw = (v: number) => {
      const cv = canvasRef.current;
      if (!cv) return;
      const ctx = cv.getContext("2d");
      if (!ctx) return;
      
      ctx.clearRect(0, 0, 170, 170);
      const cx = 85, cy = 85, r = 72, s = -Math.PI / 2, f = 2 * Math.PI;
      ctx.lineWidth = 9;
      ctx.lineCap = "round";
      
      // BG ring
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, f);
      ctx.strokeStyle = "rgba(74,200,80,0.1)";
      ctx.stroke();
      
      // Glow Foreground
      ctx.shadowColor = "rgba(74,200,80,0.4)";
      ctx.shadowBlur = 12;
      const g = ctx.createLinearGradient(13, 85, 157, 85);
      g.addColorStop(0, "#4ac850");
      g.addColorStop(1, "#26d4b4");
      
      ctx.beginPath();
      ctx.arc(cx, cy, r, s, s + f * v / 100);
      ctx.strokeStyle = g;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const interval = setInterval(() => {
      currentV = Math.min(currentV + 1, target);
      setVal(currentV);
      draw(currentV);
      if (currentV >= target) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [target]);

  return (
    <div className="score-ring-wrap">
      <canvas ref={canvasRef} width={170} height={170}></canvas>
      <div className="score-inner">
        <div className="score-num">{val}</div>
        <div className="score-lbl">Eco Score</div>
      </div>
    </div>
  );
}

// ─── Data
const CHART_DATA = [
  { name: "Jan", water: 820, energy: 18, solar: 320 },
  { name: "Feb", water: 740, energy: 16, solar: 410 },
  { name: "Mar", water: 910, energy: 19, solar: 580 },
  { name: "Apr", water: 980, energy: 20, solar: 720 },
  { name: "May", water: 1100, energy: 22, solar: 840 },
  { name: "Jun", water: 1380, energy: 26, solar: 780 },
  { name: "Jul", water: 1420, energy: 28, solar: 720 },
  { name: "Aug", water: 1350, energy: 27, solar: 750 },
  { name: "Sep", water: 1100, energy: 22, solar: 810 },
  { name: "Oct", water: 980, energy: 20, solar: 760 },
  { name: "Nov", water: 860, energy: 18, solar: 540 },
  { name: "Dec", water: 820, energy: 17, solar: 360 },
];

const PIE_DATA = [
  { name: "Solar", value: 62, color: "#f5a623" },
  { name: "Grid", value: 28, color: "#4a9eff" },
  { name: "Battery", value: 10, color: "#26d4b4" },
];

import { useLanguage } from "@/components/language-provider";

export default function DashboardPage() {
  const [chartMode, setChartMode] = useState<"water" | "energy" | "solar">("water");
  const [userName, setUserName] = useState("Ronak Jain");
  const { t } = useLanguage();

  useEffect(() => {
    const user = localStorage.getItem("eco-user");
    if (user) setUserName(user);
  }, []);

  return (
    <>
      {/* HERO */}
      <div className="hero animate-fade-up">
        <div className="hero-left">
          <div className="hero-tag">{t("welcome")} {userName.split(' ')[0]}</div>
          <div className="hero-title">
            Your Eco<br /><span>{t("dashboard")}</span>
          </div>
          <div className="hero-sub">You're in the top 15% of users in Rajasthan 🎉</div>
        </div>
        <div className="hero-right">
          <div className="score-meta">
            <div className="score-bar-item">
              <div className="sbi-head">
                <span style={{ color: "var(--amber)" }}>☀️ Solar</span>
                <span style={{ color: "var(--amber)" }}>88</span>
              </div>
              <div className="sbi-bar">
                <div className="sbi-fill animate-slide-in-left" style={{ width: "88%", background: "var(--amber)" }}></div>
              </div>
            </div>
            <div className="score-bar-item">
              <div className="sbi-head">
                <span style={{ color: "var(--teal)" }}>💧 Water</span>
                <span style={{ color: "var(--teal)" }}>74</span>
              </div>
              <div className="sbi-bar">
                <div className="sbi-fill animate-slide-in-left" style={{ width: "74%", background: "var(--teal)", animationDelay: "100ms" }}></div>
              </div>
            </div>
            <div className="score-bar-item">
              <div className="sbi-head">
                <span style={{ color: "var(--green)" }}>🗑️ Waste</span>
                <span style={{ color: "var(--green)" }}>70</span>
              </div>
              <div className="sbi-bar">
                <div className="sbi-fill animate-slide-in-left" style={{ width: "70%", background: "var(--green)", animationDelay: "200ms" }}></div>
              </div>
            </div>
            <div className="score-bar-item">
              <div className="sbi-head">
                <span style={{ color: "var(--coral)" }}>🌫️ Carbon</span>
                <span style={{ color: "var(--coral)" }}>80</span>
              </div>
              <div className="sbi-bar">
                <div className="sbi-fill animate-slide-in-left" style={{ width: "80%", background: "var(--coral)", animationDelay: "300ms" }}></div>
              </div>
            </div>
          </div>
          <ScoreRing target={78} />
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="stats-grid stagger-children">
        <div className="stat-card w animate-fade-up">
          <div className="stat-top">
            <div className="stat-icon" style={{ background: "rgba(38,212,180,0.12)" }}>💧</div>
            <div className="stat-trend up">↑ 18%</div>
          </div>
          <div className="stat-val" style={{ color: "var(--teal)" }}>12,480<small style={{ fontSize: "1rem", color: "var(--text2)" }}> L</small></div>
          <div className="stat-lbl">Water Saved / Month</div>
        </div>
        <div className="stat-card s animate-fade-up">
          <div className="stat-top">
            <div className="stat-icon" style={{ background: "rgba(245,166,35,0.12)" }}>☀️</div>
            <div className="stat-trend up">↑ 34%</div>
          </div>
          <div className="stat-val" style={{ color: "var(--amber)" }}>847<small style={{ fontSize: "1rem", color: "var(--text2)" }}> kWh</small></div>
          <div className="stat-lbl">Solar Generated</div>
        </div>
        <div className="stat-card g animate-fade-up">
          <div className="stat-top">
            <div className="stat-icon" style={{ background: "rgba(74,200,80,0.12)" }}>🌱</div>
            <div className="stat-trend up">↑ 12%</div>
          </div>
          <div className="stat-val" style={{ color: "var(--green)" }}>2.4<small style={{ fontSize: "1rem", color: "var(--text2)" }}> tons</small></div>
          <div className="stat-lbl">CO₂ Reduced / Year</div>
        </div>
        <div className="stat-card e animate-fade-up">
          <div className="stat-top">
            <div className="stat-icon" style={{ background: "rgba(255,107,107,0.12)" }}>⚡</div>
            <div className="stat-trend up">↑ 8%</div>
          </div>
          <div className="stat-val" style={{ color: "var(--coral)" }}>₹3,240</div>
          <div className="stat-lbl">Energy Savings / Month</div>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="main-grid stagger-children">
        <div className="chart-card animate-fade-up" style={{ animationDelay: "400ms" }}>
          <div className="card-head">
            <div>
              <div className="card-title">Consumption Overview</div>
              <div className="card-sub">Last 12 months · water & energy trends</div>
            </div>
            <div className="ctabs">
              <button 
                className={`ctab ${chartMode === "water" ? "active" : ""}`} 
                onClick={() => setChartMode("water")}
              >Water</button>
              <button 
                className={`ctab ${chartMode === "energy" ? "active" : ""}`} 
                onClick={() => setChartMode("energy")}
              >Energy</button>
              <button 
                className={`ctab ${chartMode === "solar" ? "active" : ""}`} 
                onClick={() => setChartMode("solar")}
              >Solar</button>
            </div>
          </div>
          
          {/* Recharts Conversion from Chart.js */}
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CHART_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartMode === "water" ? "#26d4b4" : chartMode === "energy" ? "#f5a623" : "#4ac850"} stopOpacity={0.2} />
                    <stop offset="95%" stopColor={chartMode === "water" ? "#26d4b4" : chartMode === "energy" ? "#f5a623" : "#4ac850"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(74,200,80,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#3d6b41", fontSize: 11, fontFamily: "Space Grotesk" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#3d6b41", fontSize: 11, fontFamily: "Space Grotesk" }} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: "#141c14", border: "1px solid rgba(74,200,80,0.13)", borderRadius: "10px" }}
                  itemStyle={{ color: "#e8f5e9" }}
                  cursor={{ stroke: "rgba(74,200,80,0.2)" }}
                />
                <Area 
                  type="monotone" 
                  dataKey={chartMode} 
                  stroke={chartMode === "water" ? "#26d4b4" : chartMode === "energy" ? "#f5a623" : "#4ac850"} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#fillColor)" 
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="activity-card animate-fade-up" style={{ animationDelay: "450ms" }}>
          <div className="card-head"><div className="card-title">Recent Activity</div></div>
          
          <div className="activity-item">
            <div className="act-icon" style={{ background: "rgba(74,200,80,0.12)" }}>🏆</div>
            <div className="act-body">
              <div className="act-title">Challenge Completed</div>
              <div className="act-desc">Water Conservation Week — saved 680L</div>
              <div className="act-time">2 hours ago</div>
            </div>
            <div className="act-pts">+250 pts</div>
          </div>
          <div className="activity-item">
            <div className="act-icon" style={{ background: "rgba(245,166,35,0.12)" }}>☀️</div>
            <div className="act-body">
              <div className="act-title">Solar Milestone</div>
              <div className="act-desc">Generated 100 kWh from solar panels</div>
              <div className="act-time">Yesterday</div>
            </div>
            <div className="act-pts">+15 pts</div>
          </div>
          <div className="activity-item">
            <div className="act-icon" style={{ background: "rgba(38,212,180,0.12)" }}>🛒</div>
            <div className="act-body">
              <div className="act-title">Store Purchase</div>
              <div className="act-desc">Smart Water Meter — used 1,200 pts</div>
              <div className="act-time">2 days ago</div>
            </div>
            <div className="act-pts" style={{ color: "var(--coral)" }}>-1,200 pts</div>
          </div>
          <div className="activity-item">
            <div className="act-icon" style={{ background: "rgba(74,200,80,0.12)" }}>📅</div>
            <div className="act-body">
              <div className="act-title">Daily Check-in</div>
              <div className="act-desc">7-day streak maintained</div>
              <div className="act-time">3 days ago</div>
            </div>
            <div className="act-pts">+5 pts</div>
          </div>
          <div className="activity-item">
            <div className="act-icon" style={{ background: "rgba(255,107,107,0.12)" }}>⚡</div>
            <div className="act-body">
              <div className="act-title">Energy Saving</div>
              <div className="act-desc">Reduced grid usage by 14% this week</div>
              <div className="act-time">4 days ago</div>
            </div>
            <div className="act-pts">+25 pts</div>
          </div>
        </div>
      </div>

      {/* BOTTOM GRID */}
      <div className="bottom-grid stagger-children">
        
        {/* BADGES */}
        <div className="badges-card animate-fade-up" style={{ animationDelay: "500ms" }}>
          <div className="sec-lbl">Achievements</div>
          <div className="badges-row">
            <div className="badge on"><div className="badge-ico">🏆</div><div className="badge-nm">Water Warrior</div></div>
            <div className="badge on"><div className="badge-ico">☀️</div><div className="badge-nm">Solar Champ</div></div>
            <div className="badge teal-on"><div className="badge-ico">💧</div><div className="badge-nm">Aqua Saver</div></div>
            <div className="badge"><div className="badge-ico badge-lock">🌱</div><div className="badge-nm">Guardian</div></div>
            <div className="badge"><div className="badge-ico badge-lock">⚡</div><div className="badge-nm">E. Master</div></div>
            <div className="badge"><div className="badge-ico badge-lock">🌍</div><div className="badge-nm">Eco Hero</div></div>
          </div>

          <div style={{ marginTop: "1.2rem" }}>
            <div className="sec-lbl">Energy Sources</div>
            <div className="solar-wrap">
              {/* Recharts conversion of doughnut */}
              <div className="w-[110px] h-[110px] flex-shrink-0 -ml-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      cx="50%"
                      cy="50%"
                      innerRadius={36}
                      outerRadius={50}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      formatter={(val: number) => [`${val}%`, ""]}
                      contentStyle={{ backgroundColor: "#141c14", border: "1px solid rgba(74,200,80,0.13)", borderRadius: "10px" }}
                      itemStyle={{ color: "#e8f5e9" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="solar-legend">
                <div className="leg-item"><div className="leg-dot" style={{ background: "var(--amber)" }}></div><span>Solar</span><div className="leg-val" style={{ color: "var(--amber)" }}>62%</div></div>
                <div className="leg-item"><div className="leg-dot" style={{ background: "var(--blue)" }}></div><span>Grid</span><div className="leg-val" style={{ color: "var(--blue)" }}>28%</div></div>
                <div className="leg-item"><div className="leg-dot" style={{ background: "var(--teal)" }}></div><span>Battery</span><div className="leg-val" style={{ color: "var(--teal)" }}>10%</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="quick-card animate-fade-up" style={{ animationDelay: "550ms" }}>
          <div className="sec-lbl">Quick Navigate</div>
          <div className="qaction">
            <div className="qa-icon" style={{ background: "rgba(245,166,35,0.12)" }}>☀️</div>
            <div><div className="qa-title">HydroSolar Analyzer</div><div className="qa-desc">Check your solar & rainwater potential</div></div>
            <div className="qa-arrow">›</div>
          </div>
          <div className="qaction">
            <div className="qa-icon" style={{ background: "rgba(38,212,180,0.12)" }}>📊</div>
            <div><div className="qa-title">Aqua-Energy Live</div><div className="qa-desc">Real-time water & electricity monitor</div></div>
            <div className="qa-arrow">›</div>
          </div>
          <div className="qaction">
            <div className="qa-icon" style={{ background: "rgba(74,200,80,0.12)" }}>🏆</div>
            <div><div className="qa-title">GreenGrid Optimizer</div><div className="qa-desc">Leaderboard & community challenges</div></div>
            <div className="qa-arrow">›</div>
          </div>
          <div className="qaction">
            <div className="qa-icon" style={{ background: "rgba(74,200,80,0.12)" }}>🛒</div>
            <div><div className="qa-title">Eco Store</div><div className="qa-desc">Redeem 2,840 pts for products</div></div>
            <div className="qa-arrow">›</div>
          </div>
          <div className="qaction">
            <div className="qa-icon" style={{ background: "rgba(38,212,180,0.12)" }}>🤖</div>
            <div><div className="qa-title">AI Eco Bot</div><div className="qa-desc">Ask your sustainability assistant</div></div>
            <div className="qa-arrow">›</div>
          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="community-card animate-fade-up" style={{ animationDelay: "600ms" }}>
          <div className="sec-lbl">Community Ranking</div>
          <div className="lb-row">
            <div className="lb-rank" style={{ color: "var(--amber)" }}>🏆</div>
            <div className="lb-av" style={{ background: "rgba(38,212,180,0.15)", color: "var(--teal)" }}>PM</div>
            <div className="lb-name">Priya M.</div>
            <div className="lb-pts">4,820</div>
          </div>
          <div className="lb-row">
            <div className="lb-rank" style={{ color: "#c0c0c0" }}>🥈</div>
            <div className="lb-av" style={{ background: "rgba(245,166,35,0.15)", color: "var(--amber)" }}>RK</div>
            <div className="lb-name">Ravi K.</div>
            <div className="lb-pts">4,310</div>
          </div>
          <div className="lb-row">
            <div className="lb-rank" style={{ color: "#cd7f32" }}>🥉</div>
            <div className="lb-av" style={{ background: "rgba(255,107,107,0.15)", color: "var(--coral)" }}>AT</div>
            <div className="lb-name">Aisha T.</div>
            <div className="lb-pts">3,980</div>
          </div>
          <div className="lb-row">
            <div className="lb-rank" style={{ color: "var(--text3)" }}>#4</div>
            <div className="lb-av" style={{ background: "rgba(74,154,255,0.15)", color: "var(--blue)" }}>SB</div>
            <div className="lb-name">Suresh B.</div>
            <div className="lb-pts">3,640</div>
          </div>
          <div className="lb-row" style={{ background: "rgba(74,200,80,0.06)", borderRadius: "8px", padding: "8px 10px", border: "1px solid rgba(74,200,80,0.18)" }}>
            <div className="lb-rank" style={{ color: "var(--green)" }}>#7</div>
            <div className="lb-av" style={{ background: "rgba(74,200,80,0.2)", color: "var(--green)" }}>RJ</div>
            <div className="lb-name">{userName} <span className="lb-you">You</span></div>
            <div className="lb-pts" style={{ color: "var(--green)" }}>2,840</div>
          </div>
          <div style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "0.72rem", color: "var(--text2)" }}>Active Challenge</div>
              <div style={{ fontSize: "0.68rem", color: "var(--green)", fontWeight: 700 }}>72% done</div>
            </div>
            <div style={{ marginTop: "6px", fontSize: "0.78rem", fontWeight: 600 }}>💧 Water Conservation Week</div>
            <div style={{ background: "var(--bg4)", borderRadius: "4px", height: "5px", overflow: "hidden", marginTop: "7px" }}>
              <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,var(--green),var(--teal))", borderRadius: "4px" }}></div>
            </div>
            <div style={{ fontSize: "0.67rem", color: "var(--text2)", marginTop: "4px" }}>342 participants · +250 pts reward</div>
          </div>
        </div>
      </div>

    </>
  );
}
