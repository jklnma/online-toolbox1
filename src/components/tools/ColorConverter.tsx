"use client"

import { useState, useCallback, useMemo } from "react"

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6")
  const [rgb, setRgb] = useState({ r: 59, g: 130, b: 246 })
  const [hsl, setHsl] = useState({ h: 217, s: 91, l: 60 })
  const [cmyk, setCmyk] = useState({ c: 76, m: 47, y: 0, k: 4 })
  const [hsv, setHsv] = useState({ h: 217, s: 76, v: 96 })
  const [activeInput, setActiveInput] = useState<"hex" | "rgb" | "hsl" | "cmyk" | "hsv">("hex")
  const [copiedField, setCopiedField] = useState("")
  const [history, setHistory] = useState<string[]>([])

  const hexToRgb = (h: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
    if (!result) return null
    return { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
  }

  const rgbToHex = (r: number, g: number, b: number) =>
    "#" + [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))).toString(16).padStart(2, "0")).join("")

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0, s = 0; const l = (max + min) / 2
    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
  }

  const hslToRgb = (h: number, s: number, l: number) => {
    s /= 100; l /= 100
    const a = s * Math.min(l, 1 - l)
    const f = (n: number) => {
      const k = (n + h / 30) % 12
      return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    }
    return { r: Math.round(f(0) * 255), g: Math.round(f(8) * 255), b: Math.round(f(4) * 255) }
  }

  const rgbToCmyk = (r: number, g: number, b: number) => {
    if (r === 0 && g === 0 && b === 0) return { c: 0, m: 0, y: 0, k: 100 }
    const c = 1 - r / 255, m = 1 - g / 255, y = 1 - b / 255
    const k = Math.min(c, m, y)
    return {
      c: Math.round((c - k) / (1 - k) * 100),
      m: Math.round((m - k) / (1 - k) * 100),
      y: Math.round((y - k) / (1 - k) * 100),
      k: Math.round(k * 100),
    }
  }

  const cmykToRgb = (c: number, m: number, y: number, k: number) => {
    c /= 100; m /= 100; y /= 100; k /= 100
    return {
      r: Math.round(255 * (1 - c) * (1 - k)),
      g: Math.round(255 * (1 - m) * (1 - k)),
      b: Math.round(255 * (1 - y) * (1 - k)),
    }
  }

  const rgbToHsv = (r: number, g: number, b: number) => {
    r /= 255; g /= 255; b /= 255
    const max = Math.max(r, g, b), min = Math.min(r, g, b)
    let h = 0; const v = max; const d = max - min; const s = max === 0 ? 0 : d / max
    if (max !== min) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
        case g: h = ((b - r) / d + 2) / 6; break
        case b: h = ((r - g) / d + 4) / 6; break
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) }
  }

  const hsvToRgb = (h: number, s: number, v: number) => {
    s /= 100; v /= 100
    const c = v * s, x = c * (1 - Math.abs((h / 60) % 2 - 1)), m = v - c
    let r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x }
    else if (h < 120) { r = x; g = c }
    else if (h < 180) { g = c; b = x }
    else if (h < 240) { g = x; b = c }
    else if (h < 300) { r = x; b = c }
    else { r = c; b = x }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) }
  }

  const updateFromHex = useCallback((val: string) => {
    setHex(val)
    const r = hexToRgb(val)
    if (!r) return
    setRgb(r)
    setHsl(rgbToHsl(r.r, r.g, r.b))
    setCmyk(rgbToCmyk(r.r, r.g, r.b))
    setHsv(rgbToHsv(r.r, r.g, r.b))
  }, [])

  const updateFromRgb = useCallback((r: number, g: number, b: number) => {
    setRgb({ r, g, b }); setHex(rgbToHex(r, g, b))
    setHsl(rgbToHsl(r, g, b)); setCmyk(rgbToCmyk(r, g, b)); setHsv(rgbToHsv(r, g, b))
  }, [])

  const updateFromHsl = useCallback((h: number, s: number, l: number) => {
    setHsl({ h, s, l })
    const r = hslToRgb(h, s, l); setRgb(r); setHex(rgbToHex(r.r, r.g, r.b))
    setCmyk(rgbToCmyk(r.r, r.g, r.b)); setHsv(rgbToHsv(r.r, r.g, r.b))
  }, [])

  const updateFromCmyk = useCallback((c: number, m: number, y: number, k: number) => {
    setCmyk({ c, m, y, k })
    const r = cmykToRgb(c, m, y, k); setRgb(r); setHex(rgbToHex(r.r, r.g, r.b))
    setHsl(rgbToHsl(r.r, r.g, r.b)); setHsv(rgbToHsv(r.r, r.g, r.b))
  }, [])

  const updateFromHsv = useCallback((h: number, s: number, v: number) => {
    setHsv({ h, s, v })
    const r = hsvToRgb(h, s, v); setRgb(r); setHex(rgbToHex(r.r, r.g, r.b))
    setHsl(rgbToHsl(r.r, r.g, r.b)); setCmyk(rgbToCmyk(r.r, r.g, r.b))
  }, [])

  const copy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field); setTimeout(() => setCopiedField(""), 2000)
  }

  const addToHistory = () => {
    setHistory(prev => [hex, ...prev.filter(h => h !== hex)].slice(0, 20))
  }

  // Complementary, analogous, triadic colors
  const colorHarmony = useMemo(() => {
    const comp = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l)
    const tri1 = hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l)
    const tri2 = hslToRgb((hsl.h + 240) % 360, hsl.s, hsl.l)
    const ana1 = hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l)
    const ana2 = hslToRgb((hsl.h + 330) % 360, hsl.s, hsl.l)
    return {
      complementary: rgbToHex(comp.r, comp.g, comp.b),
      triadic: [rgbToHex(tri1.r, tri1.g, tri1.b), rgbToHex(tri2.r, tri2.g, tri2.b)],
      analogous: [rgbToHex(ana1.r, ana1.g, ana1.b), rgbToHex(ana2.r, ana2.g, ana2.b)],
    }
  }, [hsl])

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255
  const textColor = luminance > 0.5 ? "#000000" : "#ffffff"

  const CopyBtn = ({ text, field }: { text: string; field: string }) => (
    <button onClick={() => copy(text, field)}
      className={`text-xs px-2 py-0.5 rounded transition ${copiedField === field ? "bg-green-500 text-white" : "bg-gray-200 dark:bg-gray-600 hover:bg-gray-300"}`}>
      {copiedField === field ? "✓" : "复制"}
    </button>
  )

  return (
    <div className="space-y-5">
      {/* Preview */}
      <div className="relative rounded-xl overflow-hidden h-28 flex items-center justify-center shadow-inner"
        style={{ backgroundColor: hex }}>
        <div className="text-center">
          <span className="text-2xl font-bold font-mono" style={{ color: textColor }}>{hex}</span>
          <div className="text-sm mt-1" style={{ color: textColor, opacity: 0.8 }}>
            RGB({rgb.r}, {rgb.g}, {rgb.b}) · HSL({hsl.h}°, {hsl.s}%, {hsl.l}%)
          </div>
        </div>
        <button onClick={addToHistory} className="absolute top-2 right-2 px-2 py-1 bg-black/20 rounded text-xs text-white hover:bg-black/40">📌 保存</button>
      </div>

      {/* Color picker + hex */}
      <div className="flex gap-3 items-center">
        <input type="color" value={hex} onChange={e => updateFromHex(e.target.value)}
          className="w-14 h-14 border-2 rounded-xl cursor-pointer shadow" />
        <div className="flex-1">
          <label className="text-xs text-gray-500">HEX</label>
          <div className="flex gap-2">
            <input type="text" value={hex} onChange={e => updateFromHex(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm dark:bg-gray-800 dark:border-gray-600" />
            <CopyBtn text={hex} field="hex" />
          </div>
        </div>
      </div>

      {/* Color spaces */}
      <div className="grid sm:grid-cols-2 gap-4">
        {/* RGB */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">RGB</span>
            <CopyBtn text={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} field="rgb" />
          </div>
          {[
            { label: "R", value: rgb.r, color: "red", max: 255 },
            { label: "G", value: rgb.g, color: "green", max: 255 },
            { label: "B", value: rgb.b, color: "blue", max: 255 },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-xs w-4 text-gray-500">{s.label}</span>
              <input type="range" min={0} max={s.max} value={s.value}
                onChange={e => updateFromRgb(
                  s.label === "R" ? +e.target.value : rgb.r,
                  s.label === "G" ? +e.target.value : rgb.g,
                  s.label === "B" ? +e.target.value : rgb.b,
                )} className="flex-1" />
              <input type="number" value={s.value} min={0} max={255}
                onChange={e => updateFromRgb(
                  s.label === "R" ? +e.target.value : rgb.r,
                  s.label === "G" ? +e.target.value : rgb.g,
                  s.label === "B" ? +e.target.value : rgb.b,
                )} className="w-16 px-2 py-1 border rounded text-sm font-mono dark:bg-gray-700 dark:border-gray-600" />
            </div>
          ))}
        </div>

        {/* HSL */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HSL</span>
            <CopyBtn text={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} field="hsl" />
          </div>
          {[
            { label: "H", value: hsl.h, max: 360 },
            { label: "S", value: hsl.s, max: 100 },
            { label: "L", value: hsl.l, max: 100 },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-xs w-4 text-gray-500">{s.label}</span>
              <input type="range" min={0} max={s.max} value={s.value}
                onChange={e => updateFromHsl(
                  s.label === "H" ? +e.target.value : hsl.h,
                  s.label === "S" ? +e.target.value : hsl.s,
                  s.label === "L" ? +e.target.value : hsl.l,
                )} className="flex-1" />
              <input type="number" value={s.value} min={0} max={s.max}
                onChange={e => updateFromHsl(
                  s.label === "H" ? +e.target.value : hsl.h,
                  s.label === "S" ? +e.target.value : hsl.s,
                  s.label === "L" ? +e.target.value : hsl.l,
                )} className="w-16 px-2 py-1 border rounded text-sm font-mono dark:bg-gray-700 dark:border-gray-600" />
            </div>
          ))}
        </div>

        {/* CMYK */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CMYK</span>
            <CopyBtn text={`cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`} field="cmyk" />
          </div>
          {[
            { label: "C", value: cmyk.c }, { label: "M", value: cmyk.m },
            { label: "Y", value: cmyk.y }, { label: "K", value: cmyk.k },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-xs w-4 text-gray-500">{s.label}</span>
              <input type="range" min={0} max={100} value={s.value}
                onChange={e => updateFromCmyk(
                  s.label === "C" ? +e.target.value : cmyk.c,
                  s.label === "M" ? +e.target.value : cmyk.m,
                  s.label === "Y" ? +e.target.value : cmyk.y,
                  s.label === "K" ? +e.target.value : cmyk.k,
                )} className="flex-1" />
              <span className="text-xs font-mono w-10 text-right">{s.value}%</span>
            </div>
          ))}
        </div>

        {/* HSV */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">HSV/HSB</span>
            <CopyBtn text={`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`} field="hsv" />
          </div>
          {[
            { label: "H", value: hsv.h, max: 360 },
            { label: "S", value: hsv.s, max: 100 },
            { label: "V", value: hsv.v, max: 100 },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-2">
              <span className="text-xs w-4 text-gray-500">{s.label}</span>
              <input type="range" min={0} max={s.max} value={s.value}
                onChange={e => updateFromHsv(
                  s.label === "H" ? +e.target.value : hsv.h,
                  s.label === "S" ? +e.target.value : hsv.s,
                  s.label === "V" ? +e.target.value : hsv.v,
                )} className="flex-1" />
              <span className="text-xs font-mono w-10 text-right">{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CSS output */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">CSS 输出</span>
        <div className="grid sm:grid-cols-2 gap-2 text-sm font-mono">
          {[
            { label: "HEX", value: hex },
            { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
            { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
            { label: "CMYK", value: `device-cmyk(${cmyk.c}% ${cmyk.m}% ${cmyk.y}% ${cmyk.k}%)` },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between bg-white dark:bg-gray-700 px-3 py-2 rounded-lg">
              <span className="text-gray-500 text-xs">{item.label}</span>
              <span>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Color harmony */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">🎨 色彩和谐</span>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-16">互补色</span>
            <div className="flex gap-1">
              {[hex, colorHarmony.complementary].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
            <span className="text-xs font-mono text-gray-400">{colorHarmony.complementary}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-16">三色组</span>
            <div className="flex gap-1">
              {[hex, ...colorHarmony.triadic].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 w-16">类似色</span>
            <div className="flex gap-1">
              {[colorHarmony.analogous[0], hex, colorHarmony.analogous[1]].map((c, i) => (
                <div key={i} className="w-8 h-8 rounded-lg border shadow-sm" style={{ backgroundColor: c }} title={c} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">📋 历史记录</span>
            <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-700">清空</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((c, i) => (
              <button key={i} onClick={() => updateFromHex(c)}
                className="w-8 h-8 rounded-lg border-2 shadow-sm hover:scale-110 transition" style={{ backgroundColor: c }} title={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
