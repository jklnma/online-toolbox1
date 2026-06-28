"use client"

import { useState } from "react"

export default function ShareButton({ title, url }: { title: string; url?: string }) {
  const [copied, setCopied] = useState(false)
  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "")

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} - 在线工具箱`, url: shareUrl })
      } catch {}
    } else {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <button onClick={handleShare}
      className={`px-3 py-1.5 rounded-lg text-xs transition ${
        copied ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
      }`}>
      {copied ? "✅ 已复制链接" : "🔗 分享"}
    </button>
  )
}
