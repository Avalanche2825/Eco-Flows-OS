"use client";

import React, { useEffect, useRef } from "react";
import { useLanguage } from "@/components/language-provider";

export default function EcoGuardianPage() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const canvas = document.getElementById('gc') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d');
    const cw_el = document.getElementById('cw');
    if (!ctx || !cw_el) return;

    function resize(){
      const r = cw_el!.getBoundingClientRect();
      canvas.width = Math.max(r.width||500,300);
      canvas.height = 530;
      cw_el!.style.height = '530px';
    }
    resize();
    
    const onResize = () => { resize(); if(G.running) drawBG(); };
    window.addEventListener('resize', onResize);

    // ── TIME LIMIT ──
    const DAILY_LIMIT = 3600;
    function getTodayKey() { return 'eco_'+new Date().toDateString(); }
    function getPlayed() { return parseInt(localStorage.getItem(getTodayKey())||'0'); }
    function savePlayed(s: number) { localStorage.setItem(getTodayKey(), s.toString()); }

    let sessionStart: number | null = null, sesInterval: NodeJS.Timeout | null = null;

    function checkTimeGate(){
      const played = getPlayed();
      if(played >= DAILY_LIMIT) { showTimeGate(played); return false; }
      return true;
    }

    function showTimeGate(played: number){
      const el = document.getElementById('time-gate');
      if (el) el.classList.add('show');
      updateCountdown();
      setInterval(updateCountdown, 1000);
    }

    function updateCountdown(){
      const now = new Date();
      const midnight = new Date(now); midnight.setHours(24,0,0,0);
      const diff = Math.floor((midnight.getTime() - now.getTime()) / 1000);
      const h = String(Math.floor(diff / 3600)).padStart(2, '0');
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
      const s = String(diff % 60).padStart(2, '0');
      const ct = document.getElementById('tg-countdown');
      if(ct) ct.textContent = `${h}:${m}:${s}`;
    }

    function startSessionTimer(){
      sessionStart = Date.now();
      sesInterval = setInterval(()=>{
        if(!sessionStart) return;
        const totalPlayed = getPlayed() + Math.floor((Date.now() - sessionStart) / 1000);
        const remaining = Math.max(0, DAILY_LIMIT - totalPlayed);
        const pct = Math.min(100, (totalPlayed / DAILY_LIMIT) * 100);
        const sf = document.getElementById('ses-fill');
        if(sf) {
          sf.style.width = pct + '%';
          sf.style.background = remaining > 600 ? 'linear-gradient(90deg,#4ac850,#26d4b4)' : remaining > 300 ? 'linear-gradient(90deg,#f5a623,#e8902a)' : 'linear-gradient(90deg,#ff6b6b,#cc0000)';
        }
        const mins = Math.floor(remaining / 60), secs = remaining % 60;
        const st = document.getElementById('ses-time');
        if(st) {
          st.textContent = mins + ':' + (secs < 10 ? '0' : '') + secs;
          st.style.color = remaining > 600 ? 'var(--g)' : remaining > 300 ? 'var(--a)' : 'var(--c)';
        }
        if(remaining <= 0) { timeUp(); }
        if(remaining === 300) showToast('Only 5 minutes of playtime left today!');
        if(remaining === 60) showToast('1 minute left! Finish strong!');
      }, 1000);
    }

    function stopSessionTimer(){
      if(sessionStart){
        const elapsed = Math.floor((Date.now() - sessionStart) / 1000);
        savePlayed(getPlayed() + elapsed);
        sessionStart = null;
      }
      if(sesInterval) clearInterval(sesInterval);
    }

    function timeUp(){
      stopSessionTimer();
      if(G.running){ G.running = false; }
      showTimeGate(DAILY_LIMIT);
    }

    const onUnload = () => stopSessionTimer();
    window.addEventListener('beforeunload', onUnload);

    // ── WEAPONS ──
    const WEAPONS = [
      {nm:'Solar Beam',em:'☀️',ic:'☀',cost:30,col:'#f5a623',range:95,fr:1100,dmg:22,type:'solar'},
      {nm:'Wind Turret',em:'🌀',ic:'⊕',cost:40,col:'#4a9eff',range:118,fr:720,dmg:14,type:'wind'},
      {nm:'Tree Wall',em:'🌳',ic:'T',cost:20,col:'#4ac850',range:78,fr:1900,dmg:10,type:'tree'},
      {nm:'Eco Bomb',em:'⚡',ic:'★',cost:60,col:'#ff6b6b',range:138,fr:2800,dmg:60,type:'bomb'},
      {nm:'Rain Cloud',em:'🌧️',ic:'≈',cost:50,col:'#26d4b4',range:128,fr:1400,dmg:7,type:'rain'},
      {nm:'Tidal Pulse',em:'🌊',ic:'~',cost:70,col:'#a78bfa',range:112,fr:2000,dmg:32,type:'tidal'},
      {nm:'Magnet Vortex',em:'🧲',ic:'M',cost:55,col:'#f472b6',range:100,fr:1600,dmg:18,type:'magnet'},
      {nm:'Bio Reactor',em:'🔬',ic:'B',cost:80,col:'#34d399',range:90,fr:2400,dmg:45,type:'bio'},
    ];

    // ── ENEMIES ──
    const ETYPES = [
      {nm:'Factory Smoke',ic:'S',col:'#888780',hp:60,spd:0.48,dmg:8,rew:12,sz:14},
      {nm:'Plastic Waste',ic:'P',col:'#f5a623',hp:100,spd:0.34,dmg:15,rew:20,sz:15},
      {nm:'CO2 Cloud',ic:'C',col:'#ff9a9a',hp:45,spd:0.74,dmg:5,rew:8,sz:13},
      {nm:'Oil Spill',ic:'O',col:'#7a7870',hp:150,spd:0.24,dmg:25,rew:35,sz:17},
      {nm:'Toxic Gas',ic:'X',col:'#a78bfa',hp:80,spd:0.54,dmg:12,rew:18,sz:14},
      {nm:'Nuclear Waste',ic:'N',col:'#f472b6',hp:200,spd:0.22,dmg:30,rew:45,sz:18,boss:true},
      {nm:'Acid Rain',ic:'A',col:'#34d399',hp:70,spd:0.62,dmg:10,rew:14,sz:13,splits:true},
      {nm:'Desert Storm',ic:'D',col:'#fbbf24',hp:120,spd:0.42,dmg:18,rew:28,sz:16},
      {nm:'Volcano Ash',ic:'V',col:'#f87171',hp:90,spd:0.50,dmg:14,rew:22,sz:15,burns:true},
      {nm:'Microplastic',ic:'m',col:'#818cf8',hp:30,spd:0.90,dmg:3,rew:5,sz:10,swarm:true},
      {nm:'BOSS Polluter',ic:'!',col:'#ff6363',hp:500,spd:0.18,dmg:40,rew:100,sz:22,boss:true,mega:true},
    ];

    const LANES = [80,160,240,320,400,480];
    const ECO_FACTS = [
      'Solar panels generate clean energy for 25+ years!',
      'A single tree absorbs ~48 lbs of CO2 annually.',
      'Wind turbines can power 1,500 homes per year!',
      'Recycling 1 aluminium can saves energy to power a TV for 3 hours.',
      'Electric vehicles produce 50% less lifetime CO2 than petrol cars.',
      'Rainwater harvesting can reduce water bills by up to 40%.',
      'LED bulbs use 75% less energy than incandescent bulbs.',
      'Composting reduces landfill waste and produces rich fertiliser.',
      'One hour less screen time saves about 0.5kg of CO2 per device.',
      'Planting 1 billion trees could offset 10 years of CO2 emissions.',
    ];

    const G = {running:false, paused:false, hp:100, coins:80, score:0, wave:0, sel:0, kills:0, spent:0, earned:0, fact:0};
    let towers: any[] = [], enemies: any[] = [], bullets: any[] = [], particles: any[] = [], lightnings: any[] = [];
    let lastTime = 0, comboCount = 0, comboTimer: any = null, raf: any = null;

    // Make global functions accessible to inline onclicks
    (window as any).devReset = () => { localStorage.removeItem(getTodayKey()); location.reload(); };
    (window as any).startGame = () => {
      if(!checkTimeGate()) return;
      const ov = document.getElementById('ov');
      if(ov) ov.style.display = 'none';
      Object.assign(G, {running:true, paused:false, hp:100, coins:80, score:0, wave:0, sel:0, kills:0, spent:0, earned:0, fact:0});
      towers=[]; enemies=[]; bullets=[]; particles=[]; lightnings=[];
      updateHUD(); sel(0);
      startSessionTimer();
      nextWave();
      lastTime = performance.now();
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };

    (window as any).togglePause = () => {
      if(!G.running) return;
      G.paused = !G.paused;
      const pb = document.getElementById('pbtn');
      if(pb) pb.textContent = G.paused ? 'Resume' : 'Pause';
      if(!G.paused) { lastTime = performance.now(); raf = requestAnimationFrame(loop); }
    };

    const sel = (window as any).sel = (i: number) => {
      G.sel = i;
      document.querySelectorAll('.wc').forEach((b, j) => b.classList.toggle('sel', j === i));
    };

    const nextWave = (window as any).nextWave = () => {
      if(!G.running || G.paused) return; // Prevent next wave if game not active
      G.wave++;
      const wv = document.getElementById('wv');
      if(wv) wv.textContent = G.wave.toString();
      const bonus = 20 + G.wave * 6;
      G.coins += bonus; G.earned += bonus;
      updateHUD();
      showToast('Wave '+G.wave+' incoming! +'+bonus+' coins');
      const count = 4 + G.wave * 2;
      for(let i=0; i<count; i++){
        setTimeout(()=>{
          if(!G.running) return;
          let pool = ETYPES.slice(0, Math.min(2 + Math.floor(G.wave/1.2), ETYPES.length));
          if(G.wave > 0 && G.wave % 5 === 0 && i === count - 1) { pool = [ETYPES[10]]; }
          const et = pool[Math.floor(Math.random()*pool.length)];
          const lane = LANES[Math.floor(Math.random()*LANES.length)];
          const hm = 1 + G.wave * 0.15;
          const nm = et.nm==='Microplastic' ? 6 : 1;
          for(let k=0; k<nm; k++){
            const spread = nm > 1 ? (k-nm/2)*22 : 0;
            enemies.push({
              x: canvas.width + 50 + Math.random()*80 + k*18,
              y: lane + spread,
              hp: Math.round(et.hp*hm), maxHp: Math.round(et.hp*hm),
              spd: et.spd * (0.88 + Math.random()*0.24),
              dmg: et.dmg, rew: et.rew, col: et.col, ic: et.ic, nm: et.nm,
              sz: et.sz, boss: !!et.boss, mega: !!et.mega, splits: !!et.splits, burns: !!et.burns, swarm: !!et.swarm,
              slow: 0, poison: 0, stunTime: 0,
              angle: 0, pulse: Math.random()*Math.PI*2,
              id: Math.random() + Date.now() + k,
            });
          }
        }, i*500 + Math.random()*200);
      }
    };

    const onCanvasClick = (e: MouseEvent | PointerEvent | TouchEvent) => {
      if(!G.running || G.paused) return;
      e.preventDefault(); // Prevent double-firing on mobile
      const rect = canvas.getBoundingClientRect();
      const sx = canvas.width / rect.width, sy = canvas.height / rect.height;
      
      let clientX, clientY;
      if ('touches' in e && (e as TouchEvent).touches.length > 0) {
        clientX = (e as TouchEvent).touches[0].clientX;
        clientY = (e as TouchEvent).touches[0].clientY;
      } else {
        clientX = (e as MouseEvent | PointerEvent).clientX;
        clientY = (e as MouseEvent | PointerEvent).clientY;
      }

      const x = (clientX - rect.left) * sx, y = (clientY - rect.top) * sy;
      if(x < 55) return;
      const w = WEAPONS[G.sel];
      if(G.coins < w.cost) { showToast('Need ' + w.cost + ' coins for ' + w.nm + '!'); return; }
      if(towers.some(t => Math.hypot(t.x - x, t.y - y) < 38)) { showToast('Too close to another tower!'); return; }
      towers.push({x, y, type: w.type, col: w.col, ic: w.ic, em: w.em, range: w.range, fr: w.fr, dmg: w.dmg, lastFire: 0, angle: 0, nm: w.nm, spin: 0});
      G.coins -= w.cost; G.spent += w.cost;
      burst(x, y, w.col, 12, 30);
      updateHUD();
      const stTw = document.getElementById('st-tw');
      if(stTw) stTw.textContent = towers.length.toString();
    };
    canvas.addEventListener('click', onCanvasClick);
    canvas.addEventListener('touchstart', onCanvasClick, {passive: false});

    function burst(x: number, y: number, col: string, n: number, spd: number){
      for(let i=0; i<n; i++){
        const a = Math.random()*Math.PI*2, s = Math.random()*spd;
        particles.push({x, y, vx: Math.cos(a)*s, vy: Math.sin(a)*s, life: 1, col, r: 1.5+Math.random()*3});
      }
    }

    function showToast(msg: string){
      const t = document.getElementById('toast') as any;
      if(!t) return;
      t.textContent = msg; t.style.opacity = 1;
      clearTimeout(t._t); t._t = setTimeout(()=>t.style.opacity = 0, 2000);
    }

    function flashCombo(n: number){
      const f = document.getElementById('combo-flash') as any;
      if(!f) return;
      f.textContent = 'COMBO x' + n + '!'; f.style.opacity = 1; f.style.fontSize = (16+n*2)+'px';
      clearTimeout(f._t); f._t = setTimeout(()=>f.style.opacity = 0, 900);
    }

    function updateHUD(){
      const hp = Math.max(0, Math.round(G.hp));
      const elHp = document.getElementById('hp-n'), elFill = document.getElementById('earth-fill');
      if(elHp) { elHp.textContent = hp.toString(); elHp.style.color = hp > 60 ? '#4ac850' : hp > 30 ? '#f5a623' : '#ff6b6b'; }
      if(elFill) {
        elFill.style.width = hp + '%';
        elFill.style.background = hp > 60 ? 'linear-gradient(90deg,#4ac850,#26d4b4)' : hp > 30 ? 'linear-gradient(90deg,#f5a623,#e8902a)' : 'linear-gradient(90deg,#ff6b6b,#cc0000)';
      }
      const setT = (id: string, v: number|string) => { const el = document.getElementById(id); if(el) el.textContent = v.toString(); };
      setT('cv', G.coins); setT('sv', G.score); setT('kv', G.kills); setT('st-kl', G.kills);
      setT('st-sp', G.spent); setT('st-er', G.earned);
      document.querySelectorAll('.wc').forEach((c, i) => { c.classList.toggle('off', WEAPONS[i].cost > G.coins); });
    }

    function loop(ts: number){
      if(!G.running || G.paused) return;
      const dt = Math.min(ts - lastTime, 50); lastTime = ts;
      if(ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBG();
        drawLightnings(dt);
        moveEnemies(dt);
        drawTowers(ts);
        moveBullets(dt);
        drawParticles(dt);
        drawHUDCanvas();
      }
      if(G.hp <= 0) { endGame(false); return; }
      if(G.running) raf = requestAnimationFrame(loop);
    }

    function drawBG(){
      if(!ctx) return;
      ctx.fillStyle = '#060e06'; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const laneColors = ['rgba(38,212,180,0.035)','rgba(74,200,80,0.03)','rgba(245,166,35,0.025)','rgba(255,107,107,0.025)','rgba(74,154,255,0.03)','rgba(167,139,250,0.025)'];
      LANES.forEach((y, i) => {
        ctx.fillStyle = laneColors[i%laneColors.length]; ctx.fillRect(0, y-27, canvas.width, 54);
        ctx.strokeStyle = 'rgba(74,200,80,0.06)'; ctx.lineWidth = 1; ctx.setLineDash([7,7]);
        ctx.beginPath(); ctx.moveTo(55, y); ctx.lineTo(canvas.width, y); ctx.stroke(); ctx.setLineDash([]);
      });
      for(let x=120; x<canvas.width; x+=110) { ctx.fillStyle='rgba(74,200,80,0.025)'; ctx.fillRect(x,0,1,canvas.height); }
      ctx.fillStyle='rgba(74,200,80,0.35)'; ctx.fillRect(0,0,5,canvas.height);
      ctx.fillStyle='rgba(74,200,80,0.04)'; ctx.fillRect(0,55,48,canvas.height-110);
      ctx.fillStyle='rgba(74,200,80,0.55)'; ctx.font='bold 8px monospace'; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText('EARTH', 24, 30); ctx.fillText('ZONE', 24, 42);
    }

    function moveEnemies(dt: number){
      for(let i=enemies.length-1; i>=0; i--){
        const e = enemies[i];
        e.pulse += 0.06;
        if(e.stunTime > 0) { e.stunTime -= dt; }
        else {
          const spd = (e.slow > 0 ? e.spd * 0.32 : e.spd) * (e.poison > 0 ? 0.82 : 1);
          e.x -= spd * (dt/16);
        }
        if(e.slow > 0) e.slow -= dt;
        if(e.poison > 0) { e.hp -= 0.04 * (dt/16); e.poison -= dt; }
        if(e.x < -35) { G.hp -= e.dmg; enemies.splice(i,1); burst(16, LANES[0], '#ff6b6b', 12, 22); updateHUD(); continue; }
        drawEnemy(e);
      }
    }

    function drawEnemy(e: any){
      if(!ctx) return;
      const r = e.sz;
      if(e.mega){
        ctx.beginPath(); ctx.arc(e.x, e.y, r+6+Math.sin(e.pulse)*3, 0, Math.PI*2);
        ctx.fillStyle = e.col+'15'; ctx.fill();
      }
      ctx.beginPath(); ctx.arc(e.x, e.y, r+2, 0, Math.PI*2); ctx.fillStyle = e.col+'22'; ctx.fill();
      ctx.beginPath(); ctx.arc(e.x, e.y, r, 0, Math.PI*2);
      ctx.fillStyle = e.col+(e.burns?'cc':'88'); ctx.fill();
      ctx.strokeStyle = e.col; ctx.lineWidth = e.boss ? 2.5 : 1.8; ctx.stroke();
      if(e.slow > 0){
        ctx.beginPath(); ctx.arc(e.x, e.y, r+5, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(38,212,180,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([2,3]); ctx.stroke(); ctx.setLineDash([]);
      }
      if(e.poison > 0){
        ctx.beginPath(); ctx.arc(e.x, e.y, r+4, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(52,211,153,0.5)'; ctx.lineWidth = 1.5; ctx.setLineDash([2,3]); ctx.stroke(); ctx.setLineDash([]);
      }
      if(e.stunTime > 0){
        for(let s=0; s<3; s++){
          const sa = e.pulse + s*2.09;
          ctx.beginPath(); ctx.arc(e.x+Math.cos(sa)*(r+7), e.y+Math.sin(sa)*(r+7)-4, 2.5, 0, Math.PI*2);
          ctx.fillStyle = '#fbbf24'; ctx.fill();
        }
      }
      ctx.fillStyle = e.boss ? '#fff' : e.col; ctx.font = `bold ${e.boss?12:10}px 'DM Mono',monospace`; ctx.textAlign='center'; ctx.textBaseline='middle';
      ctx.fillText(e.ic, e.x, e.y);
      const bw = e.sz*2+8, bh = 5, bx = e.x - bw/2, by = e.y - r - 9;
      ctx.fillStyle = '#0a140a'; ctx.beginPath(); ctx.roundRect(bx, by, bw, bh, 3); ctx.fill();
      const pct = Math.max(0, e.hp / e.maxHp);
      ctx.fillStyle = pct > 0.6 ? '#4ac850' : pct > 0.3 ? '#f5a623' : '#ff6b6b';
      if(bw*pct > 0) { ctx.beginPath(); ctx.roundRect(bx, by, bw*pct, bh, 3); ctx.fill(); }
      if(e.boss){
        ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font='bold 7px monospace'; ctx.textAlign='center';
        ctx.fillText(Math.round(e.hp).toString(), e.x, by-5);
      }
    }

    function drawTowers(ts: number){
      if(!ctx) return;
      towers.forEach(t => {
        t.spin += 0.04;
        const near = enemies.reduce((b, e) => { const d = Math.hypot(e.x-t.x, e.y-t.y); return (!b || d < b.d) ? {e, d} : b; }, null);
        if(near && near.d < t.range){
          t.angle = Math.atan2(near.e.y - t.y, near.e.x - t.x);
          if(ts - t.lastFire > t.fr){ t.lastFire = ts; fireBullet(t, near.e); }
        }
        ctx.save(); ctx.translate(t.x, t.y);
        ctx.beginPath(); ctx.arc(0, 0, 21, 0, Math.PI*2); ctx.fillStyle = t.col + '18'; ctx.fill();
        ctx.strokeStyle = t.col; ctx.lineWidth = 2; ctx.stroke();
        if(t.type === 'wind'){
          for(let b=0; b<3; b++){
            const ba = t.spin + b*2.094;
            ctx.save(); ctx.rotate(ba);
            ctx.fillStyle = t.col + 'cc'; ctx.beginPath(); ctx.ellipse(8, 0, 7, 3, 0, 0, Math.PI*2); ctx.fill();
            ctx.restore();
          }
        } else if(t.type === 'magnet'){
          ctx.strokeStyle = t.col; ctx.lineWidth = 1.5;
          for(let r2=8; r2<=18; r2+=5){ ctx.beginPath(); ctx.arc(0, 0, r2, t.spin, t.spin + Math.PI); ctx.stroke(); }
        }
        ctx.rotate(t.angle);
        ctx.strokeStyle = t.col; ctx.lineWidth = t.type === 'bio' ? 2 : 3.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(3, 0); ctx.lineTo(17, 0); ctx.stroke();
        ctx.restore();
        ctx.font = '13px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(t.em, t.x, t.y);
        ctx.strokeStyle = t.col + '10'; ctx.lineWidth = 1; ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.arc(t.x, t.y, t.range, 0, Math.PI*2); ctx.stroke(); ctx.setLineDash([]);
      });
    }

    const BCOLS: Record<string, string> = {solar:'#f5a623', wind:'#4a9eff', tree:'#4ac850', bomb:'#ff6b6b', rain:'#26d4b4', tidal:'#a78bfa', magnet:'#f472b6', bio:'#34d399'};
    function fireBullet(tower: any, target: any){
      bullets.push({x: tower.x, y: tower.y, target, type: tower.type, dmg: tower.dmg, col: BCOLS[tower.type]||tower.col, spd: tower.type==='bomb'?3.2:6.8, trail: []});
    }

    function moveBullets(dt: number){
      if(!ctx) return;
      for(let i=bullets.length-1; i>=0; i--){
        const b = bullets[i];
        if(!enemies.includes(b.target)) { bullets.splice(i, 1); continue; }
        const dx = b.target.x - b.x, dy = b.target.y - b.y, dist = Math.hypot(dx, dy);
        if(dist < 9) { applyHit(b); bullets.splice(i, 1); continue; }
        const spd = b.spd * (dt/16);
        b.trail.push({x: b.x, y: b.y}); if(b.trail.length > 6) b.trail.shift();
        b.x += dx / dist * spd; b.y += dy / dist * spd;
        b.trail.forEach((p: any, ti: number) => {
          ctx.beginPath(); ctx.arc(p.x, p.y, (ti/b.trail.length)*2.5, 0, Math.PI*2);
          ctx.fillStyle = b.col + Math.round((ti/b.trail.length)*100).toString(16).padStart(2,'0'); ctx.fill();
        });
        const r = b.type==='bomb' ? 6 : b.type==='tidal' ? 4.5 : 3.5;
        ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, Math.PI*2); ctx.fillStyle = b.col; ctx.fill();
        ctx.beginPath(); ctx.arc(b.x, b.y, r+2.5, 0, Math.PI*2); ctx.fillStyle = b.col + '44'; ctx.fill();
      }
    }

    function applyHit(b: any){
      switch(b.type){
        case 'bomb':
          enemies.forEach(e=>{if(Math.hypot(e.x-b.target.x, e.y-b.target.y)<105) e.hp-=b.dmg;});
          burst(b.target.x, b.target.y, '#ff6b6b', 22, 48); burst(b.target.x, b.target.y, '#f5a623', 10, 30);
          break;
        case 'rain':
          enemies.forEach(e=>{if(Math.hypot(e.x-b.target.x, e.y-b.target.y)<115){ e.slow=2400; e.hp-=b.dmg; }});
          burst(b.target.x, b.target.y, '#26d4b4', 12, 20);
          break;
        case 'tidal':
          let chain=[b.target], cur=b.target;
          for(let k=0; k<4; k++){const nxt=enemies.find(e=>!chain.includes(e)&&Math.hypot(e.x-cur.x,e.y-cur.y)<95); if(!nxt) break; chain.push(nxt); cur=nxt;}
          chain.forEach((e, ci)=>{e.hp-=b.dmg*(1-ci*0.18); burst(e.x, e.y, '#a78bfa', 5, 14);});
          drawChainLightning(chain);
          break;
        case 'magnet':
          enemies.forEach(e=>{if(Math.hypot(e.x-b.target.x, e.y-b.target.y)<100){ e.hp-=b.dmg; e.stunTime=600; e.x+=6; }});
          burst(b.target.x, b.target.y, '#f472b6', 14, 25);
          break;
        case 'bio':
          b.target.hp -= b.dmg; b.target.poison = 2800;
          burst(b.target.x, b.target.y, '#34d399', 10, 18);
          break;
        default:
          b.target.hp -= b.dmg; burst(b.target.x, b.target.y, b.col, 5, 14);
      }
      killCheck(b.target);
    }

    function killCheck(hitTarget: any){
      for(let j=enemies.length-1; j>=0; j--){
        const e = enemies[j];
        if(e.hp <= 0){
          if(e.splits){
            for(let s=0; s<3; s++){
              enemies.push({...ETYPES[2], x: e.x+s*14, y: e.y+(s-1)*14, hp: 20, maxHp: 20, spd: 0.9, dmg: 3, rew: 3, col: '#34d399', ic: 'a', nm: 'Acid Drop', sz: 9, slow: 0, poison: 0, stunTime: 0, pulse: Math.random()*Math.PI*2, id: Math.random()+Date.now()+s});
            }
          }
          G.coins += e.rew; G.earned += e.rew;
          G.score += e.rew*2 + (e.boss?200:0) + G.wave*2; G.kills++;
          comboCount++;
          if(comboCount > 1) flashCombo(comboCount);
          clearTimeout(comboTimer); comboTimer = setTimeout(()=>comboCount=0, 1700);
          burst(e.x, e.y, '#4ac850', 16, 36); burst(e.x, e.y, '#f5a623', 7, 20);
          enemies.splice(j, 1); updateHUD();
          if(enemies.length === 0){
            const fact = ECO_FACTS[G.fact%ECO_FACTS.length]; G.fact++;
            const fEl = document.getElementById('fact-txt');
            if(fEl) fEl.textContent = fact;
            setTimeout(() => { if(G.running) showToast('Wave cleared! Eco tip: '+fact); }, 400);
          }
        }
      }
    }

    function drawChainLightning(chain: any[]){
      for(let i=1; i<chain.length; i++){
        lightnings.push({x1: chain[i-1].x, y1: chain[i-1].y, x2: chain[i].x, y2: chain[i].y, life: 0.7});
      }
    }

    function drawLightnings(dt: number){
      if(!ctx) return;
      for(let i=lightnings.length-1; i>=0; i--){
        const l = lightnings[i]; l.life -= 0.06*(dt/16);
        if(l.life <= 0) { lightnings.splice(i, 1); continue; }
        ctx.save(); ctx.globalAlpha = l.life;
        ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 2.5; ctx.shadowBlur = 8; ctx.shadowColor = '#a78bfa';
        ctx.beginPath();
        const segs=6, dx=(l.x2-l.x1)/segs, dy=(l.y2-l.y1)/segs;
        ctx.moveTo(l.x1, l.y1);
        for(let s=1; s<=segs; s++){
          const jitter = s<segs ? (Math.random()-0.5)*16 : 0;
          ctx.lineTo(l.x1+dx*s+jitter, l.y1+dy*s+jitter);
        }
        ctx.stroke(); ctx.restore();
      }
    }

    function drawParticles(dt: number){
      if(!ctx) return;
      for(let i=particles.length-1; i>=0; i--){
        const p = particles[i];
        p.x += p.vx*(dt/16); p.y += p.vy*(dt/16);
        p.vy += 0.28*(dt/16); p.vx *= 0.96; p.life -= 0.024*(dt/16);
        if(p.life <= 0) { particles.splice(i, 1); continue; }
        ctx.globalAlpha = p.life; ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0, p.r*p.life), 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    function drawHUDCanvas(){
      if(!ctx) return;
      ctx.fillStyle = 'rgba(74,200,80,0.7)'; ctx.font = 'bold 9px monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
      ctx.fillText('Towers: '+towers.length, 58, 8);
      ctx.fillText('Threats: '+enemies.length, 58, 19);
      if(enemies.length===0 && G.wave>0){
        ctx.fillStyle = 'rgba(74,200,80,0.3)'; ctx.font = 'bold 11px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('WAVE CLEARED — Click "Next Wave" to continue', canvas.width/2, canvas.height/2);
      }
    }

    function endGame(win: boolean){
      G.running = false; stopSessionTimer();
      const ov = document.getElementById('ov');
      if(ov){
        ov.style.display = 'flex';
        ov.innerHTML = `<div class="ov-box">
          <div class="ov-ico">${win?'🌍':'💀'}</div>
          <div class="ov-title" style="color:${win?'var(--g)':'var(--c)'}">${win?'Earth Saved!':'Earth Polluted!'}</div>
          <div class="ov-sub">${win?'You heroically defended Earth from all pollution!':"The pollution broke through Earth's defences. Every eco-action counts!"}</div>
          <div class="ov-stats">
            <div class="os-r"><span class="os-l">Final Score</span><span class="os-v" style="color:var(--a)">${G.score}</span></div>
            <div class="os-r"><span class="os-l">Waves Survived</span><span class="os-v" style="color:var(--t)">${G.wave}</span></div>
            <div class="os-r"><span class="os-l">Enemies Defeated</span><span class="os-v" style="color:var(--c)">${G.kills}</span></div>
            <div class="os-r"><span class="os-l">Towers Deployed</span><span class="os-v" style="color:var(--g)">${towers.length}</span></div>
            <div class="os-r"><span class="os-l">Coins Earned</span><span class="os-v" style="color:var(--a)">${G.earned}</span></div>
          </div>
          <button class="go-btn" onclick="window.startGame()">🌱 Play Again</button>
        </div>`;
      }
    }

    drawBG();

    return () => {
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('click', onCanvasClick);
      canvas.removeEventListener('touchstart', onCanvasClick);
      window.removeEventListener('beforeunload', onUnload);
      stopSessionTimer();
      if(raf) cancelAnimationFrame(raf);
    };

  }, []);

  return (
    <div style={{ 
      padding: "16px", minHeight: "calc(100vh - 59px)", background: "var(--bg)", color: "var(--tx)", fontFamily: "'Space Grotesk', sans-serif",
      "--g": "#4ac850", "--t": "#26d4b4", "--a": "#f5a623", "--c": "#ff6b6b", "--b": "#4a9eff", "--p": "#a78bfa", "--pk": "#f472b6",
      "--bg": "#060e06", "--bg2": "#0a140a", "--bg3": "#0f1a0f", "--bg4": "#141f14",
      "--bdr": "rgba(74,200,80,0.14)", "--bdr2": "rgba(74,200,80,0.3)",
      "--tx": "#e8f5e9", "--tx2": "#8fbc92", "--tx3": "#3d6b41"
    } as React.CSSProperties}>
      <div id="wrap">
        {/* TIME GATE */}
        <div id="time-gate">
          <div className="tg-box">
            <div className="tg-icon">⏰</div>
            <div className="tg-title">Daily Limit Reached!</div>
            <div className="tg-sub">You've played your <strong style={{color:"var(--a)"}}>1 hour daily limit</strong> of EcoGuardian.<br/>Come back tomorrow to continue defending Earth from pollution!</div>
            <div style={{fontSize:"12px",color:"var(--tx2)",marginBottom:"6px"}}>Resets in</div>
            <div className="tg-timer" id="tg-countdown">00:00:00</div>
            <div style={{fontSize:"11px",color:"var(--tx2)",marginTop:"6px"}}>Healthy gaming = healthy planet 🌍</div>
            <div className="tg-reset" onClick={() => (window as any).devReset()}>Dev: reset timer</div>
          </div>
        </div>

        {/* SESSION TIMER */}
        <div id="session-bar">
          <span className="ses-label">Today's playtime</span>
          <div id="ses-bar"><div id="ses-fill" style={{width: "0%"}}></div></div>
          <span id="ses-time">60:00</span>
          <span className="ses-limit">/ 60 min</span>
        </div>

        {/* TOPBAR */}
        <div id="topbar">
          <div className="logo"><div className="logo-box">🌿</div>EcoGuardian</div>
          <div id="earth-wrap">
            <span style={{fontSize:"9px",color:"var(--tx3)",fontWeight:700,textTransform:"uppercase",letterSpacing:".5px"}}>Earth</span>
            <div id="earth-bar"><div id="earth-fill" style={{ width: "100%", background: "linear-gradient(90deg, #4ac850, #26d4b4)" }}></div></div>
            <div id="hp-n" style={{ color: "#4ac850" }}>100</div>
          </div>
          <div className="hud"><div className="hud-lbl">Coins</div><div className="hud-v" id="cv" style={{color:"var(--a)"}}>80</div></div>
          <div className="hud"><div className="hud-lbl">Wave</div><div className="hud-v" id="wv" style={{color:"var(--t)"}}>0</div></div>
          <div className="hud"><div className="hud-lbl">Score</div><div className="hud-v" id="sv" style={{color:"var(--g)"}}>0</div></div>
          <div className="hud"><div className="hud-lbl">Kills</div><div className="hud-v" id="kv" style={{color:"var(--c)"}}>0</div></div>
          <div className="nav-btns">
            <button className="nb" id="pbtn" onClick={() => (window as any).togglePause()}>Pause</button>
            <button className="nb teal" onClick={() => (window as any).nextWave()}>Next Wave ›</button>
          </div>
        </div>

        {/* MAIN */}
        <div id="main">
          {/* WEAPONS LEFT */}
          <div id="lp">
            <div className="plbl">{t("ecoWeapons", "Eco Weapons")}</div>
            <div className="wc sel" id="wb0" onClick={() => (window as any).sel(0)}>
              <div className="wc-dot" style={{background:"var(--a)"}}></div>
              <div className="wc-ico">☀️</div>
              <div className="wc-nm">Solar Beam</div>
              <div className="wc-cost">💰 30</div>
              <div className="wc-stat">Burns smoke</div>
            </div>
            <div className="wc" id="wb1" onClick={() => (window as any).sel(1)}>
              <div className="wc-dot" style={{background:"var(--b)"}}></div>
              <div className="wc-ico">🌀</div>
              <div className="wc-nm">Wind Turret</div>
              <div className="wc-cost">💰 40</div>
              <div className="wc-stat">Rapid fire</div>
            </div>
            <div className="wc" id="wb2" onClick={() => (window as any).sel(2)}>
              <div className="wc-dot" style={{background:"var(--g)"}}></div>
              <div className="wc-ico">🌳</div>
              <div className="wc-nm">Tree Wall</div>
              <div className="wc-cost">💰 20</div>
              <div className="wc-stat">CO2 absorber</div>
            </div>
            <div className="wc" id="wb3" onClick={() => (window as any).sel(3)}>
              <div className="wc-dot" style={{background:"var(--c)"}}></div>
              <div className="wc-ico">⚡</div>
              <div className="wc-nm">Eco Bomb</div>
              <div className="wc-cost">💰 60</div>
              <div className="wc-stat">Area nuke</div>
            </div>
            <div className="wc" id="wb4" onClick={() => (window as any).sel(4)}>
              <div className="wc-dot" style={{background:"var(--t)"}}></div>
              <div className="wc-ico">🌧️</div>
              <div className="wc-nm">Rain Cloud</div>
              <div className="wc-cost">💰 50</div>
              <div className="wc-stat">Slows all</div>
            </div>
            <div className="wc" id="wb5" onClick={() => (window as any).sel(5)}>
              <div className="wc-dot" style={{background:"var(--p)"}}></div>
              <div className="wc-ico">🌊</div>
              <div className="wc-nm">Tidal Pulse</div>
              <div className="wc-cost">💰 70</div>
              <div className="wc-stat">Chain strike</div>
            </div>
            <div className="wc" id="wb6" onClick={() => (window as any).sel(6)}>
              <div className="wc-dot" style={{background:"var(--pk)"}}></div>
              <div className="wc-ico">🧲</div>
              <div className="wc-nm">Magnet Vortex</div>
              <div className="wc-cost">💰 55</div>
              <div className="wc-stat">Pulls + stuns</div>
            </div>
            <div className="wc" id="wb7" onClick={() => (window as any).sel(7)}>
              <div className="wc-dot" style={{background:"#34d399"}}></div>
              <div className="wc-ico">🔬</div>
              <div className="wc-nm">Bio Reactor</div>
              <div className="wc-cost">💰 80</div>
              <div className="wc-stat">Poison cloud</div>
            </div>
          </div>

          {/* CANVAS */}
          <div id="cw">
            <canvas id="gc"></canvas>
            <div id="toast"></div>
            <div id="combo-flash"></div>
            <div id="ov">
              <div className="ov-box">
                <div className="ov-ico">🌍</div>
                <div className="ov-title" style={{color:"var(--g)"}}>EcoGuardian</div>
                <div className="ov-sub">Defend Earth from 11 types of pollution threats! Deploy eco-weapons, chain combos, and survive endless waves.</div>
                <div className="how-grid">
                  <div className="how-item"><b style={{color:"var(--g)"}}>Deploy</b>Click a weapon left, then click the field to place it</div>
                  <div className="how-item"><b style={{color:"var(--g)"}}>Earn Coins</b>Kill enemies to earn coins for more towers</div>
                  <div className="how-item"><b style={{color:"var(--g)"}}>Protect Earth</b>Don't let enemies reach the left edge!</div>
                  <div className="how-item"><b style={{color:"var(--g)"}}>Time Limit</b>Only 1 hour of play per day — use it wisely!</div>
                </div>
                <button className="go-btn" onClick={() => (window as any).startGame()}>🌱 Start Defending!</button>
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div id="rp">
            <div className="rbox">
              <div className="rbox-t">Enemy Threats</div>
              <div className="er"><div className="er-ic" style={{background:"#88878022",color:"#888780"}}>S</div><div><div className="er-nm">Factory Smoke</div><div className="er-st">60HP · slow</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#f5a62322",color:"#f5a623"}}>P</div><div><div className="er-nm">Plastic Waste</div><div className="er-st">100HP · med</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#ff9a9a22",color:"#ff9a9a"}}>C</div><div><div className="er-nm">CO2 Cloud</div><div className="er-st">45HP · fast</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#7a787022",color:"#aaa"}}>O</div><div><div className="er-nm">Oil Spill</div><div className="er-st">150HP · tank</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#a78bfa22",color:"#a78bfa"}}>X</div><div><div className="er-nm">Toxic Gas</div><div className="er-st">80HP · med</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#f472b622",color:"#f472b6"}}>N</div><div><div className="er-nm">Nuclear Waste</div><div className="er-st">200HP · boss</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#34d39922",color:"#34d399"}}>A</div><div><div className="er-nm">Acid Rain</div><div className="er-st">70HP · splits</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#fbbf2422",color:"#fbbf24"}}>D</div><div><div className="er-nm">Desert Storm</div><div className="er-st">120HP · blind</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#f8717122",color:"#f87171"}}>V</div><div><div className="er-nm">Volcano Ash</div><div className="er-st">90HP · burns</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#818cf822",color:"#818cf8"}}>m</div><div><div className="er-nm">Microplastic</div><div className="er-st">30HP · swarm</div></div></div>
              <div className="er"><div className="er-ic" style={{background:"#ff636322",color:"#ff6363"}}>!</div><div><div className="er-nm">BOSS Polluter</div><div className="er-st">500HP · mega</div></div></div>
            </div>
            <div className="rbox">
              <div className="rbox-t">Stats</div>
              <div className="sr"><span className="sr-l">Towers</span><span className="sr-v" id="st-tw" style={{color:"var(--g)"}}>0</span></div>
              <div className="sr"><span className="sr-l">Kills</span><span className="sr-v" id="st-kl" style={{color:"var(--c)"}}>0</span></div>
              <div className="sr"><span className="sr-l">Spent</span><span className="sr-v" id="st-sp" style={{color:"var(--a)"}}>0</span></div>
              <div className="sr"><span className="sr-l">Earned</span><span className="sr-v" id="st-er" style={{color:"var(--g)"}}>0</span></div>
            </div>
            <div className="tip"><b>Tip:</b> Chain Tidal Pulse between clustered enemies for massive combo bonuses!</div>
            <div className="tip" style={{background:"rgba(38,212,180,0.04)",borderColor:"rgba(38,212,180,0.15)"}}><b style={{color:"var(--t)"}}>Eco Fact:</b> <span id="fact-txt">Solar panels generate clean energy for 25+ years!</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
