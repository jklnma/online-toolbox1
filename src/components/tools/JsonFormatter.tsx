"use client"

import { useState, useCallback } from "react"

type Tab = "format" | "tree" | "path" | "diff"

export default function JsonFormatter() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [indent, setIndent] = useState(2)
  const [tab, setTab] = useState<Tab>("format")
  const [treeData, setTreeData] = useState<any>(null)
  const [jsonPath, setJsonPath] = useState("$")
  const [pathResult, setPathResult] = useState("")
  const [diffInput, setDiffInput] = useState("")
  const [diffResult, setDiffResult] = useState("")
  const [stats, setStats] = useState<{ keys: number; depth: number; arrays: number; objects: number } | null>(null)
  const [copied, setCopied] = useState(false)

  const format = useCallback(() => {
    try {
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj, null, indent))
      setError("")
      calcStats(obj)
    } catch (e: any) {
      setError(e.message)
      setOutput("")
      setStats(null)
    }
  }, [input, indent])

  const compress = useCallback(() => {
    try {
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj))
      setError("")
    } catch (e: any) { setError(e.message) }
  }, [input])

  const escape = useCallback(() => {
    setOutput(input.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t"))
    setError("")
  }, [input])

  const unescape = useCallback(() => {
    try {
      setOutput(JSON.parse(`"${input}"`))
      setError("")
    } catch (e: any) { setError(e.message) }
  }, [input])

  const validate = useCallback(() => {
    try {
      JSON.parse(input)
      setError("")
      setOutput("✅ 有效的JSON")
    } catch (e: any) {
      setError("❌ 无效JSON: " + e.message)
    }
  }, [input])

  const sortKeys = useCallback(() => {
    try {
      const obj = JSON.parse(input)
      const sorted = JSON.stringify(obj, Object.keys(obj).sort(), indent)
      setOutput(sorted)
      setError("")
    } catch (e: any) { setError(e.message) }
  }, [input, indent])

  const removeNulls = useCallback(() => {
    try {
      const obj = JSON.parse(input)
      const cleaned = JSON.parse(JSON.stringify(obj, (k, v) => v === null ? undefined : v))
      setOutput(JSON.stringify(cleaned, null, indent))
      setError("")
    } catch (e: any) { setError(e.message) }
  }, [input, indent])

  const minify = useCallback(() => {
    try {
      const obj = JSON.parse(input)
      setOutput(JSON.stringify(obj))
      setError("")
    } catch (e: any) { setError(e.message) }
  }, [input])

  const calcStats = (obj: any) => {
    let keys = 0, depth = 0, arrays = 0, objects = 0
    const walk = (o: any, d: number) => {
      if (d > depth) depth = d
      if (Array.isArray(o)) { arrays++; o.forEach(i => walk(i, d + 1)) }
      else if (o && typeof o === "object") {
        objects++
        for (const k of Object.keys(o)) { keys++; walk(o[k], d + 1) }
      }
    }
    walk(obj, 0)
    setStats({ keys, depth, arrays, objects })
  }

  const buildTree = useCallback(() => {
    try {
      const obj = JSON.parse(input)
      setTreeData(obj)
      setError("")
    } catch (e: any) { setError(e.message); setTreeData(null) }
  }, [input])

  const queryPath = useCallback(() => {
    try {
      const obj = JSON.parse(input)
      const parts = jsonPath.replace(/^\$\.?/, "").split(".").filter(Boolean)
      let result = obj
      for (const part of parts) {
        const match = part.match(/^(\w+)(?:\[(\d+)\])?$/)
        if (match) {
          result = result[match[1]]
          if (match[2] !== undefined) result = result[parseInt(match[2])]
        } else {
          result = result[part]
        }
      }
      setPathResult(typeof result === "object" ? JSON.stringify(result, null, 2) : String(result))
      setError("")
    } catch (e: any) { setPathResult(""); setError("路径查询失败: " + e.message) }
  }, [input, jsonPath])

  const compareJson = useCallback(() => {
    try {
      const obj1 = JSON.parse(input)
      const obj2 = JSON.parse(diffInput)
      const diffs: string[] = []
      const compare = (a: any, b: any, path: string) => {
        if (typeof a !== typeof b) { diffs.push(`${path}: 类型不同 ${typeof a} vs ${typeof b}`); return }
        if (typeof a !== "object" || a === null || b === null) {
          if (a !== b) diffs.push(`${path}: ${JSON.stringify(a)} → ${JSON.stringify(b)}`)
          return
        }
        const allKeys = new Set([...Object.keys(a), ...Object.keys(b)])
        for (const k of allKeys) {
          if (!(k in a)) diffs.push(`${path}.${k}: 新增 ${JSON.stringify(b[k])}`)
          else if (!(k in b)) diffs.push(`${path}.${k}: 删除`)
          else compare(a[k], b[k], `${path}.${k}`)
        }
      }
      compare(obj1, obj2, "$")
      setDiffResult(diffs.length ? diffs.join("\n") : "✅ 两个JSON完全相同")
    } catch (e: any) { setDiffResult("❌ 解析失败: " + e.message) }
  }, [input, diffInput])

  const toCsv = useCallback(() => {
    try {
      const arr = JSON.parse(input)
      if (!Array.isArray(arr)) { setError("CSV转换需要数组格式"); return }
      if (arr.length === 0) { setOutput(""); return }
      const headers = Object.keys(arr[0])
      const csv = [headers.join(","), ...arr.map(row => headers.map(h => JSON.stringify(row[h] ?? "")).join(","))].join("\n")
      setOutput(csv)
      setError("")
    } catch (e: any) { setError(e.message) }
  }, [input])

  const toYaml = useCallback(() => {
    try {
      const obj = JSON.parse(input)
      const toYamlStr = (o: any, indent: number = 0): string => {
        if (o === null) return "null"
        if (typeof o === "string") return `"${o}"`
        if (typeof o === "number" || typeof o === "boolean") return String(o)
        if (Array.isArray(o)) {
          if (o.length === 0) return "[]"
          return o.map(item => `${" ".repeat(indent)}- ${toYamlStr(item, indent + 2)}`).join("\n")
        }
        if (typeof o === "object") {
          const keys = Object.keys(o)
          if (keys.length === 0) return "{}"
          return keys.map(k => `${" ".repeat(indent)}${k}: ${toYamlStr(o[k], indent + 2)}`).join("\n")
        }
        return String(o)
      }
      setOutput(toYamlStr(obj))
      setError("")
    } catch (e: any) { setError(e.message) }
  }, [input])

  const copy = useCallback(() => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [output])

  const clear = useCallback(() => {
    setInput(""); setOutput(""); setError(""); setStats(null); setTreeData(null)
  }, [])

  const sampleJson = useCallback(() => {
    setInput(JSON.stringify({
      name: "张三", age: 25, email: "zhangsan@example.com",
      address: { city: "北京", district: "朝阳区", zip: "100000" },
      skills: ["JavaScript", "Python", "Go", "Rust"],
      projects: [
        { name: "项目A", status: "active", stars: 128 },
        { name: "项目B", status: "completed", stars: 64 }
      ],
      settings: { theme: "dark", language: "zh-CN", notifications: true }
    }, null, 2))
  }, [])

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: "format", label: "格式化" },
          { key: "tree", label: "树形视图" },
          { key: "path", label: "路径查询" },
          { key: "diff", label: "JSON对比" },
        ].map(t => (
          <button key={t.key} onClick={() => { setTab(t.key as Tab); if (t.key === "tree") buildTree() }}
            className={`flex-1 px-3 py-1.5 rounded-md text-sm transition ${tab === t.key ? "bg-white shadow font-medium" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap gap-2">
        {tab === "format" && (
          <>
            <button onClick={format} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition">格式化</button>
            <button onClick={compress} className="px-4 py-2 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition">压缩</button>
            <button onClick={validate} className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 transition">校验</button>
            <button onClick={sortKeys} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition">键排序</button>
            <button onClick={removeNulls} className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm hover:bg-orange-700 transition">去null</button>
            <button onClick={toCsv} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition">→CSV</button>
            <button onClick={toYaml} className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 transition">→YAML</button>
            <button onClick={escape} className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition">转义</button>
            <button onClick={unescape} className="px-3 py-2 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition">反转义</button>
          </>
        )}
        <button onClick={copy} disabled={!output} className={`px-4 py-2 rounded-lg text-sm transition ${copied ? "bg-green-500 text-white" : "bg-green-600 text-white hover:bg-green-700"} disabled:opacity-40`}>
          {copied ? "✓ 已复制" : "复制结果"}
        </button>
        <button onClick={clear} className="px-3 py-2 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition">清空</button>
        <button onClick={sampleJson} className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition">示例</button>
        <div className="flex items-center gap-2 ml-auto text-sm text-gray-500">
          <span>缩进:</span>
          <select value={indent} onChange={e => setIndent(Number(e.target.value))} className="border rounded px-2 py-1 text-sm">
            <option value={2}>2空格</option>
            <option value={4}>4空格</option>
            <option value={1}>1空格</option>
            <option value={0}>紧凑</option>
          </select>
        </div>
      </div>

      {/* Format tab */}
      {tab === "format" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">输入JSON</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={'{\n  "name": "张三",\n  "age": 25,\n  "skills": ["JS", "Python"]\n}'}
              className="w-full h-72 p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-300 outline-none resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">输出结果</label>
            {error ? (
              <div className="h-72 p-3 border border-red-200 rounded-lg bg-red-50 text-red-600 text-sm overflow-auto whitespace-pre-wrap">{error}</div>
            ) : (
              <pre className="h-72 p-3 border rounded-lg bg-gray-50 text-sm overflow-auto whitespace-pre-wrap font-mono">{output || "结果将显示在这里..."}</pre>
            )}
          </div>
        </div>
      )}

      {/* Tree view tab */}
      {tab === "tree" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">输入JSON</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入JSON..."
              className="w-full h-72 p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
            <button onClick={buildTree} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">生成树形</button>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">树形视图</label>
            <div className="h-72 p-3 border rounded-lg bg-gray-50 overflow-auto text-sm font-mono">
              {treeData ? <TreeNode data={treeData} path="$" depth={0} /> : "输入JSON后点击生成树形"}
            </div>
          </div>
        </div>
      )}

      {/* Path query tab */}
      {tab === "path" && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">输入JSON</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="输入JSON..."
              className="w-full h-64 p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-300 outline-none"
            />
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">JSONPath查询</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={jsonPath}
                  onChange={e => setJsonPath(e.target.value)}
                  placeholder="$.address.city"
                  className="flex-1 px-3 py-2 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-300 outline-none"
                />
                <button onClick={queryPath} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">查询</button>
              </div>
            </div>
            {pathResult && (
              <pre className="p-3 bg-gray-50 border rounded-lg text-sm font-mono overflow-auto max-h-48">{pathResult}</pre>
            )}
            {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}
          </div>
        </div>
      )}

      {/* Diff tab */}
      {tab === "diff" && (
        <div className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">JSON A</label>
              <textarea value={input} onChange={e => setInput(e.target.value)} placeholder="第一个JSON..."
                className="w-full h-48 p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">JSON B</label>
              <textarea value={diffInput} onChange={e => setDiffInput(e.target.value)} placeholder="第二个JSON..."
                className="w-full h-48 p-3 border rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-300 outline-none" />
            </div>
          </div>
          <button onClick={compareJson} className="px-6 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">对比</button>
          {diffResult && (
            <pre className="p-4 bg-gray-50 border rounded-lg text-sm font-mono whitespace-pre-wrap">{diffResult}</pre>
          )}
        </div>
      )}

      {/* Stats */}
      {stats && tab === "format" && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "键数量", value: stats.keys, color: "blue" },
            { label: "最大深度", value: stats.depth, color: "green" },
            { label: "对象数", value: stats.objects, color: "purple" },
            { label: "数组数", value: stats.arrays, color: "orange" },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-xl font-bold text-gray-900">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Tree node component
function TreeNode({ data, path, depth }: { data: any; path: string; depth: number }) {
  const [expanded, setExpanded] = useState(depth < 2)

  if (data === null) return <span className="text-gray-400">null</span>
  if (typeof data !== "object") return <span className="text-green-600">{JSON.stringify(data)}</span>

  const isArray = Array.isArray(data)
  const entries = isArray ? data.map((v: any, i: number) => [i, v]) : Object.entries(data)
  const bracket = isArray ? ["[", "]"] : ["{", "}"]

  return (
    <span>
      <span className="cursor-pointer hover:bg-blue-100 px-0.5 rounded select-none" onClick={() => setExpanded(!expanded)}>
        {expanded ? "▼" : "▶"} {bracket[0]}
      </span>
      {!expanded && <span className="text-gray-400"> ...{bracket[1]}</span>}
      {expanded && (
        <div className="ml-4 border-l border-gray-200 pl-2">
          {entries.map((entry: any) => {
            const key = String(entry[0]);
            const value = entry[1];
            return (
              <div key={key}>
                <span className="text-blue-600">{isArray ? `[${key}]` : `"${key}"`}</span>
                <span className="text-gray-400">: </span>
                <TreeNode data={value} path={`${path}.${key}`} depth={depth + 1} />
              </div>
            );
          })}
        </div>
      )}
      {expanded && <span>{bracket[1]}</span>}
    </span>
  )
}
