"use client"

import { useState, useEffect, useCallback } from "react"

const timezones = [
  { name: "本地时间", offset: 0, label: "Local" },
  { name: "UTC", offset: 0, label: "UTC" },
  { name: "北京时间", offset: 8, label: "CST" },
  { name: "东京时间", offset: 9, label: "JST" },
  { name: "纽约时间", offset: -5, label: "EST" },
  { name: "伦敦时间", offset: 0, label: "GMT" },
  { name: "巴黎时间", offset: 1, label: "CET" },
  { name: "悉尼时间", offset: 11, label: "AEDT" },
  { name: "洛杉矶时间", offset: -8, label: "PST" },
  { name: "迪拜时间", offset: 4, label: "GST" },
]

export default function TimestampTool() {
  const [now, setNow] = useState(Math.floor(Date.now() / 1000))
  const [nowMs, setNowMs] = useState(Date.now())
  const [input, setInput] = useState("")
  const [dateInput, setDateInput] = useState("")
  const [tsToDate, setTsToDate] = useState("")
  const [dateToTs, setDateToTs] = useState("")
  const [selectedTz, setSelectedTz] = useState(0)
  const [batchInput, setBatchInput] = useState("")
  const [batchResult, setBatchResult] = useState("")
  const [countdown, setCountdown] = useState("")
  const [countdownTarget, setCountdownTarget] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Math.floor(Date.now() / 1000))
      setNowMs(Date.now())
    }, 100)
    return () => clearInterval(timer)
  }, [])

  const convertToDate = useCallback(() => {
    const ts = parseInt(input)
    if (isNaN(ts)) { setTsToDate("❌ 请输入有效时间戳"); return }
    const ms = input.length === 10 ? ts * 1000 : ts
    const d = new Date(ms)

    const tzResults = timezones.map(tz => {
      const offsetMs = tz.offset * 3600 * 1000
      const tzDate = new Date(ms + offsetMs)
      return `${tz.name} (${tz.label}): ${tzDate.toISOString().replace("T", " ").slice(0, 19)}`
    }).join("\n")

    setTsToDate(
      `📅 本地时间: ${d.toLocaleString("zh-CN")}\n` +
      `🌍 UTC时间: ${d.toUTCString()}\n` +
      `📋 ISO格式: ${d.toISOString()}\n` +
      `⏱️ 秒级时间戳: ${Math.floor(ms / 1000)}\n` +
      `⏱️ 毫秒级时间戳: ${ms}\n` +
      `📊 距今: ${formatDuration(Date.now() - ms)}\n\n` +
      `🌐 各时区时间:\n${tzResults}`
    )
  }, [input])

  const convertToTs = useCallback(() => {
    const d = new Date(dateInput)
    if (isNaN(d.getTime())) { setDateToTs("❌ 请输入有效日期"); return }
    const tz = timezones[selectedTz]
    const offsetMs = tz.offset * 3600 * 1000
    setDateToTs(
      `⏱️ 秒级时间戳: ${Math.floor(d.getTime() / 1000)}\n` +
      `⏱️ 毫秒级时间戳: ${d.getTime()}\n` +
      `📅 本地时间: ${d.toLocaleString("zh-CN")}\n` +
      `🌍 UTC时间: ${d.toUTCString()}\n` +
      `📋 ISO格式: ${d.toISOString()}\n` +
      `🌐 ${tz.name}: ${new Date(d.getTime() + offsetMs).toISOString().replace("T", " ").slice(0, 19)}`
    )
  }, [dateInput, selectedTz])

  const batchConvert = useCallback(() => {
    const lines = batchInput.trim().split("\n").filter(Boolean)
    const results = lines.map(line => {
      const ts = parseInt(line.trim())
      if (isNaN(ts)) return `${line} → ❌ 无效`
      const ms = line.trim().length === 10 ? ts * 1000 : ts
      return `${line} → ${new Date(ms).toLocaleString("zh-CN")}`
    })
    setBatchResult(results.join("\n"))
  }, [batchInput])

  const formatDuration = (ms: number) => {
    const abs = Math.abs(ms)
    const seconds = Math.floor(abs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    const years = Math.floor(days / 365)

    if (years > 0) return `${years}年${days % 365}天前`
    if (days > 0) return `${days}天${hours % 24}小时前`
    if (hours > 0) return `${hours}小时${minutes % 60}分钟前`
    if (minutes > 0) return `${minutes}分钟${seconds % 60}秒前`
    return `${seconds}秒前`
  }

  const startCountdown = useCallback(() => {
    const target = new Date(countdownTarget).getTime()
    if (isNaN(target)) return
    const update = () => {
      const diff = target - Date.now()
      if (diff <= 0) { setCountdown("⏰ 时间到！"); return }
      const d = Math.floor(diff / 86400000)
      const h = Math.floor((diff % 86400000) / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setCountdown(`${d}天 ${h}小时 ${m}分 ${s}秒`)
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [countdownTarget])

  const setToNow = () => {
    setInput(now.toString())
    convertToDate()
  }

  const [activeTab, setActiveTab] = useState<"convert" | "batch" | "countdown">("convert")

  return (
    <div className="space-y-6">
      {/* Current timestamp */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 text-center">
        <div className="text-sm opacity-80 mb-1">当前Unix时间戳（实时）</div>
        <div className="text-4xl font-bold font-mono tracking-wider">{now}</div>
        <div className="text-sm opacity-80 mt-1">{new Date().toLocaleString("zh-CN")}</div>
        <div className="text-xs opacity-60 mt-1">毫秒: {nowMs}</div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: "convert", label: "时间戳转换" },
          { key: "batch", label: "批量转换" },
          { key: "countdown", label: "倒计时" },
        ].map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm transition ${activeTab === t.key ? "bg-white shadow font-medium" : "text-gray-500"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Convert tab */}
      {activeTab === "convert" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <h3 className="font-medium">⏱️ 时间戳 → 日期</h3>
            <div className="flex gap-2">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                placeholder="输入时间戳，如 1703275200"
                className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-300 outline-none" />
              <button onClick={convertToDate} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">转换</button>
              <button onClick={setToNow} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">当前</button>
            </div>
            {tsToDate && (
              <pre className="p-3 bg-gray-50 border rounded-lg text-sm whitespace-pre-wrap">{tsToDate}</pre>
            )}
          </div>

          <div className="space-y-3">
            <h3 className="font-medium">📅 日期 → 时间戳</h3>
            <div className="flex gap-2">
              <input type="datetime-local" value={dateInput} onChange={e => setDateInput(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
              <button onClick={convertToTs} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">转换</button>
            </div>
            <div>
              <label className="text-sm text-gray-600">时区:</label>
              <select value={selectedTz} onChange={e => setSelectedTz(+e.target.value)}
                className="ml-2 px-2 py-1 border rounded text-sm">
                {timezones.map((tz, i) => <option key={i} value={i}>{tz.name} (UTC{tz.offset >= 0 ? "+" : ""}{tz.offset})</option>)}
              </select>
            </div>
            {dateToTs && (
              <pre className="p-3 bg-gray-50 border rounded-lg text-sm whitespace-pre-wrap">{dateToTs}</pre>
            )}
          </div>
        </div>
      )}

      {/* Batch tab */}
      {activeTab === "batch" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">输入时间戳（每行一个）</label>
            <textarea value={batchInput} onChange={e => setBatchInput(e.target.value)}
              placeholder={"1703275200\n1703275300\n1703275400"}
              className="w-full h-48 p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
            <button onClick={batchConvert} className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">批量转换</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">转换结果</label>
            <pre className="h-48 p-3 border rounded-lg bg-gray-50 text-sm overflow-auto whitespace-pre-wrap">{batchResult || "结果..."}</pre>
          </div>
        </div>
      )}

      {/* Countdown tab */}
      {activeTab === "countdown" && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input type="datetime-local" value={countdownTarget} onChange={e => setCountdownTarget(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
            <button onClick={startCountdown} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">开始倒计时</button>
          </div>
          {countdown && (
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-xl p-8 text-center">
              <div className="text-sm opacity-80 mb-2">距离目标时间还有</div>
              <div className="text-3xl font-bold font-mono">{countdown}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
