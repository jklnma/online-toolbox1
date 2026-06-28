"use client"

import { useState, useMemo } from "react"

export default function Percentage() {
  const [mode, setMode] = useState<"percent" | "change" | "tip" | "discount" | "margin">("percent")
  const [val1, setVal1] = useState("")
  const [val2, setVal2] = useState("")
  const [val3, setVal3] = useState("")
  const [tipPeople, setTipPeople] = useState(1)

  const result = useMemo(() => {
    const a = parseFloat(val1), b = parseFloat(val2)
    if (isNaN(a) || isNaN(b)) return null

    switch (mode) {
      case "percent": {
        // a是b的百分之几 | a的b%是多少
        return {
          label1: `${a} 是 ${b} 的 ${(a / b * 100).toFixed(2)}%`,
          label2: `${a} 的 ${b}% = ${(a * b / 100).toFixed(2)}`,
          label3: `${a} 的 ${b}% 增长 = ${(a * (1 + b / 100)).toFixed(2)}`,
        }
      }
      case "change": {
        const diff = b - a
        const pct = (diff / a * 100).toFixed(2)
        return {
          label1: `变化量: ${diff > 0 ? "+" : ""}${diff.toFixed(2)}`,
          label2: `变化率: ${diff > 0 ? "+" : ""}${pct}%`,
          label3: `倍数: ${(b / a).toFixed(4)}x`,
        }
      }
      case "tip": {
        const tip = a * b / 100
        const total = a + tip
        const perPerson = total / tipPeople
        return {
          label1: `小费: ¥${tip.toFixed(2)}`,
          label2: `总计: ¥${total.toFixed(2)}`,
          label3: tipPeople > 1 ? `每人: ¥${perPerson.toFixed(2)}` : "",
        }
      }
      case "discount": {
        const c = parseFloat(val3) || 0
        const saved = a * b / 100
        const final = a - saved
        const savedExtra = c > 0 ? a * c / 100 : 0
        const finalExtra = a - saved - savedExtra
        return {
          label1: `折后价: ¥${final.toFixed(2)}`,
          label2: `节省: ¥${saved.toFixed(2)}`,
          label3: c > 0 ? `再减${c}%: ¥${finalExtra.toFixed(2)} (共省¥${(saved + savedExtra).toFixed(2)})` : "",
        }
      }
      case "margin": {
        const margin = ((a - b) / a * 100).toFixed(2)
        const markup = ((a - b) / b * 100).toFixed(2)
        return {
          label1: `利润率: ${margin}%`,
          label2: `加价率: ${markup}%`,
          label3: `成本率: ${(100 - parseFloat(margin)).toFixed(2)}%`,
        }
      }
    }
  }, [mode, val1, val2, val3, tipPeople])

  const modes = [
    { key: "percent", label: "百分比计算", icon: "%" },
    { key: "change", label: "变化率", icon: "📈" },
    { key: "tip", label: "小费计算", icon: "💰" },
    { key: "discount", label: "折扣计算", icon: "🏷️" },
    { key: "margin", label: "利润率", icon: "📊" },
  ]

  return (
    <div className="space-y-4">
      {/* Mode selector */}
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button key={m.key} onClick={() => setMode(m.key as any)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${mode === m.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {m.icon} {m.label}
          </button>
        ))}
      </div>

      {/* Inputs */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {mode === "percent" ? "数值A" : mode === "change" ? "原始值" : mode === "tip" ? "账单金额" : mode === "discount" ? "原价" : "售价"}
          </label>
          <input type="number" value={val1} onChange={e => setVal1(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            {mode === "percent" ? "数值B" : mode === "change" ? "新值" : mode === "tip" ? "小费比例(%)" : mode === "discount" ? "折扣(%)" : "成本"}
          </label>
          <input type="number" value={val2} onChange={e => setVal2(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
      </div>

      {/* Extra inputs */}
      {mode === "discount" && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">额外折扣(%) - 可选</label>
          <input type="number" value={val3} onChange={e => setVal3(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
      )}
      {mode === "tip" && (
        <div>
          <label className="block text-sm text-gray-600 mb-1">用餐人数</label>
          <input type="number" min={1} value={tipPeople} onChange={e => setTipPeople(+e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 space-y-3">
          {[result.label1, result.label2, result.label3].filter(Boolean).map((label, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="text-2xl">{["🎯", "📊", "💡"][i]}</span>
              <span className="text-lg font-medium">{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Quick buttons */}
      <div className="flex flex-wrap gap-2">
        {[10, 20, 30, 50, 100].map(v => (
          <button key={v} onClick={() => setVal1(v.toString())}
            className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">{v}</button>
        ))}
      </div>
    </div>
  )
}
