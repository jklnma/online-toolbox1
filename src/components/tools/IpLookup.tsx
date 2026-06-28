"use client"

import { useState, useCallback } from "react"

interface IpResult {
  ip: string
  country_name?: string
  country_code?: string
  region?: string
  city?: string
  postal?: string
  org?: string
  timezone?: string
  asn?: string
  latitude?: number
  longitude?: number
}

export default function IpLookup() {
  const [ip, setIp] = useState("")
  const [result, setResult] = useState<IpResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [myIp, setMyIp] = useState("")
  const [history, setHistory] = useState<string[]>([])

  const lookup = useCallback(async (targetIp?: string) => {
    const queryIp = targetIp || ip
    if (!queryIp.trim()) return
    setLoading(true); setError("")
    try {
      // 使用多个API备用方案
      let data: IpResult | null = null

      // 方案1: ipinfo.io（免费、HTTPS、支持CORS）
      try {
        const res = await fetch(`https://ipinfo.io/${queryIp}/json`)
        if (res.ok) {
          const raw = await res.json()
          if (!raw.error) {
            // 解析loc字段获取经纬度
            let lat: number | undefined, lon: number | undefined
            if (raw.loc) {
              const [la, lo] = raw.loc.split(",").map(Number)
              lat = la; lon = lo
            }
            data = {
              ip: raw.ip,
              country_name: raw.country,
              country_code: raw.country,
              region: raw.region,
              city: raw.city,
              postal: raw.postal,
              org: raw.org,
              timezone: raw.timezone,
              asn: raw.org,
              latitude: lat,
              longitude: lon,
            }
          }
        }
      } catch {}

      // 方案2: ipapi.co 备用
      if (!data) {
        try {
          const res = await fetch(`https://ipapi.co/${queryIp}/json/`)
          if (res.ok) {
            const raw = await res.json()
            if (!raw.error) {
              data = {
                ip: raw.ip,
                country_name: raw.country_name,
                country_code: raw.country_code,
                region: raw.region,
                city: raw.city,
                postal: raw.postal,
                org: raw.org,
                timezone: raw.timezone,
                asn: raw.asn,
                latitude: raw.latitude,
                longitude: raw.longitude,
              }
            }
          }
        } catch {}
      }

      // 方案3: ip-api.com（HTTP fallback，仅在本地开发时可用）
      if (!data) {
        try {
          const res = await fetch(`https://ipapi.co/${queryIp}/json/`)
          if (res.ok) {
            const raw = await res.json()
            if (!raw.error) {
              data = {
                ip: raw.ip,
                country_name: raw.country_name,
                country_code: raw.country_code,
                region: raw.region,
                city: raw.city,
                postal: raw.postal,
                org: raw.org,
                timezone: raw.timezone,
                asn: raw.asn,
                latitude: raw.latitude,
                longitude: raw.longitude,
              }
            }
          }
        } catch {}
      }

      if (data) {
        setResult(data)
        setHistory(prev => [queryIp, ...prev.filter(h => h !== queryIp)].slice(0, 10))
      } else {
        setError("查询失败，请检查IP地址或稍后重试")
      }
    } catch {
      setError("网络请求失败，请稍后重试")
    }
    setLoading(false)
  }, [ip])

  const getMyIp = useCallback(async () => {
    try {
      const res = await fetch("https://ipinfo.io/json")
      const data = await res.json()
      if (data.ip) {
        setMyIp(data.ip)
        setIp(data.ip)
        // 直接使用已有数据
        let lat: number | undefined, lon: number | undefined
        if (data.loc) {
          const [la, lo] = data.loc.split(",").map(Number)
          lat = la; lon = lo
        }
        setResult({
          ip: data.ip,
          country_name: data.country,
          country_code: data.country,
          region: data.region,
          city: data.city,
          postal: data.postal,
          org: data.org,
          timezone: data.timezone,
          latitude: lat,
          longitude: lon,
        })
        setHistory(prev => [data.ip, ...prev.filter(h => h !== data.ip)].slice(0, 10))
      }
    } catch {
      try {
        const res = await fetch("https://api.ipify.org?format=json")
        const data = await res.json()
        setMyIp(data.ip)
        setIp(data.ip)
        lookup(data.ip)
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
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
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
                { icon: "🌍", label: "国家", value: result.country_name || result.country_code || "-" },
                { icon: "📍", label: "地区", value: result.region },
                { icon: "🏙️", label: "城市", value: result.city },
                { icon: "📮", label: "邮编", value: result.postal },
                { icon: "🌐", label: "ISP/组织", value: result.org },
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
            <span>数据来源于 ipinfo.io / ipapi.co</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
