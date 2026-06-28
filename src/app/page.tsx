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
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-950 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">免费在线工具箱</h1>
          <p className="text-blue-100 dark:text-gray-400 text-lg mb-6 max-w-2xl mx-auto">
            {tools.length}+ 实用在线工具，无需下载，打开即用。<br className="sm:hidden" />
            所有数据在浏览器本地处理，安全不上传。
          </p>

          {/* Search */}
          <div className="max-w-lg mx-auto mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveCategory("all") }}
                placeholder="搜索工具... 如 JSON、密码、二维码"
                className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-blue-200 text-sm focus:ring-2 focus:ring-white/30 outline-none transition"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200 hover:text-white">✕</button>
              )}
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-2">
            {tools.slice(0, 8).map(t => (
              <Link key={t.slug} href={`/tools/${t.slug}`}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs sm:text-sm transition">
                {t.icon} {t.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category filter */}
      <div className="max-w-6xl mx-auto px-4 py-4 sticky top-14 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <button onClick={() => setActiveCategory("all")}
            className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
              activeCategory === "all" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}>
            全部 ({tools.length})
          </button>
          {categories.map(cat => {
            const count = tools.filter(t => t.category === cat.key).length
            if (count === 0) return null
            return (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition ${
                  activeCategory === cat.key ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}>
                {cat.icon} {cat.name} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Tools grid */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {grouped.map(group => (
          <section key={group.key} className="mb-8">
            {group.key !== "result" && (
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <span>{group.icon}</span>
                <span>{group.name}</span>
                <span className="text-sm font-normal text-gray-400">({group.tools.length})</span>
              </h2>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {group.tools.map(tool => (
                <Link key={tool.slug} href={`/tools/${tool.slug}`}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-lg dark:hover:shadow-blue-900/20 transition-all duration-200 hover:-translate-y-0.5">
                  <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{tool.icon}</div>
                  <h3 className="font-medium text-sm group-hover:text-blue-600 dark:group-hover:text-blue-400 transition text-gray-900 dark:text-gray-100">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}

        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🔍</div>
            <div className="text-gray-500 dark:text-gray-400">没有找到匹配的工具</div>
            <button onClick={() => { setSearch(""); setActiveCategory("all") }}
              className="mt-3 text-blue-600 hover:text-blue-700 text-sm">清除搜索</button>
          </div>
        )}

        {/* SEO content */}
        <section className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">关于在线工具箱</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
            <p>在线工具箱是一个免费的在线工具集合网站，为开发者、设计师和普通用户提供常用的在线工具。所有工具均在浏览器本地运行，数据不会上传到服务器，确保您的数据安全。</p>
            <p>我们提供JSON格式化、Base64编解码、时间戳转换、正则表达式测试、颜色转换、MD5哈希计算、二维码生成、密码生成等{tools.length}+种常用工具，持续更新中。</p>
            <p>无论您是需要格式化JSON代码、编解码Base64、转换时间戳、测试正则表达式，还是生成二维码、计算哈希值，都可以在这里找到对应的在线工具。无需注册，无需下载，打开即用。</p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
