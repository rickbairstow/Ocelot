<template>
    <component
        :is="role === 'note' ? 'aside' : 'div'"
        :class="calloutClass"
        :role="role"
    >
        <Icon
            aria-hidden="true"
            class="mt-0.5 shrink-0"
            size="xl"
            :class="palette.icon"
            :icon="resolvedIcon"
        />

        <div class="min-w-0 flex-1">
            <p
                v-if="title"
                class="text-sm font-semibold"
                :class="palette.title"
            >
                {{ title }}
            </p>
            <div
                class="text-sm leading-6"
                :class="palette.body"
            >
                <slot />
            </div>
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@Components/Icon.vue'
import type { IconProp } from '@Composables/useIcons'

export type CalloutType = 'info' | 'success' | 'warning' | 'danger' | 'tip' | 'note'

interface Props {
    icon?: IconProp
    role?: 'note' | 'status'
    title?: string
    type?: CalloutType
}

const props = withDefaults(defineProps<Props>(), {
    icon: undefined,
    role: 'note',
    title: undefined,
    type: 'info'
})

const iconMap: Record<CalloutType, IconProp> = {
    danger: 'AlertCircle',
    info: 'InfoCircle',
    note: 'Quote',
    success: 'CircleCheck',
    tip: 'Bulb',
    warning: 'AlertTriangle'
}

const paletteMap: Record<CalloutType, { body: string; container: string; icon: string; title: string }> = {
    danger: {
        body: 'text-red-900 dark:text-red-100',
        container: 'border-red-300 bg-red-50 dark:border-red-800 dark:bg-red-950/40',
        icon: 'text-red-700 dark:text-red-300',
        title: 'text-red-950 dark:text-red-50'
    },
    info: {
        body: 'text-blue-900 dark:text-blue-100',
        container: 'border-blue-300 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/40',
        icon: 'text-blue-700 dark:text-blue-300',
        title: 'text-blue-950 dark:text-blue-50'
    },
    note: {
        body: 'text-gray-800 dark:text-gray-200',
        container: 'border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900',
        icon: 'text-gray-600 dark:text-gray-300',
        title: 'text-gray-950 dark:text-gray-50'
    },
    success: {
        body: 'text-emerald-900 dark:text-emerald-100',
        container: 'border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40',
        icon: 'text-emerald-700 dark:text-emerald-300',
        title: 'text-emerald-950 dark:text-emerald-50'
    },
    tip: {
        body: 'text-violet-900 dark:text-violet-100',
        container: 'border-violet-300 bg-violet-50 dark:border-violet-800 dark:bg-violet-950/40',
        icon: 'text-violet-700 dark:text-violet-300',
        title: 'text-violet-950 dark:text-violet-50'
    },
    warning: {
        body: 'text-amber-950 dark:text-amber-100',
        container: 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40',
        icon: 'text-amber-700 dark:text-amber-300',
        title: 'text-amber-950 dark:text-amber-50'
    }
}

const palette = computed(() => paletteMap[props.type])
const resolvedIcon = computed(() => props.icon ?? iconMap[props.type])

const calloutClass = computed(() => [
    'flex gap-3 rounded-lg border p-4',
    palette.value.container
])
</script>
