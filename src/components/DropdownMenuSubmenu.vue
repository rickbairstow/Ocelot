<template>
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
    <div
        class="relative"
        @focusin="open"
        @focusout="handleFocusout"
        @mouseenter="open"
        @mouseleave="close"
    >
        <button
            ref="triggerRef"
            aria-haspopup="menu"
            data-dropdown-menu-item
            role="menuitem"
            tabindex="-1"
            type="button"
            :aria-disabled="disabled ? 'true' : undefined"
            :aria-expanded="isOpen"
            :class="itemClass"
            @click="open"
            @keydown="handleTriggerKeydown"
        >
            <Icon
                v-if="icon"
                aria-hidden="true"
                size="base"
                :icon="icon"
            />
            <span class="flex-1 text-start">{{ label }}</span>
            <Icon
                aria-hidden="true"
                icon="ChevronRight"
                size="sm"
            />
        </button>

        <Transition
            enter-active-class="transition-[opacity,transform] duration-100 ease-out motion-reduce:transition-none"
            enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100"
            leave-active-class="transition-[opacity,transform] duration-75 ease-in motion-reduce:transition-none"
            leave-from-class="opacity-100 scale-100"
            leave-to-class="opacity-0 scale-95"
        >
            <div
                v-if="isOpen"
                ref="contentRef"
                aria-orientation="vertical"
                class="fixed z-50 min-w-40 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 text-gray-900 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                data-dropdown-submenu-content
                role="menu"
                tabindex="-1"
                :style="{ insetInlineStart: `${x}px`, position: 'fixed', top: `${y}px` }"
                @keydown.capture="handleContentKeydown"
            >
                <slot />
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, provide, ref, watch } from 'vue'
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'

interface Props {
    disabled?: boolean
    icon?: IconProp
    label: string
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    icon: undefined
})

const contentRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const x = ref(0)
const y = ref(0)
let cleanupPositioning: (() => void) | null = null

const getItems = (): HTMLElement[] =>
    Array.from(
        contentRef.value?.querySelectorAll<HTMLElement>(
            '[data-dropdown-menu-item]:not([aria-disabled="true"])'
        ) ?? []
    ).filter((item) => !item.closest('[data-dropdown-submenu-content] [data-dropdown-submenu-content]'))

const focusItem = (index: number) => {
    const items = getItems()
    if (!items.length) return
    const resolved = index < 0 ? items.length + index : index
    items[Math.max(0, Math.min(resolved, items.length - 1))]?.focus()
}

const open = async () => {
    if (props.disabled) return
    isOpen.value = true
    await nextTick()
    focusItem(0)
}

const close = () => {
    isOpen.value = false
}

const closeToTrigger = () => {
    close()
    nextTick(() => triggerRef.value?.focus())
}

const handleTriggerKeydown = async (e: KeyboardEvent) => {
    if (props.disabled) return
    if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        await open()
    }
}

const handleFocusout = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null
    if (next && contentRef.value?.contains(next)) return
    if (next && triggerRef.value?.contains(next)) return
    close()
}

const handleContentKeydown = (e: KeyboardEvent) => {
    const items = getItems()
    const currentIndex = items.indexOf(document.activeElement as HTMLElement)

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        focusItem((currentIndex + 1) % (items.length || 1))
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusItem((currentIndex - 1 + items.length) % (items.length || 1))
    } else if (e.key === 'ArrowLeft' || e.key === 'Escape') {
        e.preventDefault()
        closeToTrigger()
    }
}

const handleDocumentKeydown = (e: KeyboardEvent) => {
    if (!isOpen.value || (e.key !== 'ArrowLeft' && e.key !== 'Escape')) return
    const active = document.activeElement
    if (!(active instanceof HTMLElement) || !contentRef.value?.contains(active)) return

    e.preventDefault()
    closeToTrigger()
}

provide('dropdownSubmenu', { closeToTrigger })

const initPositioning = () => {
    const anchor = triggerRef.value
    const menu = contentRef.value
    if (!anchor || !menu) return

    cleanupPositioning = autoUpdate(anchor, menu, () => {
        computePosition(anchor, menu, {
            middleware: [offset(4), flip(), shift({ padding: 8 })],
            placement: 'right-start',
            strategy: 'fixed'
        }).then(({ x: nx, y: ny }) => {
            x.value = nx
            y.value = ny
        })
    })
}

const destroyPositioning = () => {
    cleanupPositioning?.()
    cleanupPositioning = null
}

watch(isOpen, (val) => {
    if (val) {
        nextTick(initPositioning)
        document.addEventListener('keydown', handleDocumentKeydown)
    } else {
        destroyPositioning()
        document.removeEventListener('keydown', handleDocumentKeydown)
    }
})

onBeforeUnmount(() => {
    destroyPositioning()
    document.removeEventListener('keydown', handleDocumentKeydown)
})

const base = 'flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors'

const itemClass = computed(() => {
    if (props.disabled) return `${base} cursor-not-allowed opacity-50`
    return `${base} hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800`
})
</script>
