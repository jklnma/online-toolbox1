"use client"

import { useState, useCallback, useMemo } from "react"

const bases = [
  { key: 2, label: "二进制 (BIN)", prefix: "0b", chars: "01" },
  { key: 8, label: "八进制 (OCT)", prefix: "0o", chars: "01234567" },
  { key: 10, label: "十进制 (DEC)", prefix: "", chars: "0123456789" },
  { key: 16, label: "十六进制 (HEX)", prefix: "0x", chars: "0123456789ABCDEF" },
  { key: 32, label: "Base32", prefix: "", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567" },
  { key: 36, label: "Base36", prefix: "", chars: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ" },
  { key: 64, label: "Base64", prefix: "", chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" },
]

export default function NumberBase() {
  const [input, setInput] = useState("")
  const [fromBase, setFromBase] = useState(10)
  const [toBase, setToBase] = useState(16)
  const [error, setError] = useState("")
  const [results, setResults] = useState<Record<number, string>>({})
  const [bitWidth, setBitWidth] = useState(8)
  const [signed, setSigned] = useState(false)

  const convert = useCallback(() => {
    if (!input.trim()) return
    try {
      const cleanInput = input.trim().replace(/^(0b|0o|0x)/i, "")
      const num = parseInt(cleanInput, fromBase)
      if (isNaN(num)) throw new Error("无效输入")

      const res: Record<number, string> = {}
      for (const base of bases) {
        try {
          if (base.key === 64) {
            res[base.key] = btoa(String.fromCharCode(...(num.toString(2).match(/.{1,8}/g) || []).map(b => parseInt(b, 2))))
          } else {
            res[base.key] = num.toString(base.key).toUpperCase()
          }
        } catch { res[base.key] = "错误" }
      }

      // Binary with bit width
      const bin = num.toString(2)
      const padded = bin.padStart(bitWidth, "0")
      res[-2] = padded.match(/.{4}/g)?.join(" ") || padded

      // Signed interpretation
      if (signed && num >= 0) {
        const maxVal = Math.pow(2, bitWidth - 1) - 1
        const signedVal = num > maxVal ? num - Math.pow(2, bitWidth) : num
        res[-10] = signedVal.toString(10)
      }

      setResults(res)
      setError("")
    } catch (e: any) { setError(e.message); setResults({}) }
  }, [input, fromBase, toBase, bitWidth, signed])

  const allResults = useMemo(() => {
    return bases.map(b => ({
      ...b,
      value: results[b.key] || "",
    }))
  }, [results])

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-sm text-gray-600 mb-1">输入数值</label>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && convert()}
            placeholder="输入要转换的数值..."
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">输入进制</label>
          <select value={fromBase} onChange={e => setFromBase(+e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm">
            {bases.filter(b => b.key <= 36).map(b => <option key={b.key} value={b.key}>{b.label}</option>)}
          </select>
        </div>
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="text-sm text-gray-600">位宽:</label>
          <select value={bitWidth} onChange={e => setBitWidth(+e.target.value)}
            className="ml-2 px-2 py-1 border rounded text-sm">
            {[8, 16, 32, 64].map(w => <option key={w} value={w}>{w}位</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={signed} onChange={e => setSigned(e.target.checked)} />
          有符号解释
        </label>
      </div>

      <button onClick={convert} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
        🔄 转换
      </button>

      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">❌ {error}</div>}

      {/* Results */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-2">
          {allResults.map(r => (
            <div key={r.key} className="flex items-center gap-3 bg-gray-50 border rounded-lg p-3 hover:bg-gray-100 transition">
              <span className="text-sm text-gray-500 w-28 shrink-0">{r.label}</span>
              <code className="flex-1 font-mono text-sm break-all">{r.value}</code>
              <button onClick={() => navigator.clipboard.writeText(r.value)}
                className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs hover:bg-green-200">复制</button>
            </div>
          ))}

          {/* Binary with spaces */}
          {results[-2] && (
            <div className="flex items-center gap-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <span className="text-sm text-blue-600 w-28 shrink-0">二进制(分组)</span>
              <code className="flex-1 font-mono text-sm">{results[-2]}</code>
            </div>
          )}

          {/* Signed */}
          {results[-10] && (
            <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 rounded-lg p-3">
              <span className="text-sm text-purple-600 w-28 shrink-0">有符号十进制</span>
              <code className="flex-1 font-mono text-sm">{results[-10]}</code>
            </div>
          )}
        </div>
      )}

      {/* Quick convert all */}
      {Object.keys(results).length > 0 && (
        <button onClick={() => {
          const text = allResults.map(r => `${r.label}: ${r.value}`).join("\n")
          navigator.clipboard.writeText(text)
        }} className="w-full py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
          📋 复制全部结果
        </button>
      )}
    </div>
  )
}
