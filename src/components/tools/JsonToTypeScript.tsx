"use client"

import { useState, useCallback } from "react"

export default function JsonToTypeScript() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [interfaceName, setInterfaceName] = useState("RootObject")
  const [prefix, setPrefix] = useState("")
  const [optional, setOptional] = useState(false)
  const [exportType, setExportType] = useState<"interface" | "type">("interface")
  const [useArray, setUseArray] = useState(true)
  const [camelCase, setCamelCase] = useState(false)
  const [error, setError] = useState("")

  const getType = (value: any, key: string): string => {
    if (value === null) return "null"
    if (value === undefined) return "any"
    if (Array.isArray(value)) {
      if (value.length === 0) return "any[]"
      const itemType = getType(value[0], key)
      return useArray ? `${itemType}[]` : `Array<${itemType}>`
    }
    if (typeof value === "object") {
      return prefix + capitalize(key) + (optional ? "?" : "")
    }
    return typeof value
  }

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

  const toCamelCase = (s: string) => s.replace(/_([a-z])/g, (_, c) => c.toUpperCase())

  const generate = useCallback(() => {
    try {
      const json = JSON.parse(input)
      const interfaces: string[] = []

      const processObject = (obj: any, name: string): string => {
        if (typeof obj !== "object" || obj === null) return getType(obj, name)

        const typeName = prefix + capitalize(name)
        const lines: string[] = []

        if (Array.isArray(obj)) {
          if (obj.length > 0) {
            return processObject(obj[0], name) + "[]"
          }
          return "any[]"
        }

        for (const [key, value] of Object.entries(obj)) {
          const propName = camelCase ? toCamelCase(key) : key
          const safeName = /[^a-zA-Z0-9_]/.test(propName) ? `"${propName}"` : propName

          if (Array.isArray(value)) {
            if (value.length > 0 && typeof value[0] === "object" && value[0] !== null) {
              const itemType = processObject(value[0], key)
              lines.push(`  ${safeName}${optional ? "?" : ""}: ${itemType}[];`)
            } else {
              const itemType = value.length > 0 ? getType(value[0], key) : "any"
              lines.push(`  ${safeName}${optional ? "?" : ""}: ${itemType}[];`)
            }
          } else if (typeof value === "object" && value !== null) {
            processObject(value, key)
            lines.push(`  ${safeName}${optional ? "?" : ""}: ${prefix}${capitalize(key)};`)
          } else {
            lines.push(`  ${safeName}${optional ? "?" : ""}: ${typeof value};`)
          }
        }

        const def = exportType === "interface"
          ? `interface ${typeName} {\n${lines.join("\n")}\n}`
          : `type ${typeName} = {\n${lines.join("\n")}\n};`

        interfaces.push(def)
        return typeName
      }

      processObject(json, interfaceName)
      setOutput(interfaces.reverse().join("\n\n"))
      setError("")
    } catch (e: any) {
      setError("❌ JSON解析失败: " + e.message)
      setOutput("")
    }
  }, [input, interfaceName, prefix, optional, exportType, useArray, camelCase])

  const copyOutput = () => navigator.clipboard.writeText(output)

  return (
    <div className="space-y-4">
      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">根类型名称</label>
          <input type="text" value={interfaceName} onChange={e => setInterfaceName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">类型前缀</label>
          <input type="text" value={prefix} onChange={e => setPrefix(e.target.value)}
            placeholder="如 I (生成 IUser, IOrder)"
            className="w-full px-3 py-2 border rounded-lg text-sm" />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" checked={exportType === "interface"} onChange={() => setExportType("interface")} />
          interface
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" checked={exportType === "type"} onChange={() => setExportType("type")} />
          type
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={optional} onChange={e => setOptional(e.target.checked)} />
          所有属性可选
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={useArray} onChange={e => setUseArray(e.target.checked)} />
          T[] 语法 (vs Array&lt;T&gt;)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={camelCase} onChange={e => setCamelCase(e.target.checked)} />
          驼峰命名
        </label>
      </div>

      {/* Input/Output */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">JSON输入</label>
            <button onClick={() => setInput("")} className="text-xs text-red-500 hover:text-red-700">清空</button>
          </div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={`{\n  "name": "张三",\n  "age": 25,\n  "hobbies": ["读书", "游泳"]\n}`}
            className="w-full h-64 p-3 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">TypeScript输出</label>
            <button onClick={copyOutput} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">复制</button>
          </div>
          <pre className="w-full h-64 p-3 border rounded-lg bg-gray-50 text-sm font-mono overflow-auto whitespace-pre-wrap">{output || "结果..."}</pre>
        </div>
      </div>

      {error && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>}

      <button onClick={generate} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
        🔄 生成TypeScript类型
      </button>
    </div>
  )
}
