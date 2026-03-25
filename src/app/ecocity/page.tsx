"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import {
  Building2, Plus, Users, Trophy, Zap, ArrowRight, Clock, Leaf,
  LayoutDashboard, TrendingUp, Droplet, Sun, MapPin, Star,
} from "lucide-react";
import Link from "next/link";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let cur = 0;
    const step = Math.max(1, Math.floor(target / 50));
    const id = setInterval(() => {
      cur = Math.min(cur + step, target);
      setVal(cur);
      if (cur >= target) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [target]);
  return <span className="tabular-nums">{val.toLocaleString()}{suffix}</span>;
}

export default function EcoCityPage() {
  const { t } = useLanguage();

  const cityStats = [
    { label: "Population", value: 12400, suffix: "", icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Happiness", value: 87, suffix: "%", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50 dark:bg-yellow-900/20" },
    { label: "Green Energy", value: 72, suffix: "%", icon: Zap, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "CO₂ Reduced", value: 340, suffix: "kg", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  ];

  const buildings = [
    { emoji: "🏠", name: "Eco Homes", count: 45, level: 3 },
    { emoji: "🏭", name: "Solar Plant", count: 2, level: 5 },
    { emoji: "🌳", name: "Green Parks", count: 12, level: 4 },
    { emoji: "💧", name: "Water Tower", count: 3, level: 2 },
    { emoji: "🏥", name: "Eco Hospital", count: 1, level: 3 },
    { emoji: "🎓", name: "Green School", count: 4, level: 2 },
    { emoji: "♻️", name: "Recycling Hub", count: 6, level: 4 },
    { emoji: "🚉", name: "Metro Station", count: 3, level: 3 },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 animate-fade-up">
        <div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 text-xs font-semibold mb-3">
            🏙️ City Simulation
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{t("ecoCity")}</h1>
          <p className="text-gray-500 text-sm mt-1">Build India&apos;s greenest smart city simulation.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/10 border border-amber-200/60 dark:border-amber-800/30 px-4 py-2.5 rounded-2xl">
            <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Playtime Left</p>
            <p className="text-xl font-black text-amber-700 dark:text-amber-400 tabular-nums">45:20</p>
          </div>
        </div>
      </div>

      {/* City Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
        {cityStats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/40 p-4 shadow-sm card-hover animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-500">{s.label}</span>
              <div className={`p-1.5 rounded-lg ${s.bg}`}>
                <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white">
              <AnimatedCounter target={s.value} suffix={s.suffix} />
            </p>
          </div>
        ))}
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {/* Continue City */}
          <Link
            href="/ecocity"
            className="group relative bg-white dark:bg-gray-800/60 p-6 sm:p-8 rounded-2xl border border-gray-100 dark:border-gray-700/40 shadow-sm card-hover overflow-hidden flex flex-col justify-between min-h-[220px] sm:min-h-[260px] animate-fade-up"
            style={{ animationDelay: "100ms" }}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/20 mb-5">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">Continue City</h3>
              <p className="text-gray-500 text-sm">&quot;New Delhi Green&quot; · Level 12</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-green-600 dark:text-green-400 font-bold text-sm group-hover:gap-3 transition-all mt-4">
              Resume Simulation <ArrowRight className="h-4 w-4" />
            </div>
            <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500">
              <Building2 className="h-36 w-36 sm:h-48 sm:w-48" />
            </div>
          </Link>

          {/* New City */}
          <Link
            href="/ecocity"
            className="group relative bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 text-white p-6 sm:p-8 rounded-2xl shadow-lg card-hover overflow-hidden flex flex-col justify-between min-h-[220px] sm:min-h-[260px] animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 backdrop-blur-md text-white rounded-2xl flex items-center justify-center mb-5">
                <Plus className="h-5 w-5" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-1">Start New City</h3>
              <p className="text-gray-400 text-sm">₹1,00,000 starting grant.</p>
            </div>
            <div className="relative z-10 flex items-center gap-2 text-emerald-400 font-bold text-sm group-hover:gap-3 transition-all mt-4">
              Initialize Project <ArrowRight className="h-4 w-4" />
            </div>
            <div className="absolute top-0 right-0 p-6 opacity-[0.04] group-hover:opacity-[0.08] group-hover:scale-110 transition-all duration-500">
              <Plus className="h-36 w-36 sm:h-48 sm:w-48" />
            </div>
          </Link>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4 sm:space-y-5">
          {/* Leaderboard */}
          <div className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/40 rounded-2xl p-5 shadow-sm animate-fade-up" style={{ animationDelay: "250ms" }}>
            <h3 className="font-bold text-sm flex items-center gap-2 mb-4 text-gray-900 dark:text-white">
              <Trophy className="text-yellow-500 h-4 w-4" />
              Global Leaderboard
            </h3>
            <div className="space-y-3">
              {[
                { name: "Green Bengaluru", score: 980, rank: 1 },
                { name: "Solar Mumbai", score: 945, rank: 2 },
                { name: "Eco Delhi", score: 910, rank: 3 },
              ].map((city) => (
                <div key={city.rank} className="flex items-center gap-3 group">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${
                    city.rank === 1 ? "bg-yellow-100 text-yellow-700" :
                    city.rank === 2 ? "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300" :
                    "bg-orange-100 text-orange-600"
                  }`}>{city.rank}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{city.name}</p>
                    <div className="h-1 w-full bg-gray-100 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-700" style={{ width: `${city.score / 10}%` }} />
                    </div>
                  </div>
                  <span className="text-green-600 dark:text-green-400 font-bold text-xs">{city.score}</span>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2.5 text-[10px] font-bold text-gray-500 hover:text-green-600 transition-colors uppercase tracking-widest border-t border-gray-100 dark:border-gray-700">
              View All Rankings
            </button>
          </div>

          {/* Daily Goal */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border border-green-200/60 dark:border-green-800/30 rounded-2xl p-5 animate-fade-up" style={{ animationDelay: "320ms" }}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-800/30 flex items-center justify-center">
                <Clock className="text-green-600 h-4 w-4" />
              </div>
              <h3 className="font-bold text-sm text-green-800 dark:text-green-400">Daily Goal</h3>
            </div>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">Build 3 structures today to earn <strong>50 EcoPoints</strong>.</p>
            <div className="h-2 bg-green-100 dark:bg-green-800/30 rounded-full overflow-hidden mb-2">
              <div className="h-full w-[33%] bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
            </div>
            <div className="flex justify-between text-[10px] font-bold text-green-600">
              <span>PROGRESS 1/3</span>
              <span>33%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Building Grid */}
      <div className="animate-fade-up" style={{ animationDelay: "400ms" }}>
        <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-indigo-500" /> Your Buildings
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">{buildings.reduce((a, b) => a + b.count, 0)} total</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 stagger-children">
          {buildings.map((b, i) => (
            <div key={i} className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/40 p-4 shadow-sm card-hover text-center animate-fade-up"
              style={{ animationDelay: `${450 + i * 60}ms` }}
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center text-2xl mx-auto mb-2">
                {b.emoji}
              </div>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{b.name}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">×{b.count} · Lvl {b.level}</p>
              <div className="flex gap-0.5 justify-center mt-2">
                {Array.from({ length: 5 }, (_, j) => (
                  <div key={j} className={`w-1.5 h-1.5 rounded-full ${j < b.level ? "bg-green-500" : "bg-gray-200 dark:bg-gray-600"}`} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
