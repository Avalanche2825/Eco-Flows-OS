"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/components/language-provider";
import { 
  Building2, 
  Sun, 
  Droplet, 
  Leaf, 
  Zap, 
  Home, 
  Factory, 
  Trees, 
  Wind,
  IndianRupee,
  Users,
  TrendingUp,
  Clock,
  ArrowLeft,
  Settings,
  X,
  Plus
} from "lucide-react";
import Link from "next/link";

const STR_TYPES = [
  { id: 'solar', name: "Solar Farm", cost: 12000, revenue: 800, eco: 15, buildTime: 10, icon: Sun, cate: 'energy' },
  { id: 'water', name: "Rain Harvester", cost: 8000, revenue: 400, eco: 10, buildTime: 8, icon: Droplet, cate: 'water' },
  { id: 'res1', name: "Eco Apartments", cost: 15000, revenue: 1200, eco: 5, buildTime: 15, icon: Home, cate: 'housing' },
  { id: 'park', name: "Central Park", cost: 5000, revenue: 0, eco: 20, buildTime: 5, icon: Trees, cate: 'green' },
  { id: 'wind', name: "Wind Turbine", cost: 20000, revenue: 1500, eco: 25, buildTime: 20, icon: Wind, cate: 'energy' },
];

export default function CityBuilderPage() {
  const { t } = useLanguage();
  const [city, setCity] = useState({
    name: "New Delhi Green",
    money: 85200,
    population: 2450,
    ecoScore: 84,
    level: 12,
    structures: [] as any[],
    queue: [] as any[]
  });

  const [activeTab, setActiveTab] = useState('all');

  // Game Loop
  useEffect(() => {
    const timer = setInterval(() => {
      setCity(prev => {
        const revenue = prev.structures.reduce((sum, s) => sum + s.revenue, 0) / 60; // per second approx
        
        // Handle Queue
        const newQueue = prev.queue.map(item => ({ ...item, remaining: Math.max(0, item.remaining - 1) }));
        const finished = newQueue.filter(item => item.remaining === 0);
        const pending = newQueue.filter(item => item.remaining > 0);
        
        return {
          ...prev,
          money: prev.money + revenue,
          structures: [...prev.structures, ...finished.map(f => f.structure)],
          queue: pending
        };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const build = (strId: string) => {
    const str = STR_TYPES.find(s => s.id === strId);
    if (str && city.money >= str.cost) {
      setCity({
        ...city,
        money: city.money - str.cost,
        queue: [...city.queue, { structure: str, remaining: str.buildTime, total: str.buildTime }]
      });
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6">
      {/* City Stats Header */}
      <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[32px] p-6 shadow-sm flex flex-wrap items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <Link href="/ecocity" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-xl font-black">{city.name}</h1>
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest">LEVEL {city.level} ARCHITECT</p>
          </div>
        </div>

        <div className="flex gap-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl">
              <IndianRupee size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Treasury</p>
              <p className="text-lg font-black">₹{Math.floor(city.money).toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 text-blue-600 rounded-xl">
              <Users size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Population</p>
              <p className="text-lg font-black">{city.population.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 dark:bg-amber-500/10 text-amber-600 rounded-xl">
              <TrendingUp size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase">Eco Score</p>
              <p className="text-lg font-black text-emerald-600">{city.ecoScore}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button title="Settings" className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl hover:bg-zinc-200 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Build Menu */}
        <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[32px] p-6 shadow-sm flex flex-col min-h-0">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <Building2 className="text-emerald-600" size={20} />
            Build Structures
          </h2>
          
          <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
            {['all', 'energy', 'water', 'housing', 'green'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all whitespace-nowrap ${
                  activeTab === t ? 'bg-emerald-600 text-white' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-4">
            {STR_TYPES.filter(s => activeTab === 'all' || s.cate === activeTab).map((str) => (
              <button 
                key={str.id}
                onClick={() => build(str.id)}
                disabled={city.money < str.cost}
                className="w-full p-4 rounded-2xl border dark:border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all text-left flex items-center gap-4 group disabled:opacity-50"
              >
                <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <str.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm">{str.name}</p>
                  <p className="text-[10px] text-emerald-600 font-black">₹{str.cost.toLocaleString()}</p>
                </div>
                <Plus size={16} className="text-zinc-300" />
              </button>
            ))}
          </div>
        </div>

        {/* Game Canvas (Simplified Grid) */}
        <div className="lg:col-span-2 bg-zinc-50 dark:bg-zinc-950 rounded-[40px] border-4 border-white dark:border-zinc-900 shadow-inner relative overflow-hidden group">
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-10 p-4 gap-2">
            {Array.from({ length: 100 }).map((_, i) => {
              const str = city.structures[i];
              return (
                <div key={i} className="bg-white/50 dark:bg-zinc-900/50 rounded-lg border border-zinc-200/20 dark:border-zinc-800/20 flex items-center justify-center transition-all hover:bg-emerald-500/10">
                  {str && (
                    <div className="animate-in zoom-in-50 duration-300">
                      <str.icon size={20} className="text-emerald-600" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl text-[10px] font-black text-white uppercase tracking-widest shadow-2xl">
            Simulating Environment...
          </div>
        </div>

        {/* Build Queue & Insights */}
        <div className="space-y-6 flex flex-col min-h-0">
          <div className="bg-zinc-900 rounded-[32px] p-6 text-white flex-1 overflow-hidden flex flex-col">
            <h3 className="font-bold mb-6 flex items-center gap-2">
              <Clock size={20} className="text-emerald-400" />
              Build Queue
            </h3>
            
            <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
              {city.queue.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <Building2 size={48} className="mb-2" />
                  <p className="text-xs font-bold uppercase tracking-wider">Queue Empty</p>
                </div>
              ) : (
                city.queue.map((item, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold">{item.structure.name}</span>
                      <span className="text-[10px] font-black text-emerald-400">{item.remaining}s</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-1000" 
                        style={{ width: `${((item.total - item.remaining) / item.total) * 100}%` }} 
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-[32px] p-6 shadow-sm">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Trees className="text-emerald-600" size={20} />
              Sustainability
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-500">Solar Gen</span>
                <span>{city.structures.filter(s => s.id === 'solar').length * 800} kWh</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-zinc-500">Water Saved</span>
                <span>{city.structures.filter(s => s.id === 'water').length * 400} L</span>
              </div>
              <div className="h-1 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full mt-2">
                <div className="h-full bg-emerald-500 w-[84%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
