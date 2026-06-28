"use client"

import { useState, useCallback } from "react"

export default function IpLookup() {
  const [ip, setIp] = useState("")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [myIp, setMyIp] = useState("")
  const [history, setHistory] = useState<string[]>([])

  const lookup = useCallback(async (targetIp?: string) => {
    const queryIp = targetIp || ip
    if (!queryIp.trim()) return
    setLoading(true); setError("")
    try {
      // 使用 ipapi.co（支持HTTPS + 免费无需key）
      const res = await fetch(`https://ipapi.co/${queryIp}/json/`)
      const data = await res.json()
      if (!data.error) {
        setResult(data)
        setHistory(prev => [queryIp, ...prev.filter(h => h !== queryIp)].slice(0, 10))
      } else {
        setError(data.reason || "查询失败，请检查IP地址")
      }
    } catch {
      setError("网络请求失败，请稍后重试")
    }
    setLoading(false)
  }, [ip])

  const getMyIp = useCallback(async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json")
      const data = await res.json()
      setMyIp(data.ip)
      setIp(data.ip)
      lookup(data.ip)
    } catch {
      // 备用方案
      try {
        const res = await fetch("https://ipapi.co/json/")
        const data = await res.json()
        if (!data.error) {
          setMyIp(data.ip)
          setIp(data.ip)
          setResult(data)
        } else {
          setError("获取本机IP失败")
        }
      } catch {
        setError("获取本机IP失败")
      }
    }
  }, [lookup])

  const isPrivate = (ip: string) => {
    return /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|127\.|::1|fe80:)/.test(ip)
  }

  const ipType = (ip: string) => {
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(ip)) return "IPv4"
    if (/:/.test(ip)) return "IPv6"
    return "未知"
  }

  return (
    <div className="space-y-4">
      {/* Input */}
      <div className="flex gap-2">
        <input type="text" value={ip} onChange={e => setIp(e.target.value)}
          onKeyDown={e => e.key === "Enter" && lookup()}
          placeholder="输入IP地址，如 8.8.8.8"
          className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-mono focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 outline-none bg-white dark:bg-gray-800" />
        <button onClick={() => lookup()} disabled={loading}
          className="btn-primary disabled:opacity-50">
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              查询中
            </span>
          ) : "查询"}
        </button>
        <button onClick={getMyIp} className="btn-secondary flex items-center gap-1.5">
          <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          我的IP
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-xl">
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-5 text-center">
            <div className="text-3xl font-bold font-mono text-white">{result.ip}</div>
            <div className="text-sm text-blue-100 mt-1">
              {ipType(result.ip)} {isPrivate(result.ip) ? "· 内网地址" : "· 公网地址"}
            </div>
          </div>

          {/* Info grid */}
          <div className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: "🌍", label: "国家", value: `${result.country_name || result.country} (${result.country_code})` },
                { icon: "📍", label: "地区", value: result.region },
                { icon: "🏙️", label: "城市", value: result.city },
                { icon: "📮", label: "邮编", value: result.postal },
                { icon: "🌐", label: "ISP", value: result.org },
                { icon: "🕐", label: "时区", value: result.timezone },
                { icon: "📡", label: "ASN", value: result.asn },
                { icon: "🔗", label: "经纬度", value: result.latitude && result.longitude ? `${result.latitude}, ${result.longitude}` : "-" },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-3">
                  <span className="text-lg">{item.icon}</span>
                  <div className="min-w-0">
                    <div className="text-xs text-gray-400 dark:text-gray-500">{item.label}</div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{item.value || "-"}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map link */}
            {result.latitude && result.longitude && (
              <div className="mt-4 text-center">
                <a href={`https://www.google.com/maps?q=${result.latitude},${result.longitude}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  在地图上查看
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* My IP info */}
      {myIp && !result && (
        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 text-center border border-green-200 dark:border-green-800">
          <div className="text-sm text-green-600 dark:text-green-400">您的公网IP</div>
          <div className="text-2xl font-bold font-mono text-green-700 dark:text-green-300">{myIp}</div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">📋 查询历史</h3>
          <div className="flex flex-wrap gap-2">
            {history.map(h => (
              <button key={h} onClick={() => { setIp(h); lookup(h) }}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm font-mono hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                {h}
              </button>
            ))}
            <button onClick={() => setHistory([])} className="px-3 py-1.5 text-red-500 text-sm hover:text-red-700">清空</button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
        <h3 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100">💡 使用提示</h3>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1.5">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>点击"我的IP"可快速查询自身公网IP及地理位置</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>支持IPv4和IPv6地址查询</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>支持域名查询（如 google.com）</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 mt-0.5">•</span>
            <span>数据来源于 ipapi.co，免费API每日限1000次</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
