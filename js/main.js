/* 2336 · 猎户座探测计划 — 交互脚本
   星海 / 舷窗雷达 / 频段调谐 / 阅读进度 / 载入编排
   无依赖，遵循 KISS */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---- 调色板：从 CSS 变量读取，主题切换时联动 canvas ---- */
  const hexToRgb = (hex) => {
    const raw = (hex || '').trim().replace('#', '');
    if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(raw)) return { r: 232, g: 244, b: 255 };
    const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
    const n = parseInt(full, 16);
    return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
  };
  const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`;

  let palette = { ice: hexToRgb('#1c3a5e'), signal: hexToRgb('#5fb8ff'), pulse: hexToRgb('#e8f4ff') };
  const readPalette = () => {
    const cs = getComputedStyle(root);
    palette = {
      ice: hexToRgb(cs.getPropertyValue('--ice')),
      signal: hexToRgb(cs.getPropertyValue('--signal')),
      pulse: hexToRgb(cs.getPropertyValue('--pulse'))
    };
  };

  /* ---- 星海 + 舷窗雷达 ---- */
  const canvas = document.getElementById('space');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let viewW = 0;
  let viewH = 0;
  let stars = [];
  let radar = { cx: 0, cy: 0, r: 0 };
  let sweep = 2.4;
  let sweepSpeed = 3.2;
  let ringsA = 0;
  let bootT = 0;
  let lastT = 0;
  let rafId = 0;
  let running = false;

  const makeStars = () => {
    const count = Math.round(Math.min(170, (viewW * viewH) / 9000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * viewW,
      y: Math.random() * viewH,
      r: Math.random() * 1.1 + 0.3,
      a: Math.random() * 0.5 + 0.16,
      tw: Math.random() * Math.PI * 2,
      ts: Math.random() * 0.9 + 0.25,
      blue: Math.random() < 0.28
    }));
  };

  const drawStars = (t, still) => {
    for (const s of stars) {
      const twinkle = still ? s.a : Math.max(0.05, s.a * (0.6 + 0.4 * Math.sin(s.tw + t * s.ts)));
      ctx.globalAlpha = twinkle;
      ctx.fillStyle = rgba(s.blue ? palette.signal : palette.pulse, 1);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const drawRadar = (angle, alpha) => {
    const { cx, cy, r } = radar;
    ctx.lineWidth = 1;
    ctx.strokeStyle = rgba(palette.ice, 1);
    [0.3, 0.5, 0.7, 0.9].forEach((k, i) => {
      ctx.globalAlpha = (0.2 + i * 0.1) * alpha;
      ctx.beginPath();
      ctx.arc(cx, cy, r * k, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.globalAlpha = 1;
    if (alpha < 0.35) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    const grad = ctx.createRadialGradient(0, 0, r * 0.05, 0, 0, r);
    grad.addColorStop(0, rgba(palette.signal, 0));
    grad.addColorStop(1, rgba(palette.signal, 0.11));
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, r, -0.44, 0);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = rgba(palette.pulse, 0.4);
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(r, 0);
    ctx.stroke();
    ctx.restore();
  };

  const render = (t, still) => {
    if (!ctx) return;
    ctx.clearRect(0, 0, viewW, viewH);
    drawStars(t, still);
    drawRadar(still ? 2.4 : sweep, still ? 1 : ringsA);
  };

  const tick = (now) => {
    if (!running) return;
    rafId = requestAnimationFrame(tick);
    const t = now / 1000;
    const dt = lastT ? Math.min(0.06, t - lastT) : 0.016;
    lastT = t;
    bootT += dt;
    ringsA = Math.min(1, bootT / 0.7);
    sweepSpeed += (0.55 - sweepSpeed) * Math.min(1, bootT / 3.5);
    sweep = (sweep + sweepSpeed * dt) % (Math.PI * 2);
    render(t, false);
  };

  const startLoop = () => {
    if (running || !ctx || reduceQuery.matches) return;
    running = true;
    lastT = 0;
    rafId = requestAnimationFrame(tick);
  };
  const stopLoop = () => {
    running = false;
    cancelAnimationFrame(rafId);
  };

  const resize = () => {
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    viewW = window.innerWidth;
    viewH = window.innerHeight;
    canvas.width = Math.round(viewW * dpr);
    canvas.height = Math.round(viewH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    radar = { cx: viewW * 1.06, cy: viewH * 1.12, r: 0 };
    radar.r = Math.hypot(radar.cx, radar.cy) + 60;
    makeStars();
    if (reduceQuery.matches) render(0, true);
  };

  if (ctx) {
    resize();
    startLoop();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stopLoop();
      else startLoop();
    });
    reduceQuery.addEventListener('change', (e) => {
      if (e.matches) {
        stopLoop();
        render(0, true);
        return;
      }
      startLoop();
    });
  }

  /* ---- 六套视觉频段 ---- */
  const spectrum = document.querySelector('.spectrum');
  const bands = spectrum ? Array.from(spectrum.querySelectorAll('.band')) : [];

  const selectBand = (btn) => {
    bands.forEach((b) => {
      const on = b === btn;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    root.dataset.theme = btn.dataset.band;
    try { localStorage.setItem('orion-band', btn.dataset.band); } catch (err) { /* 隐私模式忽略 */ }
    readPalette();
    if (reduceQuery.matches && ctx) render(0, true);
  };

  bands.forEach((btn) => btn.addEventListener('click', () => selectBand(btn)));

  if (spectrum) {
    spectrum.addEventListener('keydown', (e) => {
      const keys = ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
      if (keys.indexOf(e.key) < 0) return;
      const i = bands.indexOf(document.activeElement);
      if (i < 0) return;
      e.preventDefault();
      let j = i;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i + bands.length - 1) % bands.length;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % bands.length;
      if (e.key === 'Home') j = 0;
      if (e.key === 'End') j = bands.length - 1;
      bands[j].focus();
      selectBand(bands[j]);
    });
  }

  if (bands.length) {
    const initial = bands.find((b) => b.dataset.band === root.dataset.theme) || bands[0];
    selectBand(initial);
  }

  /* ---- 阅读进度：信号强度 ---- */
  const story = document.getElementById('story');
  const rail = document.querySelector('.read-rail');
  if (story && rail) {
    let queued = false;
    const update = () => {
      queued = false;
      const rect = story.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height - vh;
      const passed = total <= 0 ? 1 : Math.min(1, Math.max(0, -rect.top / total));
      rail.style.setProperty('--fill', String(passed));
      rail.classList.toggle('is-on', rect.top < vh * 0.72 && rect.bottom > vh * 0.28);
    };
    const request = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    update();
  }

  /* ---- 影像档案：曲率跃迁回放 ---- */
  const warpCanvas = document.getElementById('warp');
  const warpCtx = warpCanvas ? warpCanvas.getContext('2d') : null;
  const videoPanel = document.getElementById('videoPanel');
  const warpPlayBtn = document.getElementById('warpPlay');
  const warpTitle = document.getElementById('videoTitle');
  const warpStatus = document.getElementById('videoStatus');
  const warpBtnText = warpPlayBtn ? warpPlayBtn.querySelector('.video-btn-text') : null;
  let warpW = 0;
  let warpH = 0;
  let warpStars = [];
  let warpRaf = 0;
  let warpPlaying = false;

  const sizeWarp = () => {
    if (!warpCtx || !videoPanel) return;
    const rect = videoPanel.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    warpW = Math.max(1, rect.width);
    warpH = Math.max(1, rect.height);
    warpCanvas.width = Math.round(warpW * dpr);
    warpCanvas.height = Math.round(warpH * dpr);
    warpCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    warpStars = Array.from({ length: 240 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: Math.random(),
      s: Math.random() * 0.5 + 0.5,
      w: Math.random() * 0.8 + 0.2
    }));
    drawWarp(warpPlaying ? 1 : 0);
  };

  const drawWarp = (t) => {
    if (!warpCtx) return;
    const cx = warpW * 0.5;
    const cy = warpH * 0.42;
    warpCtx.fillStyle = t <= 0 ? 'rgba(3,7,16,1)' : 'rgba(3,7,16,0.34)';
    warpCtx.fillRect(0, 0, warpW, warpH);
    const drive = Math.min(1, t * 1.6);
    const maxR = Math.hypot(Math.max(cx, warpW - cx), Math.max(cy, warpH - cy)) * 1.15;
    for (const s of warpStars) {
      const r = (0.06 + s.r * 0.94) * maxR * (0.25 + 0.75 * t);
      const len = 1.5 + drive * drive * (110 + s.s * 300);
      warpCtx.strokeStyle = rgba(s.w > 0.6 ? palette.pulse : palette.signal, s.w * (0.2 + 0.75 * drive));
      warpCtx.lineWidth = 1 + s.w * 0.8;
      warpCtx.beginPath();
      warpCtx.moveTo(cx + Math.cos(s.a) * r, cy + Math.sin(s.a) * r);
      warpCtx.lineTo(cx + Math.cos(s.a) * (r + len), cy + Math.sin(s.a) * (r + len));
      warpCtx.stroke();
    }
    const core = warpCtx.createRadialGradient(cx, cy, 0, cx, cy, maxR * 0.22);
    core.addColorStop(0, rgba(palette.pulse, 0.08 + drive * 0.32));
    core.addColorStop(1, rgba(palette.pulse, 0));
    warpCtx.fillStyle = core;
    warpCtx.fillRect(0, 0, warpW, warpH);
  };

  const setVideoState = (state) => {
    if (!videoPanel) return;
    videoPanel.dataset.state = state;
    if (state === 'playing') {
      warpTitle.textContent = '曲率跃迁 · 回放中';
      warpStatus.textContent = '曲率驱动解锁 / 惯性阻尼解除';
      return;
    }
    if (state === 'done') {
      warpTitle.textContent = '跃迁完成 · 惯性锚定';
      warpStatus.textContent = '已脱离引力屏障 系统锁定：M42 星云深处 未登记类地行星';
      if (warpBtnText) warpBtnText.textContent = '重新回放';
      return;
    }
    warpTitle.textContent = '曲率跃迁 · 回放';
    warpStatus.textContent = '待机 · 影像未启动';
  };

  const playWarp = () => {
    if (!warpCtx || !videoPanel) return;
    cancelAnimationFrame(warpRaf);
    if (reduceQuery.matches) {
      warpPlaying = false;
      drawWarp(1);
      setVideoState('done');
      return;
    }
    warpPlaying = true;
    setVideoState('playing');
    const started = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - started) / 4600);
      drawWarp(p);
      if (p < 1) {
        warpRaf = requestAnimationFrame(step);
        return;
      }
      warpPlaying = false;
      drawWarp(1);
      setVideoState('done');
    };
    warpRaf = requestAnimationFrame(step);
  };

  if (warpCtx && videoPanel) {
    sizeWarp();
    window.addEventListener('resize', sizeWarp);
    warpPlayBtn.addEventListener('click', playWarp);
  }

  /* ---- 装备档案：全域自检 ---- */
  const gearPanel = document.querySelector('.gear-panel');
  const gearBtn = document.getElementById('gearCheck');
  const gearStatus = document.getElementById('gearStatus');
  if (gearPanel && gearBtn) {
    gearBtn.addEventListener('click', () => {
      gearPanel.classList.add('is-checking');
      gearPanel.querySelectorAll('.stat').forEach((li) => {
        const valEl = li.querySelector('.stat-val');
        const val = parseFloat(valEl.dataset.value || '0');
        li.style.setProperty('--v', val + '%');
        valEl.textContent = val.toFixed(1);
      });
      gearBtn.disabled = true;
      gearBtn.textContent = '自检完成';
      if (!gearStatus) return;
      gearStatus.textContent = '自检序列运行中 …';
      window.setTimeout(() => {
        gearStatus.textContent = '自检通过 · 全系统最优';
      }, reduceQuery.matches ? 0 : 1700);
    });
  }

  /* ---- 页眉：信号读数 ---- */
  const signalLive = document.getElementById('signalLive');
  if (signalLive && !reduceQuery.matches) {
    window.setInterval(() => {
      const v = (23.36 + (Math.random() - 0.5) * 0.6).toFixed(2);
      signalLive.textContent = '信号 ' + v + ' Hz · 持续接收';
    }, 3000);
  }

  /* ---- 载入编排 ---- */
  const acquire = () => root.classList.add('is-ready');
  if (reduceQuery.matches) acquire();
  else window.setTimeout(acquire, 120);
})();
