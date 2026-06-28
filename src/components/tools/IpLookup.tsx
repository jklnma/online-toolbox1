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
      const res = await fetch(`http://ip-api.com/json/${queryIp}?lang=zh-CN`)
      const data = await res.json()
      if (data.status === "success") {
        setResult(data)
        setHistory(prev => [queryIp, ...prev.filter(h => h !== queryIp)].slice(0, 10))
      } else setError("查询失败，请检查IP地址")
    } catch { setError("网络请求失败") }
    setLoading(false)
  }, [ip])

  const getMyIp = useCallback(async () => {
    try {
      const res = await fetch("https://api.ipify.org?format=json")
      const data = await res.json()
      setMyIp(data.ip)
      setIp(data.ip)
      lookup(data.ip)
    } catch { setError("获取本机IP失败") }
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
          className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-300 outline-none" />
        <button onClick={() => lookup()} disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
          {loading ? "查询中..." : "查询"}
        </button>
        <button onClick={getMyIp} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
          📍 我的IP
        </button>
      </div>

      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">❌ {error}</div>}

      {/* Result */}
      {result && (
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 space-y-3">
          <div className="text-center mb-3">
            <div className="text-3xl font-bold font-mono text-blue-700">{result.query}</div>
            <div className="text-sm text-gray-500">{ipType(result.query)} {isPrivate(result.query) ? "(内网地址)" : "(公网地址)"}</div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { icon: "🌍", label: "国家", value: `${result.country} (${result.countryCode})` },
              { icon: "📍", label: "地区", value: result.regionName },
              { icon: "🏙️", label: "城市", value: result.city },
              { icon: "📮", label: "邮编", value: result.zip },
              { icon: "🌐", label: "ISP", value: result.isp },
              { icon: "🏢", label: "组织", value: result.org },
              { icon: "📡", label: "AS", value: result.as },
              { icon: "🕐", label: "时区", value: result.timezone },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <div className="text-sm font-medium">{item.value || "-"}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Map link */}
          {result.lat && result.lon && (
            <div className="text-center">
              <a href={`https://www.google.com/maps?q=${result.lat},${result.lon}`} target="_blank" rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline">
                📌 在地图上查看 ({result.lat}, {result.lon})
              </a>
            </div>
          )}
        </div>
      )}

      {/* My IP info */}
      {myIp && !result && (
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-sm text-green-600">您的公网IP</div>
          <div className="text-2xl font-bold font-mono text-green-700">{myIp}</div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">📋 查询历史</h3>
          <div className="flex flex-wrap gap-2">
            {history.map(h => (
              <button key={h} onClick={() => { setIp(h); lookup(h) }}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm font-mono hover:bg-gray-200 transition">
                {h}
              </button>
            ))}
            <button onClick={() => setHistory([])} className="px-3 py-1 text-red-500 text-sm hover:text-red-700">清空</button>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-medium text-sm mb-2">💡 使用提示</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 留空点击"我的IP"可查询自身公网IP</li>
          <li>• 支持IPv4和IPv6地址</li>
          <li>• 支持域名查询（如 google.com）</li>
          <li>• 数据来源于 ip-api.com</li>
        </ul>
      </div>
    </div>
  )
}
