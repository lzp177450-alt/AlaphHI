/* 产品脚本（零依赖，原生 JS · 中英双语）
   首页：产品目录渲染 / 分类筛选 / 关键词检索 / 详情弹窗 / 物流查询
   详情页：按 <body data-product="slug"> 渲染产品内容
   语言由 assets/js/site.js 提供（window.SITE），切换时自动重渲染。
   数据：assets/js/products-data.js（window.PRODUCTS） */
(() => {
  'use strict';

  const PRODUCTS = window.PRODUCTS || [];
  const CATEGORY_EN = window.PRODUCT_CATEGORY_EN || {};
  const SITE = window.SITE || { lang: () => 'zh', t: (key) => key };

  const isEn = () => SITE.lang() === 'en';

  const esc = (v) =>
    String(v)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  /* 按当前语言取产品字段（英文缺失时回退中文） */
  const f = (p, key) => (isEn() && p.en && p.en[key]) ? p.en[key] : p[key];
  const catLabel = (cat) => (isEn() && CATEGORY_EN[cat]) ? CATEGORY_EN[cat] : cat;

  /* ---------------- 详情内容（弹窗与详情页共用） ---------------- */

  const rowsHTML = (list) => list.map((r) => `<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('');

  function detailSections(p) {
    const points = f(p, 'highlights').map((h) => `<li>${esc(h)}</li>`).join('');

    return [
      `<span class="image main prod-banner"><img src="${p.image}" alt="${esc(f(p, 'name'))}"></span>`,
      `<h2>${SITE.t('highlightsTitle')}</h2>`,
      `<p>${esc(f(p, 'summary'))}</p>`,
      `<ul class="prod-points">${points}</ul>`,
      `<h2>${SITE.t('specsTitle')}</h2>`,
      `<div class="table-wrapper"><table class="prod-table"><tbody>${rowsHTML(f(p, 'specs'))}</tbody></table></div>`,
      `<h2>${SITE.t('priceTitle')}</h2>`,
      `<p>${SITE.t('priceNote')}</p>`,
      `<h2>${SITE.t('serviceTitle')}</h2>`,
      `<p>${esc(f(p, 'service'))}</p>`
    ].join('');
  }

  function pageActions() {
    return [
      '<ul class="actions">',
      `<li><a class="button primary" href="index.html#products">${SITE.t('backToCatalog')}</a></li>`,
      `<li><a class="button" href="tel:000-0000-0000">${SITE.t('callQuote')}</a></li>`,
      `<li><a class="button" href="index.html#logistics">${SITE.t('trackShipment')}</a></li>`,
      '</ul>'
    ].join('');
  }

  function dialogActions(p) {
    return [
      '<ul class="actions">',
      `<li><a class="button primary" href="product-${p.slug}.html">${SITE.t('openFullPage')}</a></li>`,
      `<li><a class="button" href="tel:000-0000-0000">${SITE.t('callQuote')}</a></li>`,
      `<li><a class="button" href="#logistics">${SITE.t('trackShipment')}</a></li>`,
      '</ul>'
    ].join('');
  }

  /* ---------------- 首页：产品目录 ---------------- */

  function initCatalog() {
    const grid = document.getElementById('prodGrid');
    const chipsBox = document.getElementById('prodChips');
    const search = document.getElementById('prodSearch');
    const empty = document.getElementById('prodEmpty');
    const count = document.getElementById('prodCount');

    const categories = ['全部', ...new Set(PRODUCTS.map((p) => p.category))];
    let activeCat = '全部';
    let query = '';

    function renderChips() {
      chipsBox.innerHTML = '';
      categories.forEach((cat) => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'prod-chip' + (cat === activeCat ? ' is-active' : '');
        chip.textContent = cat === '全部' ? SITE.t('chipAll') : catLabel(cat);
        chip.addEventListener('click', () => {
          activeCat = cat;
          [...chipsBox.children].forEach((item) => item.classList.toggle('is-active', item === chip));
          render();
        });
        chipsBox.appendChild(chip);
      });
    }

    function matches(p) {
      if (activeCat !== '全部' && p.category !== activeCat) return false;
      if (!query) return true;
      const hay = [
        p.name, p.en && p.en.name,
        p.model,
        p.category, catLabel(p.category),
        p.summary, p.en && p.en.summary
      ].join(' ').toLowerCase();
      return hay.includes(query);
    }

    function render() {
      const list = PRODUCTS.filter(matches);
      grid.innerHTML = list.map(cardHTML).join('');
      empty.hidden = list.length > 0;
      count.textContent = SITE.t('countAll', { n: list.length });
    }

    search.addEventListener('input', () => {
      query = search.value.trim().toLowerCase();
      render();
    });

    document.addEventListener('stellar:langchange', () => {
      renderChips();
      render();
    });

    renderChips();
    render();
  }

  function cardHTML(p) {
    const url = `product-${p.slug}.html`;
    const name = f(p, 'name');
    const badges = (f(p, 'badges') || []).map((b) => `<span class="prod-badge">${esc(b)}</span>`).join('');
    const quick = (f(p, 'quickSpecs') || []).map((s) => `<li>${esc(s[0])} · ${esc(s[1])}</li>`).join('');

    return [
      '<li class="prod-card">',
      `<a class="prod-media" href="${url}" data-detail="${p.slug}" tabindex="-1" aria-hidden="true">`,
      `<img src="${p.image}" alt="${esc(name)}" loading="lazy">`,
      badges ? `<span class="prod-badges">${badges}</span>` : '',
      '</a>',
      '<div class="prod-body">',
      `<p class="prod-cat">${esc(catLabel(p.category))}</p>`,
      `<h3><a href="${url}" data-detail="${p.slug}">${esc(name)}</a></h3>`,
      `<p class="prod-model">${SITE.t('modelLabel')} ${esc(p.model)}</p>`,
      `<ul class="prod-quick">${quick}</ul>`,
      `<p class="prod-note">${SITE.t('priceNoteCard')}</p>`,
      '<div class="prod-actions">',
      `<a class="button small primary" href="${url}" data-detail="${p.slug}">${SITE.t('cardDetail')}</a>`,
      `<a class="button small" href="#cta">${SITE.t('cardQuote')}</a>`,
      '</div>',
      '</div>',
      '</li>'
    ].join('');
  }

  /* ---------------- 首页：详情弹窗 ---------------- */

  function initDialog() {
    const dialog = document.getElementById('prodDialog');
    const bodyBox = document.getElementById('prodDialogBody');
    const nameEl = document.getElementById('prodDialogName');
    const subEl = document.getElementById('prodDialogSub');
    const closeBtn = document.getElementById('prodDialogClose');
    const grid = document.getElementById('prodGrid');
    if (!dialog || !grid) return;

    function open(slug) {
      const p = PRODUCTS.find((item) => item.slug === slug);
      if (!p) return;
      nameEl.textContent = f(p, 'name');
      subEl.textContent = `${SITE.t('modelLabel')} ${p.model} · ${catLabel(p.category)}`;
      subEl.hidden = false;
      bodyBox.innerHTML = detailSections(p) + dialogActions(p);
      bodyBox.scrollTop = 0;
      dialog.showModal();
      document.body.classList.add('is-locked');
    }

    grid.addEventListener('click', (event) => {
      const link = event.target.closest('a[data-detail]');
      if (!link) return;
      /* 新标签 / 中键点击时保留默认行为（打开详情页） */
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      open(link.dataset.detail);
    });

    closeBtn.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    /* 弹窗内的页内锚点（如「物流查询」）：关闭弹窗，让页面平滑滚动过去 */
    bodyBox.addEventListener('click', (event) => {
      if (event.target.closest('a[href^="#"]')) dialog.close();
    });
    dialog.addEventListener('close', () => document.body.classList.remove('is-locked'));
  }

  /* ---------------- 详情页 ---------------- */

  function initDetail(slug) {
    const host = document.getElementById('prodDetail');
    const nameEl = document.getElementById('prodName');
    const subEl = document.getElementById('prodHeadSub');
    const p = PRODUCTS.find((item) => item.slug === slug);

    if (!p) {
      if (host) host.innerHTML = `<p>${SITE.t('productNotFound')}</p>`;
      return;
    }

    const name = f(p, 'name');
    document.title = `${name}｜${SITE.t('detailSuffix')}｜${SITE.t('brand')}`;
    if (nameEl) nameEl.textContent = name;
    if (subEl) subEl.textContent = `${SITE.t('modelLabel')} ${p.model} · ${catLabel(p.category)}`;
    if (host) host.innerHTML = detailSections(p) + pageActions();

    const ctaTitle = document.getElementById('prodCtaTitle');
    if (ctaTitle) ctaTitle.textContent = SITE.t('needQuote', { name });
  }

  /* ---------------- 物流查询 ---------------- */

  function initTrack() {
    const form = document.getElementById('trackForm');
    const input = document.getElementById('trackInput');
    const hint = document.getElementById('trackHint');
    if (!form || !input || !hint) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const trackingNo = input.value.trim().replace(/\s+/g, '');

      if (!/^[0-9A-Za-z-]{6,32}$/.test(trackingNo)) {
        hint.textContent = SITE.t('trackErr');
        hint.classList.add('is-error');
        input.focus();
        return;
      }

      hint.classList.remove('is-error');
      hint.textContent = SITE.t('trackGo', { no: trackingNo });
      window.open('https://www.kuaidi100.com/chaxun?com=&nu=' + encodeURIComponent(trackingNo), '_blank', 'noopener');
    });

    input.addEventListener('input', () => {
      if (!hint.classList.contains('is-error')) return;
      hint.classList.remove('is-error');
      hint.textContent = SITE.t('trackHint');
    });

    document.addEventListener('stellar:langchange', () => {
      hint.classList.remove('is-error');
      hint.textContent = SITE.t('trackHint');
    });
  }

  /* ---------------- 启动 ---------------- */

  const detailSlug = document.body.dataset.product;

  if (detailSlug) {
    initDetail(detailSlug);
    document.addEventListener('stellar:langchange', () => initDetail(detailSlug));
  }

  if (document.getElementById('prodGrid')) {
    initCatalog();
    initDialog();
  }

  if (document.getElementById('trackForm')) initTrack();
})();
