"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "./language-provider";
import {
  LayoutDashboard,
  Droplet,
  Zap,
  Users,
  ShoppingBag,
  Building2,
  Bot,
  Sun,
  Leaf,
  TrendingUp,
} from "lucide-react";

export function Sidebar() {
  const { t } = useLanguage();
  const pathname = usePathname();

  const navItems = [
    { name: t("dashboard"), icon: LayoutDashboard, href: "/" },
    { name: t("hydroSolar"), icon: Sun, href: "/hydrosolar" },
    { name: t("aquaEnergy"), icon: Droplet, href: "/aqua-energy" },
    { name: t("greenGrid"), icon: Users, href: "/greengrid" },
    { name: t("ecoStore"), icon: ShoppingBag, href: "/store" },
    { name: "AI Eco Bot", icon: Bot, href: "/ecobot", badge: "AI" },
    { name: t("ecoCity"), icon: Building2, href: "/ecocity" },
  ];

  return (
    <aside className="fixed left-0 top-14 sm:top-16 z-30 h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-64 border-r border-gray-200/60 dark:border-gray-700/40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl hidden lg:flex flex-col transition-all duration-300">
      <div className="flex flex-col h-full py-5 px-3">
        {/* Nav Label */}
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-3">Navigation</p>

        <nav className="space-y-0.5">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                  ${active
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/20 text-green-700 dark:text-green-400 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"}
                `}
              >
                {/* Active indicator bar */}
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                )}
                <item.icon className={`w-[18px] h-[18px] flex-shrink-0 transition-colors ${active ? "text-green-600 dark:text-green-400" : "group-hover:text-green-600 dark:group-hover:text-green-400"}`} />
                <span className="truncate">{item.name}</span>
                {item.badge && (
                  <span className="ml-auto text-[9px] font-black bg-gradient-to-r from-green-500 to-emerald-500 text-white px-1.5 py-0.5 rounded-md shadow-sm">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto pt-4 space-y-3">
          {/* Eco Score Mini Card */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200/60 dark:border-green-800/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-800/40 flex items-center justify-center">
                <Leaf className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-[10px] font-bold text-green-600 dark:text-green-400 uppercase tracking-widest">
                Your EcoStatus
              </p>
            </div>
            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">EcoPoints</span>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">1,240</span>
            </div>
            <div className="h-1.5 bg-green-100 dark:bg-green-800/30 rounded-full overflow-hidden">
              <div className="h-full w-[65%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-1000" />
            </div>
            <div className="flex justify-between mt-1.5">
              <p className="text-[10px] text-green-600/70 font-semibold">Top 5%</p>
              <p className="text-[10px] text-green-600/70 font-semibold">1,450 to Elite</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex gap-2">
            <div className="flex-1 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2.5 text-center">
              <Droplet className="h-3.5 w-3.5 text-blue-500 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-blue-700 dark:text-blue-400">2,450L</p>
              <p className="text-[8px] text-blue-500">Saved</p>
            </div>
            <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl p-2.5 text-center">
              <Zap className="h-3.5 w-3.5 text-yellow-500 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-yellow-700 dark:text-yellow-400">345kW</p>
              <p className="text-[8px] text-yellow-500">Solar</p>
            </div>
            <div className="flex-1 bg-green-50 dark:bg-green-900/20 rounded-xl p-2.5 text-center">
              <TrendingUp className="h-3.5 w-3.5 text-green-500 mx-auto mb-1" />
              <p className="text-[10px] font-bold text-green-700 dark:text-green-400">+12%</p>
              <p className="text-[8px] text-green-500">Growth</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
