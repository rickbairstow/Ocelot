<template>
    <div
        aria-live="polite"
        role="status"
        :aria-label="effectiveAriaLabel"
        :class="variantCss"
    >
        <Scrim
            v-if="showScrim"
            absolute
            aria-label="Loader background."
            class="z-0"
            :clickable="false"
        />

        <div
            class="z-1 flex items-center justify-center gap-2"
            :class="vertical ? 'flex-col' : 'flex-row'"
        >
            <Icon
                :class="[animationLookup?.[props.animation] ?? animationLookup.spin, colorCss]"
                :icon="icon"
                :size="iconSize"
            />

            <p
                v-if="text"
                :class="[textSizeCss, colorCss]"
            >
                <slot>{{ text }}</slot>
            </p>
            <slot v-else />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import Scrim from './Scrim.vue'
import type { IconSize } from '@Composables/useIcons'

const animationLookup: Record<string, string> = {
    bounce: 'animate-bounce motion-reduce:animate-none',
    none: 'animate-none',
    ping: 'animate-ping motion-reduce:animate-none',
    pulse: 'animate-pulse motion-reduce:animate-none',
    spin: 'animate-spin motion-reduce:animate-none'
}

interface Props {
    animation?: 'bounce' | 'none' | 'ping' | 'pulse' | 'spin'
    ariaLabel?: string
    color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo' | 'teal' | 'pink' | 'gray' | 'default'
    icon?: string
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
    text?: string | null
    variant?: 'absolute' | 'fixed' | 'inline'
    vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    animation: 'spin',
    ariaLabel: undefined,
    color: 'default',
    icon: 'Loader2',
    size: 'base',
    text: null,
    variant: 'inline',
    vertical: false
})

const showScrim = computed((): boolean => ['absolute', 'fixed'].includes(props.variant))

const variantCss = computed((): string => {
    switch (props.variant) {
        case 'absolute':
            return 'absolute inset-0 flex items-center justify-center text-white'
        case 'fixed':
            return 'fixed inset-0 flex items-center justify-center text-white'
        default:
            return 'flex items-center justify-center text-black dark:text-white'
    }
})

const iconSizeMap: Record<string, IconSize> = {
    xs: 'sm',
    sm: 'base',
    base: '2xl',
    lg: '3xl',
    xl: '4xl'
}

const iconSize = computed((): IconSize => iconSizeMap[props.size] ?? '2xl')

const textSizeMap: Record<string, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
}

const textSizeCss = computed((): string => textSizeMap[props.size] ?? 'text-base')

const colorMap: Record<string, string> = {
    blue:   'text-blue-600 dark:text-blue-400',
    green:  'text-green-600 dark:text-green-400',
    red:    'text-red-600 dark:text-red-400',
    orange: 'text-orange-600 dark:text-orange-400',
    purple: 'text-purple-600 dark:text-purple-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    teal:   'text-teal-600 dark:text-teal-400',
    pink:   'text-pink-600 dark:text-pink-400',
    gray:   'text-gray-500 dark:text-gray-400',
    default: ''
}

const colorCss = computed((): string => colorMap[props.color] ?? '')
const effectiveAriaLabel = computed((): string => props.ariaLabel ?? props.text ?? 'Loading')
</script>
