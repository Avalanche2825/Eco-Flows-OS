"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/components/language-provider";
import { Globe } from "lucide-react";

export default function AuthPage({ initialTab = "login" }: { initialTab?: "login" | "signup" }) {
  const router = useRouter();
  const { t, language, setLanguage, languages } = useLanguage();
  const [activeTab, setActiveTab] = useState<"login" | "signup">(initialTab);
  const [profileType, setProfileType] = useState<"individual" | "community">("individual");
  const [showPwd, setShowPwd] = useState(false);

  // Login State
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Signup State
  const [suFname, setSuFname] = useState("");
  const [suLname, setSuLname] = useState("");
  const [suEmail, setSuEmail] = useState("");
  const [suPass, setSuPass] = useState("");
  const [suCity, setSuCity] = useState("");
  const [termsCb, setTermsCb] = useState(false);
  const [newsCb, setNewsCb] = useState(true);

  // Status
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Password strength
  const checkStrength = () => {
    let score = 0;
    if (suPass.length >= 8) score++;
    if (/[A-Z]/.test(suPass)) score++;
    if (/[0-9]/.test(suPass)) score++;
    if (/[^A-Za-z0-9]/.test(suPass)) score++;
    return score;
  };
  const score = checkStrength();
  const levels = [
    { w: "0%", col: "transparent", txt: "" },
    { w: "25%", col: "#ff6b6b", txt: "Weak" },
    { w: "50%", col: "#f5a623", txt: "Fair" },
    { w: "75%", col: "#fbbf24", txt: "Good" },
    { w: "100%", col: "#4ac850", txt: "Strong 🔒" },
  ];
  const strengthLevel = levels[score];

  const clearMessages = () => {
    setErrorMsg("");
    setSuccessMsg("");
  };

  const doLogin = () => {
    clearMessages();
    if (!loginEmail) { setErrorMsg("Please enter your email address."); return; }
    if (!loginEmail.includes("@")) { setErrorMsg("Please enter a valid email address."); return; }
    if (!loginPass) { setErrorMsg("Please enter your password."); return; }
    if (loginPass.length < 6) { setErrorMsg("Password must be at least 6 characters."); return; }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("eco-user", loginEmail.split('@')[0]);
      setSuccessMsg("Welcome back! Redirecting to your dashboard...");
      setTimeout(() => { window.location.href = "/"; }, 1500);
    }, 1400);
  };

  const doSignup = () => {
    clearMessages();
    if (!suFname || !suLname) { setErrorMsg("Please enter your full name."); return; }
    if (!suEmail || !suEmail.includes("@")) { setErrorMsg("Please enter a valid email address."); return; }
    if (suPass.length < 8) { setErrorMsg("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(suPass)) { setErrorMsg("Password must contain at least one uppercase letter."); return; }
    if (!termsCb) { setErrorMsg("Please accept the Terms of Service to continue."); return; }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem("eco-user", `${suFname} ${suLname.charAt(0)}.`);
      setSuccessMsg("Account created! Setting up your dashboard...");
      setTimeout(() => { window.location.href = "/"; }, 1800);
    }, 1600);
  };

  const socialLogin = (provider: string) => {
    setSuccessMsg(`Connecting to ${provider}...`);
    setTimeout(() => { router.push("/"); }, 1400);
  };

  const showForgot = () => {
    if (!loginEmail || !loginEmail.includes("@")) {
      setErrorMsg("Enter your email address first, then click Forgot password.");
      document.getElementById("login-email")?.focus();
      return;
    }
    setSuccessMsg(`Password reset link sent to ${loginEmail}! Check your inbox.`);
  };

  // Particles generator
  const [particles, setParticles] = useState<any[]>([]);
  useEffect(() => {
    const colors = ["rgba(74,200,80,", "rgba(38,212,180,", "rgba(245,166,35,"];
    const pts = [];
    for (let i = 0; i < 40; i++) {
      const size = 1.5 + Math.random() * 4;
      const col = colors[Math.floor(Math.random() * colors.length)];
      pts.push({
        id: i,
        size,
        left: `${Math.random() * 100}%`,
        bg: `${col}${0.2 + Math.random() * 0.4})`,
        dur: `${10 + Math.random() * 20}s`,
        del: `${Math.random() * 10}s`
      });
    }
    setParticles(pts);
  }, []);

  const customStyles: any = {
    "--bg": "#060e06", "--bg2": "#0a140a", "--bg3": "#0f1a0f", "--bg4": "#141f14",
    "--green": "#4ac850", "--teal": "#26d4b4", "--amber": "#f5a623", "--coral": "#ff6b6b",
    "--text": "#e8f5e9", "--text2": "#8fbc92", "--text3": "#3d6b41",
    "--border": "rgba(74,200,80,0.14)", "--border2": "rgba(74,200,80,0.3)", "--border3": "rgba(74,200,80,0.06)"
  };

  return (
    <div style={customStyles} className="auth-root">
      
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-root { background: var(--bg); color: var(--text); font-family: 'Space Grotesk', sans-serif; display: flex; min-height: 100vh; overflow: hidden; position: fixed; inset: 0; z-index: 1000; }
        .auth-root::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 20% 50%, rgba(74,200,80,0.08) 0%, transparent 60%), radial-gradient(ellipse 70% 70% at 80% 60%, rgba(38,212,180,0.06) 0%, transparent 55%); pointer-events: none; z-index: 0; }
        #particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; }
        .dot { position: absolute; border-radius: 50%; animation: floatDot linear infinite; opacity: 0; box-shadow: 0 0 10px currentColor; }
        @keyframes floatDot { 0% { transform: translateY(100vh) scale(0); opacity: 0; } 10% { opacity: 1; } 90% { opacity: .5; } 100% { transform: translateY(-30px) scale(1.2); opacity: 0; } }
        
        .left-panel { flex: 1.2; display: flex; flex-direction: column; justify-content: center; padding: 4rem 5rem; position: relative; z-index: 1; min-width: 0; }
        @media (max-width: 900px) { .left-panel { display: none; } }
        .brand { display: flex; align-items: center; gap: 14px; margin-bottom: 3.5rem; }
        .brand-box { width: 50px; height: 50px; background: linear-gradient(135deg, var(--green), var(--teal)); border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 26px; box-shadow: 0 8px 24px rgba(74,200,80,0.25); }
        .brand-name { font-size: 1.8rem; font-weight: 800; color: var(--green); letter-spacing: -0.5px; }
        .hero-title { font-size: 3.8rem; font-weight: 800; line-height: 1.05; letter-spacing: -1.5px; margin-bottom: 1.5rem; text-shadow: 0 10px 30px rgba(0,0,0,0.5); }
        .hero-title span { background: linear-gradient(135deg, var(--green), var(--teal)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; filter: drop-shadow(0 0 8px rgba(74,200,80,0.3)); }
        .hero-sub { font-size: 1.1rem; color: var(--text2); line-height: 1.6; max-width: 480px; margin-bottom: 3rem; }
        
        .feature-list { display: flex; flex-direction: column; gap: 18px; margin-bottom: 3.5rem; }
        .feat { display: flex; align-items: center; gap: 16px; background: rgba(10,20,10,0.3); border: 1px solid var(--border); border-radius: 16px; padding: 12px 18px; max-width: 500px; transition: all .3s; backdrop-filter: blur(10px); }
        .feat:hover { transform: translateX(5px); border-color: var(--border2); background: rgba(74,200,80,0.03); }
        .feat-icon { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .feat-text { font-size: 0.95rem; color: var(--text2); line-height: 1.4; }
        .feat-text strong { color: var(--text); display: block; font-size: 1rem; margin-bottom: 2px; }
        
        .stats-row { display: flex; gap: 24px; flex-wrap: wrap; background: rgba(10,20,10,0.4); border: 1px solid var(--border); border-radius: 20px; padding: 20px 28px; backdrop-filter: blur(10px); max-width: fit-content; }
        .stat-item { text-align: center; }
        .stat-num { font-size: 1.8rem; font-weight: 800; color: var(--green); letter-spacing: -0.8px; font-family: 'DM Mono', monospace; }
        .stat-label { font-size: 0.72rem; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; font-weight: 700; margin-top: 4px; }
        .divider-v { width: 1px; background: var(--border2); height: 50px; margin-top: 6px; }
        
        /* Language Selector Right Top */
        .lang-switch { position: absolute; top: 1.5rem; right: 2rem; z-index: 50; }
        .lang-btn { display: flex; align-items: center; gap: 8px; background: rgba(0,0,0,0.4); backdrop-filter: blur(12px); border: 1px solid var(--border2); padding: 8px 16px; border-radius: 30px; color: var(--text); font-size: 0.82rem; font-weight: 600; cursor: pointer; transition: all .2s; }
        .lang-btn:hover { border-color: var(--green); background: rgba(74,200,80,0.1); }
        .lang-dropdown { position: absolute; top: calc(100% + 8px); right: 0; width: 200px; background: rgba(10,15,10,0.9); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border: 1px solid var(--border2); border-radius: 16px; padding: 6px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); opacity: 0; visibility: hidden; transform: translateY(-10px); transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); max-height: 350px; overflow-y: auto; }
        .lang-switch:hover .lang-dropdown, .lang-dropdown:hover { opacity: 1; visibility: visible; transform: translateY(0); }
        .lang-dropdown::-webkit-scrollbar { width: 4px; }
        .lang-dropdown::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 4px; }
        .lang-opt { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: 10px 14px; border: none; background: transparent; color: var(--text2); font-family: inherit; font-size: 0.85rem; cursor: pointer; border-radius: 10px; transition: all .2s; text-align: left; }
        .lang-opt:hover { background: rgba(255,255,255,0.05); color: var(--text); }
        .lang-opt.active { background: rgba(74,200,80,0.15); color: var(--green); font-weight: 700; }
        
        .right-panel { width: 540px; flex-shrink: 0; background: rgba(6,10,6,0.6); backdrop-filter: blur(30px); -webkit-backdrop-filter: blur(30px); border-left: 1px solid var(--border2); display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 3rem; position: relative; z-index: 10; min-height: 100vh; overflow-y: auto; box-shadow: -20px 0 60px rgba(0,0,0,0.3); }
        @media (max-width: 900px) { .right-panel { width: 100%; border-left: none; padding: 2rem; background: transparent; backdrop-filter: none; } }
        
        .auth-box { width: 100%; max-width: 420px; background: var(--bg2); border: 1px solid var(--border2); border-radius: 24px; padding: 32px; box-shadow: 0 30px 60px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05); position: relative; }
        @media (max-width: 500px) { .auth-box { padding: 24px; border: none; background: transparent; box-shadow: none; max-width: 100%; } }
        
        .auth-logo { display: flex; align-items: center; gap: 10px; margin-bottom: 2rem; justify-content: center; display: none; }
        @media (max-width: 900px) { .auth-logo { display: flex; margin-bottom: 2.5rem; } }
        .auth-logo-box { width: 40px; height: 40px; background: linear-gradient(135deg, var(--green), var(--teal)); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 20px; box-shadow: 0 4px 15px rgba(74,200,80,0.3); }
        .auth-logo-name { font-size: 1.4rem; font-weight: 800; color: var(--green); letter-spacing: -0.5px; }
        
        .auth-toggle { display: flex; background: var(--bg4); border: 1px solid var(--border); border-radius: 16px; padding: 5px; margin-bottom: 2.5rem; gap: 5px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2); }
        .at-btn { flex: 1; padding: 10px; border: none; border-radius: 12px; font-family: inherit; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); color: var(--text2); background: transparent; }
        .at-btn:hover:not(.active) { color: var(--text); background: rgba(255,255,255,0.03); }
        .at-btn.active { background: var(--green); color: #060e06; box-shadow: 0 4px 14px rgba(74,200,80,0.3); }
        
        .form-title { font-size: 1.6rem; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
        .form-sub { font-size: 0.88rem; color: var(--text2); margin-bottom: 2rem; line-height: 1.6; }
        
        .form-group { margin-bottom: 18px; position: relative; }
        .form-label { font-size: 0.72rem; color: var(--text2); font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; display: block; }
        .form-input { background: var(--bg3); border: 1px solid var(--border2); border-radius: 12px; padding: 14px 16px; color: var(--text); font-family: inherit; font-size: 0.95rem; width: 100%; transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); outline: none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1); }
        .form-input:focus { border-color: var(--green); background: rgba(74,200,80,0.04); box-shadow: 0 0 0 4px rgba(74,200,80,0.1), inset 0 2px 4px rgba(0,0,0,0.1); transform: translateY(-1px); }
        .form-input::placeholder { color: var(--text3); }
        .form-input.has-icon { padding-left: 46px; }
        
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); font-size: 16px; color: var(--text3); margin-top: 11px; transition: color .3s; }
        .form-input:focus + .input-icon, .form-input:focus ~ .input-icon { color: var(--green); }
        
        .pass-toggle { position: absolute; right: 16px; top: 50%; transform: translateY(-50%); cursor: pointer; font-size: 13px; margin-top: 11px; background: none; border: none; color: var(--text2); font-weight: 600; padding: 4px; border-radius: 4px; transition: all .2s; }
        .pass-toggle:hover { color: var(--green); background: rgba(74,200,80,0.1); }
        
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        
        .profile-type { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 18px; }
        .pt-btn { background: var(--bg3); border: 2px solid var(--border); border-radius: 14px; padding: 14px 10px; cursor: pointer; text-align: center; transition: all .2s; font-family: inherit; }
        .pt-btn:hover { border-color: var(--border2); background: rgba(255,255,255,0.02); }
        .pt-btn.sel { border-color: var(--green); background: rgba(74,200,80,0.08); transform: translateY(-2px); box-shadow: 0 6px 16px rgba(74,200,80,0.15); }
        .pt-ico { font-size: 24px; margin-bottom: 6px; }
        .pt-nm { font-size: 12px; font-weight: 700; color: var(--text); }
        .pt-desc { font-size: 10px; color: var(--text2); margin-top: 3px; }
        
        .strength-bar { height: 4px; border-radius: 2px; background: var(--bg4); margin-top: 8px; overflow: hidden; }
        .strength-fill { height: 100%; border-radius: 2px; transition: all .4s cubic-bezier(0.16, 1, 0.3, 1); }
        .strength-lbl { font-size: 10px; margin-top: 5px; font-weight: 700; color: var(--text3); }
        
        .checkbox-row { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 20px; }
        .custom-cb { width: 20px; height: 20px; border: 2px solid var(--border2); border-radius: 6px; background: var(--bg3); cursor: pointer; flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; transition: all .2s; }
        .custom-cb.checked { background: var(--green); border-color: var(--green); }
        .custom-cb.checked::after { content: '✓'; font-size: 12px; color: #060e06; font-weight: 800; display: block; animation: scale-in .2s ease-out forwards; }
        @keyframes scale-in { from { transform: scale(0); } to { transform: scale(1); } }
        
        .cb-label { font-size: 0.82rem; color: var(--text2); line-height: 1.5; cursor: pointer; user-select: none; }
        .cb-label a { color: var(--green); text-decoration: none; font-weight: 600; }
        .cb-label a:hover { text-decoration: underline; }
        
        .submit-btn { width: 100%; background: linear-gradient(135deg, var(--green), #3baa41); color: #060e06; border: none; border-radius: 14px; padding: 16px; font-family: inherit; font-size: 1.05rem; font-weight: 800; cursor: pointer; transition: all .3s cubic-bezier(0.16, 1, 0.3, 1); letter-spacing: -0.2px; margin-bottom: 20px; min-height: 56px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(74,200,80,0.25); }
        .submit-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 28px rgba(74,200,80,0.35); filter: brightness(1.05); }
        .submit-btn:active { transform: translateY(0); box-shadow: 0 4px 10px rgba(74,200,80,0.2); }
        .submit-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; box-shadow: none; filter: grayscale(0.5); }
        
        .divider-h { display: flex; align-items: center; gap: 16px; margin: 20px 0; }
        .divider-h span { flex: 1; height: 1px; background: var(--border2); }
        .divider-h p { font-size: 11px; color: var(--text3); white-space: nowrap; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
        
        .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
        .social-btn { background: var(--bg3); border: 1px solid var(--border2); border-radius: 12px; padding: 12px; cursor: pointer; font-family: inherit; font-size: 0.88rem; font-weight: 700; color: var(--text2); display: flex; align-items: center; justify-content: center; gap: 8px; transition: all .2s; }
        .social-btn:hover { border-color: var(--green); color: var(--text); background: rgba(74,200,80,0.05); transform: translateY(-2px); box-shadow: 0 6px 15px rgba(0,0,0,0.2); }
        
        .forgot { font-size: 0.82rem; color: var(--text2); text-align: right; display: block; margin-top: -10px; margin-bottom: 18px; cursor: pointer; text-decoration: none; font-weight: 600; transition: color .2s; }
        .forgot:hover { color: var(--green); }
        
        .switch-text { text-align: center; font-size: 0.85rem; color: var(--text2); }
        .switch-text button { background: none; border: none; color: var(--green); font-weight: 800; cursor: pointer; font-family: inherit; font-size: 0.85rem; padding: 0; margin-left: 4px; transition: color .2s; }
        .switch-text button:hover { color: #5cd662; text-decoration: underline; }
        
        .error-msg { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); border-radius: 12px; padding: 12px 16px; font-size: 0.82rem; color: #ff9a9a; margin-bottom: 18px; display: flex; align-items: center; gap: 10px; font-weight: 500; animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both; box-shadow: 0 4px 12px rgba(255,107,107,0.15); }
        @keyframes shake { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(3px); } 30%, 50%, 70% { transform: translateX(-5px); } 40%, 60% { transform: translateX(5px); } }
        
        .success-msg { background: rgba(74,200,80,0.1); border: 1px solid rgba(74,200,80,0.3); border-radius: 12px; padding: 12px 16px; font-size: 0.82rem; color: var(--green); margin-bottom: 18px; display: flex; align-items: center; gap: 10px; font-weight: 500; box-shadow: 0 4px 12px rgba(74,200,80,0.15); }
        
        .loading-spinner { display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(6,14,6,0.3); border-top-color: #060e06; border-radius: 50%; animation: spin .7s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        
        .badge-new { background: rgba(245,166,35,0.15); border: 1px solid rgba(245,166,35,0.3); border-radius: 20px; padding: 3px 10px; font-size: 0.65rem; color: var(--amber); font-weight: 800; letter-spacing: 0.5px; display: inline-block; margin-left: 8px; vertical-align: middle; }
      ` }} />

      <div id="particles">
        {particles.map(p => (
          <div key={p.id} className="dot" style={{
            width: `${p.size}px`, height: `${p.size}px`,
            left: p.left, background: p.bg, color: p.bg,
            animationDuration: p.dur, animationDelay: p.del
          }} />
        ))}
      </div>

      <div className="left-panel">
        <div className="brand">
          <Link href="/" className="brand-box">🌿</Link>
          <div className="brand-name">{t("appName")}</div>
        </div>
        <h1 className="hero-title">Defend Earth.<br/>Track Your <span>Impact.</span></h1>
        <p className="hero-sub">Join 50,000+ eco-warriors using AI to reduce water usage, optimize solar energy, and fight pollution — one action at a time.</p>
        
        <div className="feature-list">
          <div className="feat">
            <div className="feat-icon" style={{ background: "rgba(245,166,35,0.12)" }}>☀️</div>
            <div className="feat-text"><strong>{t("hydroSolar")} Analyzer</strong>AI-powered solar & rainwater potential for your home</div>
          </div>
          <div className="feat">
            <div className="feat-icon" style={{ background: "rgba(38,212,180,0.12)" }}>💧</div>
            <div className="feat-text"><strong>Real-Time Monitoring</strong>Live water & energy tracking with smart alerts</div>
          </div>
          <div className="feat">
            <div className="feat-icon" style={{ background: "rgba(74,200,80,0.12)" }}>🏆</div>
            <div className="feat-text"><strong>Community Leaderboard</strong>Compete with 50K+ users and earn eco points</div>
          </div>
          <div className="feat">
            <div className="feat-icon" style={{ background: "rgba(255,107,107,0.12)" }}>🎮</div>
            <div className="feat-text"><strong>EcoGuardian Game</strong>Defend Earth from pollution in our eco tower-defense game</div>
          </div>
        </div>
        
        <div className="stats-row">
          <div className="stat-item"><div className="stat-num">50K+</div><div className="stat-label">Users</div></div>
          <div className="divider-v"></div>
          <div className="stat-item"><div className="stat-num">2.4M</div><div className="stat-label">Liters Saved</div></div>
          <div className="divider-v"></div>
          <div className="stat-item"><div className="stat-num">840T</div><div className="stat-label">CO₂ Reduced</div></div>
          <div className="divider-v"></div>
          <div className="stat-item"><div className="stat-num">₹12Cr</div><div className="stat-label">Saved</div></div>
        </div>
      </div>

      <div className="right-panel">
        {/* Language Switcher */}
        <div className="lang-switch">
          <button className="lang-btn">
            <Globe className="w-4 h-4" />
            <span>{languages.find((l: any) => l.code === language)?.code || language}</span>
          </button>
          <div className="lang-dropdown">
            {languages.map((l: any) => (
              <button 
                key={l.code} 
                className={`lang-opt ${language === l.code ? "active" : ""}`} 
                onClick={() => setLanguage(l.code)}>
                <span>{l.native}</span>
                <span style={{ opacity: 0.6, fontSize: "10px", textTransform: "uppercase" }}>{l.code}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="auth-box">
          <div className="auth-logo">
            <Link href="/" className="auth-logo-box">🌿</Link>
            <div className="auth-logo-name">{t("appName")}</div>
          </div>

          <div className="auth-toggle">
            <button className={`at-btn ${activeTab === "login" ? "active" : ""}`} onClick={() => { setActiveTab("login"); clearMessages(); }}>{t("login")}</button>
            <button className={`at-btn ${activeTab === "signup" ? "active" : ""}`} onClick={() => { setActiveTab("signup"); clearMessages(); }}>{t("signUp")}</button>
          </div>

          {errorMsg && <div className="error-msg">⚠ <span>{errorMsg}</span></div>}
          {successMsg && <div className="success-msg">✓ <span>{successMsg}</span></div>}

          {/* LOGIN FORM */}
          {activeTab === "login" && (
            <div>
              <div className="form-title">{t("welcome")} 🌿</div>
              <div className="form-sub">Sign in to your EcoFlows account to continue your sustainability journey.</div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon">📧</div>
                <input type="email" id="login-email" className="form-input has-icon" placeholder="you@example.com" 
                  value={loginEmail} onChange={(e) => { setLoginEmail(e.target.value); clearMessages(); }} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon">🔒</div>
                <input type={showPwd ? "text" : "password"} className="form-input has-icon" placeholder="Enter your password" 
                  value={loginPass} onChange={(e) => { setLoginPass(e.target.value); clearMessages(); }} 
                  onKeyDown={(e) => { if (e.key === 'Enter') doLogin(); }} />
                <button type="button" className="pass-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? "Hide" : "Show"}</button>
              </div>
              
              <button type="button" className="forgot" onClick={showForgot}>Forgot password?</button>
              
              <div className="checkbox-row">
                <div className={`custom-cb ${rememberMe ? "checked" : ""}`} onClick={() => setRememberMe(!rememberMe)}></div>
                <div className="cb-label" onClick={() => setRememberMe(!rememberMe)}>Remember me for 30 days</div>
              </div>
              
              <button disabled={isLoading} className="submit-btn" onClick={doLogin}>
                {isLoading ? <div className="loading-spinner"></div> : `${t("login")} to ${t("appName")}`}
              </button>
              
              <div className="divider-h"><span></span><p>or continue with</p><span></span></div>
              
              <div className="social-row">
                <button type="button" className="social-btn" onClick={() => socialLogin('Google')}><span style={{fontSize: "16px"}}>G</span>Google</button>
                <button type="button" className="social-btn" onClick={() => socialLogin('GitHub')}><span style={{fontSize: "16px"}}>⌥</span>GitHub</button>
              </div>
              
              <div className="switch-text">Don&apos;t have an account? <button onClick={() => { setActiveTab("signup"); clearMessages(); }}>Create one free</button></div>
            </div>
          )}

          {/* SIGNUP FORM */}
          {activeTab === "signup" && (
            <div>
              <div className="form-title">Join EcoFlows <span className="badge-new">FREE</span></div>
              <div className="form-sub">Create your account and start your eco journey today.</div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input type="text" className="form-input" placeholder="Ronak" 
                    value={suFname} onChange={(e) => { setSuFname(e.target.value); clearMessages(); }} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input type="text" className="form-input" placeholder="Jain" 
                    value={suLname} onChange={(e) => { setSuLname(e.target.value); clearMessages(); }} />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-icon">📧</div>
                <input type="email" className="form-input has-icon" placeholder="you@example.com" 
                  value={suEmail} onChange={(e) => { setSuEmail(e.target.value); clearMessages(); }} />
              </div>
              
              <div className="form-group">
                <label className="form-label">Password</label>
                <div className="input-icon">🔒</div>
                <input type={showPwd ? "text" : "password"} className="form-input has-icon" placeholder="Create a strong password" 
                  value={suPass} onChange={(e) => { setSuPass(e.target.value); clearMessages(); }} />
                <button type="button" className="pass-toggle" onClick={() => setShowPwd(!showPwd)}>{showPwd ? "Hide" : "Show"}</button>
                
                <div className="strength-bar">
                  <div className="strength-fill" style={{ width: strengthLevel.w, background: strengthLevel.col }}></div>
                </div>
                <div className="strength-lbl" style={{ color: score > 0 ? strengthLevel.col : "var(--text3)" }}>
                  {score > 0 ? strengthLevel.txt : ""}
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Profile Type</label>
                <div className="profile-type">
                  <div className={`pt-btn ${profileType === "individual" ? "sel" : ""}`} onClick={() => setProfileType("individual")}>
                    <div className="pt-ico">👤</div>
                    <div className="pt-nm">Individual</div>
                    <div className="pt-desc">Personal tracking</div>
                  </div>
                  <div className={`pt-btn ${profileType === "community" ? "sel" : ""}`} onClick={() => setProfileType("community")}>
                    <div className="pt-ico">🏘️</div>
                    <div className="pt-nm">Community</div>
                    <div className="pt-desc">Group challenges</div>
                  </div>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">{t("state")}</label>
                  <input type="text" className="form-input" placeholder="Rajasthan" />
                </div>
                <div className="form-group">
                  <label className="form-label">{t("city")}</label>
                  <div className="input-icon">📍</div>
                  <input type="text" className="form-input has-icon" placeholder="Jaipur" 
                    value={suCity} onChange={(e) => { setSuCity(e.target.value); clearMessages(); }} />
                </div>
              </div>
              
              <div className="checkbox-row">
                <div className={`custom-cb ${termsCb ? "checked" : ""}`} onClick={() => setTermsCb(!termsCb)}></div>
                <div className="cb-label" onClick={() => setTermsCb(!termsCb)}>I agree to the <Link href="#">Terms of Service</Link> and <Link href="#">Privacy Policy</Link></div>
              </div>
              
              <div className="checkbox-row" style={{ marginTop: "-8px" }}>
                <div className={`custom-cb ${newsCb ? "checked" : ""}`} onClick={() => setNewsCb(!newsCb)}></div>
                <div className="cb-label" onClick={() => setNewsCb(!newsCb)}>Send me weekly eco tips and sustainability news</div>
              </div>
              
              <button disabled={isLoading} className="submit-btn" onClick={doSignup}>
                {isLoading ? <div className="loading-spinner"></div> : "Create My Free Account 🌱"}
              </button>
              
              <div className="divider-h"><span></span><p>or continue with</p><span></span></div>
              
              <div className="social-row">
                <button type="button" className="social-btn" onClick={() => socialLogin('Google')}><span style={{fontSize: "16px"}}>G</span>Google</button>
                <button type="button" className="social-btn" onClick={() => socialLogin('GitHub')}><span style={{fontSize: "16px"}}>⌥</span>GitHub</button>
              </div>
              
              <div className="switch-text">Already have an account? <button onClick={() => { setActiveTab("login"); clearMessages(); }}>Sign in</button></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
