"use client";

import React, { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from "recharts";

const LBD = [
  { n: 'Priya M.', p: 4820, av: 'PM', c: '#26d4b4' },
  { n: 'Ravi K.', p: 4310, av: 'RK', c: '#f5a623' },
  { n: 'Aisha T.', p: 3980, av: 'AT', c: '#ff6b6b' },
  { n: 'Suresh B.', p: 3640, av: 'SB', c: '#4a9eff' },
  { n: 'Meena P.', p: 3200, av: 'MP', c: '#a78bfa' },
  { n: 'Arun D.', p: 3050, av: 'AD', c: '#34d399' },
  { n: 'Ronak Jain', p: 2840, av: 'RJ', c: '#4ac850', you: true },
  { n: 'Kavita N.', p: 2600, av: 'KN', c: '#f472b6' },
  { n: 'Dev R.', p: 2400, av: 'DR', c: '#60a5fa' },
  { n: 'Pooja L.', p: 2100, av: 'PL', c: '#fbbf24' }
];

const INITIAL_CMS = [
  { n: 'Green Jaipur', p: 48200, m: 24, joined: true },
  { n: 'EcoWarriors MH', p: 41500, m: 18, joined: false },
  { n: 'Solar KA', p: 38900, m: 21, joined: false },
  { n: 'Blue TN', p: 35100, m: 15, joined: false }
];

const RE = ['🏆', '🥈', '🥉'];
const RC = ['r1', 'r2', 'r3', '', '', '', '', '', '', ''];

const RADAR_DATA = [
  { subject: 'Solar', A: 88, B: 65, fullMark: 100 },
  { subject: 'Water', A: 74, B: 60, fullMark: 100 },
  { subject: 'Waste', A: 70, B: 55, fullMark: 100 },
  { subject: 'Carbon', A: 80, B: 62, fullMark: 100 },
  { subject: 'Community', A: 65, B: 70, fullMark: 100 },
  { subject: 'Efficiency', A: 82, B: 58, fullMark: 100 },
];

const INITIAL_CHALLENGES = [
  { c: '💧 Water Conservation Challenge', d: 'Save 500L of water this week', pts: 250, pct: 72, bg: 'linear-gradient(90deg, var(--teal), var(--green))', joined: true, parts: 342 },
  { c: '☀️ Solar Energy Marathon', d: 'Generate 200 kWh solar this month', pts: 400, pct: 45, bg: 'linear-gradient(90deg, var(--amber), var(--coral))', joined: false, parts: 218 },
  { c: '♻️ Zero Waste Week', d: 'Reduce waste output by 30%', pts: 150, pct: 88, bg: 'linear-gradient(90deg, var(--green), var(--teal))', joined: false, parts: 156 },
  { c: '🌱 Carbon Footprint Fighter', d: 'Reduce CO₂ by 50kg this month', pts: 500, pct: 30, bg: 'linear-gradient(90deg, var(--green), var(--blue))', joined: false, parts: 487 },
];

export default function GreenGridOptimizer() {
  const [tab, setTab] = useState("lb");
  const [comms, setComms] = useState(INITIAL_CMS);
  const [chal, setChal] = useState(INITIAL_CHALLENGES);
  const [showCreateMo, setShowCreateMo] = useState(false);
  const [newC, setNewC] = useState("");
  const [userName, setUserName] = useState("Ronak Jain");

  React.useEffect(() => {
    const user = localStorage.getItem("eco-user");
    if (user) setUserName(user);
  }, []);

  const toggleComm = (i: number) => {
    setComms(c => c.map((x, j) => j === i ? { ...x, joined: !x.joined } : x));
  };
  
  const createComm = () => {
    if (!newC.trim()) return;
    setComms([{ n: newC, p: 0, m: 1, joined: true }, ...comms]);
    setNewC("");
    setShowCreateMo(false);
  };

  const toggleChal = (i: number) => {
    setChal(c => c.map((x, j) => j === i ? { ...x, joined: !x.joined } : x));
  };

  return (
    <div className="page-container" style={{ padding: "40px 2rem 3rem", maxWidth: "1280px" }}>
      <div className="page-tag" style={{ fontSize: "0.68rem", color: "var(--green)", textTransform: "uppercase", letterSpacing: "1.2px", fontWeight: 600, marginBottom: "8px" }}>
        Compete & Earn
      </div>
      <div className="page-title" style={{ fontSize: "2.4rem", fontWeight: 700, letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "6px" }}>
        GreenGrid <span style={{ color: "var(--green)" }}>Optimizer</span>
      </div>
      <div className="page-sub" style={{ color: "var(--text2)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
        Leaderboard, community challenges, badges and your eco score breakdown
      </div>

      <div className="tab-bar">
        <button className={`tb ${tab === 'lb' ? 'active' : ''}`} onClick={() => setTab('lb')}>🏆 Leaderboard</button>
        <button className={`tb ${tab === 'ch' ? 'active' : ''}`} onClick={() => setTab('ch')}>⚔️ Challenges</button>
        <button className={`tb ${tab === 'bd' ? 'active' : ''}`} onClick={() => setTab('bd')}>🎖️ Badges</button>
        <button className={`tb ${tab === 'es' ? 'active' : ''}`} onClick={() => setTab('es')}>📊 Eco Score</button>
      </div>

      {/* LEADERBOARD */}
      {tab === 'lb' && (
        <div>
          <div className="g2" style={{ marginBottom: "14px" }}>
            <div className="card">
              <div className="sec-lbl">Individual Rankings</div>
              <div>
                {LBD.map((u, i) => (
                  <div key={i} className={`lb-item ${u.you ? 'you' : ''}`}>
                    <div className={`rn ${RC[i]}`}>{i < 3 ? RE[i] : '#' + (i + 1)}</div>
                    <div className="av" style={{ background: `${u.c}22`, color: u.c }}>{u.av}</div>
                    <div className="lb-name">{u.you ? userName : u.n}{u.you ? ' (You)' : ''}</div>
                    <div className="lb-bar">
                      <div className="lb-bar-fill" style={{ width: `${Math.round(u.p / 4820 * 100)}%` }}></div>
                    </div>
                    <div className="lb-pts">{u.p.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <div className="sec-lbl" style={{ display: "flex", justifyContent: "space-between" }}>
                <span>Community Rankings</span>
                <span style={{ color: "var(--green)", cursor: "pointer" }} onClick={() => setShowCreateMo(true)}>+ Create</span>
              </div>
              <div>
                {comms.map((c, i) => (
                  <div key={i} className={`lb-item ${c.joined ? 'you' : ''}`}>
                    <div className={`rn ${RC[i] && i < 3 ? RC[i] : ''}`}>{i < 3 ? RE[i] : '#' + (i + 1)}</div>
                    <div className="av" style={{ background: 'rgba(74,200,80,0.12)', color: 'var(--green)' }}>🏘️</div>
                    <div className="lb-name">
                      {c.n} <span style={{ fontSize: '0.62rem', color: 'var(--text2)' }}>{c.m} members</span>
                    </div>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div className="lb-pts">{c.p.toLocaleString()} pts</div>
                      <button onClick={() => toggleComm(i)} className="join-btn" style={{ padding: "4px 8px", fontSize: "0.65rem", background: c.joined ? "var(--green)" : "transparent", color: c.joined ? "#0a0e0a" : "var(--green)" }}>
                        {c.joined ? "Joined ✓" : "Join"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="g3">
            <div className="spot"><div className="spot-icon">☀️</div><div className="spot-lbl">Top Solar Generator</div><div className="spot-val">Priya M.</div><div className="spot-sub">1,240 kWh</div></div>
            <div className="spot"><div className="spot-icon">🏘️</div><div className="spot-lbl">Leading Community</div><div className="spot-val">Green Jaipur</div><div className="spot-sub">48,200 pts</div></div>
            <div className="spot" style={{ borderColor: "var(--border2)" }}><div className="spot-icon">⭐</div><div className="spot-lbl">Your Rank</div><div className="spot-val" style={{ color: "var(--green)" }}>#7</div><div className="spot-sub">2,840 pts</div></div>
          </div>
        </div>
      )}

      {/* CHALLENGES */}
      {tab === 'ch' && (
        <div className="g2">
          <div>
            <div className="sec-lbl" style={{ marginBottom: "1rem" }}>Active Challenges</div>
            
            {chal.map((c, i) => (
              <div key={i} className="ch-card">
                <div className="ch-top">
                  <div>
                    <div className="ch-name">{c.c}</div>
                    <div className="ch-desc">{c.d}</div>
                  </div>
                  <span className="pts-badge">+{c.pts} pts</span>
                </div>
                <div className="prog"><div className="prog-fill" style={{ width: `${c.pct}%`, background: c.bg }}></div></div>
                <div className="ch-meta">
                  <span>{c.pct}% · {c.parts} participants</span>
                  <button onClick={() => toggleChal(i)} className="join-btn" style={{ background: c.joined ? "var(--green)" : "transparent", color: c.joined ? "#0a0e0a" : "var(--green)" }}>
                    {c.joined ? "Joined ✓" : "Join"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mega-card">
            <div style={{ fontSize: "0.62rem", color: "var(--green)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "6px", fontWeight: 600 }}>Weekly Spotlight</div>
            <div style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "10px" }}>🌍 Earth Month Mega-Challenge</div>
            <div style={{ fontSize: "0.82rem", color: "var(--text2)", marginBottom: "14px", lineHeight: 1.65 }}>
              Reduce total consumption by 25% across water AND energy this week. The top 3 earners split a ₹10,000 prize pool plus massive eco points.
            </div>
            <div className="prog" style={{ marginBottom: "6px" }}><div className="prog-fill" style={{ width: "38%", background: "linear-gradient(90deg, var(--green), var(--teal))" }}></div></div>
            <div style={{ fontSize: "0.7rem", color: "var(--text2)", marginBottom: "16px" }}>38% complete · 847 participants · 4 days left</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--amber)", marginBottom: "6px" }}>750 pts + ₹3,333</div>
            <button className="dl-btn" onClick={(e) => {
              const target = e.currentTarget;
              if(target.innerText.includes("Joined")) {
                target.innerText = "Join Mega-Challenge →";
                target.style.background = "linear-gradient(135deg, var(--green), var(--teal))";
                target.style.color = "#0a0e0a";
              } else {
                target.innerText = "Joined ✓";
                target.style.background = "var(--bg3)";
                target.style.color = "var(--green)";
              }
            }}>Join Mega-Challenge →</button>
          </div>
        </div>
      )}

      {/* BADGES */}
      {tab === 'bd' && (
        <div>
          <div className="sec-lbl">Achievement Vault — 3 of 6 Earned</div>
          <div className="badge-grid">
            <div className="bdg on"><div className="bdg-ico">🏆</div><div className="bdg-name">Water Warrior</div><div className="bdg-req">Save 10,000L of water</div><div className="bdg-status" style={{ background: "rgba(245,166,35,0.12)", color: "var(--amber)" }}>✓ Earned</div></div>
            <div className="bdg on"><div className="bdg-ico">☀️</div><div className="bdg-name">Solar Champion</div><div className="bdg-req">Generate 1,000 kWh solar</div><div className="bdg-status" style={{ background: "rgba(245,166,35,0.12)", color: "var(--amber)" }}>✓ Earned</div></div>
            <div className="bdg on-teal"><div className="bdg-ico">💧</div><div className="bdg-name">Aqua Saver</div><div className="bdg-req">Harvest 5,000L rainwater</div><div className="bdg-status" style={{ background: "rgba(38,212,180,0.12)", color: "var(--teal)" }}>✓ Earned</div></div>
            <div className="bdg"><div className="bdg-ico lock">🌱</div><div className="bdg-name">Green Guardian</div><div className="bdg-req">Reduce 1 ton CO₂</div><div className="bdg-status" style={{ background: "var(--bg3)", color: "var(--text3)" }}>Locked</div></div>
            <div className="bdg"><div className="bdg-ico lock">⚡</div><div className="bdg-name">Energy Master</div><div className="bdg-req">30 days grid-free</div><div className="bdg-status" style={{ background: "var(--bg3)", color: "var(--text3)" }}>Locked</div></div>
            <div className="bdg"><div className="bdg-ico lock">🌍</div><div className="bdg-name">Eco Hero</div><div className="bdg-req">Reach 90+ eco score</div><div className="bdg-status" style={{ background: "var(--bg3)", color: "var(--text3)" }}>Locked</div></div>
          </div>
        </div>
      )}

      {/* ECO SCORE */}
      {tab === 'es' && (
        <div className="g2">
          <div className="card">
            <div className="sec-lbl">Score Radar</div>
            <div style={{ height: "300px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={RADAR_DATA}>
                  <PolarGrid stroke="rgba(74,200,80,0.1)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#8fbc92', fontSize: 11, fontFamily: 'Space Grotesk' }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="You" dataKey="A" stroke="#4ac850" fill="rgba(74,200,80,0.12)" fillOpacity={0.6} />
                  <Radar name="Avg User" dataKey="B" stroke="#26d4b4" fill="rgba(38,212,180,0.07)" fillOpacity={0.6} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', color: '#8fbc92', fontFamily: 'Space Grotesk' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div className="card" style={{ textAlign: "center", padding: "1.8rem", marginBottom: "12px" }}>
              <div style={{ fontSize: "5rem", fontWeight: 700, color: "var(--green)", lineHeight: 1, letterSpacing: "-3px" }}>78</div>
              <div style={{ fontSize: "0.65rem", color: "var(--text2)", marginTop: "6px", textTransform: "uppercase", letterSpacing: "1px" }}>Eco Score · March 2026</div>
              <div style={{ fontSize: "0.78rem", color: "var(--text2)", marginTop: "8px" }}>Top 15% in Rajasthan 🎉</div>
            </div>
            
            <div className="prog-row"><div className="prog-head"><span>☀️ Solar</span><span style={{ color: "var(--amber)" }}>88 / 100</span></div><div className="prog"><div className="prog-fill" style={{ width: "88%", background: "var(--amber)" }}></div></div></div>
            <div className="prog-row"><div className="prog-head"><span>💧 Water</span><span style={{ color: "var(--teal)" }}>74 / 100</span></div><div className="prog"><div className="prog-fill" style={{ width: "74%", background: "var(--teal)" }}></div></div></div>
            <div className="prog-row"><div className="prog-head"><span>🗑️ Waste</span><span style={{ color: "var(--green)" }}>70 / 100</span></div><div className="prog"><div className="prog-fill" style={{ width: "70%", background: "var(--green)" }}></div></div></div>
            <div className="prog-row"><div className="prog-head"><span>🌫️ Carbon</span><span style={{ color: "var(--coral)" }}>80 / 100</span></div><div className="prog"><div className="prog-fill" style={{ width: "80%", background: "var(--coral)" }}></div></div></div>
            <div className="prog-row"><div className="prog-head"><span>🤝 Community</span><span style={{ color: "var(--blue)" }}>65 / 100</span></div><div className="prog"><div className="prog-fill" style={{ width: "65%", background: "var(--blue)" }}></div></div></div>
            
            <button className="dl-btn">📥 Download Monthly Report</button>
          </div>
        </div>
      )}

      {/* CREATE COMMUNITY MODAL */}
      {showCreateMo && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#141c14] border border-[#rgba(74,200,80,0.28)] rounded-[20px] p-6 w-full max-w-sm">
            <h3 className="text-[1.05rem] font-bold mb-4">Create Community</h3>
            <input 
              type="text" 
              placeholder="Community Name" 
              value={newC}
              onChange={e => setNewC(e.target.value)}
              className="w-full bg-[#171e17] border border-[rgba(74,200,80,0.13)] rounded-lg p-3 text-white text-sm mb-4 focus:outline-none focus:border-[#4ac850]"
            />
            <div className="flex gap-2">
              <button onClick={() => setShowCreateMo(false)} className="flex-1 py-2 rounded-lg text-sm text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--bg3)]">Cancel</button>
              <button onClick={createComm} className="flex-1 py-2 rounded-lg text-sm bg-[var(--green)] text-[#0a0e0a] font-bold hover:bg-[#5cd662]">Create</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
