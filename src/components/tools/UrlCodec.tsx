"use client"

import { useState, useCallback } from "react"

export default function UrlCodec() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [encodeType, setEncodeType] = useState<"component" | "full">("component")
  const [parsed, setParsed] = useState<URL | null>(null)
  const [parseError, setParseError] = useState("")

  const process = useCallback(() => {
    if (mode === "encode") {
      setOutput(encodeType === "component" ? encodeURIComponent(input) : encodeURI(input))
    } else {
      try {
        setOutput(decodeURIComponent(input))
      } catch {
        try { setOutput(decodeURI(input)) }
        catch { setOutput("❌ 无法解码，请检查输入") }
      }
    }
  }, [input, mode, encodeType])

  const parseUrl = useCallback(() => {
    try {
      const url = new URL(input)
      setParsed(url)
      setParseError("")
    } catch {
      setParsed(null)
      setParseError("❌ 请输入完整的URL（如 https://example.com/path?key=value）")
    }
  }, [input])

  const urlParts = parsed ? [
    { label: "协议 (Protocol)", value: parsed.protocol },
    { label: "主机 (Host)", value: parsed.host },
    { label: "主机名 (Hostname)", value: parsed.hostname },
    { label: "端口 (Port)", value: parsed.port || "(默认)" },
    { label: "路径 (Pathname)", value: parsed.pathname },
    { label: "查询参数 (Search)", value: parsed.search || "(无)" },
    { label: "哈希 (Hash)", value: parsed.hash || "(无)" },
    { label: "来源 (Origin)", value: parsed.origin },
  ] : []

  const queryParams = parsed ? Array.from(parsed.searchParams.entries()) : []

  return (
    <div className="space-y-4">
      {/* Mode */}
      <div className="flex gap-2">
        {(["encode", "decode"] as const).map(m => (
          <button key={m} onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${mode === m ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}`}>
            {m === "encode" ? "📝 编码" : "🔓 解码"}
          </button>
        ))}
      </div>

      {mode === "encode" && (
        <div className="flex gap-2">
          <button onClick={() => setEncodeType("component")}
            className={`px-3 py-1 rounded text-sm ${encodeType === "component" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>
            encodeURIComponent
          </button>
          <button onClick={() => setEncodeType("full")}
            className={`px-3 py-1 rounded text-sm ${encodeType === "full" ? "bg-blue-100 text-blue-700" : "bg-gray-100"}`}>
            encodeURI
          </button>
        </div>
      )}

      {/* Input/Output */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">输入</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === "encode" ? "输入要编码的文本或URL..." : "输入编码后的URL..."}
            className="w-full h-32 p-3 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">输出</label>
            <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">复制</button>
          </div>
          <textarea value={output} readOnly
            className="w-full h-32 p-3 border rounded-lg bg-gray-50 text-sm font-mono" />
        </div>
      </div>

      <button onClick={process} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
        {mode === "encode" ? "编码" : "解码"}
      </button>

      {/* URL Parser */}
      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-sm">🔍 URL解析器</h3>
          <button onClick={parseUrl} className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">解析URL</button>
        </div>

        {parseError && <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{parseError}</div>}

        {parsed && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3 space-y-2">
              {urlParts.map(p => (
                <div key={p.label} className="flex gap-3 text-sm">
                  <span className="text-gray-500 w-32 shrink-0">{p.label}</span>
                  <span className="font-mono text-blue-600 break-all">{p.value}</span>
                </div>
              ))}
            </div>

            {queryParams.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">查询参数详情</h4>
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr><th className="px-3 py-1.5 text-left text-xs text-gray-500">参数名</th><th className="px-3 py-1.5 text-left text-xs text-gray-500">值</th></tr>
                    </thead>
                    <tbody>
                      {queryParams.map(([k, v]) => (
                        <tr key={k} className="border-t">
                          <td className="px-3 py-1.5 font-mono text-blue-600">{k}</td>
                          <td className="px-3 py-1.5 font-mono">{v}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
