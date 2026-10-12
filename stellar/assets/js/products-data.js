/* ============================================================
   产品数据（示例数据 · 单一数据源 · 中英双语）
   ------------------------------------------------------------
   本文件同时驱动「首页产品目录」与「产品详情（弹窗 / 详情页）」
   的内容渲染，替换下方数组即可整批更新，无需改页面结构。

   中文字段直接写在对象上；英文翻译写在 en 对象里（同名字段）。
   语言切换由 assets/js/site.js + products.js 处理。

   字段说明：
   - slug        详情页文件名标识：product-<slug>.html（改 slug 需同步改文件名）
   - name        产品名（en.name 为英文名）
   - model       型号 / 编号（中英通用）
   - category    分类（列表页筛选按钮由此自动生成；英文名见 PRODUCT_CATEGORY_EN）
   - badges      角标（如「现货常备」「支持定制」，可留空数组；en.badges 为英文）
   - summary     一句话介绍
   - image       产品图（建议 16:10、960×600 以上；当前为占位图）
   - highlights  产品亮点（详情页清单）
   - quickSpecs  列表卡片上的要点（[标签, 值] 数组）
   - specs       规格参数表（[项目, 参数] 数组）
   - service     服务说明

   注意：参数均为示例占位，替换为真实数据即可。
   价格不在页面展示具体数字，统一提示「具体价格以报价单为准」，
   客户通过电话 / 邮件询价获取报价单。
   ============================================================ */

/* 分类的英文名（筛选按钮显示用，筛选逻辑仍使用中文分类键） */
window.PRODUCT_CATEGORY_EN = {
  '办公耗材': 'Office Supplies',
  '包装耗材': 'Packaging',
  '劳保防护': 'Safety & PPE',
  '清洁用品': 'Cleaning'
};

