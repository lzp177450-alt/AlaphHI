/* 站点交互脚本（单页站）
   1) 多语言（中 / EN）：data-i18n / data-i18n-html / data-i18n-placeholder / data-i18n-aria
      语言选择记忆在 localStorage（键：stellar-lang）
   2) 移动端导航抽屉：汉堡按钮 + 遮罩 + 丝滑开合
   对外暴露 window.SITE = { lang, setLang, t }；
   语言切换完成后派发 'stellar:langchange' 事件（供 products.js 等重渲染）。 */
(() => {
  'use strict';

  const KEY = 'stellar-lang';
  const root = document.documentElement;

  /* ---------------- 文案字典 ---------------- */

  const DICT = {
    zh: {
      docTitle: '【公司名称】｜一站式企业产品供应与配套服务',
      brand: '【公司名称】',
      brandLine1: '一站式企业产品供应与配套服务',
      brandLine2: '从选品、报价到交付与售后，一次对接，全流程负责',
      langAria: '语言切换 / Language',
      menuOpen: '打开导航菜单',
      drawerAria: '移动端导航',
      navIntro: '公司背景',
      navServices: '服务能力',
      navProducts: '产品目录',
      navLogistics: '物流查询',
      navContact: '联系我们',

      introTitle: '值得长期托付的供应伙伴',
      introP1: '【公司名称】专注企业级产品供应与配套服务，业务覆盖多个核心品类，为经销商、工程配套与企业集采客户提供稳定的货源与透明的价格。',
      introP2: '我们与上游厂商保持长期合作，支持样品试用、小批量试单与长期框架协议，并可按需提供定制与 OEM 配套，帮助客户降低采购成本、缩短交付周期。',
      introBtn: '浏览产品供应',

      svcTitle: '服务能力',
      svc1Title: '产品供应',
      svc1Text: '多品类选品与集中采购，提供现货、排产与定制三种供货模式，支持样品试用与小批量试单。',
      svc2Title: '交付与物流',
      svc2Text: '订单全流程跟踪，全国仓储配送，支持指定快递与物流承运商，运单号可随时查询。',
      svc3Title: '售后与支持',
      svc3Text: '质保与换补支持，专属业务对接，协助选型与技术确认，工作时段快速响应。',
      svcBtn: '联系我们获取方案',

      productsTitle: '产品目录',
      productsLead: '按分类筛选或搜索关键词，点击「查看详情」查看完整规格参数与服务说明。',
      searchPh: '搜索产品 / 型号…',
      searchAria: '搜索产品',
      chipAll: '全部',
      countAll: '共 {n} 款产品',
      emptyText: '未找到匹配产品 · 换个关键词或分类试试',
      cardDetail: '查看详情',
      cardQuote: '询价',
      priceNoteCard: '具体价格以报价单为准',
      modelLabel: '型号',

      logisticsTitle: '物流查询',
      logisticsLede: '输入运单号，跳转快递100 查询实时物流轨迹<br />自动识别承运商 · 顺丰等个别快递需在其页面按提示验证手机号',
      trackAria: '运单号',
      trackPh: '请输入运单号，如 SF1234567890',
      trackBtn: '查询物流',
      trackHint: '本页不收集任何信息，运单号仅在快递100 页面完成查询。',
      trackErr: '请输入 6–32 位运单号（字母 / 数字 / -），例如 SF1234567890',
      trackGo: '正在跳转快递100 查询：{no} …',

      ctaTitle: '获取产品目录与报价方案',
      ctaDesc: '告诉我们您需要的品类、数量与交付要求，我们在一个工作日内回复报价与样品信息。<br />支持企业集采、工程配套与区域经销合作。',
      ctaCall: '立即联系业务',
      ctaMail: '发送询价邮件',

      footerAboutTitle: '以稳定供应，赢得长期合作',
      footerAboutText: '【公司名称】——一站式企业产品供应与配套服务。从选品、报价到交付与售后，我们以稳定的货源、透明的价格与可靠的服务，成为您值得长期托付的供应伙伴。',
      footerAboutBtn: '了解公司背景',
      footerContactTitle: '联系方式',
      dtAddress: '地址',
      dtPhone: '电话',
      dtEmail: '邮箱',
      dtHours: '工作时间',
      ddAddress: '【公司地址】',
      ddPhone: '【联系电话】',
      ddEmail: '【联系邮箱】',
      ddHours: '周一至周六 9:00–18:00',
      iconAriaPhone: '电话',
      iconAriaMail: '邮箱',
      iconAriaContact: '联系我们',
      copyright: '&copy; 【公司名称】. Design: <a href="https://html5up.net">HTML5 UP</a>.',

      dialogAria: '产品详情',
      dialogClose: '关闭 ✕',
      highlightsTitle: '产品亮点',
      specsTitle: '规格参数',
      priceTitle: '价格',
      priceNote: '具体价格以报价单为准。',
      serviceTitle: '服务说明',
      backToCatalog: '返回产品目录',
      callQuote: '电话询价',
      trackShipment: '物流查询',
      openFullPage: '在新页面打开详情页 ↗',
      needQuote: '需要「{name}」的报价或样品？',
      needQuoteDesc: '告诉我们数量与交付要求，一个工作日内回复报价与样品信息。',
      detailSuffix: '产品详情',
      productNotFound: '未找到该产品，请返回产品目录查看。',
      noscriptGrid: '产品列表需要启用 JavaScript 显示；如需产品目录，请致电【联系电话】联系我们。',
      noscriptDetail: '本页详情需要启用 JavaScript 显示；请致电【联系电话】，或返回产品目录。'
    },
    en: {
      docTitle: '【Company Name】 | One-stop Corporate Product Supply & Support Services',
      brand: '【Company Name】',
      brandLine1: 'One-stop Corporate Product Supply & Support Services',
      brandLine2: 'From selection and quotation to delivery and after-sales — one point of contact, end to end',
      langAria: 'Language / 语言切换',
      menuOpen: 'Open navigation menu',
      drawerAria: 'Mobile navigation',
      navIntro: 'About',
      navServices: 'Services',
      navProducts: 'Products',
      navLogistics: 'Logistics',
      navContact: 'Contact',

      introTitle: 'A Supply Partner You Can Rely On',
      introP1: '【Company Name】 focuses on corporate product supply and support services across multiple core categories, serving distributors, project integrators and corporate procurement teams with stable sourcing and transparent pricing.',
      introP2: 'We maintain long-term partnerships with upstream manufacturers and support sample trials, small-batch trial orders and long-term framework agreements, with custom and OEM options to help customers cut procurement costs and shorten lead times.',
      introBtn: 'Browse Products',

      svcTitle: 'Service Capabilities',
      svc1Title: 'Product Supply',
      svc1Text: 'Multi-category selection and centralized procurement, with stock, make-to-order and custom supply models; sample trials and small-batch orders supported.',
      svc2Title: 'Delivery & Logistics',
      svc2Text: 'End-to-end order tracking and nationwide warehousing and distribution; your preferred carrier is supported, with tracking numbers queryable at any time.',
      svc3Title: 'After-sales & Support',
      svc3Text: 'Warranty and replacement support, a dedicated account manager, and assistance with selection and technical confirmation, with fast response during business hours.',
      svcBtn: 'Contact Us for a Proposal',

      productsTitle: 'Product Catalog',
      productsLead: 'Filter by category or search by keyword — click “View Details” for full specifications and service notes.',
      searchPh: 'Search product / model…',
      searchAria: 'Search products',
      chipAll: 'All',
      countAll: '{n} products',
      emptyText: 'No matching products · try another keyword or category',
      cardDetail: 'View Details',
      cardQuote: 'Get a Quote',
      priceNoteCard: 'Final pricing subject to quotation',
      modelLabel: 'Model',

      logisticsTitle: 'Logistics Tracking',
      logisticsLede: 'Enter a tracking number to check live status on Kuaidi100.<br />Carrier is auto-detected · For some carriers (e.g. SF Express), phone verification is required on their page.',
      trackAria: 'Tracking number',
      trackPh: 'Tracking number, e.g. SF1234567890',
      trackBtn: 'Track',
      trackHint: 'This page collects no data; the query is completed on Kuaidi100.',
      trackErr: 'Enter a 6–32 character tracking number (letters / digits / -), e.g. SF1234567890',
      trackGo: 'Opening Kuaidi100 for {no} …',

      ctaTitle: 'Get a Quote or Samples',
      ctaDesc: 'Tell us the categories, quantities and delivery requirements — we will reply with a quotation and sample information within one business day.<br />Corporate procurement, project integration and regional distribution partnerships are welcome.',
      ctaCall: 'Call Sales',
      ctaMail: 'Email Us',

      footerAboutTitle: 'Built on Stable Supply, Made for Long-term Partnership',
      footerAboutText: '【Company Name】 — one-stop corporate product supply and support services. From selection and quotation to delivery and after-sales, we aim to be the supply partner you can rely on.',
      footerAboutBtn: 'About Us',
      footerContactTitle: 'Contact',
      dtAddress: 'Address',
      dtPhone: 'Phone',
      dtEmail: 'Email',
      dtHours: 'Hours',
      ddAddress: '【Company Address】',
      ddPhone: '【Phone】',
      ddEmail: '【Email】',
      ddHours: 'Mon–Sat 9:00–18:00',
      iconAriaPhone: 'Phone',
      iconAriaMail: 'Email',
      iconAriaContact: 'Contact us',
      copyright: '&copy; 【Company Name】. Design: <a href="https://html5up.net">HTML5 UP</a>.',

      dialogAria: 'Product details',
      dialogClose: 'Close ✕',
      highlightsTitle: 'Highlights',
      specsTitle: 'Specifications',
      priceTitle: 'Pricing',
      priceNote: 'Final pricing is subject to the official quotation.',
      serviceTitle: 'Service Notes',
      backToCatalog: 'Back to Catalog',
      callQuote: 'Call for a Quote',
      trackShipment: 'Track Shipment',
      openFullPage: 'Open Full Page ↗',
      needQuote: 'Need a quote or sample for “{name}”?',
      needQuoteDesc: 'Tell us the quantity and requirements — we will reply with a quotation and sample information within one business day.',
      detailSuffix: 'Product Details',
      productNotFound: 'Product not found — please check the product catalog.',
      noscriptGrid: 'The product list requires JavaScript. For a catalog, please call 【Phone】.',
      noscriptDetail: 'This page requires JavaScript. Please call 【Phone】 or go back to the catalog.'
    }
  };

  /* ---------------- 语言状态 ---------------- */

  let current = 'zh';

  try {
    if (window.localStorage.getItem(KEY) === 'en') current = 'en';
  } catch (e) { /* 隐私模式忽略 */ }

  function t(key, vars) {
    let text = (DICT[current] && DICT[current][key]) || DICT.zh[key] || key;
    if (vars) {
      Object.keys(vars).forEach((name) => {
        text = text.replace(`{${name}}`, vars[name]);
      });
    }
    return text;
  }

  function apply() {
    root.setAttribute('lang', current === 'en' ? 'en' : 'zh-CN');

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-html]').forEach((el) => {
      el.innerHTML = t(el.dataset.i18nHtml);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((el) => {
      el.setAttribute('aria-label', t(el.dataset.i18nAria));
    });
    document.querySelectorAll('.lang-switch [data-lang]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(btn.dataset.lang === current));
    });

    /* 详情页标题由 products.js 接管，避免被通用标题覆盖 */
    if (!document.body.dataset.product) document.title = t('docTitle');

    document.dispatchEvent(new CustomEvent('stellar:langchange', { detail: { lang: current } }));
  }

  function setLang(next) {
    if (next !== 'en' && next !== 'zh') return;
    if (next === current) return;
    current = next;
    try {
      window.localStorage.setItem(KEY, next);
    } catch (e) { /* 忽略 */ }
    apply();
  }

  /* 语言切换按钮（页面可能存在多处：桌面导航 / 移动端顶栏 / 抽屉） */
  document.querySelectorAll('.lang-switch').forEach((group) => {
    group.addEventListener('click', (event) => {
      const btn = event.target.closest('[data-lang]');
      if (btn) setLang(btn.dataset.lang);
    });
  });

  /* ---------------- 移动端导航抽屉 ---------------- */

  const toggle = document.getElementById('navToggle');
  const drawer = document.getElementById('navDrawer');
  const backdrop = document.getElementById('navBackdrop');

  function setDrawer(open) {
    if (!drawer || !toggle || !backdrop) return;
    drawer.classList.toggle('is-open', open);
    backdrop.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  }

  if (toggle && drawer && backdrop) {
    toggle.addEventListener('click', () => setDrawer(!drawer.classList.contains('is-open')));
    backdrop.addEventListener('click', () => setDrawer(false));
    drawer.addEventListener('click', (event) => {
      if (event.target.closest('a')) setDrawer(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setDrawer(false);
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 736) setDrawer(false);
    });
  }

  /* ---------------- 页内锚点平滑滚动 ----------------
     桌面导航条与 .scrolly 按钮由模板 jQuery scrolly 接管（带动画）。
     这里只兜底其余锚点（抽屉链接、弹窗内链接、顶栏品牌），
     避免与模板逐帧滚动相互干扰。 */

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link || link.classList.contains('scrolly') || link.closest('#nav')) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const hash = link.getAttribute('href');
    if (hash.length < 2) return;

    const target = hash === '#top' ? null : document.querySelector(hash);
    if (!target && hash !== '#top') return;

    event.preventDefault();
    const behavior = reduceMotion.matches ? 'auto' : 'smooth';
    if (target) target.scrollIntoView({ behavior, block: 'start' });
    else window.scrollTo({ top: 0, behavior });
  });

  /* ---------------- 初始化 ---------------- */

  window.SITE = { lang: () => current, setLang, t, apply };
  apply();
})();
