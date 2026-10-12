/* AI 知识产权判例档案 — 页面脚本（中英双语）
   渲染 / 分类筛选 / 检索 / 全文弹窗 / 语言切换 / 轻量星海
   数据：js/cases-data.js（window.AI_IP_CASES）· 无依赖，遵循 KISS */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const data = window.AI_IP_CASES;

  /* ---- 双语词典 ---- */
  const I18N = {
    zh: {
      docTitle: 'AI 知识产权判例档案｜人民法院案例库归档',
      skip: '跳到判例档案',
      crumbs: '星际法庭 ❯ 判例档案库 ❯ AI 知识产权',
      brand: '星际法庭',
      navHome: '首页',
      navFiles: '判例档案',
      navAppendix: '附录',
      navOfficial: '官网',
      heroTitle: 'AI 知识产权判例档案',
      heroLede: '从人民法院案例库检索归档的<b>人工智能知识产权判例</b>：AI 生成内容著作权、AI 相关专利、算法保护与竞争权益——按侵权类型分类收录，凡例皆可全文展阅。',
      heroMaxim: '法不阿贵，绳不挠曲。<span>——《韩非子·有度》</span>',
      btnBrowse: '浏览判例',
      btnHome: '返回主页',
      heroLogline: '星际法庭 · 判例档案库 · 归档于 {ym}',
      dataMeta: '已收录 {n} 篇判例 · 来源：人民法院案例库',
      statsAria: '卷宗统计',
      chipsAria: '按侵权类型筛选',
      searchAria: '检索判例',
      searchPh: '检索标题 / 案号 / 法院 / 关键词…',
      filesTitle: '判例档案',
      filesTagAll: '共 {n} 篇判例 · 按侵权类型分类',
      filesTagFiltered: '显示 {a} / {b} 篇 · 按侵权类型分类',
      emptyText: '未找到匹配判例 · 换个关键词再试',
      appendixTitle: '附录',
      appendixTag: 'AI 相关但非知识产权判例（仅列明）',
      sourceNote: '数据来源：人民法院案例库（rmfyalk.court.gov.cn）· 判例文本来自公开司法案例库 · 本页仅作整理索引',
      btnReadFull: '查看全文',
      btnSource: '法院原文 ↗',
      btnViewOriginal: '查看原文 ↗',
      labelCause: '案由',
      labelCourt: '审理法院',
      labelDate: '裁判日期',
      labelDocket: '案号',
      labelCaseType: '案件类型',
      labelArchiveNo: '入库编号',
      typeGuiding: '指导性案例',
      typeReference: '参考案例',
      expired: '（已失效）',
      btnClose: '关闭 ✕',
      dlgSource: '人民法院案例库原文',
      dialogAria: '判例全文',
      footerBrand: '星际法庭｜判例档案库',
      footerSource: '数据来源：人民法院案例库',
      btnTop: '回到顶部'
    },
    en: {
      docTitle: 'AI IP Case Files — People’s Court Case Database',
      skip: 'Skip to case files',
      crumbs: 'Interstellar Tribunal ❯ Case Archive ❯ AI IP',
      brand: 'Interstellar Tribunal',
      navHome: 'Home',
      navFiles: 'Case Files',
      navAppendix: 'Appendix',
      navOfficial: 'Official Site',
      heroTitle: 'AI Intellectual Property Case Files',
      heroLede: 'AI-related intellectual property cases retrieved from the People’s Court Case Database: <b>copyright in AI-generated content, AI patents, algorithm protection and competition interests</b> — classified by infringement type, full texts available for every case.',
      heroMaxim: 'The law flatters no noble; the plumb line yields to no crooked.<span>— Han Feizi, On Standards</span>',
      btnBrowse: 'Browse Cases',
      btnHome: 'Back to Home',
      heroLogline: 'Interstellar Tribunal · Case Archive · Filed {ym}',
      dataMeta: '{n} cases archived · Source: People’s Court Case Database',
      statsAria: 'Case statistics',
      chipsAria: 'Filter by infringement type',
      searchAria: 'Search cases',
      searchPh: 'Search title / docket no. / court / keywords…',
      filesTitle: 'Case Files',
      filesTagAll: '{n} cases · grouped by infringement type',
      filesTagFiltered: 'Showing {a} / {b} cases · grouped by infringement type',
      emptyText: 'No matching cases · try another keyword',
      appendixTitle: 'Appendix',
      appendixTag: 'AI-related cases outside IP scope (listed only)',
      sourceNote: 'Source: People’s Court Case Database (rmfyalk.court.gov.cn) · Case texts are public judicial records · This page is an index for study purposes',
      btnReadFull: 'Read Full Text',
      btnSource: 'Original ↗',
      btnViewOriginal: 'View Original ↗',
      labelCause: 'Cause of action',
      labelCourt: 'Court',
      labelDate: 'Judgment date',
      labelDocket: 'Docket no.',
      labelCaseType: 'Case type',
      labelArchiveNo: 'Archive no.',
      typeGuiding: 'Guiding Case',
      typeReference: 'Reference Case',
      expired: ' (superseded)',
      btnClose: 'Close ✕',
      dlgSource: 'View on the Case Database',
      dialogAria: 'Full text of the case',
      footerBrand: 'Interstellar Tribunal · Case Archive',
      footerSource: 'Source: People’s Court Case Database',
      btnTop: 'Back to top',
      cats: {
        '全部': 'All',
        '著作权': 'Copyright',
        '专利': 'Patents',
        '不正当竞争': 'Unfair Competition',
        '商业秘密': 'Trade Secrets',
        '其他（AI相关）': 'Others (AI-related)'
      },
      sectionLabels: {
        '基本案情': 'Facts',
        '裁判理由': 'Reasoning',
        '裁判要旨': 'Holding',
        '裁判要点': 'Key Points',
        '裁判结果': 'Judgment',
        '相关法条': 'Relevant Statutes',
        '关联索引': 'Related Provisions',
        '执行理由': 'Reasoning',
        '执行要旨': 'Holding',
        '调解结果': 'Mediation Outcome',
        '调解指引': 'Mediation Guidance',
        '案例价值': 'Significance'
      }
    }
  };

  let lang = 'zh';
  try {
    const saved = localStorage.getItem('orion-lang');
    if (saved === 'en' || saved === 'zh') lang = saved;
  } catch (e) { /* 隐私模式忽略 */ }

  const t = (key) => (I18N[lang] && I18N[lang][key]) || I18N.zh[key] || key;
  const fmt = (tpl, map) => String(tpl).replace(/\{(\w+)\}/g, (m, k) => (k in map ? map[k] : m));
  const catLabel = (c) => (lang === 'en' && I18N.en.cats[c]) ? I18N.en.cats[c] : c;
  const secLabel = (s) => (lang === 'en' && I18N.en.sectionLabels[s]) ? I18N.en.sectionLabels[s] : s;
  const typeLabel = (c) => (String(c.type).indexOf('指导') > -1 ? t('typeGuiding') : t('typeReference'));

  /* ---- 轻量星海（与主页一致的浅层星尘，掺金） ---- */
  const canvas = document.getElementById('space');
  const ctx = canvas ? canvas.getContext('2d') : null;
  if (ctx) {
    const hexToRgb = (hex) => {
      const raw = (hex || '').trim().replace('#', '');
      if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(raw)) return { r: 232, g: 244, b: 255 };
      const full = raw.length === 3 ? raw.split('').map((c) => c + c).join('') : raw;
      const n = parseInt(full, 16);
      return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
    };
    const rgba = (c, a) => `rgba(${c.r},${c.g},${c.b},${a})`;
    let palette = { signal: hexToRgb('#5fb8ff'), pulse: hexToRgb('#e8f4ff'), answer: hexToRgb('#ffb454') };
    let stars = [];
    let viewW = 0;
    let viewH = 0;
    let running = false;
    let rafId = 0;

    const readPalette = () => {
      const cs = getComputedStyle(root);
      palette = { signal: hexToRgb(cs.getPropertyValue('--signal')), pulse: hexToRgb(cs.getPropertyValue('--pulse')), answer: hexToRgb(cs.getPropertyValue('--answer')) };
    };
    const makeStars = () => {
      const count = Math.round(Math.min(150, (viewW * viewH) / 11000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * viewW,
        y: Math.random() * viewH,
        r: Math.random() * 1.1 + 0.3,
        a: Math.random() * 0.5 + 0.16,
        tw: Math.random() * Math.PI * 2,
        ts: Math.random() * 0.9 + 0.25,
        blue: Math.random() < 0.26,
        gold: Math.random() < 0.14
      }));
    };
    const draw = (t, still) => {
      ctx.clearRect(0, 0, viewW, viewH);
      for (const s of stars) {
        const alpha = still ? s.a : Math.max(0.05, s.a * (0.6 + 0.4 * Math.sin(s.tw + t * s.ts)));
        ctx.globalAlpha = alpha;
        ctx.fillStyle = rgba(s.gold ? palette.answer : s.blue ? palette.signal : palette.pulse, 1);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };
    const tick = (now) => {
      if (!running) return;
      rafId = requestAnimationFrame(tick);
      draw(now / 1000, false);
    };
    const start = () => {
      if (running || reduceQuery.matches) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(rafId);
    };
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      viewW = window.innerWidth;
      viewH = window.innerHeight;
      canvas.width = Math.round(viewW * dpr);
      canvas.height = Math.round(viewH * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      readPalette();
      makeStars();
      if (reduceQuery.matches) draw(0, true);
    };
    resize();
    start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
    reduceQuery.addEventListener('change', (e) => {
      if (e.matches) { stop(); draw(0, true); return; }
      start();
    });
  }

  /* ---- 数据缺失兜底 ---- */
  if (!data || !Array.isArray(data.cases)) {
    root.classList.add('is-ready');
    return;
  }

  const $ = (sel, el) => (el || document).querySelector(sel);
  const state = { cat: '全部', q: '' };
  const SCALES = '<svg class="i-scales" aria-hidden="true"><use href="#i-scales"></use></svg>';

  /* ---- 元素引用 ---- */
  const metaEl = $('#libDataMeta');
  const genEl = $('#libGenerated');
  const statsWrap = $('#libStats');
  const chipsWrap = $('#libChips');
  const input = $('#libSearchInput');
  const listEl = $('#libCards');
  const countEl = $('#libCount');
  const emptyEl = $('#libEmpty');
  const langNote = $('#libLangNote');
  const apEl = $('#libAppendix');
  const dlg = $('#caseDialog');
  const dlgNo = $('#dialogNo');
  const dlgTitle = $('#dialogTitle');
  const dlgSub = $('#dialogSub');
  const dlgBody = $('#caseDialogBody');
  const langSwitch = $('#langSwitch');

  const cats = ['全部'].concat(data.cats || []);
  const countOf = (c) => (c === '全部' ? data.cases.length : data.cases.filter((x) => x.cat === c).length);
  const statEls = new Map();
  const chipEls = new Map();
  let lastCase = null;
  let debounce = 0;

  /* ---- 分类按钮（统计条 + 工具条） ---- */
  const makeCatButton = (c, cls) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = cls;
    btn.setAttribute('aria-pressed', String(state.cat === c));
    btn.appendChild(document.createTextNode(catLabel(c) + ' '));
    const i = document.createElement('i');
    i.textContent = String(countOf(c));
    btn.appendChild(i);
    btn.addEventListener('click', () => setCat(c, cls === 'lib-stat'));
    return btn;
  };

  const buildCatButtons = () => {
    statEls.clear();
    chipEls.clear();
    if (statsWrap) {
      statsWrap.textContent = '';
      for (const c of cats) {
        const b = makeCatButton(c, 'lib-stat');
        statEls.set(c, b);
        statsWrap.appendChild(b);
      }
    }
    if (chipsWrap) {
      chipsWrap.textContent = '';
      for (const c of cats) {
        const b = makeCatButton(c, 'lib-chip');
        chipEls.set(c, b);
        chipsWrap.appendChild(b);
      }
    }
  };

  const setCat = (c, scroll) => {
    state.cat = c;
    statEls.forEach((el, k) => el.setAttribute('aria-pressed', String(k === c)));
    chipEls.forEach((el, k) => el.setAttribute('aria-pressed', String(k === c)));
    renderCards();
    if (scroll && $('#library')) $('#library').scrollIntoView({ behavior: reduceQuery.matches ? 'auto' : 'smooth', block: 'start' });
  };

  /* ---- 检索 ---- */
  if (input) {
    input.addEventListener('input', () => {
      window.clearTimeout(debounce);
      debounce = window.setTimeout(() => {
        state.q = input.value.trim().toLowerCase();
        renderCards();
      }, 140);
    });
  }

  /* ---- 卡片渲染 ---- */
  const matches = (c) => {
    if (state.cat !== '全部' && c.cat !== state.cat) return false;
    if (!state.q) return true;
    const hay = [c.title, c.no, c.ajzh, c.court, c.sortName, c.note, (c.keywords || []).join(' ')].join(' ').toLowerCase();
    return hay.includes(state.q);
  };

  const metaRow = (label, value) => {
    if (!value) return null;
    const div = document.createElement('div');
    const dt = document.createElement('dt');
    dt.textContent = label;
    const dd = document.createElement('dd');
    dd.textContent = value;
    div.append(dt, dd);
    return div;
  };

  const cardEl = (c) => {
    const card = document.createElement('article');
    card.className = 'case-card frame';

    const top = document.createElement('div');
    top.className = 'case-card-top';
    const no = document.createElement('span');
    no.className = 'case-no';
    no.textContent = c.no;
    const badge = document.createElement('span');
    badge.className = 'case-badge';
    badge.innerHTML = SCALES + catLabel(c.cat);
    top.append(no, badge);

    const title = document.createElement('h3');
    title.textContent = c.title;

    card.append(top, title);

    if (c.note) {
      const note = document.createElement('p');
      note.className = 'case-note';
      note.textContent = c.note;
      card.appendChild(note);
    }

    const meta = document.createElement('dl');
    meta.className = 'case-meta';
    for (const row of [metaRow(t('labelCourt'), c.court), metaRow(t('labelDate'), c.date), metaRow(t('labelDocket'), c.ajzh)]) {
      if (row) meta.appendChild(row);
    }
    if (meta.childElementCount) card.appendChild(meta);

    if (c.summary) {
      const sum = document.createElement('p');
      sum.className = 'case-summary';
      sum.textContent = c.summary;
      card.appendChild(sum);
    }

    if (c.keywords && c.keywords.length) {
      const ul = document.createElement('ul');
      ul.className = 'case-keys';
      for (const k of c.keywords.slice(0, 6)) {
        const li = document.createElement('li');
        li.textContent = k;
        ul.appendChild(li);
      }
      card.appendChild(ul);
    }

    const foot = document.createElement('div');
    foot.className = 'case-foot';
    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'case-open';
    openBtn.innerHTML = t('btnReadFull') + '<span class="ghost-glyph" aria-hidden="true">❯</span>';
    openBtn.addEventListener('click', () => openCase(c));
    const src = document.createElement('a');
    src.className = 'case-src';
    src.href = c.url;
    src.target = '_blank';
    src.rel = 'noopener';
    src.textContent = t('btnSource');
    foot.append(openBtn, src);
    card.appendChild(foot);

    return card;
  };

  const renderCards = () => {
    const arr = data.cases.filter(matches);
    listEl.textContent = '';
    for (const c of arr) listEl.appendChild(cardEl(c));
    if (emptyEl) emptyEl.hidden = arr.length > 0;
    if (countEl) {
      countEl.textContent = state.cat === '全部' && !state.q
        ? fmt(t('filesTagAll'), { n: data.total })
        : fmt(t('filesTagFiltered'), { a: arr.length, b: data.total });
    }
  };

  /* ---- 全文弹窗 ---- */
  const renderDialog = (c) => {
    dlgNo.textContent = `${c.no} · ${typeLabel(c)}${c.expired ? t('expired') : ''}`;
    dlgTitle.textContent = c.title;
    dlgSub.textContent = c.subTitle || '';
    dlgSub.hidden = !c.subTitle;

    dlgBody.textContent = '';

    const badgeRow = document.createElement('div');
    badgeRow.className = 'dialog-badge-row';
    const badge = document.createElement('span');
    badge.className = 'case-badge';
    badge.innerHTML = SCALES + catLabel(c.cat);
    badgeRow.appendChild(badge);
    if (c.note) {
      const note = document.createElement('p');
      note.className = 'dialog-note';
      note.textContent = c.note;
      badgeRow.appendChild(note);
    }
    dlgBody.appendChild(badgeRow);

    const meta = document.createElement('dl');
    meta.className = 'dialog-meta';
    const rows = [
      [t('labelCause'), c.sortName],
      [t('labelCourt'), c.court],
      [t('labelDate'), c.date],
      [t('labelDocket'), c.ajzh],
      [t('labelCaseType'), c.caseSort],
      [t('labelArchiveNo'), c.no]
    ];
    for (const [label, value] of rows) {
      if (!value) continue;
      const item = document.createElement('div');
      item.className = 'dossier-item';
      const dt = document.createElement('dt');
      dt.textContent = label;
      const dd = document.createElement('dd');
      dd.textContent = value;
      item.append(dt, dd);
      meta.appendChild(item);
    }
    dlgBody.appendChild(meta);

    if (c.keywords && c.keywords.length) {
      const ul = document.createElement('ul');
      ul.className = 'case-keys dialog-keys';
      for (const k of c.keywords) {
        const li = document.createElement('li');
        li.textContent = k;
        ul.appendChild(li);
      }
      dlgBody.appendChild(ul);
    }

    for (const sec of c.sections || []) {
      const wrap = document.createElement('div');
      wrap.className = 'dialog-section';
      const h = document.createElement('h4');
      h.textContent = secLabel(sec.t);
      wrap.appendChild(h);
      for (const p of sec.b) {
        const para = document.createElement('p');
        para.textContent = p;
        wrap.appendChild(para);
      }
      dlgBody.appendChild(wrap);
    }

    const foot = document.createElement('div');
    foot.className = 'dialog-foot';
    const src = document.createElement('a');
    src.className = 'btn-ghost';
    src.href = c.url;
    src.target = '_blank';
    src.rel = 'noopener';
    src.innerHTML = t('dlgSource') + '<span class="ghost-glyph" aria-hidden="true">❯</span>';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dialog-close';
    close.textContent = t('btnClose');
    close.addEventListener('click', () => dlg.close());
    foot.append(src, close);
    dlgBody.appendChild(foot);
  };

  const openCase = (c) => {
    if (!dlg) return;
    lastCase = c;
    renderDialog(c);
    if (!dlg.open) {
      if (typeof dlg.showModal === 'function') dlg.showModal();
      else dlg.setAttribute('open', '');
    }
    dlgBody.scrollTop = 0;
  };

  if (dlg) {
    dlg.addEventListener('click', (e) => {
      if (e.target === dlg) dlg.close();
    });
    const dlgClose = $('#dialogClose');
    if (dlgClose) dlgClose.addEventListener('click', () => dlg.close());
  }

  /* ---- 附录 ---- */
  const buildAppendix = () => {
    if (!apEl || !Array.isArray(data.appendix)) return;
    apEl.textContent = '';
    for (const a of data.appendix) {
      const li = document.createElement('li');
      const link = document.createElement('a');
      link.href = a.url;
      link.target = '_blank';
      link.rel = 'noopener';
      link.textContent = a.title;
      const note = document.createElement('span');
      note.className = 'ap-note';
      note.textContent = a.note;
      const ext = document.createElement('a');
      ext.className = 'ap-link';
      ext.href = a.url;
      ext.target = '_blank';
      ext.rel = 'noopener';
      ext.textContent = t('btnViewOriginal');
      li.append(link, note, ext);
      apEl.appendChild(li);
    }
  };

  /* ---- 静态文案与语言切换 ---- */
  const applyStatic = () => {
    document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => { el.innerHTML = t(el.dataset.i18nHtml); });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => { el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)); });
  };

  const applyLang = (next) => {
    lang = next === 'en' ? 'en' : 'zh';
    try { localStorage.setItem('orion-lang', lang); } catch (e) { /* 忽略 */ }
    root.lang = lang === 'en' ? 'en' : 'zh-CN';
    document.title = t('docTitle');

    applyStatic();

    if (metaEl) metaEl.textContent = fmt(t('dataMeta'), { n: data.total });
    if (genEl) {
      const d = new Date(data.generatedAt);
      const ym = `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}`;
      genEl.textContent = fmt(t('heroLogline'), { ym });
    }
    if (langNote) langNote.hidden = lang !== 'en';
    if (langSwitch) {
      langSwitch.querySelectorAll('button').forEach((b) => {
        b.setAttribute('aria-pressed', String(b.dataset.lang === lang));
      });
    }

    buildCatButtons();
    renderCards();
    buildAppendix();
    if (dlg && dlg.open && lastCase) {
      const st = dlgBody.scrollTop;
      renderDialog(lastCase);
      dlgBody.scrollTop = st;
    }
  };

  if (langSwitch) {
    langSwitch.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      if (btn.dataset.lang !== lang) applyLang(btn.dataset.lang);
    });
  }

  /* ---- 首屏 ---- */
  applyLang(lang);

  /* ---- 载入编排 ---- */
  const acquire = () => root.classList.add('is-ready');
  if (reduceQuery.matches) acquire();
  else requestAnimationFrame(() => requestAnimationFrame(acquire));
})();
