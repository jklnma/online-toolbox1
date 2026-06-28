"use client"

import { useState, useRef, useCallback } from "react"

export default function ImageBase64() {
  const [preview, setPreview] = useState("")
  const [base64, setBase64] = useState("")
  const [cssOutput, setCssOutput] = useState("")
  const [htmlOutput, setHtmlOutput] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [fileInfo, setFileInfo] = useState({ name: "", size: "", type: "", dimensions: "" })
  const [outputFormat, setOutputFormat] = useState<"png" | "jpeg" | "webp">("png")
  const [quality, setQuality] = useState(0.92)
  const fileRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / 1048576).toFixed(1) + " MB"
  }

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      setPreview(dataUrl)

      // Get dimensions
      const img = new Image()
      img.onload = () => {
        setFileInfo({
          name: file.name,
          size: formatSize(file.size),
          type: file.type,
          dimensions: `${img.width} × ${img.height}`,
        })

        // Convert to desired format
        const canvas = canvasRef.current!
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext("2d")!
        ctx.drawImage(img, 0, 0)

        const mimeType = `image/${outputFormat}`
        const converted = canvas.toDataURL(mimeType, quality)
        setBase64(converted.split(",")[1])

        setCssOutput(`background-image: url("${converted}");\nbackground-size: cover;\nbackground-repeat: no-repeat;`)
        setHtmlOutput(`<img src="${converted}" alt="${file.name}" />`)
      }
      img.src = dataUrl
    }
    reader.readAsDataURL(file)
  }, [outputFormat, quality])

  const onDrag = (e: React.DragEvent) => {
    e.preventDefault(); e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
    else if (e.type === "dragleave") setDragActive(false)
  }

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragActive(false)
    if (e.dataTransfer.files?.[0]) processFile(e.dataTransfer.files[0])
  }

  const copy = (text: string) => navigator.clipboard.writeText(text)

  const downloadBase64 = () => {
    const blob = new Blob([base64], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url; a.download = `${fileInfo.name || "image"}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition ${
          dragActive ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
        }`}
      >
        <input ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={e => e.target.files?.[0] && processFile(e.target.files[0])} />
        <div className="text-4xl mb-3">🖼️</div>
        <div className="text-gray-600">拖拽图片到此处或点击上传</div>
        <div className="text-xs text-gray-400 mt-1">支持 JPG, PNG, GIF, WebP, SVG</div>
      </div>

      {/* Options */}
      <div className="flex gap-4">
        <div>
          <label className="text-sm text-gray-600">输出格式:</label>
          <select value={outputFormat} onChange={e => setOutputFormat(e.target.value as any)}
            className="ml-2 px-2 py-1 border rounded text-sm">
            <option value="png">PNG</option><option value="jpeg">JPEG</option><option value="webp">WebP</option>
          </select>
        </div>
        {outputFormat !== "png" && (
          <div>
            <label className="text-sm text-gray-600">质量: {Math.round(quality * 100)}%</label>
            <input type="range" min={0.1} max={1} step={0.01} value={quality}
              onChange={e => setQuality(+e.target.value)} className="ml-2 w-32 align-middle" />
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {/* Preview */}
      {preview && (
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">预览</h3>
            <img src={preview} alt="Preview" className="max-w-full max-h-48 border rounded-lg mx-auto" />
            <div className="mt-2 text-sm text-gray-500 text-center">
              {fileInfo.name} | {fileInfo.size} | {fileInfo.dimensions}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Base64</h3>
            <textarea value={base64} readOnly
              className="w-full h-32 p-2 border rounded-lg bg-gray-50 text-xs font-mono" />
            <div className="flex gap-2 mt-2">
              <button onClick={() => copy(base64)} className="flex-1 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">复制Base64</button>
              <button onClick={downloadBase64} className="flex-1 py-1.5 bg-gray-600 text-white rounded text-sm hover:bg-gray-700">下载</button>
            </div>
          </div>
        </div>
      )}

      {/* CSS/HTML output */}
      {base64 && (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-gray-700">CSS</h3>
              <button onClick={() => copy(cssOutput)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">复制</button>
            </div>
            <pre className="p-3 bg-gray-50 border rounded-lg text-xs font-mono overflow-auto">{cssOutput}</pre>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-sm font-medium text-gray-700">HTML</h3>
              <button onClick={() => copy(htmlOutput)} className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200">复制</button>
            </div>
            <pre className="p-3 bg-gray-50 border rounded-lg text-xs font-mono overflow-auto">{htmlOutput}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
