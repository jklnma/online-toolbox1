import Header from "@/components/Header"
import Footer from "@/components/Footer"
import type { Metadata } from "next"

export const metadata: Metadata = { title: "使用条款" }

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100">使用条款</h1>
        <div className="space-y-6 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">1. 服务说明</h2>
            <p>在线工具箱（以下简称"本站"）提供免费在线工具服务。所有工具均在用户浏览器本地运行，本站不存储用户输入的任何数据。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">2. 使用规范</h2>
            <p>用户应合法使用本站提供的工具。禁止将本站工具用于任何违法活动。用户对其使用本站工具的行为承担全部责任。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">3. 免责声明</h2>
            <p>本站工具按"现状"提供，不作任何明示或暗示的保证。本站不对工具的准确性、完整性或可靠性作任何承诺。用户使用本站工具的风险由用户自行承担。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">4. 知识产权</h2>
            <p>本站的代码、设计、内容等知识产权归本站所有。用户使用本站工具生成的结果归用户所有。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">5. 广告</h2>
            <p>本站可能展示第三方广告。广告内容由广告联盟提供，本站不对广告内容负责。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">6. 条款变更</h2>
            <p>本站保留随时修改使用条款的权利。修改后的条款将在本页面公布。</p>
          </section>
          <section>
            <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">7. 联系方式</h2>
            <p>如有任何问题，请联系：3092616062@qq.com</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
