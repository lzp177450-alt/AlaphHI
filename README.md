# 2336·猎户座探测计划 — 星际旅行探索网站

原生 HTML / CSS / JavaScript 单页沉浸式网站，零依赖、零构建。

## 运行

双击 `index.html` 即可（纯静态，支持 `file://` 直接打开）；
部署时把整个目录上传到任意静态托管即可。

## 结构

```
├─ index.html       首页（含 SEO / Open Graph 元信息）
├─ cases.html       AI 知识产权判例档案（星际法庭主题 · 人民法院案例库归档）
├─ css/style.css    全部样式（token 系统 + 六套视觉频段）
├─ css/cases.css    判例档案页面样式（法庭元素：列柱立面 / 天平徽记 / 印章 / 金铜色）
├─ js/main.js       星海 / 雷达 / 跃迁回放 / 自检 / 频段调谐 / 阅读进度 / 载入编排
├─ js/cases.js      判例档案渲染 / 分类筛选 / 检索 / 全文弹窗 / 中英双语切换（orion-lang）
├─ js/cases-data.js 判例数据（自动生成：人民法院案例库整理，见 content/ai-ip-cases/）
├─ stellar/         产品供应公司站（基于 HTML5 UP「Stellar」模板，独立子目录）
└─ assets/
   ├─ favicon.svg   站点图标
   └─ og-cover.png  社交分享封面（1200×630）
```

## 页面分区

| # | 分区 | 说明 |
|---|---|---|
| ① | 信号捕获（Hero） | 星海 + 舷窗雷达，载入编排一次；斜切实心 CTA |
| ② | 深空日志 | 「悬疑未知风」故事全文，四声部排版（时间戳 / 旁白 / AI / 脉冲句） |
| ③ | 影像档案 | 曲率跃迁回放：Canvas 星流动画，三态（待机 / 回放中 / 跃迁完成） |
| ④ | 装备档案 | 聚恒战甲模块示意图 + 六项分段自检条（点击「启动全域自检」动画填充） |
| ⑤ | 六套呈现 | 视觉频段选择器，偏好保存在 `localStorage`（键：`orion-band`） |
| ⑥ | 任务档案 | 联邦归档数据 + 任务简报（`<details>` 展开） |

## 设计说明

- 视觉方向：未知恐惧主义；黑 + 蓝主导，暖色仅用于「生命的应答」一处。
- 五层蓝色纵深：`--void / --abyss / --ice / --signal / --pulse`，深度即距离。
- 三声部字体：叙事（宋体）/ 系统（黑体）/ 机器（等宽），对应故事中的旁白、界面与 AI。
- 全站仅一次载入编排；`prefers-reduced-motion` 下全部降级为静态。
- 规范来源：`content/.agents/skills/frontend-design/SKILL.md`（两遍走：token → 自审 → 落地）。

### 交互语言参考（Star Citizen 官网）

保持本站自身叙事弧与黑色蓝天宇基调，移植了以下交互范式：

- 双层页眉：工具条（面包屑 + 实时信号读数）+ 主导航；
- `PLAY NOW` 式斜切实心 CTA（`clip-path` 箭头角，focus 以 drop-shadow 描边适配）；
- `.btn-txt` 式幽灵发光链（青色 + 细下划线 + 图标位移）；
- 角括号面板（`.frame`）、`REC` 打点、规格自检条等仪器感细节；
- 以 Canvas 星流回放替代官网的视频 hero（无外部媒体资源）。

## 产品供应公司站（`stellar/`）

基于 HTML5 UP「Stellar」模板（CCA 3.0 授权）改造的**单页式**产品供应公司站，
独立子目录、零构建，保留模板原有布局、视觉风格与交互，并扩展了：

- **一页浏览**：公司背景 / 服务能力 / 产品目录 / 物流查询 / 联系我们 全在一页，锚点平滑滚动；
- **产品详情弹窗**：卡片点击即开（`<dialog>`，关闭按钮 / 点遮罩 / ESC 均可关闭），
  另提供 6 个独立详情页作 SEO 落地（弹窗内「在新页面打开详情页」进入，Ctrl/中键点击卡片同样直接打开）；
