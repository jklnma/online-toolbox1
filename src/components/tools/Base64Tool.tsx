"use client"

import { useState, useCallback, useRef } from "react"

export default function Base64Tool() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [mode, setMode] = useState<"encode" | "decode">("encode")
  const [charset, setCharset] = useState("UTF-8")
  const [urlSafe, setUrlSafe] = useState(false)
  const [lineBreak, setLineBreak] = useState(false)
  const [fileOutput, setFileOutput] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const encode = useCallback(() => {
    try {
      const encoder = new TextEncoder()
      const bytes = encoder.encode(input)
      let b64 = btoa(String.fromCharCode(...bytes))
      if (urlSafe) b64 = b64.replace(/\+/g, "-").replace(/\//g, "_")
      if (lineBreak) b64 = b64.match(/.{1,76}/g)?.join("\n") || b64
      setOutput(b64)
    } catch (e: any) { setOutput("❌ 编码失败: " + e.message) }
  }, [input, urlSafe, lineBreak])

  const decode = useCallback(() => {
    try {
      let b64 = input.replace(/\s/g, "")
      if (urlSafe) b64 = b64.replace(/-/g, "+").replace(/_/g, "/")
      const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
      const decoder = new TextDecoder(charset)
      setOutput(decoder.decode(bytes))
    } catch (e: any) { setOutput("❌ 解码失败: " + e.message) }
  }, [input, charset, urlSafe])

  const process = () => mode === "encode" ? encode() : decode()

  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      const base64 = result.split(",")[1]
      setFileOutput(`文件名: ${file.name}\n大小: ${formatSize(file.size)}\n类型: ${file.type}\n\n${base64}`)
    }
    reader.readAsDataURL(file)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) handleFile(e.dataTransfer.files[0])
  }

  const downloadOutput = () => {
    const blob = new Blob([output], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = mode === "encode" ? "encoded.txt" : "decoded.txt"
    a.click(); URL.revokeObjectURL(url)
  }

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

      {/* Options */}
      <div className="flex flex-wrap gap-3">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={urlSafe} onChange={e => setUrlSafe(e.target.checked)} />
          URL安全模式
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={lineBreak} onChange={e => setLineBreak(e.target.checked)} />
          每76字符换行
        </label>
        {mode === "decode" && (
          <select value={charset} onChange={e => setCharset(e.target.value)} className="px-2 py-1 border rounded text-sm">
            <option>UTF-8</option><option>GBK</option><option>GB2312</option><option>BIG5</option><option>ISO-8859-1</option>
          </select>
        )}
      </div>

      {/* Input/Output */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">输入</label>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder={mode === "encode" ? "输入要编码的文本..." : "输入Base64字符串..."}
            className="w-full h-40 p-3 border rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-300 outline-none" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium text-gray-700">输出</label>
            <div className="flex gap-1">
              <button onClick={() => navigator.clipboard.writeText(output)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">复制</button>
              <button onClick={downloadOutput} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">下载</button>
            </div>
          </div>
          <textarea value={output} readOnly
            className="w-full h-40 p-3 border rounded-lg bg-gray-50 text-sm font-mono" />
        </div>
      </div>

      <button onClick={process} className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
        {mode === "encode" ? "编码" : "解码"}
      </button>

      {/* File to Base64 */}
      <div className="border-t pt-4">
        <h3 className="font-medium text-sm mb-2">📁 文件转Base64</h3>
        <div
          onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
            dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
        >
          <input ref={fileRef} type="file" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          <div className="text-3xl mb-2">📄</div>
          <div className="text-sm text-gray-600">拖拽文件到此处或点击上传</div>
        </div>
        {fileOutput && (
          <pre className="mt-2 p-3 bg-gray-50 border rounded-lg text-xs font-mono max-h-40 overflow-auto whitespace-pre-wrap">{fileOutput}</pre>
        )}
      </div>
    </div>
  )
}
