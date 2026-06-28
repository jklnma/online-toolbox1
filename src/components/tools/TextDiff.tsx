"use client"

import { useState, useCallback } from "react"

type DiffLine = { type: "same" | "add" | "remove"; text: string; lineNum1?: number; lineNum2?: number }

export default function TextDiff() {
  const [text1, setText1] = useState("")
  const [text2, setText2] = useState("")
  const [result, setResult] = useState<DiffLine[]>([])
  const [mode, setMode] = useState<"line" | "word" | "char">("line")
  const [stats, setStats] = useState({ added: 0, removed: 0, same: 0 })
  const [showInline, setShowInline] = useState(false)

  const compare = useCallback(() => {
    if (mode === "line") {
      compareLines()
    } else if (mode === "word") {
      compareWords()
    } else {
      compareChars()
    }
  }, [text1, text2, mode])

  const compareLines = () => {
    const lines1 = text1.split("\n")
    const lines2 = text2.split("\n")
    const res: DiffLine[] = []

    // Simple LCS-based diff
    const m = lines1.length, n = lines2.length
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (lines1[i - 1] === lines2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }

    let i = m, j = n
    const temp: DiffLine[] = []
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && lines1[i - 1] === lines2[j - 1]) {
        temp.unshift({ type: "same", text: lines1[i - 1], lineNum1: i, lineNum2: j })
        i--; j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        temp.unshift({ type: "add", text: lines2[j - 1], lineNum2: j })
        j--
      } else {
        temp.unshift({ type: "remove", text: lines1[i - 1], lineNum1: i })
        i--
      }
    }

    setResult(temp)
    setStats({
      added: temp.filter(l => l.type === "add").length,
      removed: temp.filter(l => l.type === "remove").length,
      same: temp.filter(l => l.type === "same").length,
    })
  }

  const compareWords = () => {
    const words1 = text1.split(/(\s+)/)
    const words2 = text2.split(/(\s+)/)
    const m = words1.length, n = words2.length
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (words1[i - 1] === words2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }

    let i = m, j = n
    const temp: DiffLine[] = []
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && words1[i - 1] === words2[j - 1]) {
        temp.unshift({ type: "same", text: words1[i - 1] })
        i--; j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        temp.unshift({ type: "add", text: words2[j - 1] })
        j--
      } else {
        temp.unshift({ type: "remove", text: words1[i - 1] })
        i--
      }
    }

    setResult(temp)
    setStats({
      added: temp.filter(l => l.type === "add").length,
      removed: temp.filter(l => l.type === "remove").length,
      same: temp.filter(l => l.type === "same").length,
    })
  }

  const compareChars = () => {
    const m = text1.length, n = text2.length
    const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (text1[i - 1] === text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }

    let i = m, j = n
    const temp: DiffLine[] = []
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && text1[i - 1] === text2[j - 1]) {
        temp.unshift({ type: "same", text: text1[i - 1] })
        i--; j--
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        temp.unshift({ type: "add", text: text2[j - 1] })
        j--
      } else {
        temp.unshift({ type: "remove", text: text1[i - 1] })
        i--
      }
    }

    setResult(temp)
    setStats({
      added: temp.filter(l => l.type === "add").length,
      removed: temp.filter(l => l.type === "remove").length,
      same: temp.filter(l => l.type === "same").length,
    })
  }

  const copyDiff = () => {
    const text = result.map(l => {
      const prefix = l.type === "add" ? "+" : l.type === "remove" ? "-" : " "
      return `${prefix} ${l.text}`
    }).join("\n")
    navigator.clipboard.writeText(text)
  }

  const similarity = result.length > 0
    ? ((stats.same / result.length) * 100).toFixed(1)
    : "0"

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex gap-2 items-center">
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {[
            { key: "line", label: "行对比" },
            { key: "word", label: "词对比" },
            { key: "char", label: "字符对比" },
          ].map(m => (
            <button key={m.key} onClick={() => setMode(m.key as any)}
              className={`px-3 py-1 rounded-md text-sm ${mode === m.key ? "bg-white shadow" : "text-gray-500"}`}>
              {m.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm ml-4">
          <input type="checkbox" checked={showInline} onChange={e => setShowInline(e.target.checked)} />
          并排显示
        </label>
      </div>

      {/* Input */}
      <div className={`grid ${showInline ? "md:grid-cols-2" : ""} gap-4`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">原始文本</label>
          <textarea value={text1} onChange={e => setText1(e.target.value)}
            placeholder="输入第一段文本..."
            className="w-full h-48 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">对比文本</label>
          <textarea value={text2} onChange={e => setText2(e.target.value)}
            placeholder="输入第二段文本..."
            className="w-full h-48 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={compare} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">对比</button>
        <button onClick={() => { setText1(""); setText2(""); setResult([]) }} className="px-4 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200">清空</button>
        {result.length > 0 && (
          <button onClick={copyDiff} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">复制差异</button>
        )}
      </div>

      {/* Stats */}
      {result.length > 0 && (
        <div className="flex gap-4 text-sm">
          <span className="text-green-600">+{stats.added} 新增</span>
          <span className="text-red-600">-{stats.removed} 删除</span>
          <span className="text-gray-500">{stats.same} 相同</span>
          <span className="text-blue-600">相似度: {similarity}%</span>
        </div>
      )}

      {/* Result */}
      {result.length > 0 && (
        <div className="border rounded-lg overflow-hidden">
          <div className="max-h-96 overflow-auto">
            {result.map((line, i) => (
              <div key={i} className={`px-3 py-1 text-sm font-mono border-b last:border-b-0 flex ${
                line.type === "add" ? "bg-green-50" :
                line.type === "remove" ? "bg-red-50" :
                "bg-white"
              }`}>
                {mode === "line" && (
                  <>
                    <span className="text-gray-400 mr-2 select-none w-8 text-right shrink-0">
                      {line.lineNum1 || ""}
                    </span>
                    <span className="text-gray-400 mr-2 select-none w-8 text-right shrink-0">
                      {line.lineNum2 || ""}
                    </span>
                  </>
                )}
                <span className={`mr-2 select-none shrink-0 ${
                  line.type === "add" ? "text-green-500" : line.type === "remove" ? "text-red-500" : "text-gray-300"
                }`}>
                  {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                </span>
                <span className={
                  line.type === "add" ? "text-green-800" :
                  line.type === "remove" ? "text-red-800" :
                  "text-gray-600"
                }>
                  {line.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
