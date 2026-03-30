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
              style={{ appearance: "none", cursor: "pointer", textAlign: "center" }}
              value={language} 
              onChange={e => setLanguage(e.target.value)}
            >
              {languages.map(l => (
                <option key={l.code} value={l.code} style={{ background: "var(--bg2)", color: "#e8f5e9" }}>
                  🌐 {l.name}
                </option>
              ))}
            </select>
            <div className={`eco-pill ${menuOpen ? 'hidden md:flex' : ''}`}>
              <div className="live-dot" />
              2,840 pts
            </div>
            <Link href="/login" className={`btn-sm ${menuOpen ? 'hidden md:flex' : ''}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              {userName}
            </Link>
            
            {/* Mobile Hamburger Button */}
            <button 
              className="mobile-toggle-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
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
