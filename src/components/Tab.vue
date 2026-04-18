<template>
    <button
        :id="`${ctx!.baseId}-tab-${sanitizedValue}`"
        role="tab"
        :aria-controls="`${ctx!.baseId}-panel-${sanitizedValue}`"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-selected="isActive ? 'true' : 'false'"
        :class="tabClass"
        :tabindex="isActive ? 0 : -1"
        @click="handleClick"
        @keydown="handleKeydown"
    >
        <component
            :is="resolvedIcon"
            v-if="resolvedIcon"
            aria-hidden="true"
            :height="16"
            :width="16"
        />
        <slot />
    </button>
</template>

<script setup lang="ts">
import { inject, computed, onMounted, onBeforeUnmount } from 'vue'
import type { Component } from 'vue'
import type { TabsContext } from './Tabs.vue'
import type { IconProp } from '@Composables/useIcons'
import { availableIcons } from '@Composables/useIcons'

interface Props {
    disabled?: boolean
    icon?: IconProp
    value: string
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    icon: undefined
})

const ctx = inject<TabsContext>('tabs')

const sanitizedValue = computed(() => props.value.replace(/\s+/g, '-'))

const isActive = computed(() => ctx?.activeTab.value === props.value)

onMounted(() => ctx?.registerTab(props.value))
onBeforeUnmount(() => ctx?.unregisterTab(props.value))

const handleClick = () => {
    if (!props.disabled) ctx?.setActiveTab(props.value)
}

const handleKeydown = (e: KeyboardEvent) => {
    const order = ctx?.tabOrder.value ?? []
    const currentIndex = order.indexOf(props.value)

    const focusTab = (index: number) => {
        const target = order[index]
        if (target) {
            document.getElementById(`${ctx!.baseId}-tab-${target.replace(/\s+/g, '-')}`)?.focus()
        }
    }

    if (e.key === 'ArrowRight') {
        e.preventDefault()
        focusTab((currentIndex + 1) % order.length)
    } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        focusTab((currentIndex - 1 + order.length) % order.length)
    } else if (e.key === 'Home') {
        e.preventDefault()
        focusTab(0)
    } else if (e.key === 'End') {
        e.preventDefault()
        focusTab(order.length - 1)
    }
}

const resolvedIcon = computed((): Component | null => {
    const { icon } = props
    if (!icon) return null
    if (typeof icon !== 'string') return icon
    if (icon in availableIcons) return availableIcons[icon]
    return null
})

const baseClasses = 'inline-flex items-center gap-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950'

const tabClass = computed((): string => {
    const variant = ctx?.variant ?? 'line'
    const active = isActive.value

    if (props.disabled) {
        const disabledMap: Record<string, string> = {
            line: 'px-4 py-2 border-b-2 -mb-px border-transparent text-gray-300 dark:text-gray-600 cursor-not-allowed',
            pill: 'px-3 py-1.5 rounded-md text-gray-300 dark:text-gray-600 cursor-not-allowed',
            contained: 'px-4 py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 bg-white dark:bg-gray-900 text-gray-300 dark:text-gray-600 cursor-not-allowed'
        }
        return `${baseClasses} ${disabledMap[variant] ?? disabledMap.line}`
    }

    if (variant === 'pill') {
        return active
            ? `${baseClasses} px-3 py-1.5 rounded-md bg-white dark:bg-gray-900 shadow text-gray-900 dark:text-white`
            : `${baseClasses} px-3 py-1.5 rounded-md text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white cursor-pointer`
    }

    if (variant === 'contained') {
        return active
            ? `${baseClasses} px-4 py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white`
            : `${baseClasses} px-4 py-2 border-r border-gray-200 dark:border-gray-700 last:border-r-0 bg-white dark:bg-gray-900 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 dark:text-gray-400 cursor-pointer`
    }

    // line (default)
    return active
        ? `${baseClasses} px-4 py-2 border-b-2 -mb-px border-blue-600 text-blue-700 dark:border-blue-400 dark:text-blue-400`
        : `${baseClasses} px-4 py-2 border-b-2 -mb-px border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600 cursor-pointer`
})
</script>
