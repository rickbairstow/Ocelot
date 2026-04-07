import { reactive } from 'vue'
import { generateUuid } from '@Utils/uuid'

export type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

export interface ToastOptions {
    type?: ToastType
    duration?: number
    permanent?: boolean
}

export interface ToastItem {
    id: string
    message: string
    type: ToastType
    duration: number
    permanent: boolean
}

// Singleton — shared across all useToast() callers
const toasts = reactive<ToastItem[]>([])
const timers = new Map<string, ReturnType<typeof setTimeout>>()

export function useToast() {
    const startTimer = (id: string, duration: number): void => {
        timers.set(id, setTimeout(() => remove(id), duration))
    }

    const pauseTimer = (id: string): void => {
        clearTimeout(timers.get(id))
        timers.delete(id)
    }

    const resumeTimer = (id: string, duration: number): void => {
        startTimer(id, duration)
    }

    const add = (message: string, options?: ToastOptions): string => {
        const id = generateUuid()
        const toast: ToastItem = {
            id,
            message,
            type: options?.type ?? 'default',
            duration: options?.duration ?? 4000,
            permanent: options?.permanent ?? false
        }
        toasts.push(toast)
        if (!toast.permanent) startTimer(id, toast.duration)
        return id
    }

    const remove = (id: string): void => {
        pauseTimer(id)
        const idx = toasts.findIndex(t => t.id === id)
        if (idx !== -1) toasts.splice(idx, 1)
    }

    const clear = (): void => {
        toasts.forEach(t => pauseTimer(t.id))
        toasts.splice(0)
    }

    return { toasts, add, remove, clear, startTimer, pauseTimer, resumeTimer }
}
