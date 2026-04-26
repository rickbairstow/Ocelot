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
            class="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:bg-gray-800"
            type="button"
            :aria-expanded="isOpen"
            :aria-haspopup="true"
            @click="open"
            @keydown.down.prevent="openAndFocusFirst"
            @keydown.esc.prevent="close"
        >
            {{ label }}
            <Icon
                aria-hidden="true"
                icon="ChevronDown"
                size="sm"
            />
        </button>

        <Transition
            enter-active-class="transition-[opacity,transform] duration-100 ease-out motion-reduce:transition-none"
            enter-from-class="opacity-0 translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-[opacity,transform] duration-75 ease-in motion-reduce:transition-none"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-1"
        >
            <div
                v-if="isOpen"
                ref="menuRef"
                class="absolute start-0 top-full z-40 mt-2 min-w-56 rounded-lg border border-gray-200 bg-white p-2 text-gray-950 shadow-lg dark:border-gray-700 dark:bg-gray-900 dark:text-gray-50"
                role="menu"
                tabindex="-1"
                @keydown="handleMenuKeydown"
            >
                <template
                    v-for="item in items"
                    :key="item.label"
                >
                    <a
                        v-if="!item.children?.length"
                        class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                        role="menuitem"
                        :href="item.href"
                        @click="close"
                    >
                        <Icon
                            v-if="item.icon"
                            aria-hidden="true"
                            size="sm"
                            :icon="item.icon"
                        />
                        <span>{{ item.label }}</span>
                    </a>

                    <div
                        v-else
                        class="py-1"
                    >
                        <p class="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                            {{ item.label }}
                        </p>
                        <a
                            v-for="child in item.children"
                            :key="child.label"
                            class="flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 focus:bg-gray-100 focus:outline-none dark:hover:bg-gray-800 dark:focus:bg-gray-800"
                            role="menuitem"
                            :href="child.href"
                            @click="close"
                        >
                            <Icon
                                v-if="child.icon"
                                aria-hidden="true"
                                size="sm"
                                :icon="child.icon"
                            />
                            <span>{{ child.label }}</span>
                        </a>
                    </div>
                </template>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref } from 'vue'
import Icon from '@Components/Icon.vue'
import type { IconProp } from '@Composables/useIcons'

export interface NavigationBarSubmenuItem {
    children?: Omit<NavigationBarSubmenuItem, 'children'>[]
    href: string
    icon?: IconProp
    label: string
}

interface Props {
    items: NavigationBarSubmenuItem[]
    label: string
}

defineProps<Props>()

const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)
const triggerRef = ref<HTMLButtonElement | null>(null)

const getItems = (): HTMLElement[] =>
    Array.from(menuRef.value?.querySelectorAll<HTMLElement>('[role="menuitem"]') ?? [])

const focusItem = (index: number) => {
    const items = getItems()
    if (!items.length) return
    const resolved = index < 0 ? items.length + index : index
    items[Math.max(0, Math.min(resolved, items.length - 1))]?.focus()
}

const open = () => {
    isOpen.value = true
}

const close = () => {
    isOpen.value = false
}

const openAndFocusFirst = async () => {
    open()
    await nextTick()
    focusItem(0)
}

const handleFocusout = (e: FocusEvent) => {
    const next = e.relatedTarget as Node | null
    if (next && (menuRef.value?.contains(next) || triggerRef.value?.contains(next))) return
    close()
}

const handleMenuKeydown = (e: KeyboardEvent) => {
    const items = getItems()
    const currentIndex = items.indexOf(document.activeElement as HTMLElement)

    if (e.key === 'ArrowDown') {
        e.preventDefault()
        focusItem((currentIndex + 1) % (items.length || 1))
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        focusItem((currentIndex - 1 + items.length) % (items.length || 1))
    } else if (e.key === 'Escape') {
        e.preventDefault()
        close()
        triggerRef.value?.focus()
    }
}
</script>
