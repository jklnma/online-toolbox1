import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center px-4">
        <div className="text-8xl mb-6">🔍</div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-3">404</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">页面不存在或已被移除</p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
            返回首页
          </Link>
          <Link href="/tools/json-formatter" className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-gray-700 dark:text-gray-300">
            使用工具
          </Link>
        </div>
      </div>
    </div>
  )
}
