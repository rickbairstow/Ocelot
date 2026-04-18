<template>
    <component
        :is="element"
        :aria-busy="loading ? 'true' : undefined"
        :aria-disabled="isDisabled ? 'true' : undefined"
        :class="componentStyle"
        :href="href"
        :role="href ? 'link' : 'button'"
        @click="handleInteraction"
        @keydown.enter="handleKeyInteraction"
        @keydown.space="handleKeyInteraction"
    >
        <span :class="loading ? 'opacity-0' : innerWrapClass">
            <component
                :is="resolvedIcon"
                v-if="resolvedIcon && (iconOnly || iconPosition === 'start')"
                aria-hidden="true"
                :height="iconPixelSize"
                :width="iconPixelSize"
            />
            <slot v-if="!iconOnly" />
            <component
                :is="resolvedIcon"
                v-if="resolvedIcon && !iconOnly && iconPosition === 'end'"
                aria-hidden="true"
                :height="iconPixelSize"
                :width="iconPixelSize"
            />
        </span>
        <span
            v-if="loading"
            aria-hidden="true"
            class="absolute inset-0 flex items-center justify-center"
        >
            <Icon
                class="animate-spin"
                :icon="loadingIcon"
                :size="spinnerSize"
            />
        </span>
    </component>
</template>

<script setup lang="ts">
import { computed, onMounted, useAttrs } from 'vue'
import type { Component } from 'vue'
import Icon from './Icon.vue'
import type { IconProp, IconSize } from '@Composables/useIcons'
import { availableIcons, availableSizes } from '@Composables/useIcons'

interface Props {
    color?: string
    disabled?: boolean
    href?: string | null
    icon?: IconProp
    iconOnly?: boolean
    iconPosition?: 'start' | 'end'
    loading?: boolean
    loadingIcon?: string
    size?: 'small' | 'base' | 'large'
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
    color: 'blue',
    disabled: false,
    href: null,
    icon: undefined,
    iconOnly: false,
    iconPosition: 'start',
    loading: false,
    loadingIcon: 'Loader2',
    size: 'base',
    variant: 'primary'
})

const attrs = useAttrs()

const isDisabled = computed((): boolean => props.disabled || props.loading)

const handleInteraction = (e: MouseEvent) => {
    if (isDisabled.value) {
        e.preventDefault()
        e.stopImmediatePropagation()
        e.stopPropagation()
    }
}

const handleKeyInteraction = (e: KeyboardEvent) => {
    if (isDisabled.value) {
        e.preventDefault()
        e.stopPropagation()
        return
    }

    if (e.key === ' ') {
        e.preventDefault()
        ;(e.currentTarget as HTMLElement).click()
    }
}

const element = computed((): string => (props.href ? 'a' : 'button'))

// Icon size in pixels, strictly matched to button size
const iconSizeMap: Record<string, number> = {
    small: availableSizes.xs,   // 12px — small button
    base: availableSizes.sm,    // 14px — base button
    large: availableSizes.lg    // 18px — large button
}

const iconPixelSize = computed((): number => iconSizeMap[props.size ?? 'base'] ?? availableSizes.sm)

const resolvedIcon = computed((): Component | null => {
    const { icon } = props
    if (!icon) return null
    if (typeof icon !== 'string') return icon
    if (icon in availableIcons) return availableIcons[icon]
    if (import.meta.env.DEV) {
        console.warn(`[OuiButton] Icon "${icon}" not found in registry. Register it with registerIcons() or pass the component directly.`)
    }
    return null
})

// Gap between icon and label scales with button size
const iconGapMap: Record<string, string> = {
    small: 'gap-1',
    base: 'gap-1.5',
    large: 'gap-2'
}

// When icon + label: flex row with gap. Otherwise transparent to button's own flex layout.
const innerWrapClass = computed((): string => {
    if (resolvedIcon.value && !props.iconOnly) {
        return `flex items-center ${iconGapMap[props.size ?? 'base'] ?? 'gap-1.5'}`
    }
    return 'contents'
})

const spinnerSize = computed((): IconSize => {
    const map: Record<string, IconSize> = {
        small: 'sm',
        base: 'base',
        large: 'lg'
    }
    return map[props.size] ?? 'base'
})

// Normal padding (asymmetric horizontal)
const padding: Record<string, string> = {
    small: 'py-1 px-2',
    base: 'py-2 px-3',
    large: 'py-3 px-4'
}

