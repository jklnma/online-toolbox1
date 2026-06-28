import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { tools, categories } from "@/data/tools"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "关于我们",
  description: "了解在线工具箱 - 免费、安全、无需下载的在线工具集合平台",
}

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">关于在线工具箱</h1>

        <div className="space-y-8 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">🧰 我们是什么</h2>
            <p className="leading-relaxed">
              在线工具箱是一个免费的在线工具集合平台，为开发者、设计师和普通用户提供 {tools.length}+ 种常用在线工具。
              涵盖 {categories.length} 大分类：{categories.map(c => c.name).join("、")}。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">🔒 数据安全</h2>
            <p className="leading-relaxed">
              所有工具均在浏览器本地运行，您的数据不会上传到服务器。无论是JSON格式化、Base64编解码、密码生成还是图片处理，
              所有操作都在您的浏览器中完成。关闭页面后，数据即刻消失。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">💰 完全免费</h2>
            <p className="leading-relaxed">
              所有工具完全免费使用，无需注册，无需下载，打开即用。我们通过广告收入维持服务器运营，
              永远不会向用户收费。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">🚀 持续更新</h2>
            <p className="leading-relaxed">
              我们持续开发新工具、优化现有工具。如果您有工具需求或建议，欢迎联系我们。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">🛠️ 工具列表</h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {tools.map(t => (
                <div key={t.slug} className="flex items-center gap-2 text-sm">
                  <span>{t.icon}</span>
                  <span className="text-gray-900 dark:text-gray-100">{t.name}</span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-500 dark:text-gray-500">{t.description}</span>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">📧 联系我们</h2>
            <p className="leading-relaxed">
              如果您有任何问题、建议或合作意向，欢迎通过以下方式联系我们：
            </p>
            <ul className="mt-2 space-y-1">
              <li>📧 邮箱：3092616062@qq.com</li>
              <li>🐙 GitHub：<a href="https://github.com/jklnma/online-toolbox" className="text-blue-600 dark:text-blue-400 hover:underline">online-toolbox</a></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
