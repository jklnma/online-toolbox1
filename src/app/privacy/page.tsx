import Header from "@/components/Header"
import Footer from "@/components/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "隐私政策" }

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">隐私政策</h1>
        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-400">
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">数据收集</h2>
            <p>在线工具箱的所有工具均在您的浏览器本地运行。我们不会收集、存储或上传您使用工具时输入的任何数据。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Cookies</h2>
            <p>我们可能使用Cookies来存储您的偏好设置（如暗色模式选择）。这些数据仅保存在您的浏览器中。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">第三方服务</h2>
            <p>我们可能使用第三方广告联盟（如Google AdSense、百度联盟）来展示广告。这些服务可能会使用Cookies来提供个性化广告。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">联系我们</h2>
            <p>如有任何隐私相关问题，请联系：3092616062@qq.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
