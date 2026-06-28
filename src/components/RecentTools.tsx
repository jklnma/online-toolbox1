"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { tools } from "@/data/tools"

export default function RecentTools() {
  const [recent, setRecent] = useState<string[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const saved = localStorage.getItem("recentTools")
      if (saved) setRecent(JSON.parse(saved))
    } catch {}
  }, [])

  if (!mounted) return null

  const recentTools = recent
    .map(slug => tools.find(t => t.slug === slug))
    .filter(Boolean)
    .slice(0, 6)

  if (recentTools.length === 0) return null

  return (
    <div className="mb-6">
      <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">⏰ 最近使用</h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {recentTools.map(t => t && (
          <Link key={t.slug} href={`/tools/${t.slug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm whitespace-nowrap hover:border-blue-300 dark:hover:border-blue-500 transition">
            <span>{t.icon}</span>
            <span className="text-gray-700 dark:text-gray-300">{t.name}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export function trackToolVisit(slug: string) {
  try {
    const saved = localStorage.getItem("recentTools")
    const recent: string[] = saved ? JSON.parse(saved) : []
    const updated = [slug, ...recent.filter(s => s !== slug)].slice(0, 10)
    localStorage.setItem("recentTools", JSON.stringify(updated))
  } catch {}
}
