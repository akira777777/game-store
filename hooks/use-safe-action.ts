"use client"

import { useState, useCallback } from "react"
import { useErrorHandler } from "./use-error-handler"
import { useToast } from "@/components/ui/toast-provider"

interface UseSafeActionOptions {
  /**
   * Контекст для логирования ошибок
   */
  context?: string
  /**
   * Кастомное сообщение об ошибке
   */
  errorMessage?: string
  /**
   * Сообщение об успехе
   */
  successMessage?: string
  /**
   * Callback при успешном выполнении
   */
  onSuccess?: (result?: unknown) => void
  /**
   * Callback при ошибке
   */
  onError?: (error: unknown) => void
}

interface UseSafeActionReturn<T> {
  /**
   * Выполнить действие
   */
  execute: (action: () => Promise<T>) => Promise<T | undefined>
  /**
   * Флаг загрузки
   */
  isLoading: boolean
  /**
   * Ошибка (если была)
   */
  error: unknown
  /**
   * Успешно выполнено
   */
  isSuccess: boolean
  /**
   * Состояние для LoadingButton
   */
  buttonState: "idle" | "loading" | "success" | "error"
}

/**
 * Hook для безопасного выполнения асинхронных действий с автоматической обработкой ошибок
 */
export function useSafeAction<T = void>(
  options: UseSafeActionOptions = {}
): UseSafeActionReturn<T> {
  const { context, errorMessage, successMessage, onSuccess, onError } = options
  const { handleError } = useErrorHandler(context)
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<unknown>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [buttonState, setButtonState] = useState<"idle" | "loading" | "success" | "error">("idle")

  const execute = useCallback(
    async (action: () => Promise<T>): Promise<T | undefined> => {
      setIsLoading(true)
      setError(null)
      setIsSuccess(false)
      setButtonState("loading")

      try {
        const result = await action()
        setIsSuccess(true)
        setIsLoading(false)
        setButtonState("success")

        if (successMessage) {
          toast.success(successMessage)
        }

        onSuccess?.(result)

        // Автоматически сбрасываем состояние через 2 секунды
        setTimeout(() => {
          setButtonState("idle")
        }, 2000)

        return result
      } catch (err) {
        setError(err)
        setIsLoading(false)
        setIsSuccess(false)
        setButtonState("error")

        handleError(err, errorMessage)
        onError?.(err)

        // Автоматически сбрасываем состояние через 3 секунды
        setTimeout(() => {
          setButtonState("idle")
        }, 3000)

        return undefined
      }
    },
    [handleError, errorMessage, successMessage, onSuccess, onError, toast]
  )

  return { execute, isLoading, error, isSuccess, buttonState }
}
