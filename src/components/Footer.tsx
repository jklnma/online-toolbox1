import Link from "next/link"
import { categories } from "@/data/tools"

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">🧰</span>
              <span className="font-bold">在线工具箱</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              免费在线工具集合，无需下载，打开即用。持续更新中。
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-3">热门工具</h4>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/tools/json-formatter" className="block hover:text-blue-600 dark:hover:text-blue-400">JSON格式化</Link>
              <Link href="/tools/base64" className="block hover:text-blue-600 dark:hover:text-blue-400">Base64编解码</Link>
              <Link href="/tools/timestamp" className="block hover:text-blue-600 dark:hover:text-blue-400">时间戳转换</Link>
              <Link href="/tools/md5-hash" className="block hover:text-blue-600 dark:hover:text-blue-400">MD5哈希</Link>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">工具分类</h4>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              {categories.slice(0, 6).map(cat => (
                <div key={cat.key}>{cat.icon} {cat.name}</div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-3">关于</h4>
            <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/about" className="block hover:text-blue-600 dark:hover:text-blue-400">关于我们</Link>
              <Link href="/privacy" className="block hover:text-blue-600 dark:hover:text-blue-400">隐私政策</Link>
              <Link href="/terms" className="block hover:text-blue-600 dark:hover:text-blue-400">使用条款</Link>
              <a href="mailto:3092616062@qq.com" className="block hover:text-blue-600 dark:hover:text-blue-400">联系我们</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 pt-4 text-center text-xs text-gray-400 dark:text-gray-500">
          © 2026 在线工具箱 ToolBox - 免费实用在线工具集合 | 所有工具均在浏览器本地运行，数据不上传服务器
        </div>
      </div>
    </footer>
  )
}
