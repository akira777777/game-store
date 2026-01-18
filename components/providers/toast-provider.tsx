"use client"

import { cn } from "@/lib/utils"
import { AlertCircle, CheckCircle2, X } from "lucide-react"
import { createContext, ReactNode, useCallback, useContext, useState } from "react"

interface Toast {
  id: string
  message: string
  type: "success" | "error"
}

interface ToastContextValue {
  showSuccess: (message: string) => void
  handleError: (error: unknown, context?: string) => void
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showSuccess = useCallback((message: string) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { id, message, type: "success" }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 3000)
  }, [])

  const handleError = useCallback((error: unknown, context?: string) => {
    const id = Math.random().toString(36).substring(7)
    const message =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : context
            ? `Ошибка в ${context}`
            : "Произошла ошибка"

    setToasts((prev) => [...prev, { id, message, type: "error" }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showSuccess, handleError }}>
      {children}
      <div
        className="fixed bottom-0 right-0 z-[100] flex flex-col gap-2 p-4 max-w-sm w-full pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg transition-all animate-in slide-in-from-right",
              toast.type === "success"
                ? "bg-background border-green-500/50"
                : "bg-background border-destructive/50"
            )}
            role="alert"
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" aria-hidden="true" />
            ) : (
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" aria-hidden="true" />
            )}
            <p className={cn("flex-1 text-sm", toast.type === "error" && "text-destructive")}>
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Закрыть уведомление"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within ToastProvider")
  }
  return context
}
