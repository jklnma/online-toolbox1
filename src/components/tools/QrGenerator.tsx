"use client"

import { useState, useCallback, useRef } from "react"
import QRCode from "qrcode"

export default function QrGenerator() {
  const [input, setInput] = useState("")
  const [size, setSize] = useState(256)
  const [fgColor, setFgColor] = useState("#000000")
  const [bgColor, setBgColor] = useState("#ffffff")
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M")
  const [qrDataUrl, setQrDataUrl] = useState("")
  const [activeTab, setActiveTab] = useState<"text" | "wifi" | "vcard" | "email" | "sms" | "geo">("text")
  const [wifiSSID, setWifiSSID] = useState("")
  const [wifiPass, setWifiPass] = useState("")
  const [wifiEnc, setWifiEnc] = useState("WPA")
  const [wifiHidden, setWifiHidden] = useState(false)
  const [vcardName, setVcardName] = useState("")
  const [vcardPhone, setVcardPhone] = useState("")
  const [vcardEmail, setVcardEmail] = useState("")
  const [vcardOrg, setVcardOrg] = useState("")
  const [vcardTitle, setVcardTitle] = useState("")
  const [vcardUrl, setVcardUrl] = useState("")
  const [emailTo, setEmailTo] = useState("")
  const [emailSubject, setEmailSubject] = useState("")
  const [emailBody, setEmailBody] = useState("")
  const [smsPhone, setSmsPhone] = useState("")
  const [smsBody, setSmsBody] = useState("")
  const [geoLat, setGeoLat] = useState("")
  const [geoLng, setGeoLng] = useState("")
  const [copied, setCopied] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateQR = useCallback(async (text: string) => {
    if (!text) return
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: errorLevel as any,
      })
      setQrDataUrl(dataUrl)
    } catch (err) {
      console.error(err)
    }
  }, [size, fgColor, bgColor, errorLevel])

  const generate = useCallback(() => {
    let text = ""
    switch (activeTab) {
      case "text": text = input; break
      case "wifi": text = `WIFI:T:${wifiEnc};S:${wifiSSID};P:${wifiPass};H:${wifiHidden ? "true" : "false"};;`; break
      case "vcard":
        text = [
          "BEGIN:VCARD", "VERSION:3.0",
          `FN:${vcardName}`, `TEL:${vcardPhone}`, `EMAIL:${vcardEmail}`,
          vcardOrg && `ORG:${vcardOrg}`, vcardTitle && `TITLE:${vcardTitle}`, vcardUrl && `URL:${vcardUrl}`,
          "END:VCARD"
        ].filter(Boolean).join("\n")
        break
      case "email": text = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`; break
      case "sms": text = `smsto:${smsPhone}:${smsBody}`; break
      case "geo": text = `geo:${geoLat},${geoLng}`; break
    }
    generateQR(text)
  }, [activeTab, input, wifiSSID, wifiPass, wifiEnc, wifiHidden, vcardName, vcardPhone, vcardEmail, vcardOrg, vcardTitle, vcardUrl, emailTo, emailSubject, emailBody, smsPhone, smsBody, geoLat, geoLng, generateQR])

  const download = (fmt: "png" | "svg") => {
    if (fmt === "png" && qrDataUrl) {
      const a = document.createElement("a")
      a.href = qrDataUrl; a.download = "qrcode.png"; a.click()
    }
  }

  const copyImage = async () => {
    if (!qrDataUrl) return
    try {
      const res = await fetch(qrDataUrl)
      const blob = await res.blob()
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })])
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { }
  }

  const tabs = [
    { key: "text", label: "📝 文本/URL" },
    { key: "wifi", label: "📶 WiFi" },
    { key: "vcard", label: "👤 名片" },
    { key: "email", label: "📧 邮件" },
    { key: "sms", label: "💬 短信" },
    { key: "geo", label: "📍 位置" },
  ]

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key as any)}
            className={`flex-1 px-2 py-1.5 rounded-md text-xs sm:text-sm transition ${activeTab === t.key ? "bg-white dark:bg-gray-700 shadow" : "text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Input by tab */}
      {activeTab === "text" && (
        <textarea value={input} onChange={e => setInput(e.target.value)}
          placeholder="输入文本、URL、邮箱、电话..."
          className="w-full h-24 p-3 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-gray-800 dark:border-gray-600" />
      )}
      {activeTab === "wifi" && (
        <div className="space-y-2">
          <input type="text" value={wifiSSID} onChange={e => setWifiSSID(e.target.value)} placeholder="WiFi名称 (SSID)"
            className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <input type="text" value={wifiPass} onChange={e => setWifiPass(e.target.value)} placeholder="密码"
            className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <div className="flex gap-3">
            <select value={wifiEnc} onChange={e => setWifiEnc(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600">
              <option>WPA</option><option>WEP</option><option>nopass</option>
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={wifiHidden} onChange={e => setWifiHidden(e.target.checked)} /> 隐藏网络
            </label>
          </div>
        </div>
      )}
      {activeTab === "vcard" && (
        <div className="grid sm:grid-cols-2 gap-2">
          <input type="text" value={vcardName} onChange={e => setVcardName(e.target.value)} placeholder="姓名 *"
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <input type="text" value={vcardPhone} onChange={e => setVcardPhone(e.target.value)} placeholder="电话"
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <input type="text" value={vcardEmail} onChange={e => setVcardEmail(e.target.value)} placeholder="邮箱"
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <input type="text" value={vcardOrg} onChange={e => setVcardOrg(e.target.value)} placeholder="公司"
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <input type="text" value={vcardTitle} onChange={e => setVcardTitle(e.target.value)} placeholder="职位"
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <input type="text" value={vcardUrl} onChange={e => setVcardUrl(e.target.value)} placeholder="网站"
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
        </div>
      )}
      {activeTab === "email" && (
        <div className="space-y-2">
          <input type="text" value={emailTo} onChange={e => setEmailTo(e.target.value)} placeholder="收件人"
            className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="主题"
            className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} placeholder="内容"
            className="w-full h-20 p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
        </div>
      )}
      {activeTab === "sms" && (
        <div className="space-y-2">
          <input type="text" value={smsPhone} onChange={e => setSmsPhone(e.target.value)} placeholder="手机号"
            className="w-full px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <textarea value={smsBody} onChange={e => setSmsBody(e.target.value)} placeholder="短信内容"
            className="w-full h-20 p-3 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
        </div>
      )}
      {activeTab === "geo" && (
        <div className="grid grid-cols-2 gap-2">
          <input type="text" value={geoLat} onChange={e => setGeoLat(e.target.value)} placeholder="纬度 (如 39.9042)"
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
          <input type="text" value={geoLng} onChange={e => setGeoLng(e.target.value)} placeholder="经度 (如 116.4074)"
            className="px-3 py-2 border rounded-lg text-sm dark:bg-gray-800 dark:border-gray-600" />
        </div>
      )}

      {/* Options */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-500">尺寸</label>
          <select value={size} onChange={e => setSize(+e.target.value)}
            className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600">
            <option value={128}>128px</option><option value={256}>256px</option>
            <option value={512}>512px</option><option value={1024}>1024px</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500">前景色</label>
          <input type="color" value={fgColor} onChange={e => setFgColor(e.target.value)}
            className="w-full h-8 border rounded cursor-pointer" />
        </div>
        <div>
          <label className="text-xs text-gray-500">背景色</label>
          <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)}
            className="w-full h-8 border rounded cursor-pointer" />
        </div>
        <div>
          <label className="text-xs text-gray-500">容错</label>
          <select value={errorLevel} onChange={e => setErrorLevel(e.target.value as any)}
            className="w-full px-2 py-1.5 border rounded text-sm dark:bg-gray-800 dark:border-gray-600">
            <option value="L">L (7%)</option><option value="M">M (15%)</option>
            <option value="Q">Q (25%)</option><option value="H">H (30%)</option>
          </select>
        </div>
      </div>

      <button onClick={generate} className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition">
        📱 生成二维码
      </button>

      {/* QR display */}
      {qrDataUrl && (
        <div className="text-center space-y-3">
          <img src={qrDataUrl} alt="QR Code" className="mx-auto border-2 border-gray-200 rounded-xl shadow-lg" style={{ width: Math.min(size, 300), height: Math.min(size, 300) }} />
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={() => download("png")} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition">⬇️ 下载PNG</button>
            <button onClick={copyImage} className={`px-4 py-2 rounded-lg text-sm transition ${copied ? "bg-green-500 text-white" : "bg-gray-600 text-white hover:bg-gray-700"}`}>
              {copied ? "✅ 已复制" : "📋 复制图片"}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
