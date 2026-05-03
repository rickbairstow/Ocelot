<template>
    <component
        :is="href ? 'a' : 'button'"
        data-dropdown-menu-item
        role="menuitem"
        tabindex="-1"
        :aria-disabled="disabled ? 'true' : undefined"
        :class="itemClass"
        :href="effectiveHref"
        @click="handleClick"
        @keydown.left.prevent="submenu?.closeToTrigger()"
    >
        <Icon
            v-if="icon"
            aria-hidden="true"
            size="base"
            :icon="icon"
        />
        <span class="flex-1 text-start">{{ label }}</span>
        <span
            v-if="shortcut"
            aria-hidden="true"
            class="ms-auto text-xs tracking-widest"
        >
            {{ shortcut }}
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'
import type { DropdownMenuContext } from './DropdownMenu.vue'

interface Props {
    destructive?: boolean
    disabled?: boolean
    href?: string
    icon?: IconProp
    label: string
    shortcut?: string
}

const props = withDefaults(defineProps<Props>(), {
    destructive: false,
    disabled: false,
    href: undefined,
    icon: undefined,
    shortcut: undefined
})

const context = inject<DropdownMenuContext>('dropdownMenu')!
const submenu = inject<{ closeToTrigger: () => void } | null>('dropdownSubmenu', null)

const effectiveHref = computed((): string | undefined => {
    if (props.disabled) return undefined
    return props.href
})

const handleClick = () => {
    if (props.disabled) return
    context.close()
}

const base = 'flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors'

const itemClass = computed(() => {
    if (props.disabled) return `${base} cursor-not-allowed opacity-50`
    if (props.destructive) {
        return `${base} text-red-600 hover:bg-red-50 focus:bg-red-50 dark:text-red-400 dark:hover:bg-red-950 dark:focus:bg-red-950`
    }
    return `${base} hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800`
})
</script>