- **中英双语**：导航、分区文案、产品数据全量切换，选择记忆在 `localStorage`（键：`stellar-lang`）；
- **移动端导航**：≤736px 显示固定顶栏 + 汉堡抽屉（丝滑开合、逐条滑入），桌面端保留模板的滚动收缩导航条；
- **物流查询**：输入运单号 → 跳转快递100 官方查询页（`kuaidi100.com/chaxun?com=&nu=单号`，自动识别承运商，无后端依赖；顺丰等个别快递需在其页面按提示验证手机号）。

| 文件 | 说明 |
|---|---|
| `stellar/index.html` | 公司单页站（含 SEO / OG；产品目录 + 详情弹窗 + 物流查询都在此页） |
| `stellar/product-*.html` | 6 个产品详情页（每页独立 title / description / OG，正文双语渲染） |
| `stellar/products.html` | 旧链接跳转页（→ `index.html#products`，noindex） |
| `stellar/assets/css/main.css` | 模板样式（仅移除 Google Fonts 外链，保证离线 / file:// 可用） |
| `stellar/assets/css/custom.css` | 中文适配补丁：字体回退 / 标题字距 / 页脚标签宽度 |
| `stellar/assets/css/products.css` | 产品样式：卡片网格 / 筛选检索 / 物流查询 / 详情内容 |
| `stellar/assets/css/site.css` | 单页站扩展：移动端抽屉 / 语言切换 / 详情弹窗 / 平滑滚动 |
| `stellar/assets/js/site.js` | 站点交互：中英文案字典 + 语言切换 + 导航抽屉（`window.SITE`） |
| `stellar/assets/js/products-data.js` | 产品数据（示例数据 · 单一数据源 · 中英双语，`en` 对象存英文） |
| `stellar/assets/js/products.js` | 产品脚本（目录渲染 / 筛选 / 检索 / 弹窗 / 详情页 / 物流跳转，零依赖） |
| `stellar/assets/js/` 其余 | 模板脚本（jQuery + skel，全部本地引用，不联网） |
| `stellar/images/prod-*.jpg` | 6 张产品占位图（960×600，可逐张替换） |
| `stellar/images/og-cover.png` | 分享封面占位图（1200×630，可替换） |
| `stellar/generic.html`、`stellar/elements.html` | 模板自带参考页，做新页面时对照样式用 |

预览：双击 `stellar/index.html` 即可（file:// 直开，无需服务器）。

### 价格展示约定

不展示具体价格数字，卡片与详情统一提示「具体价格以报价单为准」，通过电话 / 邮箱询价。

### 如何新增 / 替换产品

1. 编辑 `stellar/assets/js/products-data.js`：按现有结构新增或修改对象（卡片、弹窗、详情页都会更新）；
   中文写在中文字段，英文写在同一个对象的 `en` 对象里（缺失时自动回退中文）；
2. 复制任意 `stellar/product-<slug>.html` 为新产品页，改文件名与 `data-product="slug"`，
   并更新 `<head>` 里的 title / description / OG（详情页 SEO 依靠静态 head）；
3. 替换对应产品图（`stellar/images/prod-*.jpg`）。

界面文案（导航 / 分区标题 / 按钮 / 页脚等）在 `stellar/assets/js/site.js` 的 `DICT` 里，
按 `data-i18n` 键名成对维护中英文即可。

### 占位替换清单（对甲方演示前逐项替换）

- 【公司名称】/【Company Name】—— 首页 H1、正文、页脚及 `og:site_name`（中英文案均有）
- 【公司地址】【联系电话】【联系邮箱】—— 各页页脚与 CTA 按钮（含 `tel:` / `mailto:` 链接）
- `stellar/images/pic01.jpg` —— 首页圆形插图，替换为公司实景/产品图（方形最佳）
- `stellar/images/prod-*.jpg` —— 6 张产品图占位（图内含产品名文字，替换即消失）
- `stellar/assets/js/products-data.js` —— 产品名、型号、分类、参数、服务说明均为示例（含英文）
- `stellar/images/og-cover.png` —— 分享封面（当前为占位图）
- 各页 `<head>` 中 `og:url` / `og:image` 的 `https://example.com/stellar/` 为占位域名

## 部署前待办

- 把 `og:url`、`twitter` 相关占位域名替换为实际部署地址（根站与 `stellar/` 两处）。
- `og:image` 建议改为部署后的绝对 URL，兼容部分抓取平台。
- 替换 `stellar/` 的占位内容：公司名称、联系方式、示例数据、占位图片（见上方清单）。
- Stellar 模板为 CCA 3.0 授权，页脚 “Design: HTML5 UP” 署名请保留。
