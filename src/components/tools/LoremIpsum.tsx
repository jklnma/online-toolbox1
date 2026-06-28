"use client"

import { useState, useCallback } from "react"

const loremWords = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "perspiciatis", "unde",
  "omnis", "iste", "natus", "error", "voluptatem", "accusantium", "doloremque",
  "laudantium", "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo",
  "inventore", "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta",
  "explicabo", "nemo", "ipsam", "voluptas", "aspernatur", "aut", "odit", "fugit",
  "consequuntur", "magni", "dolores", "ratione", "sequi", "nesciunt", "neque",
  "porro", "quisquam", "dolorem", "adipisci", "numquam", "eius", "modi", "tempora",
]

const chineseWords = [
  "的", "一", "是", "在", "不", "了", "有", "和", "人", "这", "中", "大", "为", "上", "个",
  "国", "我", "以", "要", "他", "时", "来", "用", "们", "生", "到", "作", "地", "于", "出",
  "就", "分", "对", "成", "会", "可", "主", "发", "年", "动", "同", "工", "也", "能", "下",
  "过", "子", "说", "产", "种", "面", "而", "方", "后", "多", "定", "行", "学", "法", "所",
  "民", "得", "经", "十", "三", "之", "进", "着", "等", "部", "度", "家", "电", "力", "里",
  "如", "水", "化", "高", "自", "二", "理", "起", "小", "物", "现", "实", "加", "量", "都",
  "两", "体", "制", "机", "当", "使", "点", "从", "业", "本", "去", "把", "性", "好", "应",
  "开", "它", "合", "还", "因", "由", "其", "些", "然", "前", "外", "天", "政", "四", "日",
  "那", "社", "义", "事", "平", "形", "相", "全", "表", "间", "样", "与", "关", "各", "重",
]

export default function LoremIpsum() {
  const [count, setCount] = useState(3)
  const [unit, setUnit] = useState<"paragraphs" | "sentences" | "words">("paragraphs")
  const [output, setOutput] = useState("")
  const [lang, setLang] = useState<"latin" | "chinese">("latin")
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [htmlOutput, setHtmlOutput] = useState(false)

  const randomWord = () => lang === "latin"
    ? loremWords[Math.floor(Math.random() * loremWords.length)]
    : chineseWords[Math.floor(Math.random() * chineseWords.length)]

  const generateSentence = () => {
    const len = 8 + Math.floor(Math.random() * 12)
    const words = Array.from({ length: len }, randomWord)
    if (lang === "latin") {
      words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1)
      return words.join(" ") + "."
    }
    return words.join("") + "。"
  }

  const generateParagraph = () => {
    const sentenceCount = 3 + Math.floor(Math.random() * 5)
    return Array.from({ length: sentenceCount }, generateSentence).join(lang === "latin" ? " " : "")
  }

  const generate = useCallback(() => {
    let result: string[] = []

    if (unit === "paragraphs") {
      result = Array.from({ length: count }, generateParagraph)
      if (startWithLorem && lang === "latin" && result.length > 0) {
        result[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + result[0].split(". ").slice(1).join(". ")
      }
      setOutput(result.join("\n\n"))
    } else if (unit === "sentences") {
      result = Array.from({ length: count }, generateSentence)
      if (startWithLorem && lang === "latin" && result.length > 0) {
        result[0] = "Lorem ipsum dolor sit amet, consectetur adipiscing elit."
      }
      setOutput(result.join(lang === "latin" ? " " : ""))
    } else {
      const words = Array.from({ length: count }, randomWord)
      if (startWithLorem && lang === "latin" && words.length > 0) words[0] = "Lorem"
      setOutput(words.join(lang === "latin" ? " " : ""))
    }
  }, [count, unit, lang, startWithLorem])

  const generateHtml = useCallback(() => {
    let result: string[] = []
    if (unit === "paragraphs") {
      result = Array.from({ length: count }, generateParagraph)
    } else if (unit === "sentences") {
      result = [Array.from({ length: count }, generateSentence).join(" ")]
    } else {
      result = [Array.from({ length: count }, randomWord).join(" ")]
    }
    const html = result.map(p => `<p>${p}</p>`).join("\n")
    setOutput(html)
  }, [count, unit])

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">数量</label>
          <input type="number" min={1} max={100} value={count} onChange={e => setCount(+e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">单位</label>
          <select value={unit} onChange={e => setUnit(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="paragraphs">段落</option>
            <option value="sentences">句子</option>
            <option value="words">单词</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">语言</label>
          <select value={lang} onChange={e => setLang(e.target.value as any)} className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="latin">拉丁文 (Lorem Ipsum)</option>
            <option value="chinese">中文</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={startWithLorem} onChange={e => setStartWithLorem(e.target.checked)} />
          以"Lorem ipsum"开头
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={htmlOutput} onChange={e => setHtmlOutput(e.target.checked)} />
          输出HTML标签
        </label>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          📝 生成文本
        </button>
        <button onClick={generateHtml} className="px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700">
          生成HTML
        </button>
        <button onClick={() => navigator.clipboard.writeText(output)} className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700">
          📋 复制
        </button>
      </div>

      <textarea value={output} readOnly
        className="w-full h-64 p-3 border rounded-lg bg-gray-50 text-sm leading-relaxed" />

      <div className="text-xs text-gray-400 text-right">
        {output ? `${output.length} 字符 · ${output.split(/\s+/).filter(Boolean).length} 词` : ""}
      </div>
    </div>
  )
}
