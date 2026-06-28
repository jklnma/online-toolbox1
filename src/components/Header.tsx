"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { tools } from "@/data/tools"

export default function Header() {
  const [search, setSearch] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [dark, setDark] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (saved === "dark" || (!saved && prefersDark)) {
      setDark(true)
      document.documentElement.classList.add("dark")
    }

    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
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
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled
        ? "glass border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm"
        : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/40 dark:border-gray-700/40"
    }`}>
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-gray-900 dark:text-white shrink-0 group">
          <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm shadow-md shadow-blue-500/20 group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-shadow">🧰</span>
          <span className="hidden sm:inline">工具箱</span>
        </Link>

        <div className="relative flex-1 max-w-md">
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="搜索工具..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowResults(true) }}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onFocus={() => search.length > 0 && setShowResults(true)}
              className="w-full pl-10 pr-16 py-2 bg-gray-100/80 dark:bg-gray-800/80 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-400/50 dark:focus:ring-blue-500/50 transition-all placeholder-gray-400 dark:placeholder-gray-500 border border-transparent focus:border-blue-300 dark:focus:border-blue-600"
            />
            {!search && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 bg-gray-200/80 dark:bg-gray-700/80 px-1.5 py-0.5 rounded-md font-mono">⌘K</span>
            )}
          </div>
          {showResults && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200/80 dark:border-gray-700/80 py-2 overflow-hidden animate-slide-down">
              {results.map(t => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-sm transition-colors"
                  onClick={() => { setSearch(""); setShowResults(false) }}
                >
                  <span className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-base">{t.icon}</span>
                  <div className="min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-100">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-300 shrink-0">
          <Link href="/" className="px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:inline font-medium">首页</Link>
          <Link href="/about" className="px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors hidden sm:inline">关于</Link>
          <button onClick={toggleDark}
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={dark ? "切换亮色" : "切换暗色"}>
            {mounted ? (
              dark ? (
                <svg className="w-4.5 h-4.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4.5 h-4.5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )
            ) : (
              <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
            )}
          </button>
        </nav>
      </div>
    </header>
  )
}
