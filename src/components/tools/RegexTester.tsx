"use client"

import { useState, useCallback } from "react"

const commonPatterns = [
  { name: "手机号", pattern: "1[3-9]\\d{9}", desc: "中国大陆手机号" },
  { name: "邮箱", pattern: "[\\w.-]+@[\\w.-]+\\.\\w+", desc: "电子邮箱地址" },
  { name: "身份证", pattern: "[1-9]\\d{5}(?:19|20)\\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\\d|3[01])\\d{3}[\\dXx]", desc: "18位身份证号" },
  { name: "IP地址", pattern: "(?:(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d\\d?)", desc: "IPv4地址" },
  { name: "URL", pattern: "https?://[\\w.-]+(?:/[\\w./-]*)?(?:\\?[\\w&=]*)?", desc: "网页链接" },
  { name: "中文字符", pattern: "[\\u4e00-\\u9fa5]+", desc: "中文汉字" },
  { name: "日期", pattern: "\\d{4}[-/]\\d{1,2}[-/]\\d{1,2}", desc: "日期格式" },
  { name: "数字", pattern: "-?\\d+\\.?\\d*", desc: "整数或小数" },
  { name: "HTML标签", pattern: "<[^>]+>", desc: "HTML标签" },
  { name: "QQ号", pattern: "[1-9]\\d{4,10}", desc: "QQ号码" },
  { name: "微信号", pattern: "[a-zA-Z][\\w-]{5,19}", desc: "微信号" },
  { name: "车牌号", pattern: "[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤川青藏琼宁][A-HJ-NP-Z][A-HJ-NP-Z0-9]{4,5}[A-HJ-NP-Z0-9挂学警港澳]", desc: "中国车牌" },
  { name: "密码强度", pattern: "(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}", desc: "至少8位，含大小写+数字+特殊字符" },
  { name: "HTML颜色", pattern: "#(?:[0-9a-fA-F]{3}){1,2}", desc: "十六进制颜色值" },
  { name: "MAC地址", pattern: "(?:[0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}", desc: "MAC物理地址" },
]