window.PRODUCTS = [
  {
    slug: 'a4-paper',
    name: 'A4 复印纸 70g',
    model: 'HX-A4-70',
    category: '办公耗材',
    badges: ['现货常备'],
    summary: '高白度原生木浆双胶纸，打印不卡纸、不渗墨；适配主流激光与喷墨打印机，整箱塑封防潮。',
    image: 'images/prod-a4-paper.jpg',
    highlights: [
      '100% 原生木浆，白度柔和不刺眼',
      '批次稳定，同一批号可长期供货',
      '整箱塑封防潮，仓储破损包换'
    ],
    quickSpecs: [['克重', '70g/㎡'], ['规格', '210 × 297 mm'], ['包装', '500 张/包 · 5 包/箱']],
    specs: [
      ['品牌', '【品牌名（占位）】'],
      ['型号', 'HX-A4-70'],
      ['克重', '70g/㎡'],
      ['规格', 'A4 · 210 × 297 mm'],
      ['包装', '500 张/包 · 5 包/箱'],
      ['起订量', '1 箱（5 包）'],
      ['适用设备', '激光 / 喷墨打印机、复印机']
    ],
    service: '运输破损包换、质量问题整批退换；支持对公开票、合同签署与账期结算。',
    en: {
      name: 'A4 Copy Paper 70gsm',
      category: 'Office Supplies',
      badges: ['In Stock'],
      summary: 'High-whiteness wood-pulp offset paper with smooth, jam-free printing; compatible with mainstream laser and inkjet printers and shrink-wrapped by the carton.',
      highlights: [
        '100% virgin wood pulp with a soft, eye-friendly whiteness',
        'Stable batches — the same batch can be supplied long-term',
        'Shrink-wrapped cartons; storage damage replaced free of charge'
      ],
      quickSpecs: [['Weight', '70gsm'], ['Size', '210 × 297 mm'], ['Packing', '500 sheets/pack · 5 packs/carton']],
      specs: [
        ['Brand', '【Brand (placeholder)】'],
        ['Model', 'HX-A4-70'],
        ['Weight', '70gsm'],
        ['Size', 'A4 · 210 × 297 mm'],
        ['Packing', '500 sheets/pack · 5 packs/carton'],
        ['MOQ', '1 carton (5 packs)'],
        ['Devices', 'Laser / inkjet printers, copiers']
      ],
      service: 'Free replacement for transport damage and full-carton returns for quality issues; company invoicing, contracts and account terms supported.'
    }
  },
  {
    slug: 'cardboard-box',
    name: '三层瓦楞纸箱',
    model: 'HX-BOX-3L',
    category: '包装耗材',
    badges: ['支持定制'],
    summary: '三层 B 楞瓦楞纸箱，可定制尺寸与印刷；强度高、堆码稳，适合仓储周转与运输包装。',
    image: 'images/prod-cardboard-box.jpg',
    highlights: [
      '尺寸、材质、印刷均可按需定制',
      '三层 B 楞，强度与缓冲兼顾',
      '可按需打样确认，批量供货稳定'
    ],
    quickSpecs: [['楞型', '三层 B 楞'], ['常用尺寸', '400 × 300 × 200 mm'], ['起订量', '500 个 / 规格']],
    specs: [
      ['型号', 'HX-BOX-3L'],
      ['楞型', '三层 B 楞'],
      ['常用尺寸', '400 × 300 × 200 mm（可定制）'],
      ['材质', '120g 面纸 + 高强瓦楞芯纸'],
      ['印刷', '单色 / 双色（加价项）'],
      ['起订量', '500 个 / 规格']
    ],
    service: '尺寸或材质与确认样不符免费重做；批量订单可签框架协议。',
    en: {
      name: 'Three-layer Corrugated Box',
      category: 'Packaging',
      badges: ['Customizable'],
      summary: 'Three-layer B-flute corrugated boxes with customizable size and printing; strong and stackable, ideal for storage and shipping.',
      highlights: [
        'Size, material and printing fully customizable',
        'B-flute construction balances strength and cushioning',
        'Sample confirmation available; stable batch supply'
      ],
      quickSpecs: [['Flute', '3-layer B-flute'], ['Common size', '400 × 300 × 200 mm'], ['MOQ', '500 pcs / spec']],
      specs: [
        ['Model', 'HX-BOX-3L'],
        ['Flute', '3-layer B-flute'],
        ['Common size', '400 × 300 × 200 mm (customizable)'],
        ['Material', '120g liner + high-strength corrugated medium'],
        ['Printing', '1–2 colors (surcharge applies)'],
        ['MOQ', '500 pcs / spec']
      ],
      service: 'If size or material differs from the confirmed sample, we remake it free of charge; framework agreements available for bulk orders.'
    }
  },
  {
    slug: 'nitrile-gloves',
    name: '一次性丁腈手套',
    model: 'HX-GLOVE-N',
    category: '劳保防护',
    badges: ['现货常备', '多尺码'],
    summary: '丁腈材质无粉手套，耐油耐穿刺、贴合不闷手；食品加工与电子装配等场景均可使用。',
    image: 'images/prod-nitrile-gloves.jpg',
    highlights: [
      '无粉丁腈，不易致敏',
      '耐油、耐穿刺，防静电款可选',
      'S–XL 多尺码常备，整箱起订'
    ],
    quickSpecs: [['材质', '丁腈（无粉）'], ['规格', '100 只 / 盒'], ['尺码', 'S / M / L / XL']],
    specs: [
      ['型号', 'HX-GLOVE-N'],
      ['材质', '丁腈橡胶（无粉）'],
      ['规格', '100 只 / 盒 · 10 盒 / 箱'],
      ['尺码', 'S / M / L / XL'],
      ['特性', '耐油、耐穿刺；防静电款可选'],
      ['起订量', '1 箱']
    ],
    service: '未拆封尺码不合适可换；可随货提供合规检测报告。',
    en: {
      name: 'Disposable Nitrile Gloves',
      category: 'Safety & PPE',
      badges: ['In Stock', 'Multiple Sizes'],
      summary: 'Powder-free nitrile gloves — oil- and puncture-resistant with a snug, breathable fit; suitable for food processing and electronics assembly.',
      highlights: [
        'Powder-free nitrile, low allergy risk',
        'Oil- and puncture-resistant; anti-static version available',
        'S–XL sizes in stock, sold by the carton'
      ],
      quickSpecs: [['Material', 'Nitrile (powder-free)'], ['Packing', '100 pcs / box'], ['Sizes', 'S / M / L / XL']],
      specs: [
        ['Model', 'HX-GLOVE-N'],
        ['Material', 'Nitrile rubber (powder-free)'],
        ['Packing', '100 pcs/box · 10 boxes/carton'],
        ['Sizes', 'S / M / L / XL'],
        ['Features', 'Oil- and puncture-resistant; anti-static option'],
        ['MOQ', '1 carton']
      ],
      service: 'Unopened wrong-size items can be exchanged; compliance test reports available with shipment.'
    }
  },
  {
    slug: 'stretch-film',
    name: 'PE 缠绕膜',
    model: 'HX-FILM-50',
    category: '包装耗材',
    badges: ['现货常备'],
    summary: '高强度 PE 缠绕膜，拉伸不回弹、不易断；适合托盘打包与运输货物固定。',
    image: 'images/prod-stretch-film.jpg',
    highlights: [
      '高拉伸率，同等重量包更多托盘',
      '断膜率低，机器手工均可使用',
      '整件包装，库房常备'
    ],
    quickSpecs: [['宽度', '50 cm'], ['厚度', '约 2.5 丝'], ['净重', '2.5 kg / 卷']],
    specs: [
      ['型号', 'HX-FILM-50'],
      ['宽度', '50 cm'],
      ['厚度', '约 2.5 丝'],
      ['净重', '2.5 kg / 卷（约 300 m）'],
      ['包装', '4 卷 / 件'],
      ['起订量', '1 件']
    ],
    service: '质量异议 7 天内受理；批量供货可按月结算。',
    en: {
      name: 'PE Stretch Film',
      category: 'Packaging',
      badges: ['In Stock'],
      summary: 'High-strength PE stretch film that stretches without rebound or breaking; ideal for pallet wrapping and securing loads in transit.',
      highlights: [
        'High stretch rate — more pallets wrapped per roll',
        'Low breakage rate for both manual and machine use',
        'Sold by the case; regularly stocked'
      ],
      quickSpecs: [['Width', '50 cm'], ['Thickness', '≈ 25 μm'], ['Net weight', '2.5 kg / roll']],
      specs: [
        ['Model', 'HX-FILM-50'],
        ['Width', '50 cm'],
        ['Thickness', '≈ 25 μm'],
        ['Net weight', '2.5 kg / roll (≈ 300 m)'],
        ['Packing', '4 rolls / case'],
        ['MOQ', '1 case']
      ],
      service: 'Quality claims accepted within 7 days; monthly settlement available for bulk supply.'
    }
  },
  {
    slug: 'thermal-label',
    name: '热敏标签纸',
    model: 'HX-LABEL-100',
    category: '办公耗材',
    badges: ['现货常备'],
    summary: '热敏不干胶标签纸，打印清晰、耐磨不掉色；适配主流便携标签打印机。',
    image: 'images/prod-thermal-label.jpg',
    highlights: [
      '打印清晰，不易褪色',
      '强粘不残胶，撕取方便',
      '尺寸与印刷可按需定制'
    ],
    quickSpecs: [['规格', '100 × 100 mm'], ['张数', '500 张 / 卷'], ['适配', '主流热敏标签机']],
    specs: [
      ['型号', 'HX-LABEL-100'],
      ['规格', '100 × 100 mm 方标签'],
      ['张数', '500 张 / 卷'],
      ['胶性', '强粘不残胶'],
      ['适配', '主流热敏标签打印机'],
      ['起订量', '1 箱（20 卷）']
    ],
    service: '未拆封打印不适配可退换；支持定制尺寸与印刷。',
    en: {
      name: 'Thermal Label Paper',
      category: 'Office Supplies',
      badges: ['In Stock'],
      summary: 'Thermal adhesive label paper with crisp, fade-resistant printing; compatible with mainstream portable label printers.',
      highlights: [
        'Crisp, fade-resistant printing',
        'Strong adhesion with no residue',
        'Custom sizes and printing available'
      ],
      quickSpecs: [['Size', '100 × 100 mm'], ['Labels', '500 per roll'], ['Printer', 'Mainstream thermal label printers']],
      specs: [
        ['Model', 'HX-LABEL-100'],
        ['Size', '100 × 100 mm square label'],
        ['Labels', '500 per roll'],
        ['Adhesive', 'Strong, residue-free'],
        ['Printer', 'Mainstream thermal label printers'],
        ['MOQ', '1 carton (20 rolls)']
      ],
      service: 'Unopened rolls can be returned or exchanged if incompatible; custom sizes and printing supported.'
    }
  },
  {
    slug: 'cleaning-wipes',
    name: '工业擦拭布',
    model: 'HX-WIPE-500',
    category: '清洁用品',
    badges: ['样品可试用'],
    summary: '水刺无纺布工业擦拭布，吸油吸水、低掉屑；设备保养与车间清洁适用。',
    image: 'images/prod-cleaning-wipes.jpg',
    highlights: [
      '吸油吸水，擦拭后不留纤维',
      '可搭配溶剂使用，不易破损',
      '提供免费样品试用'
    ],
    quickSpecs: [['材质', '水刺无纺布'], ['尺寸', '300 × 300 mm'], ['张数', '500 张 / 卷']],
    specs: [
      ['型号', 'HX-WIPE-500'],
      ['材质', '水刺无纺布'],
      ['尺寸', '300 × 300 mm'],
      ['张数', '500 张 / 卷'],
      ['特性', '吸油吸水、低掉屑'],
      ['起订量', '2 卷']
    ],
    service: '免费样品试用；批量采购支持按月供货。',
    en: {
      name: 'Industrial Wipes',
      category: 'Cleaning',
      badges: ['Free Sample'],
      summary: 'Spunlace non-woven industrial wipes that absorb oil and water with low lint; ideal for equipment maintenance and workshop cleaning.',
      highlights: [
        'Absorbs oil and water; leaves no fibers',
        'Works with solvents and resists tearing',
        'Free samples available'
      ],
      quickSpecs: [['Material', 'Spunlace non-woven'], ['Size', '300 × 300 mm'], ['Sheets', '500 per roll']],
      specs: [
        ['Model', 'HX-WIPE-500'],
        ['Material', 'Spunlace non-woven'],
        ['Size', '300 × 300 mm'],
        ['Sheets', '500 per roll'],
        ['Features', 'Oil / water absorption, low lint'],
        ['MOQ', '2 rolls']
      ],
      service: 'Free sample trial; monthly supply available for bulk orders.'
    }
  }
];
