import { computed, onMounted, ref } from 'vue'

const DEFAULT_TELEPORT_TARGET = '#portal-target'
const configuredTeleportTarget = ref(DEFAULT_TELEPORT_TARGET)

export interface TeleportTargetOptions {
    createIfMissing?: boolean
    id?: string
    target?: string
}

export const configureTeleportTarget = (target: string): void => {
    configuredTeleportTarget.value = target
}

const selectorToId = (target: string): string => {
    if (target.startsWith('#')) return target.slice(1)
    return target
}

export const useTeleportTarget = (options: TeleportTargetOptions = {}) => {
    const target = computed(() => options.target ?? configuredTeleportTarget.value)
    const isReady = ref(false)

    const ensureTarget = (): HTMLElement | null => {
        if (typeof document === 'undefined') return null

        const selector = target.value
        const existing = document.querySelector<HTMLElement>(selector)
        if (existing || options.createIfMissing === false) return existing

        const id = options.id ?? selectorToId(selector)
        const el = document.createElement('div')
        el.id = id
        document.body.appendChild(el)
        return el
    }

    onMounted(() => {
        isReady.value = !!ensureTarget()
    })

    return {
        ensureTarget,
        isReady,
        target
    }
}

export default useTeleportTarget
