"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage, languages, t } = useLanguage();
  const [userName, setUserName] = useState("Aarav S.");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("eco-user");
    if (user) setUserName(user);
  }, []);

  const links = [
    { name: t("dashboard"), href: "/" },
    { name: "☀️ " + t("hydroSolar"), href: "/hydrosolar" },
    { name: "💧 " + t("aquaEnergy"), href: "/aqua-energy" },
    { name: "🏆 " + t("greenGrid"), href: "/greengrid" },
    { name: "🛒 " + t("ecoStore"), href: "/store" },
    { name: "🤖 " + t("aiBot"), href: "/ecobot" },
    { name: "🛡️ " + t("ecoGuardian"), href: "/ecoguardian" },
  ];

  return (
    <>
      <nav>
        <div className="nav-in">
          <Link href="/" className="logo">
            <div className="logo-box">🌿</div>{t("appName")}
          </Link>
          


          <div className="nav-r">
            <select 
              className="nl" 
              style={{ appearance: "none", cursor: "pointer", textAlign: "center", fontSize: "0.75rem" }}
              value={language} 
              onChange={e => setLanguage(e.target.value)}
            >
              {languages.map(l => (
                <option key={l.code} value={l.code} style={{ background: "var(--bg2)", color: "#e8f5e9" }}>
                  🌐 {l.name.split(' ')[0]}
                </option>
              ))}
            </select>
            <div className="hidden lg:flex eco-pill">
              <div className="live-dot" />
              2,840 pts
            </div>
            <Link href="/login" className="hidden lg:flex btn-sm" style={{ textDecoration: 'none' }}>
              {userName}
            </Link>
            
            <button 
              className="mobile-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              style={{ display: "flex" }} 
            >
              <span className="lg:hidden">{menuOpen ? '✕' : '☰'}</span>
              <span className="hidden lg:hidden">☰</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <div className="lg:hidden p-4 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--green)] to-[var(--teal)] flex items-center justify-center font-bold text-xs text-black">
              {userName.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-sm font-semibold">{userName}</div>
          </div>
          <div className="eco-pill text-[10px] py-1 px-2">
            <div className="live-dot w-1.5 h-1.5" />
            2,840 pts
          </div>
        </div>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`mobile-nl ${pathname === link.href ? "active" : ""}`}
            onClick={() => setMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </>
  );
}
