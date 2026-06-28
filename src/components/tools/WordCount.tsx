"use client"

import { useState, useMemo } from "react"

export default function WordCount() {
  const [text, setText] = useState("")
  const [showDetails, setShowDetails] = useState(false)

  const stats = useMemo(() => {
    const chars = text.length
    const charsNoSpace = text.replace(/\s/g, "").length
    const words = text.trim() ? text.trim().split(/[\s\u3000]+/).length : 0
    const lines = text ? text.split("\n").length : 0
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0
    const sentences = text.trim() ? text.split(/[.!?。！？]+/).filter(s => s.trim()).length : 0
    const chinese = (text.match(/[\u4e00-\u9fa5]/g) || []).length
    const english = (text.match(/[a-zA-Z]/g) || []).length
    const numbers = (text.match(/\d/g) || []).length
    const punctuation = (text.match(/[^\w\s\u4e00-\u9fa5]/g) || []).length
    const spaces = (text.match(/\s/g) || []).length
    const newlines = (text.match(/\n/g) || []).length
    const tabs = (text.match(/\t/g) || []).length

    // Reading time (Chinese: ~400 chars/min, English: ~200 words/min)
    const readingTimeMin = (chinese / 400) + (words - chinese) / 200
    const readingTime = readingTimeMin < 1 ? `约${Math.ceil(readingTimeMin * 60)}秒` : `约${Math.ceil(readingTimeMin)}分钟`

    // Speaking time (~150 words/min)
    const speakingTimeMin = words / 150
    const speakingTime = speakingTimeMin < 1 ? `约${Math.ceil(speakingTimeMin * 60)}秒` : `约${Math.ceil(speakingTimeMin)}分钟`

    // Character frequency
    const charFreq: Record<string, number> = {}
    for (const c of text) {
      if (c.trim()) charFreq[c] = (charFreq[c] || 0) + 1
    }
    const topChars = Object.entries(charFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Word frequency (for Chinese, use characters; for English, use words)
    const wordFreq: Record<string, number> = {}
    const englishWords = text.toLowerCase().match(/[a-z]+/g) || []
    for (const w of englishWords) {
      if (w.length > 1) wordFreq[w] = (wordFreq[w] || 0) + 1
    }
    const topWords = Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)

    // Line lengths
    const lineLengths = text.split("\n").map(l => l.length)
    const maxLineLength = Math.max(...lineLengths, 0)
    const avgLineLength = lineLengths.length > 0 ? (lineLengths.reduce((a, b) => a + b, 0) / lineLengths.length).toFixed(1) : "0"

    return {
      chars, charsNoSpace, words, lines, paragraphs, sentences,
      chinese, english, numbers, punctuation, spaces, newlines, tabs,
      readingTime, speakingTime,
      topChars, topWords,
      maxLineLength, avgLineLength,
    }
  }, [text])

  const copyStats = () => {
    const text = `字符: ${stats.chars} | 不含空格: ${stats.charsNoSpace} | 单词: ${stats.words} | 中文: ${stats.chinese} | 行: ${stats.lines} | 段落: ${stats.paragraphs}`
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="在此输入或粘贴文本..."
        className="w-full h-48 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
      />

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "总字符", value: stats.chars, color: "blue" },
          { label: "不含空格", value: stats.charsNoSpace, color: "green" },
          { label: "单词/词数", value: stats.words, color: "purple" },
          { label: "中文字符", value: stats.chinese, color: "red" },
          { label: "英文字符", value: stats.english, color: "orange" },
          { label: "数字", value: stats.numbers, color: "teal" },
          { label: "行数", value: stats.lines, color: "indigo" },
          { label: "段落数", value: stats.paragraphs, color: "pink" },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition">
            <div className="text-2xl font-bold text-gray-900">{item.value}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Time estimates */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-blue-700">{stats.readingTime}</div>
          <div className="text-xs text-blue-500">阅读时间</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-lg font-bold text-green-700">{stats.speakingTime}</div>
          <div className="text-xs text-green-500">朗读时间</div>
        </div>
      </div>

      {/* Toggle details */}
      <button onClick={() => setShowDetails(!showDetails)}
        className="text-sm text-blue-600 hover:text-blue-800">
        {showDetails ? "收起详情" : "展开详情 ▼"}
      </button>

      {showDetails && (
        <div className="space-y-4">
          {/* Additional stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "句子数", value: stats.sentences },
              { label: "标点符号", value: stats.punctuation },
              { label: "空格数", value: stats.spaces },
              { label: "换行数", value: stats.newlines },
              { label: "制表符", value: stats.tabs },
              { label: "最大行宽", value: stats.maxLineLength },
              { label: "平均行宽", value: stats.avgLineLength },
              { label: "字符种类", value: new Set(text).size },
            ].map(item => (
              <div key={item.label} className="bg-gray-50 rounded-lg p-2 text-center">
                <div className="text-lg font-bold">{item.value}</div>
                <div className="text-xs text-gray-500">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Character frequency */}
          {stats.topChars.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">📊 字符频率 TOP 10</h3>
              <div className="space-y-1">
                {stats.topChars.map(([char, count], i) => (
                  <div key={char} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 w-4">{i + 1}</span>
                    <code className="w-8 text-center font-mono">{char === " " ? "␣" : char}</code>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 rounded-full h-2" style={{ width: `${(count / stats.topChars[0][1]) * 100}%` }} />
                    </div>
                    <span className="text-gray-500 w-12 text-right">{count}次</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Word frequency */}
          {stats.topWords.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">📊 词频 TOP 10</h3>
              <div className="space-y-1">
                {stats.topWords.map(([word, count], i) => (
                  <div key={word} className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400 w-4">{i + 1}</span>
                    <code className="w-20 font-mono truncate">{word}</code>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 rounded-full h-2" style={{ width: `${(count / stats.topWords[0][1]) * 100}%` }} />
                    </div>
                    <span className="text-gray-500 w-12 text-right">{count}次</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <button onClick={copyStats} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
        📋 复制统计
      </button>
    </div>
  )
}
