"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { tools, categories } from "@/data/tools"

export default function HomePage() {
  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const filteredTools = useMemo(() => {
    return tools.filter(t => {
      const matchesSearch = !search ||
        t.name.includes(search) ||
        t.description.includes(search) ||
        t.keywords.some(k => k.includes(search))
      const matchesCat = activeCategory === "all" || t.category === activeCategory
      return matchesSearch && matchesCat
    })
  }, [search, activeCategory])

  const grouped = useMemo(() => {
    if (search || activeCategory !== "all") {
      return [{ key: "result", name: "搜索结果", icon: "🔍", tools: filteredTools }]
    }
    return categories
      .map(cat => ({ ...cat, tools: filteredTools.filter(t => t.category === cat.key) }))
      .filter(g => g.tools.length > 0)
  }, [filteredTools, search, activeCategory])

  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-gradient" />
          <div className="absolute -bottom-1/2 -left-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/5 rounded-full blur-2xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-16 sm:py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6 text-sm text-blue-100">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>{tools.length}+ 工具已上线 · 完全免费</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-5 text-white leading-tight">
            在线工具箱
          </h1>
          <p className="text-blue-100 dark:text-gray-400 text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed">
            为开发者和创作者打造的在线工具集合。<br className="hidden sm:inline" />
            数据本地处理，安全可靠，无需注册。
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8">
            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory("all") }}
                placeholder="搜索工具... 如 JSON、密码、二维码、正则"
                className="w-full pl-12 pr-12 py-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm border-0 rounded-2xl text-gray-900 dark:text-white placeholder-gray-400 text-base focus:ring-4 focus:ring-white/20 outline-none shadow-xl transition-all"
              />
              {search ? (
                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-md font-mono">⌘K</span>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {tools.slice(0, 6).map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`}
                className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 hover:border-white/20 px-4 py-2 rounded-xl text-sm text-white/90 hover:text-white transition-all">
                <span>{t.icon}</span>
                <span>{t.name}</span>
              </Link>
            ))}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-8 sm:gap-12 mt-10 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white stat-number">{tools.length}+</div>
              <div className="text-sm text-blue-200 dark:text-gray-500 mt-1">在线工具</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white stat-number">{categories.length}</div>
              <div className="text-sm text-blue-200 dark:text-gray-500 mt-1">工具分类</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold text-white stat-number">0</div>
              <div className="text-sm text-blue-200 dark:text-gray-500 mt-1">数据上传</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="sticky top-14 z-40 glass border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveCategory("all")}
              className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all font-medium ${
                activeCategory === "all"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}>
              全部
            </button>
            {categories.map(cat => {
              const count = tools.filter(t => t.category === cat.key).length
              if (count === 0) return null
              return (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  className={`px-4 py-2 rounded-xl text-sm whitespace-nowrap transition-all font-medium ${
                    activeCategory === cat.key
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}>
                  {cat.icon} {cat.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tools grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {grouped.map(group => (
          <section key={group.key} className="mb-10">
            {group.key !== "result" && (
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{group.icon}</span>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {group.name}
                </h2>
                <span className="text-sm text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full">
                  {group.tools.length}
                </span>
              </div>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {group.tools.map((tool, i) => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}
                  className="stagger-item card-hover group bg-white dark:bg-gray-800/80 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 hover:border-blue-200 dark:hover:border-blue-500/50">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-700 flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform duration-200">
                    {tool.icon}
                  </div>
                  <h3 className="font-semibold text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-gray-900 dark:text-gray-100 mb-1">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed line-clamp-2">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {filteredTools.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-4xl">
              🔍
            </div>
            <div className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">没有找到匹配的工具</div>
            <div className="text-sm text-gray-400 dark:text-gray-500 mb-4">试试其他关键词？</div>
            <button onClick={() => { setSearch(""); setActiveCategory("all") }}
              className="btn-primary">
              清除搜索
            </button>
          </div>
        )}

        {/* SEO content */}
        <section className="mt-12 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-xl font-bold mb-5 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm">📖</span>
            关于在线工具箱
          </h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-4 leading-relaxed">
            <p>在线工具箱是一个免费的在线工具集合网站，为开发者、设计师和普通用户提供常用的在线工具。所有工具均在浏览器本地运行，数据不会上传到服务器，确保您的数据安全。</p>
            <p>我们提供JSON格式化、Base64编解码、时间戳转换、正则表达式测试、颜色转换、MD5哈希计算、二维码生成、密码生成等{tools.length}+种常用工具，持续更新中。</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-4">
                <span className="text-xl">🔒</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">数据安全</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">所有处理在浏览器本地完成</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-4">
                <span className="text-xl">⚡</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">极速体验</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">无需等待，即时处理</div>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 rounded-xl p-4">
                <span className="text-xl">💰</span>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100 text-sm">完全免费</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">无需注册，无使用限制</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
