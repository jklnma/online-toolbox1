"use client"

import { useEffect } from "react"
import { trackToolVisit } from "@/components/RecentTools"

export default function ToolTracker({ slug }: { slug: string }) {
  useEffect(() => {
    trackToolVisit(slug)
  }, [slug])

  return null
}
