import { MetadataRoute } from "next"
import { tools } from "@/data/tools"

export const dynamic = "force-static"

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://toolbox.dev"

  const toolPages = tools.map(t => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  return [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${base}/privacy`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${base}/terms`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    ...toolPages,
  ]
}
