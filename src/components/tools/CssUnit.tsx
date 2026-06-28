"use client"

import { useState, useCallback, useMemo } from "react"

const cssUnits = [
  { key: "px", name: "像素 (px)", category: "绝对" },
  { key: "pt", name: "点 (pt)", category: "绝对" },
  { key: "pc", name: "派卡 (pc)", category: "绝对" },
  { key: "in", name: "英寸 (in)", category: "绝对" },
  { key: "cm", name: "厘米 (cm)", category: "绝对" },
  { key: "mm", name: "毫米 (mm)", category: "绝对" },
  { key: "em", name: "em", category: "相对" },
  { key: "rem", name: "rem", category: "相对" },
  { key: "vw", name: "视口宽度 (vw)", category: "视口" },
  { key: "vh", name: "视口高度 (vh)", category: "视口" },
  { key: "vmin", name: "vmin", category: "视口" },
  { key: "vmax", name: "vmax", category: "视口" },
  { key: "%", name: "百分比 (%)", category: "相对" },
  { key: "ch", name: "ch", category: "相对" },
  { key: "ex", name: "ex", category: "相对" },
]

// Conversion to px (base: 16px font-size, 96dpi)
const toPx: Record<string, (v: number, ctx: CssContext) => number> = {
  "px": v => v,
  "pt": v => v * 96 / 72,
  "pc": v => v * 16,
  "in": v => v * 96,
  "cm": v => v * 96 / 2.54,
  "mm": v => v * 96 / 25.4,
  "em": v => v * 16,
  "rem": v => v * 16,
  "vw": v => v * (typeof window !== "undefined" ? window.innerWidth : 1920) / 100,
  "vh": v => v * (typeof window !== "undefined" ? window.innerHeight : 1080) / 100,
  "vmin": v => v * Math.min(typeof window !== "undefined" ? window.innerWidth : 1920, typeof window !== "undefined" ? window.innerHeight : 1080) / 100,
  "vmax": v => v * Math.max(typeof window !== "undefined" ? window.innerWidth : 1920, typeof window !== "undefined" ? window.innerHeight : 1080) / 100,
  "%": v => v * 16 / 100,
  "ch": v => v * 8,
  "ex": v => v * 8,
}

const fromPx: Record<string, (v: number, ctx: CssContext) => number> = {
  "px": v => v,
  "pt": v => v * 72 / 96,
  "pc": v => v / 16,
  "in": v => v / 96,
  "cm": v => v * 2.54 / 96,
  "mm": v => v * 25.4 / 96,
  "em": v => v / 16,
  "rem": v => v / 16,
  "vw": v => v * 100 / (typeof window !== "undefined" ? window.innerWidth : 1920),
  "vh": v => v * 100 / (typeof window !== "undefined" ? window.innerHeight : 1080),
  "vmin": v => v * 100 / Math.min(typeof window !== "undefined" ? window.innerWidth : 1920, typeof window !== "undefined" ? window.innerHeight : 1080),
  "vmax": v => v * 100 / Math.max(typeof window !== "undefined" ? window.innerWidth : 1920, typeof window !== "undefined" ? window.innerHeight : 1080),
  "%": v => v * 100 / 16,
  "ch": v => v / 8,
  "ex": v => v / 8,
}

interface CssContext {
  fontSize: number
  viewportWidth: number
  viewportHeight: number
}

export default function CssUnit() {
  const [input, setInput] = useState("")
  const [fromUnit, setFromUnit] = useState("px")
  const [toUnit, setToUnit] = useState("rem")
  const [fontSize, setFontSize] = useState(16)
  const [results, setResults] = useState<Record<string, string>>({})
  const [commonSizes, setCommonSizes] = useState<number[]>([1, 2, 4, 8, 12, 16, 20, 24, 32, 48, 64])

  const convert = useCallback(() => {
    const v = parseFloat(input)
    if (isNaN(v)) return

    const ctx: CssContext = {
      fontSize,
      viewportWidth: typeof window !== "undefined" ? window.innerWidth : 1920,
      viewportHeight: typeof window !== "undefined" ? window.innerHeight : 1080,
    }

    const px = toPx[fromUnit]?.(v, ctx) ?? v
    const res: Record<string, string> = {}

    for (const unit of cssUnits) {
      const converted = fromPx[unit.key]?.(px, ctx)
      if (converted !== undefined) {
        res[unit.key] = converted.toFixed(4).replace(/\.?0+$/, "")
      }
    }

    setResults(res)
  }, [input, fromUnit, fontSize])

  const swap = () => {
    const t = fromUnit
    setFromUnit(toUnit)
    setToUnit(t)
  }

  return (
    <div className="space-y-4">
      {/* Context */}
      <div className="flex gap-4">
        <div>
          <label className="text-sm text-gray-600">根字体大小</label>
          <div className="flex items-center gap-2">
            <input type="number" value={fontSize} onChange={e => setFontSize(+e.target.value)}
              className="w-20 px-2 py-1 border rounded text-sm" />
            <span className="text-sm text-gray-500">px</span>
          </div>
        </div>
      </div>

      {/* Converter */}
      <div className="grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600 mb-1">从</label>
          <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm mb-2">
            {cssUnits.map(u => <option key={u.key} value={u.key}>{u.name}</option>)}
          </select>
          <input type="number" value={input} onChange={e => setInput(e.target.value)}
            placeholder="输入数值"
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono" />
        </div>
        <div className="text-center">
          <button onClick={swap} className="w-10 h-10 bg-gray-100 rounded-full text-lg hover:bg-gray-200 mx-auto">⇄</button>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">到</label>
          <select value={toUnit} onChange={e => setToUnit(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm mb-2">
            {cssUnits.map(u => <option key={u.key} value={u.key}>{u.name}</option>)}
          </select>
          <div className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 font-mono">
            {results[toUnit] || "结果"}
          </div>
        </div>
      </div>

      <button onClick={convert} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700">
        🔄 转换
      </button>

      {/* All results */}
      {Object.keys(results).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">所有单位换算结果</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {cssUnits.map(u => (
              <div key={u.key} className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2 hover:bg-gray-100 transition">
                <span className="text-sm text-gray-600">{u.name}</span>
                <code className="font-mono text-sm text-blue-600">{results[u.key] || "-"}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common sizes reference */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">常用尺寸参考 (基于 {fontSize}px 字体)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border rounded">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-1.5 text-left text-xs text-gray-500">px</th>
                <th className="px-3 py-1.5 text-left text-xs text-gray-500">rem</th>
                <th className="px-3 py-1.5 text-left text-xs text-gray-500">em</th>
                <th className="px-3 py-1.5 text-left text-xs text-gray-500">pt</th>
              </tr>
            </thead>
            <tbody>
              {commonSizes.map(px => (
                <tr key={px} className="border-t hover:bg-gray-50">
                  <td className="px-3 py-1.5 font-mono">{px}px</td>
                  <td className="px-3 py-1.5 font-mono">{(px / fontSize).toFixed(3).replace(/\.?0+$/, "")}rem</td>
                  <td className="px-3 py-1.5 font-mono">{(px / fontSize).toFixed(3).replace(/\.?0+$/, "")}em</td>
                  <td className="px-3 py-1.5 font-mono">{(px * 72 / 96).toFixed(2)}pt</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
