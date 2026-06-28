"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function KeyboardShortcuts() {
  const router = useRouter()

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K → focus search
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault()
        const input = document.querySelector('input[placeholder*="搜索"]') as HTMLInputElement
        if (input) {
          input.focus()
          input.select()
        }
      }
      // Escape → blur search
      if (e.key === "Escape") {
        const input = document.querySelector('input[placeholder*="搜索"]') as HTMLInputElement
        if (input === document.activeElement) {
          input.blur()
        }
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [router])

  return null
}
