"use client"

import { useState, useCallback } from "react"

interface HashResult {
  name: string
  value: string
  time: number
}

const algorithms = [
  { key: "MD5", name: "MD5", bits: 128 },
  { key: "SHA-1", name: "SHA-1", bits: 160 },
  { key: "SHA-256", name: "SHA-256", bits: 256 },
  { key: "SHA-384", name: "SHA-384", bits: 384 },
  { key: "SHA-512", name: "SHA-512", bits: 512 },
]

const encodings = [
  { key: "hex", name: "十六进制 (Hex)" },
  { key: "base64", name: "Base64" },
  { key: "binary", name: "二进制" },
]

export default function HashGenerator() {
  const [input, setInput] = useState("")
  const [results, setResults] = useState<HashResult[]>([])
  const [encoding, setEncoding] = useState("hex")
  const [selectedAlgos, setSelectedAlgos] = useState<Set<string>>(new Set(["MD5", "SHA-1", "SHA-256", "SHA-512"]))
  const [hmacKey, setHmacKey] = useState("")
  const [useHmac, setUseHmac] = useState(false)
  const [fileHash, setFileHash] = useState<HashResult[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const toggleAlgo = (key: string) => {
    const next = new Set(selectedAlgos)
    if (next.has(key)) next.delete(key)
    else next.add(key)
    setSelectedAlgos(next)
  }

  const computeHash = useCallback(async () => {
    if (!input) return
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const newResults: HashResult[] = []

    for (const algo of algorithms) {
      if (!selectedAlgos.has(algo.key)) continue
      const start = performance.now()

      try {
        let hashBuffer: ArrayBuffer
        if (useHmac && hmacKey) {
          const key = await crypto.subtle.importKey("raw", encoder.encode(hmacKey), { name: "HMAC", hash: algo.key }, false, ["sign"])
          hashBuffer = await crypto.subtle.sign("HMAC", key, data)
        } else if (algo.key === "MD5") {
          const hash = md5(input)
          newResults.push({ name: algo.key, value: hash, time: performance.now() - start })
          continue
        } else {
          hashBuffer = await crypto.subtle.digest(algo.key, data)
        }

        const elapsed = performance.now() - start
        let value: string
        if (encoding === "hex") {
          value = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("")
        } else if (encoding === "base64") {
          value = btoa(String.fromCharCode(...new Uint8Array(hashBuffer)))
        } else {
          value = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(2).padStart(8, "0")).join("")
        }
        newResults.push({ name: algo.key, value, time: elapsed })
      } catch (e: any) {
        newResults.push({ name: algo.key, value: "❌ " + e.message, time: 0 })
      }
    }
    setResults(newResults)
  }, [input, encoding, selectedAlgos, useHmac, hmacKey])

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const buffer = await file.arrayBuffer()
    const newResults: HashResult[] = []

    for (const algo of algorithms) {
      if (!selectedAlgos.has(algo.key)) continue
      const start = performance.now()
      try {
        if (algo.key === "MD5") {
          const wordArray = Array.from(new Uint8Array(buffer))
          const hash = md5(String.fromCharCode(...wordArray))
          newResults.push({ name: algo.key, value: hash, time: performance.now() - start })
        } else {
          const hashBuffer = await crypto.subtle.digest(algo.key, buffer)
          const elapsed = performance.now() - start
          const value = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, "0")).join("")
          newResults.push({ name: algo.key, value, time: elapsed })
        }
      } catch (e: any) {
        newResults.push({ name: algo.key, value: "❌ " + e.message, time: 0 })
      }
    }
    setFileHash(newResults)
  }

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const copyAll = () => {
    const text = results.map(r => `${r.name}: ${r.value}`).join("\n")
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-4">
      {/* Algorithm selection */}
      <div className="flex flex-wrap gap-2">
        {algorithms.map(a => (
          <button
            key={a.key}
            onClick={() => toggleAlgo(a.key)}
            className={`px-3 py-1.5 rounded-lg text-sm transition ${selectedAlgos.has(a.key) ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {a.name} ({a.bits}bit)
          </button>
        ))}
      </div>

      {/* Encoding & HMAC */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">输出编码:</span>
          <select value={encoding} onChange={e => setEncoding(e.target.value)} className="border rounded px-2 py-1 text-sm">
            {encodings.map(e => <option key={e.key} value={e.key}>{e.name}</option>)}
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useHmac} onChange={e => setUseHmac(e.target.checked)} className="rounded" />
          HMAC模式
        </label>
        {useHmac && (
          <input type="text" value={hmacKey} onChange={e => setHmacKey(e.target.value)} placeholder="HMAC密钥..."
            className="px-3 py-1.5 border rounded-lg text-sm flex-1 min-w-[200px]" />
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && computeHash()}
          placeholder="输入要计算哈希的文本..."
          className="flex-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none"
        />
        <button onClick={computeHash} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">计算</button>
        {results.length > 0 && (
          <button onClick={copyAll} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">全部复制</button>
        )}
      </div>

      {/* Results */}
      {results.length > 0 && (
        <div className="space-y-2">
          {results.map((r, i) => (
            <div key={r.name} className="flex items-center gap-3 bg-gray-50 border rounded-lg p-3">
              <span className="font-medium text-sm w-20">{r.name}</span>
              <code className="flex-1 text-sm font-mono break-all">{r.value}</code>
              <span className="text-xs text-gray-400">{r.time.toFixed(2)}ms</span>
              <button
                onClick={() => copy(r.value, i)}
                className={`px-3 py-1 rounded text-xs transition ${copiedIdx === i ? "bg-green-500 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}
              >
                {copiedIdx === i ? "✓" : "复制"}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* File hash */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-sm mb-2">📁 文件哈希</h3>
        <input type="file" onChange={handleFile} className="text-sm" />
        {fileHash.length > 0 && (
          <div className="space-y-2 mt-3">
            {fileHash.map(r => (
              <div key={r.name} className="flex items-center gap-3 bg-gray-50 border rounded-lg p-3">
                <span className="font-medium text-sm w-20">{r.name}</span>
                <code className="flex-1 text-sm font-mono break-all">{r.value}</code>
                <span className="text-xs text-gray-400">{r.time.toFixed(2)}ms</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// MD5 implementation
function md5(string: string): string {
  function md5cycle(x: number[], k: number[]) {
    let a = x[0], b = x[1], c = x[2], d = x[3]
    a = ff(a, b, c, d, k[0], 7, -680876936); d = ff(d, a, b, c, k[1], 12, -389564586)
    c = ff(c, d, a, b, k[2], 17, 606105819); b = ff(b, c, d, a, k[3], 22, -1044525330)
    a = ff(a, b, c, d, k[4], 7, -176418897); d = ff(d, a, b, c, k[5], 12, 1200080426)
    c = ff(c, d, a, b, k[6], 17, -1473231341); b = ff(b, c, d, a, k[7], 22, -45705983)
    a = ff(a, b, c, d, k[8], 7, 1770035416); d = ff(d, a, b, c, k[9], 12, -1958414417)
    c = ff(c, d, a, b, k[10], 17, -42063); b = ff(b, c, d, a, k[11], 22, -1990404162)
    a = ff(a, b, c, d, k[12], 7, 1804603682); d = ff(d, a, b, c, k[13], 12, -40341101)
    c = ff(c, d, a, b, k[14], 17, -1502002290); b = ff(b, c, d, a, k[15], 22, 1236535329)
    a = gg(a, b, c, d, k[1], 5, -165796510); d = gg(d, a, b, c, k[6], 9, -1069501632)
    c = gg(c, d, a, b, k[11], 14, 643717713); b = gg(b, c, d, a, k[0], 20, -373897302)
    a = gg(a, b, c, d, k[5], 5, -701558691); d = gg(d, a, b, c, k[10], 9, 38016083)
    c = gg(c, d, a, b, k[15], 14, -660478335); b = gg(b, c, d, a, k[4], 20, -405537848)
    a = gg(a, b, c, d, k[9], 5, 568446438); d = gg(d, a, b, c, k[14], 9, -1019803690)
    c = gg(c, d, a, b, k[3], 14, -187363961); b = gg(b, c, d, a, k[8], 20, 1163531501)
    a = gg(a, b, c, d, k[13], 5, -1444681467); d = gg(d, a, b, c, k[2], 9, -51403784)
    c = gg(c, d, a, b, k[7], 14, 1735328473); b = gg(b, c, d, a, k[12], 20, -1926607734)
    a = hh(a, b, c, d, k[5], 4, -378558); d = hh(d, a, b, c, k[8], 11, -2022574463)
    c = hh(c, d, a, b, k[11], 16, 1839030562); b = hh(b, c, d, a, k[14], 23, -35309556)
    a = hh(a, b, c, d, k[1], 4, -1530992060); d = hh(d, a, b, c, k[4], 11, 1272893353)
    c = hh(c, d, a, b, k[7], 16, -155497632); b = hh(b, c, d, a, k[10], 23, -1094730640)
    a = hh(a, b, c, d, k[13], 4, 681279174); d = hh(d, a, b, c, k[0], 11, -358537222)
    c = hh(c, d, a, b, k[3], 16, -722521979); b = hh(b, c, d, a, k[6], 23, 76029189)
    a = hh(a, b, c, d, k[9], 4, -640364487); d = hh(d, a, b, c, k[12], 11, -421815835)
    c = hh(c, d, a, b, k[15], 16, 530742520); b = hh(b, c, d, a, k[2], 23, -995338651)
    a = ii(a, b, c, d, k[0], 6, -198630844); d = ii(d, a, b, c, k[7], 10, 1126891415)
    c = ii(c, d, a, b, k[14], 15, -1416354905); b = ii(b, c, d, a, k[5], 21, -57434055)
    a = ii(a, b, c, d, k[12], 6, 1700485571); d = ii(d, a, b, c, k[3], 10, -1894986606)
    c = ii(c, d, a, b, k[10], 15, -1051523); b = ii(b, c, d, a, k[1], 21, -2054922799)
    a = ii(a, b, c, d, k[8], 6, 1873313359); d = ii(d, a, b, c, k[15], 10, -30611744)
    c = ii(c, d, a, b, k[6], 15, -1560198380); b = ii(b, c, d, a, k[13], 21, 1309151649)
    a = ii(a, b, c, d, k[4], 6, -145523070); d = ii(d, a, b, c, k[11], 10, -1120210379)
    c = ii(c, d, a, b, k[2], 15, 718787259); b = ii(b, c, d, a, k[9], 21, -343485551)
    x[0] = add32(a, x[0]); x[1] = add32(b, x[1]); x[2] = add32(c, x[2]); x[3] = add32(d, x[3])
  }
  function cmn(q: number, a: number, b: number, x: number, s: number, t: number) {
    a = add32(add32(a, q), add32(x, t)); return add32((a << s) | (a >>> (32 - s)), b)
  }
  function ff(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & c) | (~b & d), a, b, x, s, t) }
  function gg(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn((b & d) | (c & ~d), a, b, x, s, t) }
  function hh(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(b ^ c ^ d, a, b, x, s, t) }
  function ii(a: number, b: number, c: number, d: number, x: number, s: number, t: number) { return cmn(c ^ (b | ~d), a, b, x, s, t) }
  function md5blk(s: string) {
    const md5blks: number[] = []
    for (let i = 0; i < 64; i += 4) md5blks[i >> 2] = s.charCodeAt(i) + (s.charCodeAt(i + 1) << 8) + (s.charCodeAt(i + 2) << 16) + (s.charCodeAt(i + 3) << 24)
    return md5blks
  }
  function add32(a: number, b: number) { return (a + b) & 0xFFFFFFFF }
  function rhex(n: number) {
    const hex_chr = "0123456789abcdef"
    let s = ""
    for (let j = 0; j < 4; j++) s += hex_chr.charAt((n >> (j * 8 + 4)) & 0x0F) + hex_chr.charAt((n >> (j * 8)) & 0x0F)
    return s
  }
  let n = string.length
  let state = [1732584193, -271733879, -1732584194, 271733878]
  let i: number
  for (i = 64; i <= n; i += 64) md5cycle(state, md5blk(string.substring(i - 64, i)))
  string = string.substring(i - 64)
  const tail = Array(16).fill(0)
  for (i = 0; i < string.length; i++) tail[i >> 2] |= string.charCodeAt(i) << ((i % 4) << 3)
  tail[i >> 2] |= 0x80 << ((i % 4) << 3)
  if (i > 55) { md5cycle(state, tail); tail.fill(0) }
  tail[14] = n * 8
  md5cycle(state, tail)
  return rhex(state[0]) + rhex(state[1]) + rhex(state[2]) + rhex(state[3])
}
