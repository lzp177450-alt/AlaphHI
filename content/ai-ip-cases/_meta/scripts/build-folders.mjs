// 最终归档：根据 selection.json（人工复核结果）生成分类文件夹 + 索引
import fs from 'node:fs/promises'
import path from 'node:path'

const META = 'C:\\Users\\13809\\Desktop\\my-website\\content\\ai-ip-cases\\_meta'
const DET = META + '\\details'
const OUT = 'C:\\Users\\13809\\Desktop\\my-website\\content\\ai-ip-cases'
const BASE = 'https://rmfyalk.court.gov.cn'

const html2text = (h) => String(h || '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()

const cleanLine = (h) => html2text(h).replace(/\s+/g, ' ').trim()

function sanitizeFileName(s, max = 100) {
  let out = String(s).replace(/[\\/:*?"<>|\r\n\t]+/g, '-').replace(/[\u0000-\u001f]/g, '')
    .replace(/\s+/g, ' ').replace(/^[ .]+|[ .]+$/g, '')
  if (out.length > max) out = out.slice(0, max).replace(/[ .-]+$/g, '')
  return out || '未命名'
}

function sectionsOf(c) {
  const lib = c.cpws_al_type === '01' ? 'zdx' : 'ck'
  const sortIds = [].concat(c.cpws_al_case_sort_id || []).join(',')
  let modules
  if (lib === 'zdx') {
    if (sortIds.includes('A0501'))
      modules = [['执行实施要点', 'cpws_al_cpyz'], ['基本案情', 'cpws_al_jbaq'], ['执行结果', 'cpws_al_cpjg'], ['执行理由', 'cpws_al_cply'], ['相关法条', 'cpws_al_glsy']]
    else
      modules = [['裁判要点', 'cpws_al_cpyz'], ['基本案情', 'cpws_al_jbaq'], ['裁判结果', 'cpws_al_cpjg'], ['裁判理由', 'cpws_al_cply'], ['相关法条', 'cpws_al_glsy']]
  } else if (sortIds.includes('A0501')) {
    modules = [['基本案情', 'cpws_al_jbaq'], ['执行理由', 'cpws_al_cply'], ['执行要旨', 'cpws_al_cpyz'], ['关联索引', 'cpws_al_glsy']]
  } else if (sortIds.includes('A06')) {
    modules = [['基本案情', 'cpws_al_jbaq'], ['调解结果', 'cpws_al_cply'], ['调解指引', 'cpws_al_cpyz'], ['案例价值', 'cpws_al_aljz'], ['关联索引', 'cpws_al_glsy']]
  } else {
    modules = [['基本案情', 'cpws_al_jbaq'], ['裁判理由', 'cpws_al_cply'], ['裁判要旨', 'cpws_al_cpyz'], ['关联索引', 'cpws_al_glsy']]
  }
  return { lib, modules }
}

const selection = JSON.parse(await fs.readFile(META + '\\selection.json', 'utf8'))
const used = new Set()
const curated = []
const appendix = []

for (const [key, sel] of Object.entries(selection)) {
  if (!sel.include) {
    if (sel.appendix) appendix.push({ title: sel.title, note: sel.appendixNote || '', id: sel.id })
    continue
  }
  let raw
  try {
    raw = JSON.parse(await fs.readFile(path.join(DET, 'case-' + key + '.json'), 'utf8'))
  } catch {
    console.log('缺少详情：' + key)
    continue
  }
  const c = raw.content
  const e = raw.entry || {}
  const title = cleanLine(c.cpws_al_title)
  const cat = sel.cat
  const subTitle = cleanLine(c.cpws_al_sub_title || '')
  const keywordArr = [].concat(c.cpws_al_keyword || []).map(cleanLine)
  const no = cleanLine(c.cpws_al_no || key)
  const { lib, modules } = sectionsOf(c)
  const linkId = (e.ids && e.ids[0]) || ''
  const srcUrl = `${BASE}/view/content.html?id=${linkId}&lib=${lib}`

  let md = `# ${title}\n`
  if (subTitle) md += `\n> ${subTitle}\n`
  md += `\n> 分类（整理）：**${cat}**${sel.note ? '　·　' + sel.note : ''}\n`
  md += `\n| 项目 | 内容 |\n| --- | --- |\n`
  if (no) md += `| 入库编号 | ${no} |\n`
  const typeText = c.cpws_al_type === '01' ? '指导性案例' : '参考案例'
  const statusText = c.cpws_al_status === '02' ? '（已失效）' : ''
  md += `| 案例类型 | ${typeText}${statusText} |\n`
  const caseSort = cleanLine(c.cpws_al_case_sort_name || '')
  if (caseSort) md += `| 案件类型 | ${caseSort} |\n`
  const sortName = cleanLine(e.sortName || c.cpws_al_sort_name || '')
  if (sortName) md += `| 案由 | ${sortName} |\n`
  const court = cleanLine(e.court || c.cpws_al_slfy_name || '')
  if (court) md += `| 审理法院 | ${court} |\n`
  const date = cleanLine(e.date || c.cpws_al_zs_date || '')
  if (date) md += `| 裁判日期 | ${date} |\n`
  const ajzh = cleanLine(c.cpws_al_ajzh || '')
  if (ajzh) md += `| 案号 | ${ajzh} |\n`
  const slcx = cleanLine(c.cpws_al_slcx_name || '')
  if (slcx) md += `| 审理程序 | ${slcx} |\n`
  if (keywordArr.length) md += `| 关键词 | ${keywordArr.join('；')} |\n`
  md += `| 原文链接 | [人民法院案例库](${srcUrl}) |\n`
  md += `\n---\n`
  for (const [label, field] of modules) {
    const text = html2text(c[field])
    if (text) md += `\n## ${label}\n\n${text}\n`
  }
  md += `\n---\n\n*来源：人民法院案例库（https://rmfyalk.court.gov.cn）· 整理时间：${new Date().toISOString().slice(0, 10)}*\n`

  let fname = sanitizeFileName(`${no ? no + ' ' : ''}${title}`)
  let finalName = fname + '.md'
  let n = 2
  while (used.has(cat + '/' + finalName)) finalName = `${fname} (${n++}).md`
  used.add(cat + '/' + finalName)
  await fs.mkdir(path.join(OUT, cat), { recursive: true })
  await fs.writeFile(path.join(OUT, cat, finalName), md, 'utf8')

  curated.push({
    no, title, cat, note: sel.note || '', lib, url: srcUrl,
    file: `${cat}/${finalName}`,
    ajzh, court, date, caseSort, sortName,
    keywords: keywordArr,
    summary: html2text(c.cpws_al_cpyz).slice(0, 300)
  })
}

const CAT_ORDER = ['著作权', '商标', '专利', '不正当竞争', '商业秘密', '其他（AI相关）']
curated.sort((a, b) => (CAT_ORDER.indexOf(a.cat) - CAT_ORDER.indexOf(b.cat)) || a.title.localeCompare(b.title, 'zh'))
appendix.sort((a, b) => a.title.localeCompare(b.title, 'zh'))

const groups = {}
for (const r of curated) (groups[r.cat] = groups[r.cat] || []).push(r)

let idx = `# 人民法院案例库 · AI 知识产权案例汇编\n\n`
idx += `- 来源：人民法院案例库（https://rmfyalk.court.gov.cn）\n`
idx += `- 整理时间：${new Date().toLocaleString('zh-CN')}\n`
idx += `- 收录：${curated.length} 篇（按侵权类型分文件夹），另附 ${appendix.length} 篇 AI 相关非知产案例说明（见文末）\n`
idx += `- 说明：“其他（AI相关）”收录与 AI 技术直接相关但非典型知识产权类型的案件（人格权、个人信息等），供参考\n\n`
idx += `## 分类统计\n\n| 侵权类型 | 数量 |\n| --- | --- |\n`
for (const cat of CAT_ORDER) if (groups[cat]) idx += `| ${cat} | ${groups[cat].length} |\n`
idx += `\n`
for (const cat of CAT_ORDER) {
  if (!groups[cat]) continue
  idx += `\n## ${cat}（${groups[cat].length} 篇）\n\n`
  idx += `| # | 标题 | 入库编号 | 案号 | 法院 | 裁判日期 | 文件 |\n| --- | --- | --- | --- | --- | --- | --- |\n`
  groups[cat].forEach((r, i) => {
    idx += `| ${i + 1} | ${r.title} | ${r.no} | ${r.ajzh} | ${r.court} | ${r.date} | [打开](./${encodeURI(r.file)}) |\n`
  })
}
if (appendix.length) {
  idx += `\n## 附：AI 相关但非知识产权案件（仅列明，未归档）\n\n`
  idx += `| # | 标题 | 说明 | 链接 |\n| --- | --- | --- | --- |\n`
  appendix.forEach((r, i) => {
    idx += `| ${i + 1} | ${r.title} | ${r.note} | [查看](${BASE}/view/content.html?id=${r.id}) |\n`
  })
}
await fs.writeFile(path.join(OUT, '案件索引.md'), idx, 'utf8')
await fs.writeFile(path.join(OUT, 'cases.json'), JSON.stringify({ generatedAt: new Date().toISOString(), total: curated.length, cases: curated, appendix }, null, 2), 'utf8')

console.log(`[build] 已归档 ${curated.length} 篇`)
for (const cat of CAT_ORDER) if (groups[cat]) console.log(`  ${cat}: ${groups[cat].length}`)
console.log(`  附录(非知产): ${appendix.length}`)
