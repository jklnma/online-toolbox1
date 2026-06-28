"use client"

import { useState, useCallback } from "react"

export default function PasswordGenerator() {
  const [length, setLength] = useState(16)
  const [useUpper, setUseUpper] = useState(true)
  const [useLower, setUseLower] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeChars, setExcludeChars] = useState("")
  const [noRepeat, setNoRepeat] = useState(false)
  const [noAmbiguous, setNoAmbiguous] = useState(false)
  const [count, setCount] = useState(5)
  const [passwords, setPasswords] = useState<{ pw: string; strength: { label: string; color: string; score: number } }[]>([])
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [customChars, setCustomChars] = useState("")
  const [useCustom, setUseCustom] = useState(false)
  const [memorable, setMemorable] = useState(false)
  const [separator, setSeparator] = useState("-")

  const ambiguousChars = "Il1O0"

  const generate = useCallback(() => {
    let chars = ""
    if (useCustom && customChars) {
      chars = customChars
    } else {
      if (useUpper) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if (useLower) chars += "abcdefghijklmnopqrstuvwxyz"
      if (useNumbers) chars += "0123456789"
      if (useSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?"
    }

    if (noAmbiguous) {
      chars = chars.split("").filter(c => !ambiguousChars.includes(c)).join("")
    }

    if (excludeChars) {
      chars = chars.split("").filter(c => !excludeChars.includes(c)).join("")
    }

    if (!chars) return

    const result: typeof passwords = []

    for (let i = 0; i < count; i++) {
      let pw = ""

      if (memorable) {
        pw = generateMemorable()
      } else {
        const arr = new Uint32Array(length * 2)
        crypto.getRandomValues(arr)
        let idx = 0
        for (let j = 0; j < length; j++) {
          const c = chars[arr[idx++] % chars.length]
          if (noRepeat && pw.includes(c) && pw.length > 0) {
            j--
            if (idx >= arr.length) break
            continue
          }
          pw += c
        }
      }

      result.push({ pw, strength: calcStrength(pw) })
    }
    setPasswords(result)
  }, [length, useUpper, useLower, useNumbers, useSymbols, excludeChars, noRepeat, noAmbiguous, count, customChars, useCustom, memorable])

  const generateMemorable = () => {
    const syllables = ["ba", "be", "bi", "bo", "bu", "ca", "ce", "ci", "co", "cu", "da", "de", "di", "do", "du",
      "fa", "fe", "fi", "fo", "fu", "ga", "ge", "gi", "go", "gu", "ha", "he", "hi", "ho", "hu",
      "ja", "je", "ji", "jo", "ju", "ka", "ke", "ki", "ko", "ku", "la", "le", "li", "lo", "lu",
      "ma", "me", "mi", "mo", "mu", "na", "ne", "ni", "no", "nu", "pa", "pe", "pi", "po", "pu",
      "ra", "re", "ri", "ro", "ru", "sa", "se", "si", "so", "su", "ta", "te", "ti", "to", "tu"]
    const nums = "0123456789"
    const symbols = "!@#$%&*"
    const parts: string[] = []
    const syllableCount = Math.max(2, Math.floor(length / 4))
    const arr = new Uint32Array(syllableCount + 2)
    crypto.getRandomValues(arr)

    for (let i = 0; i < syllableCount; i++) {
      let syl = syllables[arr[i] % syllables.length]
      if (i === 0) syl = syl.charAt(0).toUpperCase() + syl.slice(1)
      parts.push(syl)
    }
    parts.push(nums[arr[syllableCount] % nums.length])
    parts.push(symbols[arr[syllableCount + 1] % symbols.length])

    return parts.join(separator)
  }

  const calcStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score++
    if (pw.length >= 12) score++
    if (pw.length >= 16) score++
    if (pw.length >= 20) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[a-z]/.test(pw)) score++
    if (/\d/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (new Set(pw).size >= pw.length * 0.7) score++

    if (score <= 2) return { label: "弱", color: "red", score }
    if (score <= 4) return { label: "中", color: "yellow", score }
    if (score <= 6) return { label: "强", color: "green", score }
    return { label: "极强", color: "emerald", score }
  }

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(passwords.map(p => p.pw).join("\n"))
  }

  const strengthBar = (score: number) => {
    const pct = Math.min(100, (score / 9) * 100)
    return (
      <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${
          pct <= 25 ? "bg-red-500" : pct <= 50 ? "bg-yellow-500" : pct <= 75 ? "bg-green-500" : "bg-emerald-500"
        }`} style={{ width: `${pct}%` }} />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">密码长度</span>
              <span className="font-mono font-bold text-blue-600">{length}</span>
            </div>
            <input type="range" min={4} max={128} value={length} onChange={e => setLength(+e.target.value)} className="w-full" />
            <div className="flex justify-between text-xs text-gray-400">
              <span>4</span><span>128</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">生成数量</span>
              <span className="font-mono font-bold">{count}</span>
            </div>
            <input type="range" min={1} max={50} value={count} onChange={e => setCount(+e.target.value)} className="w-full" />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useUpper} onChange={e => setUseUpper(e.target.checked)} className="rounded" />
              大写字母 A-Z
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useLower} onChange={e => setUseLower(e.target.checked)} className="rounded" />
              小写字母 a-z
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useNumbers} onChange={e => setUseNumbers(e.target.checked)} className="rounded" />
              数字 0-9
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={useSymbols} onChange={e => setUseSymbols(e.target.checked)} className="rounded" />
              特殊字符 !@#$%
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={noRepeat} onChange={e => setNoRepeat(e.target.checked)} className="rounded" />
            禁止重复字符
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={noAmbiguous} onChange={e => setNoAmbiguous(e.target.checked)} className="rounded" />
            排除易混淆字符 (I, l, 1, O, 0)
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={memorable} onChange={e => setMemorable(e.target.checked)} className="rounded" />
            易记密码模式
          </label>
          {memorable && (
            <div>
              <label className="text-sm text-gray-600">分隔符:</label>
              <select value={separator} onChange={e => setSeparator(e.target.value)} className="ml-2 px-2 py-1 border rounded text-sm">
                <option value="-">- 连字符</option>
                <option value=".">. 句号</option>
                <option value="_">_ 下划线</option>
                <option value=" ">  空格</option>
              </select>
            </div>
          )}
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useCustom} onChange={e => setUseCustom(e.target.checked)} className="rounded" />
            自定义字符集
          </label>
          {useCustom && (
            <input type="text" value={customChars} onChange={e => setCustomChars(e.target.value)}
              placeholder="输入自定义字符..."
              className="w-full px-3 py-2 border rounded-lg text-sm font-mono" />
          )}
          <div>
            <label className="text-sm text-gray-600">排除字符:</label>
            <input type="text" value={excludeChars} onChange={e => setExcludeChars(e.target.value)}
              placeholder="要排除的字符..."
              className="w-full px-3 py-2 border rounded-lg text-sm font-mono mt-1" />
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={generate} className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition">
          🔑 生成密码
        </button>
        {passwords.length > 0 && (
          <button onClick={copyAll} className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
            全部复制
          </button>
        )}
      </div>

      {passwords.length > 0 && (
        <div className="space-y-2">
          {passwords.map((item, i) => (
            <div key={i} className="flex items-center gap-3 bg-gray-50 border rounded-lg p-3 hover:bg-gray-100 transition">
              <span className="text-xs text-gray-400 w-6">{i + 1}</span>
              <code className="flex-1 font-mono text-sm break-all">{item.pw}</code>
              {strengthBar(item.strength.score)}
              <span className={`px-2 py-0.5 rounded text-xs font-medium bg-${item.strength.color}-100 text-${item.strength.color}-700`}>
                {item.strength.label}
              </span>
              <button onClick={() => copy(item.pw, i)}
                className={`px-3 py-1 rounded text-xs transition ${copiedIdx === i ? "bg-green-500 text-white" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
                {copiedIdx === i ? "✓" : "复制"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
