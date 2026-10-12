// 生成 js/cases-data.js（供网站页面使用）
import fs from 'node:fs/promises'
import path from 'node:path'

const META = 'C:\\Users\\13809\\Desktop\\my-website\\content\\ai-ip-cases\\_meta'
const DET = META + '\\details'
const OUT = 'C:\\Users\\13809\\Desktop\\my-website\\js\\cases-data.js'
const BASE = 'https://rmfyalk.court.gov.cn'

const html2text = (h) => String(h || '')
  .replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
  .replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim()
const line = (h) => html2text(h).replace(/\s+/g, ' ').trim()
const paras = (h) => html2text(h).split(/\n+/).map((s) => s.trim().replace(/^[　\s]+/, '')).filter(Boolean)

function sectionsOf(c) {
  const type = c.cpws_al_type === '01' ? 'zdx' : 'ck'
  const sortIds = [].concat(c.cpws_al_case_sort_id || []).join(',')
  if (type === 'zdx') {
    if (sortIds.includes('A0501')) return [['执行实施要点', 'cpws_al_cpyz'], ['基本案情', 'cpws_al_jbaq'], ['执行结果', 'cpws_al_cpjg'], ['执行理由', 'cpws_al_cply'], ['相关法条', 'cpws_al_glsy']]
    return [['裁判要点', 'cpws_al_cpyz'], ['基本案情', 'cpws_al_jbaq'], ['裁判结果', 'cpws_al_cpjg'], ['裁判理由', 'cpws_al_cply'], ['相关法条', 'cpws_al_glsy']]
  }
  if (sortIds.includes('A0501')) return [['基本案情', 'cpws_al_jbaq'], ['执行理由', 'cpws_al_cply'], ['执行要旨', 'cpws_al_cpyz'], ['关联索引', 'cpws_al_glsy']]
  if (sortIds.includes('A06')) return [['基本案情', 'cpws_al_jbaq'], ['调解结果', 'cpws_al_cply'], ['调解指引', 'cpws_al_cpyz'], ['案例价值', 'cpws_al_aljz'], ['关联索引', 'cpws_al_glsy']]
  return [['基本案情', 'cpws_al_jbaq'], ['裁判理由', 'cpws_al_cply'], ['裁判要旨', 'cpws_al_cpyz'], ['关联索引', 'cpws_al_glsy']]
}

const CATS = ['著作权', '商标', '专利', '不正当竞争', '商业秘密', '其他（AI相关）']
const selection = JSON.parse(await fs.readFile(META + '\\selection.json', 'utf8'))
const cases = []
const appendix = []

for (const [key, sel] of Object.entries(selection)) {
  if (!sel.include) {
    if (sel.appendix) appendix.push({ title: sel.title, note: sel.appendixNote || '', url: `${BASE}/view/content.html?id=${sel.id}` })
    continue
  }
  const raw = JSON.parse(await fs.readFile(path.join(DET, 'case-' + key + '.json'), 'utf8'))
  const c = raw.content
  const e = raw.entry || {}
  const lib = c.cpws_al_type === '01' ? 'zdx' : 'ck'
  const linkId = (e.ids && e.ids[0]) || ''
  const sections = []
  for (const [label, field] of sectionsOf(c)) {
    const b = paras(c[field])
    if (b.length) sections.push({ t: label, b })
  }
  cases.push({
    no: line(c.cpws_al_no || key),
    title: line(c.cpws_al_title),
    subTitle: line(c.cpws_al_sub_title || ''),
    cat: sel.cat,
    note: sel.note || '',
    type: c.cpws_al_type === '01' ? '指导性案例' : '参考案例',
    expired: c.cpws_al_status === '02',
    sortName: line(e.sortName || c.cpws_al_sort_name || ''),
    caseSort: line(c.cpws_al_case_sort_name || ''),
    court: line(e.court || c.cpws_al_slfy_name || ''),
    date: line(e.date || c.cpws_al_zs_date || ''),
    ajzh: line(c.cpws_al_ajzh || ''),
    keywords: [].concat(c.cpws_al_keyword || []).map(line).filter(Boolean),
    url: `${BASE}/view/content.html?id=${linkId}&lib=${lib}`,
    summary: line(c.cpws_al_cpyz).slice(0, 220),
    sections
  })
}

cases.sort((a, b) => (CATS.indexOf(a.cat) - CATS.indexOf(b.cat)) || String(b.date).localeCompare(String(a.date)))
appendix.sort((a, b) => a.title.localeCompare(b.title, 'zh'))

const payload = {
  generatedAt: new Date().toISOString(),
  source: '人民法院案例库（https://rmfyalk.court.gov.cn）',
  cats: CATS.filter((c) => cases.some((x) => x.cat === c)),
  total: cases.length,
  cases,
  appendix
}

const js = `/* 自动生成 ${new Date().toISOString().slice(0, 10)} · 数据来源：人民法院案例库\n   生成脚本输出，请勿手改；案件全文来自公开司法案例库。 */\nwindow.AI_IP_CASES = ${JSON.stringify(payload, null, 2)};\n`
await fs.writeFile(OUT, js, 'utf8')
console.log('cases-data.js 已生成：', cases.length, '篇 + 附录', appendix.length, '条')