export default function RegexTester() {
  const [pattern, setPattern] = useState("")
  const [flags, setFlags] = useState("g")
  const [testStr, setTestStr] = useState("")
  const [matches, setMatches] = useState<{ text: string; index: number; groups?: Record<string, string> }[]>([])
  const [error, setError] = useState("")
  const [highlighted, setHighlighted] = useState("")
  const [showExplain, setShowExplain] = useState(false)
  const [replacePattern, setReplacePattern] = useState("")
  const [replaceResult, setReplaceResult] = useState("")
  const [execResult, setExecResult] = useState<string[][]>([])

  const flagOptions = [
    { key: "g", label: "g 全局", desc: "匹配所有" },
    { key: "i", label: "i 忽略大小写", desc: "不区分大小写" },
    { key: "m", label: "m 多行", desc: "^$匹配行首行尾" },
    { key: "s", label: "s 点匹配换行", desc: ".匹配换行符" },
    { key: "u", label: "u Unicode", desc: "Unicode模式" },
  ]

  const toggleFlag = (f: string) => {
    setFlags(flags.includes(f) ? flags.replace(f, "") : flags + f)
  }

  const test = useCallback(() => {
    if (!pattern) return
    try {
      const regex = new RegExp(pattern, flags)
      const found: typeof matches = []
      let match: RegExpExecArray | null

      if (flags.includes("g")) {
        while ((match = regex.exec(testStr)) !== null) {
          found.push({ text: match[0], index: match.index, groups: match.groups })
          if (!match[0]) regex.lastIndex++
        }
      } else {
        match = regex.exec(testStr)
        if (match) found.push({ text: match[0], index: match.index, groups: match.groups })
      }

      setMatches(found)
      setError("")

      // Highlight
      let result = ""
      let lastIndex = 0
      const hlRegex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g")
      let m: RegExpExecArray | null
      while ((m = hlRegex.exec(testStr)) !== null) {
        result += escapeHtml(testStr.slice(lastIndex, m.index))
        result += `<mark class="bg-yellow-200 px-0.5 rounded">${escapeHtml(m[0])}</mark>`
        lastIndex = m.index + m[0].length
        if (!m[0]) hlRegex.lastIndex++
      }
      result += escapeHtml(testStr.slice(lastIndex))
      setHighlighted(result)

      // Exec (capture groups)
      const execRegex = new RegExp(pattern, flags.includes("g") ? flags : flags + "g")
      const execResults: string[][] = []
      let em: RegExpExecArray | null
      while ((em = execRegex.exec(testStr)) !== null) {
        execResults.push(Array.from(em))
        if (!em[0]) execRegex.lastIndex++
      }
      setExecResult(execResults)

    } catch (e: any) {
      setError(e.message)
      setMatches([])
      setHighlighted("")
      setExecResult([])
    }
  }, [pattern, flags, testStr])

  const replace = useCallback(() => {
    if (!pattern) return
    try {
      const regex = new RegExp(pattern, flags)
      setReplaceResult(testStr.replace(regex, replacePattern))
      setError("")
    } catch (e: any) { setError(e.message) }
  }, [pattern, flags, testStr, replacePattern])

  const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

  const explainRegex = useCallback(() => {
    if (!pattern) return []
    const parts: string[] = []
    let i = 0
    const p = pattern

    while (i < p.length) {
      if (p[i] === "\\") {
        const next = p[i + 1]
        const escapeMap: Record<string, string> = {
          "d": "数字 [0-9]", "D": "非数字", "w": "单词字符 [a-zA-Z0-9_]", "W": "非单词字符",
          "s": "空白字符", "S": "非空白字符", "b": "单词边界", "B": "非单词边界",
          "n": "换行符", "t": "制表符", "r": "回车符",
        }
        parts.push(escapeMap[next] || `转义字符 \\${next}`)
        i += 2
      } else if (p[i] === "[") {
        const end = p.indexOf("]", i)
        if (end !== -1) {
          parts.push(`字符集 [${p.slice(i + 1, end)}]`)
          i = end + 1
        } else { parts.push("字符集开始"); i++ }
      } else if (p[i] === "(") {
        if (p.slice(i, i + 3) === "(?:") { parts.push("非捕获组"); i += 3 }
        else if (p.slice(i, i + 4) === "(?=") { parts.push("正向前瞻"); i += 3 }
        else if (p.slice(i, i + 4) === "(?!") { parts.push("负向前瞻"); i += 3 }
        else if (p.slice(i, i + 4) === "(?<=") { parts.push("正向后顾"); i += 4 }
        else if (p.slice(i, i + 4) === "(?<!") { parts.push("负向后顾"); i += 4 }
        else { parts.push("捕获组"); i++ }
      } else if (p[i] === ")") { parts.push("组结束"); i++ }
      else if (p[i] === ".") { parts.push("任意字符(除换行)"); i++ }
      else if (p[i] === "^") { parts.push("行/字符串开头"); i++ }
      else if (p[i] === "$") { parts.push("行/字符串结尾"); i++ }
      else if (p[i] === "*") { parts.push(p[i + 1] === "?" ? "零次或多次(懒惰)" : "零次或多次(贪婪)"); i += p[i + 1] === "?" ? 2 : 1 }
      else if (p[i] === "+") { parts.push(p[i + 1] === "?" ? "一次或多次(懒惰)" : "一次或多次(贪婪)"); i += p[i + 1] === "?" ? 2 : 1 }
      else if (p[i] === "?") { parts.push("零次或一次"); i++ }
      else if (p[i] === "{") {
        const end = p.indexOf("}", i)
        if (end !== -1) {
          const quant = p.slice(i + 1, end)
          if (quant.includes(",")) {
            const [min, max] = quant.split(",")
            parts.push(max ? `${min}到${max}次` : `${min}次以上`)
          } else parts.push(`恰好${quant}次`)
          i = end + 1
        } else { parts.push(p[i]); i++ }
      }
      else if (p[i] === "|") { parts.push("或"); i++ }
      else { parts.push(`字面量 "${p[i]}"`); i++ }
    }
    return parts
  }, [pattern])

  return (
    <div className="space-y-4">
      {/* Pattern input */}
      <div className="flex gap-2">
        <span className="px-3 py-2 bg-gray-100 rounded-lg text-gray-500 font-mono">/</span>
        <input
          type="text"
          value={pattern}
          onChange={e => setPattern(e.target.value)}
          placeholder="输入正则表达式..."
          className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-300 outline-none"
        />
        <span className="px-3 py-2 bg-gray-100 rounded-lg text-gray-500 font-mono">/</span>
        <div className="flex gap-1">
          {flagOptions.map(f => (
            <button
              key={f.key}
              onClick={() => toggleFlag(f.key)}
              title={f.desc}
              className={`w-8 h-8 rounded text-xs font-mono ${flags.includes(f.key) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-500"}`}
            >
              {f.key}
            </button>
          ))}
        </div>
      </div>

      {/* Common patterns */}
      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs text-gray-400 py-1">常用:</span>
        {commonPatterns.map(p => (
          <button
            key={p.name}
            onClick={() => setPattern(p.pattern)}
            title={p.desc}
            className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            {p.name}
          </button>
        ))}
      </div>

      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">❌ {error}</div>}

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: "match", label: "匹配测试" },
          { key: "replace", label: "替换" },
          { key: "explain", label: "表达式解释" },
        ].map(t => (
          <button key={t.key} onClick={() => setShowExplain(t.key === "explain")}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm ${t.key === "explain" && showExplain ? "bg-white shadow" : "text-gray-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Match tab */}
      {!showExplain && !replacePattern && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">测试文本</label>
            <textarea
              value={testStr}
              onChange={e => setTestStr(e.target.value)}
              placeholder="输入要测试的文本..."
              className="w-full h-48 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <button onClick={test} className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">测试匹配</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">匹配结果 ({matches.length}个)</label>
            {highlighted ? (
              <div className="h-48 p-3 border rounded-lg bg-gray-50 text-sm overflow-auto" dangerouslySetInnerHTML={{ __html: highlighted }} />
            ) : (
              <div className="h-48 p-3 border rounded-lg bg-gray-50 text-sm text-gray-400">匹配结果将在这里高亮显示...</div>
            )}
          </div>
        </div>
      )}

      {/* Replace tab */}
      {(replacePattern || !showExplain) && (
        <div className={!showExplain ? "hidden" : ""}>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">替换为</label>
              <input type="text" value={replacePattern} onChange={e => setReplacePattern(e.target.value)}
                placeholder="替换文本（支持 $1, $2 引用分组）"
                className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
              <button onClick={replace} className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">替换</button>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">替换结果</label>
              <pre className="h-32 p-3 border rounded-lg bg-gray-50 text-sm overflow-auto whitespace-pre-wrap">{replaceResult || "结果..."}</pre>
            </div>
          </div>
        </div>
      )}

      {/* Explain tab */}
      {showExplain && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-sm mb-3">表达式解释</h3>
          <div className="space-y-1">
            {explainRegex().map((part, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <span className="text-gray-400 w-6 text-right">{i + 1}</span>
                <span>{part}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Match details */}
      {matches.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">匹配详情</label>
          <div className="space-y-1 max-h-48 overflow-auto">
            {matches.map((m, i) => (
              <div key={i} className="flex items-center gap-3 bg-gray-50 border rounded px-3 py-1.5 text-sm">
                <span className="text-gray-400 w-6">#{i + 1}</span>
                <code className="font-mono text-blue-600">{m.text}</code>
                <span className="text-gray-400 text-xs">位置: {m.index}</span>
                {m.groups && (
                  <span className="text-xs text-gray-500">分组: {JSON.stringify(m.groups)}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Exec groups */}
      {execResult.length > 0 && execResult.some(r => r.length > 1) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">捕获组</label>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border rounded">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-1.5 text-left text-xs text-gray-500">#</th>
                  <th className="px-3 py-1.5 text-left text-xs text-gray-500">完整匹配</th>
                  {Array.from({ length: Math.max(...execResult.map(r => r.length)) - 1 }, (_, i) => (
                    <th key={i} className="px-3 py-1.5 text-left text-xs text-gray-500">分组{i + 1}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {execResult.map((row, i) => (
                  <tr key={i} className="border-t">
                    <td className="px-3 py-1.5 text-gray-400">{i + 1}</td>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-1.5 font-mono">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
