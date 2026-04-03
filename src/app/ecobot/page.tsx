"use client";

import React, { useState, useRef, useEffect } from "react";

const RESPONSES: Record<string, string> = {
  bill: 'Based on your usage data, here are your top 3 actions:\n\n1. 🕙 Shift AC, dishwasher & washing machine to after 10 PM — saves ₹45/day on peak tariffs.\n\n2. ☀️ Your solar offsets 62% of grid draw. Clean panels monthly for 10% boost.\n\n3. 💡 Replace your 4 remaining incandescent bulbs with LEDs — saves ₹18/month.\n\n💰 Total potential saving: ~₹1,800/month!',
  water: 'Your water efficiency score is 74/100. Top improvements:\n\n1. 🚿 Low-flow showerhead → saves 12L/shower\n2. 🌧️ Your roof can harvest 510 m³ rainwater/year\n3. 🚰 Minor leak in Zone B detected → fix to save 8L/day\n4. 🌿 Drip irrigation → 40% less garden water\n\n📊 Potential: 4,200L saved per month!',
  solar: 'For your 80m² rooftop in Jaipur:\n\n☀️ Estimated output: 1,440 kWh/year\n💰 Annual savings: ₹13,680\n🔧 System cost (6kW): ~₹3.6 lakhs\n📅 Payback: ~4.5 years\n\nWith Rajasthan\'s 30% solar subsidy, payback drops to 3.2 years. You\'d earn back ₹27.3 lakhs over 25 years! 🎯',
  appliance: 'Based on Jaipur\'s grid, here\'s your optimal schedule:\n\n🌅 Morning 6–9 AM: Coffee maker, toaster (solar starting)\n☀️ Midday 11 AM–2 PM: Washing machine, dishwasher (peak solar)\n🌙 After 10 PM: Off-peak rates — run AC at 25°C, avoid heavy loads\n\n💵 This scheduling saves you ~₹62/day on your energy bill!',
  points: 'Here\'s how to maximize eco points today:\n\n📅 Daily check-in: +5 pts (claim now!)\n💧 Save 100L water: +10 pts\n⚡ Save 10 kWh: +5 pts\n⚔️ Join Water Conservation challenge: +250 pts on completion\n\nYou\'re at 2,840 pts. Just 1,160 more to reach Silver tier and unlock exclusive discounts! 🚀',
  challenge: 'I recommend these challenges based on your current stats:\n\n🥇 Water Conservation Challenge (72% done!) — you\'re almost there, finish it for +250 pts\n☀️ Solar Energy Marathon — you\'re generating well, join for +400 pts\n\nAvoid the Zero Waste challenge for now — your waste score needs improvement first. Focus on the water one today! 💪',
};

const DEFAULTS = [
  'Your eco score of 78/100 puts you in the top 15% of Jaipur users. 🎉\n\nFocus on Water (74) to push past 80. Install a low-flow showerhead this week — that alone could add 3 points!',
  'Great question! You\'ve saved 12,480L of water and generated 847 kWh solar this month. Keep it up — you\'re on track to unlock the Green Guardian badge! 🌱'
];

function getR(t: string) {
  const l = t.toLowerCase();
  if(l.includes('bill')||l.includes('electr')||l.includes('energy')) return RESPONSES.bill;
  if(l.includes('water')) return RESPONSES.water;
  if(l.includes('solar')||l.includes('roi')||l.includes('panel')) return RESPONSES.solar;
  if(l.includes('appliance')||l.includes('timing')||l.includes('when')) return RESPONSES.appliance;
  if(l.includes('point')||l.includes('earn')) return RESPONSES.points;
  if(l.includes('challenge')) return RESPONSES.challenge;
  return DEFAULTS[Math.floor(Math.random() * DEFAULTS.length)];
}

function now() {
  return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'});
}

type Msg = { id: number, text: string, time: string, isBot: boolean, isTyping?: boolean };

