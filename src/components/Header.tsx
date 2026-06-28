"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { tools } from "@/data/tools"

export default function Header() {
  const [search, setSearch] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (saved === "dark" || (!saved && prefersDark)) {
      setDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleDark = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
  }

  const results = search.length > 0
    ? tools.filter(t =>
        t.name.includes(search) ||
        t.description.includes(search) ||
        t.keywords.some(k => k.includes(search))
      ).slice(0, 8)
    : []

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-gray-900 dark:text-white shrink-0">
          <span className="text-2xl">🧰</span>
          <span className="hidden sm:inline">在线工具箱</span>
        </Link>

        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              placeholder="搜索工具..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowResults(true) }}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => search.length > 0 && setShowResults(true)}
              className="w-full pl-9 pr-16 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition placeholder-gray-400 dark:placeholder-gray-500"
            />
            {!search && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">⌘K</span>
            )}
          </div>
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 rounded-xl shadow-xl border dark:border-gray-700 py-2 overflow-hidden">
              {results.map(t => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm transition"
                  onClick={() => { setSearch(""); setShowResults(false) }}
                >
                  <span className="text-lg">{t.icon}</span>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-gray-100">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 shrink-0">
          <Link href="/" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition hidden sm:inline">首页</Link>
          <Link href="/about" className="px-3 py-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition hidden sm:inline">关于</Link>
          <button onClick={toggleDark}
            className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title={dark ? "切换亮色" : "切换暗色"}>
            {mounted ? (dark ? "☀️" : "🌙") : "🌓"}
          </button>
        </nav>
      </div>
    </header>
  )
}
