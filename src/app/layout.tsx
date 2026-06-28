import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ToastProvider } from "@/components/Toast"
import BackToTop from "@/components/BackToTop"
import KeyboardShortcuts from "@/components/KeyboardShortcuts"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: {
    default: "在线工具�?- 免费实用在线工具集合 | ToolBox",
    template: "%s - 在线工具�?| ToolBox",
  },
  description: "免费在线工具箱，提供JSON格式化、Base64编解码、时间戳转换、正则测试、颜色转换、哈希计算等20+实用在线工具，无需下载，打开即用�?,
  keywords: "在线工具,在线工具�?json格式�?base64编解�?时间戳转�?正则测试,颜色转换,md5在线,二维码生�?免费工具",
  authors: [{ name: "ToolBox" }],
  metadataBase: new URL("https://jklnma.github.io/online-toolbox1"),
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "在线工具�?,
    title: "在线工具�?- 免费实用在线工具集合",
    description: "20+免费在线工具，无需下载，打开即用",
    images: [{ url: "/og-image.svg", width: 1200, height: 630, type: "image/svg+xml" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://jklnma.github.io/online-toolbox1",
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f9fafb" },
    { media: "(prefers-color-scheme: dark)", color: "#030712" },
  ],
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className={inter.className} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            try {
              var t = localStorage.getItem('theme');
              if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                document.documentElement.classList.add('dark');
              }
            } catch(e) {}
          })();
        `}} />
      </head>
      <body className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased min-h-screen flex flex-col transition-colors">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[200] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg">
          跳转到主要内�?        </a>
        <ToastProvider>
          <div id="main-content">
            {children}
          </div>
          <BackToTop />
          <KeyboardShortcuts />
        </ToastProvider>
      </body>
    </html>
  )
}