export default function EcoBotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 1, text: "🌿 Hi Ronak! I'm EcoBot, your personal sustainability AI.\n\nYour eco score is 78/100 — top 15% in Rajasthan! 🎉\n\nI've analyzed your March 2026 data. You've saved 12,480L of water and generated 847 kWh solar this month.\n\nHow can I help you save more today?", time: now(), isBot: true }
  ]);
  const [inp, setInp] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const sq = (txt: string) => {
    if(!txt.trim()) return;
    const uMsg: Msg = { id: Date.now(), text: txt, time: now(), isBot: false };
    const tMsg: Msg = { id: Date.now()+1, text: "", time: "", isBot: true, isTyping: true };
    setMsgs(prev => [...prev, uMsg, tMsg]);
    
    setTimeout(() => {
      setMsgs(prev => {
        const p = [...prev];
        p.pop(); // remove typing
        p.push({ id: Date.now()+2, text: getR(txt), time: now(), isBot: true });
        return p;
      });
    }, 900 + Math.random() * 700);
  };

  const submit = () => {
    sq(inp);
    setInp("");
  };

  return (
    <div className="app-body" style={{ height: "calc(100vh - 120px)", marginTop: "-20px" }}>
      {/* LEFT */}
      <div className="left-panel rounded-l-2xl">
        <div className="bot-profile">
          <div className="bot-av">🌿</div>
          <div className="bot-name-big">EcoBot AI</div>
          <div className="bot-status"><div className="online-dot"></div>Online · Sustainability Expert</div>
        </div>
        <div className="stat-mini">
          <div className="stat-mini-title">Your Stats</div>
          <div className="stat-mini-row"><span style={{ color: "var(--text2)" }}>Eco Score</span><span className="stat-mini-val" style={{ color: "var(--green)" }}>78/100</span></div>
          <div className="stat-mini-row"><span style={{ color: "var(--text2)" }}>Points</span><span className="stat-mini-val" style={{ color: "var(--green)" }}>2,840</span></div>
          <div className="stat-mini-row"><span style={{ color: "var(--text2)" }}>Water saved</span><span className="stat-mini-val" style={{ color: "var(--teal)" }}>12,480L</span></div>
          <div className="stat-mini-row"><span style={{ color: "var(--text2)" }}>Solar gen.</span><span className="stat-mini-val" style={{ color: "var(--amber)" }}>847 kWh</span></div>
          <div className="stat-mini-row"><span style={{ color: "var(--text2)" }}>Your rank</span><span className="stat-mini-val">#7</span></div>
        </div>
        <div>
          <div className="rp-title">Browse Topics</div>
          <button className="topic-btn" onClick={() => sq('How can I reduce my electricity bill?')}>⚡ Energy Savings</button>
          <button className="topic-btn" onClick={() => sq('How can I save more water at home?')}>💧 Water Tips</button>
          <button className="topic-btn" onClick={() => sq('Calculate my solar panel ROI for 80m² roof')}>☀️ Solar ROI</button>
          <button className="topic-btn" onClick={() => sq('When is the best time to run appliances?')}>🕐 Scheduling</button>
          <button className="topic-btn" onClick={() => sq('How do I earn more eco points today?')}>🏆 Earn Points</button>
          <button className="topic-btn" onClick={() => sq('What challenges should I join?')}>⚔️ Challenges</button>
        </div>
      </div>

      {/* CHAT */}
      <div className="chat-area">
        <div className="chat-header">
          <div className="chat-bot-av">🌿</div>
          <div>
            <div className="chat-bot-nm">EcoBot AI</div>
            <div className="chat-bot-st">● Online · Powered by EcoFlows AI Engine</div>
          </div>
        </div>
        <div className="msgs">
          {msgs.map(m => (
            <div key={m.id} className={`msg ${m.isBot ? 'b' : 'u'}`}>
              <div className="bubble">
                {m.isTyping ? (
                  <div className="typ"><div className="td"/><div className="td"/><div className="td"/></div>
                ) : (
                  m.text
                )}
              </div>
              {!m.isTyping && <div className="msg-t">{m.time}</div>}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <div className="quick-btns">
          <button className="qb" onClick={() => sq('How can I reduce my electricity bill?')}>⚡ Reduce bill</button>
          <button className="qb" onClick={() => sq('When is the best time to run appliances?')}>🕐 Best timing</button>
          <button className="qb" onClick={() => sq('Calculate my solar panel ROI')}>☀️ Solar ROI</button>
          <button className="qb" onClick={() => sq('How can I save more water?')}>💧 Save water</button>
          <button className="qb" onClick={() => sq('How do I earn more eco points today?')}>🏆 Earn points</button>
        </div>
        <div className="input-row z-10">
          <input type="text" className="chat-in" value={inp} onChange={e => setInp(e.target.value)} placeholder="Ask me anything about sustainability..." onKeyDown={e => e.key === 'Enter' && submit()} />
          <button className="send-btn" onClick={submit}>➤</button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="right-panel rounded-r-2xl">
        <div>
          <div className="pts-mini">
            <div className="pts-mini-n">2,840</div>
            <div className="pts-mini-l">eco points balance</div>
          </div>
        </div>
        <div>
          <div className="rp-title">Quick Tips</div>
          <div className="tip-card">
            <div className="tip-t" style={{ color: "var(--teal)" }}>💧 Save 12L today</div>
            <div className="tip-b">Install a low-flow showerhead — no pressure loss, instant savings.</div>
          </div>
          <div className="tip-card">
            <div className="tip-t" style={{ color: "var(--amber)" }}>☀️ Solar Peak</div>
            <div className="tip-b">11 AM – 2 PM is your highest generation window. Run heavy appliances now.</div>
          </div>
          <div className="tip-card">
            <div className="tip-t" style={{ color: "var(--green)" }}>⚡ Off-peak Hours</div>
            <div className="tip-b">After 10 PM rates are 35% cheaper. Schedule your dishwasher & washing machine.</div>
          </div>
          <div className="tip-card">
            <div className="tip-t" style={{ color: "var(--coral)" }}>🌡️ AC Tip</div>
            <div className="tip-b">Set AC to 24°C instead of 22°C — saves 18% electricity with no comfort loss.</div>
          </div>
        </div>
        <div>
          <div className="rp-title">Active Challenge</div>
          <div className="tip-card" style={{ borderColor: "rgba(74,200,80,0.25)" }}>
            <div className="tip-t" style={{ color: "var(--green)" }}>💧 Water Conservation</div>
            <div className="tip-b" style={{ marginBottom: "8px" }}>Save 500L this week · 72% done</div>
            <div style={{ background: "var(--bg4)", borderRadius: "3px", height: "4px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "72%", background: "linear-gradient(90deg,var(--green),var(--teal))", borderRadius: "3px" }}></div>
            </div>
            <div style={{ fontSize: "0.65rem", color: "var(--text3)", marginTop: "5px" }}>342 participants · +250 pts</div>
          </div>
        </div>
      </div>
    </div>
  );
}