// Square padding for icon-only buttons — height matches normal variant
const iconOnlyPadding: Record<string, string> = {
    small: 'p-1',
    base: 'p-2',
    large: 'p-3'
}

const common = 'relative inline-flex items-center justify-center border rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

const disabledClasses: Record<string, string> = {
    primary:   'text-white bg-gray-400 border-gray-400 dark:bg-gray-600 dark:border-gray-600 opacity-50',
    secondary: 'text-gray-400 bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-500 opacity-50',
    tertiary:  'text-gray-400 dark:text-gray-600 bg-transparent border-transparent opacity-50',
    text:      'text-gray-400 dark:text-gray-600 bg-transparent border-transparent opacity-50',
    none:      'text-gray-400 dark:text-gray-600 bg-transparent border-transparent opacity-50'
}

const colorClasses: Record<string, Record<string, string>> = {
    primary: {
        blue:   'text-white bg-blue-600   border-blue-600   hover:bg-blue-700   focus-visible:outline-blue-600   dark:bg-blue-500   dark:border-blue-500   dark:hover:bg-blue-400',
        green:  'text-white bg-green-600  border-green-600  hover:bg-green-700  focus-visible:outline-green-600  dark:bg-green-500  dark:border-green-500  dark:hover:bg-green-400',
        red:    'text-white bg-red-600    border-red-600    hover:bg-red-700    focus-visible:outline-red-600    dark:bg-red-500    dark:border-red-500    dark:hover:bg-red-400',
        orange: 'text-white bg-orange-600 border-orange-600 hover:bg-orange-700 focus-visible:outline-orange-600 dark:bg-orange-500 dark:border-orange-500 dark:hover:bg-orange-400',
        purple: 'text-white bg-purple-600 border-purple-600 hover:bg-purple-700 focus-visible:outline-purple-600 dark:bg-purple-500 dark:border-purple-500 dark:hover:bg-purple-400',
        indigo: 'text-white bg-indigo-600 border-indigo-600 hover:bg-indigo-700 focus-visible:outline-indigo-600 dark:bg-indigo-500 dark:border-indigo-500 dark:hover:bg-indigo-400',
        teal:   'text-white bg-teal-600   border-teal-600   hover:bg-teal-700   focus-visible:outline-teal-600   dark:bg-teal-500   dark:border-teal-500   dark:hover:bg-teal-400',
        pink:   'text-white bg-pink-600   border-pink-600   hover:bg-pink-700   focus-visible:outline-pink-600   dark:bg-pink-500   dark:border-pink-500   dark:hover:bg-pink-400'
    },
    secondary: {
        blue:   'text-blue-600   bg-white border-blue-300   hover:bg-blue-50   focus-visible:outline-blue-600   dark:bg-gray-900 dark:text-blue-400   dark:border-blue-700   dark:hover:bg-blue-950',
        green:  'text-green-600  bg-white border-green-300  hover:bg-green-50  focus-visible:outline-green-600  dark:bg-gray-900 dark:text-green-400  dark:border-green-700  dark:hover:bg-green-950',
        red:    'text-red-600    bg-white border-red-300    hover:bg-red-50    focus-visible:outline-red-600    dark:bg-gray-900 dark:text-red-400    dark:border-red-700    dark:hover:bg-red-950',
        orange: 'text-orange-600 bg-white border-orange-300 hover:bg-orange-50 focus-visible:outline-orange-600 dark:bg-gray-900 dark:text-orange-400 dark:border-orange-700 dark:hover:bg-orange-950',
        purple: 'text-purple-600 bg-white border-purple-300 hover:bg-purple-50 focus-visible:outline-purple-600 dark:bg-gray-900 dark:text-purple-400 dark:border-purple-700 dark:hover:bg-purple-950',
        indigo: 'text-indigo-600 bg-white border-indigo-300 hover:bg-indigo-50 focus-visible:outline-indigo-600 dark:bg-gray-900 dark:text-indigo-400 dark:border-indigo-700 dark:hover:bg-indigo-950',
        teal:   'text-teal-600   bg-white border-teal-300   hover:bg-teal-50   focus-visible:outline-teal-600   dark:bg-gray-900 dark:text-teal-400   dark:border-teal-700   dark:hover:bg-teal-950',
        pink:   'text-pink-600   bg-white border-pink-300   hover:bg-pink-50   focus-visible:outline-pink-600   dark:bg-gray-900 dark:text-pink-400   dark:border-pink-700   dark:hover:bg-pink-950'
    },
    tertiary: {
        blue:   'text-blue-600   bg-transparent border-transparent hover:bg-blue-50   focus-visible:outline-blue-600   dark:text-blue-400   dark:hover:bg-blue-950',
        gray:   'text-gray-400   bg-transparent border-transparent hover:text-gray-600 focus-visible:outline-gray-400   dark:hover:text-gray-200',
        green:  'text-green-600  bg-transparent border-transparent hover:bg-green-50  focus-visible:outline-green-600  dark:text-green-400  dark:hover:bg-green-950',
        red:    'text-red-600    bg-transparent border-transparent hover:bg-red-50    focus-visible:outline-red-600    dark:text-red-400    dark:hover:bg-red-950',
        orange: 'text-orange-600 bg-transparent border-transparent hover:bg-orange-50 focus-visible:outline-orange-600 dark:text-orange-400 dark:hover:bg-orange-950',
        purple: 'text-purple-600 bg-transparent border-transparent hover:bg-purple-50 focus-visible:outline-purple-600 dark:text-purple-400 dark:hover:bg-purple-950',
        indigo: 'text-indigo-600 bg-transparent border-transparent hover:bg-indigo-50 focus-visible:outline-indigo-600 dark:text-indigo-400 dark:hover:bg-indigo-950',
        teal:   'text-teal-600   bg-transparent border-transparent hover:bg-teal-50   focus-visible:outline-teal-600   dark:text-teal-400   dark:hover:bg-teal-950',
        pink:   'text-pink-600   bg-transparent border-transparent hover:bg-pink-50   focus-visible:outline-pink-600   dark:text-pink-400   dark:hover:bg-pink-950'
    },
    text: {
        blue:   'text-blue-600   bg-transparent border-transparent hover:text-blue-700   hover:underline focus-visible:outline-blue-600   dark:text-blue-400   dark:hover:text-blue-300',
        green:  'text-green-600  bg-transparent border-transparent hover:text-green-700  hover:underline focus-visible:outline-green-600  dark:text-green-400  dark:hover:text-green-300',
        red:    'text-red-600    bg-transparent border-transparent hover:text-red-700    hover:underline focus-visible:outline-red-600    dark:text-red-400    dark:hover:text-red-300',
        orange: 'text-orange-600 bg-transparent border-transparent hover:text-orange-700 hover:underline focus-visible:outline-orange-600 dark:text-orange-400 dark:hover:text-orange-300',
        purple: 'text-purple-600 bg-transparent border-transparent hover:text-purple-700 hover:underline focus-visible:outline-purple-600 dark:text-purple-400 dark:hover:text-purple-300',
        indigo: 'text-indigo-600 bg-transparent border-transparent hover:text-indigo-700 hover:underline focus-visible:outline-indigo-600 dark:text-indigo-400 dark:hover:text-indigo-300',
        teal:   'text-teal-600   bg-transparent border-transparent hover:text-teal-700   hover:underline focus-visible:outline-teal-600   dark:text-teal-400   dark:hover:text-teal-300',
        pink:   'text-pink-600   bg-transparent border-transparent hover:text-pink-700   hover:underline focus-visible:outline-pink-600   dark:text-pink-400   dark:hover:text-pink-300'
    }
}

const noneBase = 'text-black dark:text-white bg-transparent border-transparent'

const componentStyle = computed((): string => {
    const { size, variant, color, disabled: isExplicitlyDisabled, iconOnly } = props
    const interactive = isDisabled.value ? 'cursor-not-allowed' : 'cursor-pointer'
    const padClass = iconOnly
        ? (iconOnlyPadding[size] ?? iconOnlyPadding.base)
        : (padding[size] ?? padding.base)

    if (isExplicitlyDisabled) {
        return `${common} ${padClass} ${disabledClasses[variant]} ${interactive}`
    }

    if (variant === 'none') {
        return `${common} ${padClass} ${noneBase} ${interactive}`
    }

    const colorClass = colorClasses[variant]?.[color] ?? colorClasses[variant]?.['blue'] ?? ''
    return `${common} ${padClass} ${colorClass} ${interactive}`
})

onMounted(() => {
    if (import.meta.env.DEV && props.iconOnly && !attrs['aria-label']) {
        console.warn('[OuiButton] iconOnly is true but aria-label is not provided. Add an aria-label to describe the button action for screen readers.')
    }
})
</script>
