"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"

interface Toast {
  id: number
  message: string
  type: "success" | "error" | "info"
}

const ToastContext = createContext<{
  toast: (message: string, type?: "success" | "error" | "info") => void
}>({ toast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  let nextId = 0

  const toast = useCallback((message: string, type: "success" | "error" | "info" = "success") => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2500)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map(t => (
          <div key={t.id}
            className={`px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium text-white animate-fade-in ${
              t.type === "success" ? "bg-green-600" : t.type === "error" ? "bg-red-600" : "bg-blue-600"
            }`}>
            {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"} {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
