import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { tools, categories } from "@/data/tools"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解在线工具箱 - 免费、安全、专业的在线工具集合平台。",
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-3xl shadow-lg shadow-blue-500/20">
            🧰
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">关于在线工具箱</h1>
          <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            为开发者和创作者打造的免费在线工具集合平台
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700/50">
            <div className="text-3xl font-bold gradient-text mb-1">{tools.length}+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">在线工具</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700/50">
            <div className="text-3xl font-bold gradient-text mb-1">{categories.length}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">工具分类</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-100 dark:border-gray-700/50">
            <div className="text-3xl font-bold gradient-text mb-1">100%</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">免费使用</div>
          </div>
        </div>

        {/* Mission */}
        <section className="bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800/50 dark:to-gray-900/50 rounded-3xl p-8 mb-8 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm">🎯</span>
            我们的使命
          </h2>
          <div className="text-gray-600 dark:text-gray-400 space-y-4 leading-relaxed">
            <p>在线工具箱致力于为开发者、设计师和普通用户提供最实用、最便捷的在线工具。我们相信，好的工具应该免费、易用、安全。</p>
            <p>所有工具均在浏览器本地运行，数据不会上传到服务器，确保您的隐私和数据安全。无需注册，无需下载，打开即用。</p>
          </div>
        </section>

        {/* Features */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm">✨</span>
            核心特色
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: "🔒", title: "数据安全", desc: "所有处理在浏览器本地完成，数据不上传服务器" },
              { icon: "⚡", title: "极速响应", desc: "无需等待服务器处理，即时获得结果" },
              { icon: "💰", title: "完全免费", desc: "所有工具免费使用，无隐藏收费" },
              { icon: "📱", title: "多端适配", desc: "完美支持手机、平板和电脑" },
              { icon: "🌙", title: "暗色模式", desc: "支持亮色/暗色主题，保护眼睛" },
              { icon: "🔍", title: "SEO友好", desc: "每个工具独立页面，搜索引擎友好" },
            ].map(f => (
              <div key={f.title} className="bg-white dark:bg-gray-800 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 card-hover">
                <div className="flex items-start gap-4">
                  <span className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-700 flex items-center justify-center text-xl shrink-0">{f.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/50">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm">📧</span>
            联系我们
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
            如果您有任何建议、反馈或合作意向，欢迎联系我们：
          </p>
          <a href="mailto:3092616062@qq.com" className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            3092616062@qq.com
          </a>
        </section>
      </main>
      <Footer />
    </>
  )
}
