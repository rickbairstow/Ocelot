<template>
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
            :id="contentId"
            ref="menuRef"
            aria-orientation="vertical"
            class="z-50 min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white p-1 shadow-lg text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            role="menu"
            tabindex="-1"
            :style="{ left: `${x}px`, position: 'fixed', top: `${y}px` }"
            @keydown="handleKeydown"
        >
            <slot />
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, ref, watch } from 'vue'
import { autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom'
import type { DropdownMenuContext } from './DropdownMenu.vue'

const context = inject<DropdownMenuContext>('dropdownMenu')!
const { close, contentId, isOpen, openFocusTarget, triggerRef } = context

const menuRef = ref<HTMLElement | null>(null)
const x = ref(0)
const y = ref(0)
let cleanupPositioning: (() => void) | null = null

const getItems = (): HTMLElement[] =>
    Array.from(
        menuRef.value?.querySelectorAll<HTMLElement>(
            '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([aria-disabled="true"])'
        ) ?? []
    )

const focusItem = (index: number) => {
    const items = getItems()
    if (!items.length) return
    const resolved = index < 0 ? items.length + index : index
    items[Math.max(0, Math.min(resolved, items.length - 1))]?.focus()
}

let typeaheadBuffer = ''
let typeaheadTimeout: ReturnType<typeof setTimeout> | null = null

const handleTypeahead = (char: string) => {
    typeaheadBuffer += char.toLowerCase()
    if (typeaheadTimeout) clearTimeout(typeaheadTimeout)
    typeaheadTimeout = setTimeout(() => { typeaheadBuffer = '' }, 500)

    const items = getItems()
    const currentIndex = items.indexOf(document.activeElement as HTMLElement)
    const ordered = [...items.slice(currentIndex + 1), ...items.slice(0, currentIndex + 1)]
    const match = ordered.find((item) =>
        (item.textContent?.trim() ?? '').toLowerCase().startsWith(typeaheadBuffer)
    )
    if (match) match.focus()
}

const handleKeydown = (e: KeyboardEvent) => {
    const items = getItems()
    const currentIndex = items.indexOf(document.activeElement as HTMLElement)

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        focusItem((currentIndex + 1) % (items.length || 1))
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusItem((currentIndex - 1 + items.length) % (items.length || 1))
    } else if (e.key === 'Home') {
        e.preventDefault()
        focusItem(0)
    } else if (e.key === 'End') {
        e.preventDefault()
        focusItem(-1)
    } else if (e.key === 'Escape') {
        e.preventDefault()
        close()
    } else if (e.key === 'Tab') {
        close()
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        handleTypeahead(e.key)
    }
}

const handleOutsidePointerdown = (e: PointerEvent) => {
    const target = e.target as Node
    if (menuRef.value?.contains(target) || triggerRef.value?.contains(target)) return
    close()
}

const getAnchorEl = (): HTMLElement | null =>
    triggerRef.value?.querySelector<HTMLElement>(
        'button, [href], input, [tabindex]:not([tabindex="-1"])'
    ) ?? triggerRef.value

const initPositioning = () => {
    const anchor = getAnchorEl()
    const menu = menuRef.value
    if (!anchor || !menu) return

    cleanupPositioning = autoUpdate(anchor, menu, () => {
        if (!anchor || !menu) return
        computePosition(anchor, menu, {
            middleware: [offset(4), flip(), shift({ padding: 8 })],
            placement: 'bottom-start',
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

watch(
    isOpen,
    (val) => {
        if (val) {
            initPositioning()
            document.addEventListener('pointerdown', handleOutsidePointerdown)
            focusItem(openFocusTarget.value === 'last' ? -1 : 0)
        } else {
            destroyPositioning()
            document.removeEventListener('pointerdown', handleOutsidePointerdown)
            if (typeaheadTimeout) {
                clearTimeout(typeaheadTimeout)
                typeaheadTimeout = null
                typeaheadBuffer = ''
            }
        }
    },
    { flush: 'post' }
)

onBeforeUnmount(() => {
    destroyPositioning()
    document.removeEventListener('pointerdown', handleOutsidePointerdown)
})
</script>
