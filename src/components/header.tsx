"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

export function Header() {
  const pathname = usePathname();
  const { language, setLanguage, languages } = useLanguage();
  const [userName, setUserName] = useState("Aarav S.");

  useEffect(() => {
    const user = localStorage.getItem("eco-user");
    if (user) setUserName(user);
  }, []);

  const links = [
    { name: "Dashboard", href: "/" },
    { name: "☀️ HydroSolar", href: "/hydrosolar" },
    { name: "💧 Aqua-Energy", href: "/aqua-energy" },
    { name: "🏆 GreenGrid", href: "/greengrid" },
    { name: "🛒 Eco Store", href: "/store" },
    { name: "🤖 AI Bot", href: "/ecobot" },
    { name: "🛡️ EcoGuardian", href: "/ecoguardian" },
  ];

  return (
    <nav>
      <div className="nav-in">
        <Link href="/" className="logo">
          <div className="logo-box">🌿</div>EcoFlows OS
        </Link>
        
        <div className="nav-links hidden xl:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`nl ${pathname === link.href ? "active" : ""}`}
            >
              {link.name}
            </Link>
          ))}
        </div>

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
          <div className="eco-pill">
            <div className="live-dot" />
            2,840 pts
          </div>
          <Link href="/login" className="btn-sm" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            {userName}
          </Link>
        </div>
      </div>
    </nav>
  );
}
