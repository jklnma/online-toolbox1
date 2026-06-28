"use client"

import { useState, useCallback } from "react"

const unitTypes = [
  {
    key: "length", name: "长度", icon: "📏",
    units: [
      { name: "纳米(nm)", factor: 1e-9 },
      { name: "微米(μm)", factor: 1e-6 },
      { name: "毫米(mm)", factor: 0.001 },
      { name: "厘米(cm)", factor: 0.01 },
      { name: "分米(dm)", factor: 0.1 },
      { name: "米(m)", factor: 1 },
      { name: "千米(km)", factor: 1000 },
      { name: "英寸(in)", factor: 0.0254 },
      { name: "英尺(ft)", factor: 0.3048 },
      { name: "码(yd)", factor: 0.9144 },
      { name: "英里(mi)", factor: 1609.344 },
      { name: "海里(nmi)", factor: 1852 },
      { name: "里", factor: 500 },
      { name: "丈", factor: 3.333 },
      { name: "尺", factor: 0.3333 },
      { name: "寸", factor: 0.03333 },
    ],
  },
  {
    key: "weight", name: "重量", icon: "⚖️",
    units: [
      { name: "微克(μg)", factor: 1e-9 },
      { name: "毫克(mg)", factor: 1e-6 },
      { name: "克(g)", factor: 0.001 },
      { name: "千克(kg)", factor: 1 },
      { name: "吨(t)", factor: 1000 },
      { name: "盎司(oz)", factor: 0.0283495 },
      { name: "磅(lb)", factor: 0.453592 },
      { name: "英石(st)", factor: 6.35029 },
      { name: "格令(gr)", factor: 0.0000648 },
      { name: "两(50g)", factor: 0.05 },
      { name: "斤", factor: 0.5 },
      { name: "公斤", factor: 1 },
    ],
  },
  {
    key: "temperature", name: "温度", icon: "🌡️",
    units: [
      { name: "摄氏度(°C)", factor: 1 },
      { name: "华氏度(°F)", factor: 1 },
      { name: "开尔文(K)", factor: 1 },
      { name: "兰氏度(°Ra)", factor: 1 },
      { name: "列氏度(°Ré)", factor: 1 },
    ],
  },
  {
    key: "area", name: "面积", icon: "📐",
    units: [
      { name: "平方毫米(mm²)", factor: 1e-6 },
      { name: "平方厘米(cm²)", factor: 1e-4 },
      { name: "平方分米(dm²)", factor: 0.01 },
      { name: "平方米(m²)", factor: 1 },
      { name: "公亩(a)", factor: 100 },
      { name: "公顷(ha)", factor: 10000 },
      { name: "平方千米(km²)", factor: 1e6 },
      { name: "平方英寸(in²)", factor: 6.4516e-4 },
      { name: "平方英尺(ft²)", factor: 0.092903 },
      { name: "平方码(yd²)", factor: 0.836127 },
      { name: "英亩(ac)", factor: 4046.86 },
      { name: "平方英里(mi²)", factor: 2.59e6 },
      { name: "亩", factor: 666.667 },
      { name: "分", factor: 66.667 },
    ],
  },
  {
    key: "volume", name: "体积", icon: "🧪",
    units: [
      { name: "毫升(mL)", factor: 1e-6 },
      { name: "厘升(cL)", factor: 1e-5 },
      { name: "分升(dL)", factor: 1e-4 },
      { name: "升(L)", factor: 0.001 },
      { name: "立方米(m³)", factor: 1 },
      { name: "立方厘米(cm³)", factor: 1e-6 },
      { name: "立方英寸(in³)", factor: 1.6387e-5 },
      { name: "立方英尺(ft³)", factor: 0.0283168 },
      { name: "美制加仑(gal)", factor: 0.00378541 },
      { name: "英制加仑(gal)", factor: 0.00454609 },
      { name: "美制夸脱(qt)", factor: 9.4635e-4 },
      { name: "美制品脱(pt)", factor: 4.73176e-4 },
      { name: "美制杯(cup)", factor: 2.36588e-4 },
      { name: "汤匙(tbsp)", factor: 1.47868e-5 },
      { name: "茶匙(tsp)", factor: 4.92892e-6 },
    ],
  },
  {
    key: "speed", name: "速度", icon: "🏃",
    units: [
      { name: "米/秒(m/s)", factor: 1 },
      { name: "千米/时(km/h)", factor: 0.277778 },
      { name: "英里/时(mph)", factor: 0.44704 },
      { name: "节(kn)", factor: 0.514444 },
      { name: "英尺/秒(ft/s)", factor: 0.3048 },
      { name: "马赫(Mach)", factor: 340.3 },
      { name: "光速(c)", factor: 299792458 },
    ],
  },
  {
    key: "time", name: "时间", icon: "⏰",
    units: [
      { name: "纳秒(ns)", factor: 1e-9 },
      { name: "微秒(μs)", factor: 1e-6 },
      { name: "毫秒(ms)", factor: 0.001 },
      { name: "秒(s)", factor: 1 },
      { name: "分钟(min)", factor: 60 },
      { name: "小时(h)", factor: 3600 },
      { name: "天(d)", factor: 86400 },
      { name: "周", factor: 604800 },
      { name: "月(30天)", factor: 2592000 },
      { name: "年(365天)", factor: 31536000 },
    ],
  },
  {
    key: "data", name: "数据", icon: "💾",
    units: [
      { name: "比特(bit)", factor: 1 },
      { name: "字节(B)", factor: 8 },
      { name: "KB", factor: 8192 },
      { name: "MB", factor: 8388608 },
      { name: "GB", factor: 8589934592 },
      { name: "TB", factor: 8796093022208 },
      { name: "PB", factor: 9007199254740992 },
      { name: "KiB", factor: 8192 },
      { name: "MiB", factor: 8388608 },
      { name: "GiB", factor: 8589934592 },
    ],
  },
  {
    key: "pressure", name: "压强", icon: "🔬",
    units: [
      { name: "帕斯卡(Pa)", factor: 1 },
      { name: "千帕(kPa)", factor: 1000 },
      { name: "兆帕(MPa)", factor: 1e6 },
      { name: "巴(bar)", factor: 1e5 },
      { name: "标准大气压(atm)", factor: 101325 },
      { name: "毫米汞柱(mmHg)", factor: 133.322 },
      { name: "磅/平方英寸(psi)", factor: 6894.76 },
    ],
  },
  {
    key: "energy", name: "能量", icon: "⚡",
    units: [
      { name: "焦耳(J)", factor: 1 },
      { name: "千焦(kJ)", factor: 1000 },
      { name: "卡(cal)", factor: 4.184 },
      { name: "千卡(kcal)", factor: 4184 },
      { name: "瓦时(Wh)", factor: 3600 },
      { name: "千瓦时(kWh)", factor: 3600000 },
      { name: "电子伏(eV)", factor: 1.602e-19 },
      { name: "英热单位(BTU)", factor: 1055.06 },
    ],
  },
]

