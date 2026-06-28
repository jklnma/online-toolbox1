import { notFound } from "next/navigation"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ErrorBoundary from "@/components/ErrorBoundary"
import RecentTools from "@/components/RecentTools"
import ShareButton from "@/components/ShareButton"
import ToolTracker from "./ToolTracker"
import { tools, categories } from "@/data/tools"
import JsonFormatter from "@/components/tools/JsonFormatter"
import JsonToTypeScript from "@/components/tools/JsonToTypeScript"
import Base64Tool from "@/components/tools/Base64Tool"
import UrlCodec from "@/components/tools/UrlCodec"
import TimestampTool from "@/components/tools/TimestampTool"
import HashGenerator from "@/components/tools/HashGenerator"
import RegexTester from "@/components/tools/RegexTester"
import ColorConverter from "@/components/tools/ColorConverter"
import TextDiff from "@/components/tools/TextDiff"
import WordCount from "@/components/tools/WordCount"
import PasswordGenerator from "@/components/tools/PasswordGenerator"
import UuidGenerator from "@/components/tools/UuidGenerator"
import IpLookup from "@/components/tools/IpLookup"
import UnitConverter from "@/components/tools/UnitConverter"
import Percentage from "@/components/tools/Percentage"
import LoremIpsum from "@/components/tools/LoremIpsum"
import NumberBase from "@/components/tools/NumberBase"
import QrGenerator from "@/components/tools/QrGenerator"
import ImageBase64 from "@/components/tools/ImageBase64"
import CssUnit from "@/components/tools/CssUnit"
import type { Metadata } from "next"

const componentMap: Record<string, React.ComponentType> = {
  JsonFormatter, JsonToTypeScript, Base64: Base64Tool, UrlCodec,
  Timestamp: TimestampTool, HashGenerator, RegexTester, ColorConverter,
  TextDiff, WordCount, PasswordGenerator, UuidGenerator, IpLookup,
  UnitConverter, Percentage, LoremIpsum, NumberBase, QrGenerator,
  ImageBase64, CssUnit,
}

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const tool = tools.find(t => t.slug === slug)
  if (!tool) return {}
  return {
    title: tool.name,
    description: tool.description,
    keywords: tool.keywords.join(","),
    alternates: { canonical: `https://toolbox.dev/tools/${slug}` },
    openGraph: {
      title: `${tool.name} - 在线工具箱`,
      description: tool.description,
      type: "website",
    },
  }
}

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }))
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params
  const tool = tools.find(t => t.slug === slug)
  if (!tool) notFound()

  const Component = componentMap[tool.component]
  if (!Component) notFound()

  const cat = categories.find(c => c.key === tool.category)
  const relatedTools = tools.filter(t => t.category === tool.category && t.slug !== slug).slice(0, 4)

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `https://toolbox.dev/tools/${slug}`,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "CNY" },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "首页", item: "https://toolbox.dev" },
      ...(cat ? [{ "@type": "ListItem", position: 2, name: cat.name }] : []),
      { "@type": "ListItem", position: cat ? 3 : 2, name: tool.name, item: `https://toolbox.dev/tools/${slug}` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <Header />
      <ToolTracker slug={slug} />

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">首页</Link>
          <span>/</span>
          {cat && (<><span>{cat.icon} {cat.name}</span><span>/</span></>)}
          <span className="text-gray-900 dark:text-gray-100 font-medium">{tool.name}</span>
        </nav>

        {/* Title row */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <span>{tool.icon}</span>
              <span>{tool.name}</span>
              <span className="text-sm font-normal text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30 px-2 py-0.5 rounded-full">免费</span>
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{tool.description}</p>
          </div>
          <ShareButton title={tool.name} />
        </div>

        {/* Ad */}
        <div className="ad-container mb-6">广告位</div>

        {/* Tool */}
        <div className="tool-container bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-6">
          <ErrorBoundary toolName={tool.name}>
            <Component />
          </ErrorBoundary>
        </div>

        {/* Ad */}
        <div className="ad-container mb-6">广告位</div>

        {/* Recent tools */}
        <RecentTools />

        {/* Related tools */}
        {relatedTools.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-100">相关工具</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedTools.map(t => (
                <Link key={t.slug} href={`/tools/${t.slug}`}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md transition">
                  <div className="text-2xl mb-2">{t.icon}</div>
                  <h3 className="font-medium text-sm text-gray-900 dark:text-gray-100">{t.name}</h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{t.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* SEO content */}
        <section className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-lg font-bold mb-3 text-gray-900 dark:text-gray-100">关于{tool.name}</h2>
          <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
            <p>{tool.name}是一个免费的在线工具，{tool.description}。所有数据在浏览器本地处理，不会上传到服务器，确保您的数据安全。</p>
            <p>使用方法：在上方输入框中输入内容，工具会自动处理并显示结果。支持一键复制结果，方便粘贴到其他地方使用。</p>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
}
