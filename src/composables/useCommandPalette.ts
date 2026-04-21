import { computed, reactive, ref } from 'vue'
import type { ComputedRef, Ref } from 'vue'
import type { IconProp } from '@Composables/useIcons'
import { generateUuid } from '@Utils/uuid'

export interface CommandPaletteItem {
    description?: string
    disabled?: boolean
    group?: string
    icon?: IconProp
    id: string
    keywords?: string[]
    onSelect?: () => void
    shortcut?: string
    title: string
}

type Registry = Record<string, CommandPaletteItem[]>

const isOpen = ref(false)
const registry = reactive<Registry>({})
const commands = computed(() => Object.values(registry).flat()) as ComputedRef<CommandPaletteItem[]>

export function useCommandPalette(): {
    clearRegistry: () => void
    close: () => void
    commands: ComputedRef<CommandPaletteItem[]>
    isOpen: Ref<boolean>
    open: () => void
    register: (items: CommandPaletteItem[], key?: string) => () => void
    toggle: () => void
    unregister: (key: string) => void
} {
    const open = (): void => {
        isOpen.value = true
    }

    const close = (): void => {
        isOpen.value = false
    }

    const toggle = (): void => {
        isOpen.value = !isOpen.value
    }

    const unregister = (key: string): void => {
        delete registry[key]
    }

    const register = (items: CommandPaletteItem[], key = generateUuid('command-palette-scope')): (() => void) => {
        registry[key] = items
        return () => unregister(key)
    }

    const clearRegistry = (): void => {
        Object.keys(registry).forEach((key) => unregister(key))
    }

    return {
        clearRegistry,
        close,
        commands,
        isOpen,
        open,
        register,
        toggle,
        unregister
    }
}
