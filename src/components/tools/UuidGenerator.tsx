"use client"

import { useState, useCallback } from "react"

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([])
  const [version, setVersion] = useState<"v4" | "v1" | "nil">("v4")
  const [count, setCount] = useState(5)
  const [format, setFormat] = useState<"standard" | "no-dash" | "upper" | "braces" | "base64">("standard")
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const generateV4 = (): string => {
    const arr = new Uint8Array(16)
    crypto.getRandomValues(arr)
    arr[6] = (arr[6] & 0x0f) | 0x40
    arr[8] = (arr[8] & 0x3f) | 0x80
    return Array.from(arr).map((b, i) =>
      [4, 6, 8, 10].includes(i) ? "-" + b.toString(16).padStart(2, "0") : b.toString(16).padStart(2, "0")
    ).join("")
  }

  const generateV1 = (): string => {
    const timestamp = Date.now()
    const arr = new Uint8Array(16)
    crypto.getRandomValues(arr)
    // Time-low
    arr[0] = timestamp & 0xff; arr[1] = (timestamp >> 8) & 0xff
    arr[2] = (timestamp >> 16) & 0xff; arr[3] = (timestamp >> 24) & 0xff
    // Time-mid
    arr[4] = (timestamp >> 32) & 0xff; arr[5] = (timestamp >> 40) & 0xff
    // Time-hi + version 1
    arr[6] = ((timestamp >> 48) & 0x0f) | 0x10; arr[7] = (timestamp >> 52) & 0xff
    // Clock seq
    arr[8] = (arr[8] & 0x3f) | 0x80
    return Array.from(arr).map((b, i) =>
      [4, 6, 8, 10].includes(i) ? "-" + b.toString(16).padStart(2, "0") : b.toString(16).padStart(2, "0")
    ).join("")
  }

  const formatUuid = (uuid: string): string => {
    switch (format) {
      case "no-dash": return uuid.replace(/-/g, "")
      case "upper": return uuid.toUpperCase()
      case "braces": return `{${uuid}}`
      case "base64": return btoa(uuid.replace(/-/g, "").match(/.{2}/g)!.map(h => String.fromCharCode(parseInt(h, 16))).join(""))
      default: return uuid
    }
  }

  const generate = useCallback(() => {
    const result: string[] = []
    for (let i = 0; i < count; i++) {
      const uuid = version === "v4" ? generateV4() : version === "v1" ? generateV1() : "00000000-0000-0000-0000-000000000000"
      result.push(formatUuid(uuid))
    }
    setUuids(result)
  }, [version, count, format])

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const copyAll = () => navigator.clipboard.writeText(uuids.join("\n"))

  // UUID validation
  const [validateInput, setValidateInput] = useState("")
  const [validateResult, setValidateResult] = useState("")
  const validate = () => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (uuidRegex.test(validateInput)) {
      const version = parseInt(validateInput[14], 16)
      setValidateResult(`✅ 有效的UUID v${version}`)
    } else {
      setValidateResult("❌ 无效的UUID格式")
    }
  }

  return (
    <div className="space-y-4">
      {/* Version & Format */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">UUID版本</label>
          <div className="flex gap-2">
            {[
              { key: "v4", label: "v4 随机", desc: "最常用" },
              { key: "v1", label: "v1 时间戳", desc: "基于时间" },
              { key: "nil", label: "NIL", desc: "全零" },
            ].map(v => (
              <button key={v.key} onClick={() => setVersion(v.key as any)}
                title={v.desc}
                className={`flex-1 py-2 rounded-lg text-sm transition ${version === v.key ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
                {v.label}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">输出格式</label>
          <select value={format} onChange={e => setFormat(e.target.value as any)}
            className="w-full px-3 py-2 border rounded-lg text-sm">
            <option value="standard">标准格式 (带连字符)</option>
            <option value="no-dash">无连字符</option>
            <option value="upper">大写</option>
            <option value="braces">花括号包裹</option>
            <option value="base64">Base64编码</option>
          </select>
        </div>
      </div>

      {/* Count */}
      <div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">生成数量</span>
          <span className="font-mono font-bold">{count}</span>
        </div>
        <input type="range" min={1} max={100} value={count} onChange={e => setCount(+e.target.value)} className="w-full" />
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition">
          🎲 生成UUID
        </button>
        {uuids.length > 0 && (
          <button onClick={copyAll} className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700">
            全部复制
          </button>
        )}
      </div>

      {/* Results */}
      {uuids.length > 0 && (
        <div className="space-y-1 max-h-64 overflow-auto">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 border rounded-lg p-2 hover:bg-gray-100 transition">
              <span className="text-xs text-gray-400 w-6">{i + 1}</span>
              <code className="flex-1 font-mono text-sm">{uuid}</code>
              <button onClick={() => copy(uuid, i)}
                className={`px-2 py-1 rounded text-xs ${copiedIdx === i ? "bg-green-500 text-white" : "bg-green-100 text-green-700"}`}>
                {copiedIdx === i ? "✓" : "复制"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Validator */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-sm mb-2">🔍 UUID验证器</h3>
        <div className="flex gap-2">
          <input type="text" value={validateInput} onChange={e => setValidateInput(e.target.value)}
            placeholder="输入UUID进行验证..."
            className="flex-1 px-3 py-2 border rounded-lg text-sm font-mono" />
          <button onClick={validate} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">验证</button>
        </div>
        {validateResult && <div className="mt-2 text-sm">{validateResult}</div>}
      </div>
    </div>
  )
}
