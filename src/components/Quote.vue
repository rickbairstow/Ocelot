<template>
    <figure :class="containerClass">
        <Icon
            aria-hidden="true"
            size="2xl"
            :class="markClass"
            :icon="icon"
        />

        <blockquote class="m-0 text-gray-700 dark:text-gray-300 text-base italic leading-relaxed">
            <slot />
        </blockquote>

        <figcaption
            v-if="author"
            class="mt-4 flex items-center gap-3"
        >
            <img
                v-if="avatar"
                class="w-10 h-10 rounded-full object-cover shrink-0"
                :alt="author"
                :src="avatar"
            />
            <div class="min-w-0">
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                    {{ author }}
                </p>
                <p
                    v-if="source"
                    class="text-sm text-gray-500 dark:text-gray-400 truncate"
                >
                    {{ source }}
                </p>
            </div>
        </figcaption>
    </figure>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'

type QuoteColor = 'blue' | 'green' | 'indigo' | 'orange' | 'pink' | 'purple' | 'red' | 'teal'
type QuoteVariant = 'bordered' | 'card'

interface Props {
    author?: string
    avatar?: string
    color?: QuoteColor
    icon?: IconProp
    source?: string
    variant?: QuoteVariant
}

const props = withDefaults(defineProps<Props>(), {
    author: undefined,
    avatar: undefined,
    color: 'blue',
    icon: 'QuoteFilled',
    source: undefined,
    variant: 'bordered'
})

const colorMap: Record<QuoteColor, { border: string; mark: string; ring: string }> = {
    blue:   { border: 'border-blue-500',   mark: 'text-blue-300   dark:text-blue-700', ring: 'ring-blue-100   dark:ring-blue-900/40' },
    green:  { border: 'border-green-500',  mark: 'text-green-300  dark:text-green-700', ring: 'ring-green-100  dark:ring-green-900/40' },
    indigo: { border: 'border-indigo-500', mark: 'text-indigo-300 dark:text-indigo-700', ring: 'ring-indigo-100 dark:ring-indigo-900/40' },
    orange: { border: 'border-orange-500', mark: 'text-orange-300 dark:text-orange-700', ring: 'ring-orange-100 dark:ring-orange-900/40' },
    pink:   { border: 'border-pink-500',   mark: 'text-pink-300   dark:text-pink-700',  ring: 'ring-pink-100   dark:ring-pink-900/40' },
    purple: { border: 'border-purple-500', mark: 'text-purple-300 dark:text-purple-700', ring: 'ring-purple-100 dark:ring-purple-900/40' },
    red:    { border: 'border-red-500',    mark: 'text-red-300    dark:text-red-700',   ring: 'ring-red-100    dark:ring-red-900/40' },
    teal:   { border: 'border-teal-500',   mark: 'text-teal-300   dark:text-teal-700',  ring: 'ring-teal-100   dark:ring-teal-900/40' }
}

const colors = computed(() => colorMap[props.color])

const containerClass = computed(() => {
    if (props.variant === 'card') {
        return `m-0 rounded-2xl bg-white dark:bg-gray-900 ring-1 ${colors.value.ring} px-8 pt-6 pb-6 shadow-sm`
    }
    return `m-0 pl-5 border-l-4 py-1 ${colors.value.border}`
})

const markClass = computed(() => `block mb-2 ${colors.value.mark}`)
</script>