export default function UnitConverter() {
  const [type, setType] = useState("length")
  const [fromIdx, setFromIdx] = useState(5)
  const [toIdx, setToIdx] = useState(6)
  const [input, setInput] = useState("")
  const [history, setHistory] = useState<string[]>([])

  const currentType = unitTypes.find(t => t.key === type)!

  const convert = useCallback(() => {
    const v = parseFloat(input)
    if (isNaN(v)) return ""

    if (type === "temperature") {
      return convertTemp(v, fromIdx, toIdx)
    }

    const base = v * currentType.units[fromIdx].factor
    const result = base / currentType.units[toIdx].factor

    if (result >= 1e15 || (result < 1e-6 && result > 0)) {
      return result.toExponential(6)
    }
    return result.toFixed(10).replace(/\.?0+$/, "")
  }, [input, fromIdx, toIdx, type])

  const convertTemp = (v: number, from: number, to: number): string => {
    // Convert to Celsius first
    let celsius: number
    switch (from) {
      case 0: celsius = v; break
      case 1: celsius = (v - 32) * 5 / 9; break
      case 2: celsius = v - 273.15; break
      case 3: celsius = (v - 491.67) * 5 / 9; break
      case 4: celsius = v * 5 / 4; break
      default: celsius = v
    }

    // Convert from Celsius to target
    let result: number
    switch (to) {
      case 0: result = celsius; break
      case 1: result = celsius * 9 / 5 + 32; break
      case 2: result = celsius + 273.15; break
      case 3: result = (celsius + 273.15) * 9 / 5; break
      case 4: result = celsius * 4 / 5; break
      default: result = celsius
    }

    return result.toFixed(6).replace(/\.?0+$/, "")
  }

  const result = convert()

  const addToHistory = () => {
    if (!input || !result) return
    const entry = `${input} ${currentType.units[fromIdx].name} = ${result} ${currentType.units[toIdx].name}`
    setHistory(prev => [entry, ...prev].slice(0, 20))
  }

  const swap = () => {
    const t = fromIdx
    setFromIdx(toIdx)
    setToIdx(t)
  }

  return (
    <div className="space-y-4">
      {/* Unit type selector */}
      <div className="flex flex-wrap gap-2">
        {unitTypes.map(t => (
          <button
            key={t.key}
            onClick={() => { setType(t.key); setFromIdx(0); setToIdx(1) }}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${type === t.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {t.icon} {t.name}
          </button>
        ))}
      </div>

      {/* Converter */}
      <div className="grid md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm text-gray-600 mb-1">从</label>
          <select value={fromIdx} onChange={e => setFromIdx(+e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm mb-2">
            {currentType.units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
          </select>
          <input type="number" value={input} onChange={e => setInput(e.target.value)}
            placeholder="输入数值"
            className="w-full px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>

        <div className="text-center">
          <button onClick={swap}
            className="w-10 h-10 bg-gray-100 rounded-full text-lg hover:bg-gray-200 transition mx-auto">⇄</button>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">到</label>
          <select value={toIdx} onChange={e => setToIdx(+e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm mb-2">
            {currentType.units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}
          </select>
          <div className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 font-mono min-h-[38px] flex items-center">
            {result || "结果"}
          </div>
        </div>
      </div>

      {/* Quick buttons */}
      <div className="flex flex-wrap gap-2">
        <button onClick={() => { setInput("1"); }}
          className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">1</button>
        <button onClick={() => { setInput("100"); }}
          className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">100</button>
        <button onClick={() => { setInput("1000"); }}
          className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">1000</button>
        <button onClick={addToHistory} className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200">
          📝 记录
        </button>
        {result && (
          <button onClick={() => navigator.clipboard.writeText(result)} className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
            📋 复制结果
          </button>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-700">转换历史</h3>
            <button onClick={() => setHistory([])} className="text-xs text-red-500 hover:text-red-700">清空</button>
          </div>
          <div className="space-y-1 max-h-40 overflow-auto">
            {history.map((h, i) => (
              <div key={i} className="text-sm text-gray-600 bg-gray-50 rounded px-3 py-1">{h}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
