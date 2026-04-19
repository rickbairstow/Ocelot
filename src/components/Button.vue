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
import { computed, inject, onMounted, useAttrs } from 'vue'
import type { Component } from 'vue'
import Icon from './Icon.vue'
import type { IconProp, IconSize } from '@Composables/useIcons'
import { availableIcons, availableSizes } from '@Composables/useIcons'
import type { ButtonGroupContext } from './ButtonGroup.vue'

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
    color: undefined,
    disabled: false,
    href: null,
    icon: undefined,
    iconOnly: false,
    iconPosition: 'start',
    loading: false,
    loadingIcon: 'Loader2',
    size: undefined,
    variant: undefined
})

const buttonGroup = inject<ButtonGroupContext | null>('buttonGroup', null)

const effectiveColor = computed(() => props.color ?? buttonGroup?.color.value ?? 'blue')
const effectiveSize = computed(() => props.size ?? buttonGroup?.size.value ?? 'base')
const effectiveVariant = computed(() => props.variant ?? buttonGroup?.variant.value ?? 'primary')

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

const iconSizeMap: Record<string, number> = {
    small: availableSizes.xs,
    base: availableSizes.sm,
    large: availableSizes.lg
}

const iconPixelSize = computed((): number => {
    return iconSizeMap[effectiveSize.value] ?? availableSizes.sm
})

const resolvedIcon = computed((): Component | null => {
    const { icon } = props

    if (!icon) return null
    if (typeof icon !== 'string') return icon
    if (icon in availableIcons) return availableIcons[icon]

    if (import.meta.env.DEV) {
        console.warn(
            `[OuiButton] Icon "${icon}" not found in registry. Register it with registerIcons() or pass the component directly.`
        )
    }

    return null
})

const iconGapMap: Record<string, string> = {
    small: 'gap-1',
    base: 'gap-1.5',
    large: 'gap-2'
}

const innerWrapClass = computed((): string => {
    if (resolvedIcon.value && !props.iconOnly) {
        return `flex items-center ${iconGapMap[effectiveSize.value] ?? 'gap-1.5'}`
    }

    return 'contents'
})

const spinnerSize = computed((): IconSize => {
    const map: Record<string, IconSize> = {
        small: 'sm',
        base: 'base',
        large: 'lg'
    }

    return map[effectiveSize.value] ?? 'base'
})

const padding: Record<string, string> = {
    small: 'py-1 px-2',
    base: 'py-2 px-3',
    large: 'py-3 px-4'
}

const iconOnlyPadding: Record<string, string> = {
    small: 'p-1',
    base: 'p-2',
    large: 'p-3'
}

const common =
    'relative inline-flex items-center justify-center border rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950'

const disabledClasses: Record<string, string> = {
    primary: 'text-white bg-gray-500 border-gray-500',
    secondary: 'text-gray-600 bg-white border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-400',
    tertiary: 'text-gray-600 bg-transparent border-transparent dark:text-gray-400',
    text: 'text-gray-600 bg-transparent border-transparent dark:text-gray-400',
    none: 'text-gray-600 bg-transparent border-transparent dark:text-gray-400'
}

const colorClasses: Record<string, Record<string, string>> = {
    primary: {
        blue: 'text-white bg-blue-800 border-blue-800 hover:bg-blue-900 focus-visible:ring-blue-800 dark:bg-blue-700 dark:border-blue-700 dark:hover:bg-blue-600 dark:focus-visible:ring-blue-300',
        green: 'text-white bg-green-800 border-green-800 hover:bg-green-900 focus-visible:ring-green-800 dark:bg-green-700 dark:border-green-700 dark:hover:bg-green-600 dark:focus-visible:ring-green-300',
        red: 'text-white bg-red-800 border-red-800 hover:bg-red-900 focus-visible:ring-red-800 dark:bg-red-700 dark:border-red-700 dark:hover:bg-red-600 dark:focus-visible:ring-red-300',
        orange: 'text-white bg-orange-800 border-orange-800 hover:bg-orange-900 focus-visible:ring-orange-800 dark:bg-orange-700 dark:border-orange-700 dark:hover:bg-orange-600 dark:focus-visible:ring-orange-300',
        purple: 'text-white bg-purple-800 border-purple-800 hover:bg-purple-900 focus-visible:ring-purple-800 dark:bg-purple-700 dark:border-purple-700 dark:hover:bg-purple-600 dark:focus-visible:ring-purple-300',
        indigo: 'text-white bg-indigo-800 border-indigo-800 hover:bg-indigo-900 focus-visible:ring-indigo-800 dark:bg-indigo-700 dark:border-indigo-700 dark:hover:bg-indigo-600 dark:focus-visible:ring-indigo-300',
        teal: 'text-white bg-teal-800 border-teal-800 hover:bg-teal-900 focus-visible:ring-teal-800 dark:bg-teal-700 dark:border-teal-700 dark:hover:bg-teal-600 dark:focus-visible:ring-teal-300',
        pink: 'text-white bg-pink-800 border-pink-800 hover:bg-pink-900 focus-visible:ring-pink-800 dark:bg-pink-700 dark:border-pink-700 dark:hover:bg-pink-600 dark:focus-visible:ring-pink-300'
    },

    secondary: {
        blue: 'text-blue-800 bg-white border-blue-500 hover:bg-blue-50 focus-visible:ring-blue-800 dark:bg-gray-900 dark:text-blue-200 dark:border-blue-600 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-300',
        green: 'text-green-800 bg-white border-green-500 hover:bg-green-50 focus-visible:ring-green-800 dark:bg-gray-900 dark:text-green-200 dark:border-green-600 dark:hover:bg-green-950 dark:focus-visible:ring-green-300',
        red: 'text-red-800 bg-white border-red-500 hover:bg-red-50 focus-visible:ring-red-800 dark:bg-gray-900 dark:text-red-200 dark:border-red-600 dark:hover:bg-red-950 dark:focus-visible:ring-red-300',
        orange: 'text-orange-800 bg-white border-orange-500 hover:bg-orange-50 focus-visible:ring-orange-800 dark:bg-gray-900 dark:text-orange-200 dark:border-orange-600 dark:hover:bg-orange-950 dark:focus-visible:ring-orange-300',
        purple: 'text-purple-800 bg-white border-purple-500 hover:bg-purple-50 focus-visible:ring-purple-800 dark:bg-gray-900 dark:text-purple-200 dark:border-purple-600 dark:hover:bg-purple-950 dark:focus-visible:ring-purple-300',
        indigo: 'text-indigo-800 bg-white border-indigo-500 hover:bg-indigo-50 focus-visible:ring-indigo-800 dark:bg-gray-900 dark:text-indigo-200 dark:border-indigo-600 dark:hover:bg-indigo-950 dark:focus-visible:ring-indigo-300',
        teal: 'text-teal-800 bg-white border-teal-500 hover:bg-teal-50 focus-visible:ring-teal-800 dark:bg-gray-900 dark:text-teal-200 dark:border-teal-600 dark:hover:bg-teal-950 dark:focus-visible:ring-teal-300',
        pink: 'text-pink-800 bg-white border-pink-500 hover:bg-pink-50 focus-visible:ring-pink-800 dark:bg-gray-900 dark:text-pink-200 dark:border-pink-600 dark:hover:bg-pink-950 dark:focus-visible:ring-pink-300'
    },

    tertiary: {
        blue: 'text-blue-800 bg-transparent border-transparent hover:bg-blue-50 focus-visible:ring-blue-800 dark:text-blue-200 dark:hover:bg-blue-950 dark:focus-visible:ring-blue-300',
        gray: 'text-gray-800 bg-transparent border-transparent hover:text-gray-900 hover:bg-gray-100 focus-visible:ring-gray-800 dark:text-gray-200 dark:hover:text-white dark:hover:bg-gray-800 dark:focus-visible:ring-gray-300',
        green: 'text-green-800 bg-transparent border-transparent hover:bg-green-50 focus-visible:ring-green-800 dark:text-green-200 dark:hover:bg-green-950 dark:focus-visible:ring-green-300',
        red: 'text-red-800 bg-transparent border-transparent hover:bg-red-50 focus-visible:ring-red-800 dark:text-red-200 dark:hover:bg-red-950 dark:focus-visible:ring-red-300',
        orange: 'text-orange-800 bg-transparent border-transparent hover:bg-orange-50 focus-visible:ring-orange-800 dark:text-orange-200 dark:hover:bg-orange-950 dark:focus-visible:ring-orange-300',
        purple: 'text-purple-800 bg-transparent border-transparent hover:bg-purple-50 focus-visible:ring-purple-800 dark:text-purple-200 dark:hover:bg-purple-950 dark:focus-visible:ring-purple-300',
        indigo: 'text-indigo-800 bg-transparent border-transparent hover:bg-indigo-50 focus-visible:ring-indigo-800 dark:text-indigo-200 dark:hover:bg-indigo-950 dark:focus-visible:ring-indigo-300',
        teal: 'text-teal-800 bg-transparent border-transparent hover:bg-teal-50 focus-visible:ring-teal-800 dark:text-teal-200 dark:hover:bg-teal-950 dark:focus-visible:ring-teal-300',
        pink: 'text-pink-800 bg-transparent border-transparent hover:bg-pink-50 focus-visible:ring-pink-800 dark:text-pink-200 dark:hover:bg-pink-950 dark:focus-visible:ring-pink-300'
    },

    text: {
        blue: 'text-blue-800 bg-transparent border-transparent hover:text-blue-900 hover:underline focus-visible:ring-blue-800 dark:text-blue-200 dark:hover:text-white dark:focus-visible:ring-blue-300',
        green: 'text-green-800 bg-transparent border-transparent hover:text-green-900 hover:underline focus-visible:ring-green-800 dark:text-green-200 dark:hover:text-white dark:focus-visible:ring-green-300',
        red: 'text-red-800 bg-transparent border-transparent hover:text-red-900 hover:underline focus-visible:ring-red-800 dark:text-red-200 dark:hover:text-white dark:focus-visible:ring-red-300',
        orange: 'text-orange-800 bg-transparent border-transparent hover:text-orange-900 hover:underline focus-visible:ring-orange-800 dark:text-orange-200 dark:hover:text-white dark:focus-visible:ring-orange-300',
        purple: 'text-purple-800 bg-transparent border-transparent hover:text-purple-900 hover:underline focus-visible:ring-purple-800 dark:text-purple-200 dark:hover:text-white dark:focus-visible:ring-purple-300',
        indigo: 'text-indigo-800 bg-transparent border-transparent hover:text-indigo-900 hover:underline focus-visible:ring-indigo-800 dark:text-indigo-200 dark:hover:text-white dark:focus-visible:ring-indigo-300',
        teal: 'text-teal-800 bg-transparent border-transparent hover:text-teal-900 hover:underline focus-visible:ring-teal-800 dark:text-teal-200 dark:hover:text-white dark:focus-visible:ring-teal-300',
        pink: 'text-pink-800 bg-transparent border-transparent hover:text-pink-900 hover:underline focus-visible:ring-pink-800 dark:text-pink-200 dark:hover:text-white dark:focus-visible:ring-pink-300'
    }
}

const noneBase = 'text-black dark:text-white bg-transparent border-transparent'

const componentStyle = computed((): string => {
    const { iconOnly } = props
    const size = effectiveSize.value
    const variant = effectiveVariant.value
    const color = effectiveColor.value

    const interactive = isDisabled.value ? 'cursor-not-allowed' : 'cursor-pointer'
    const padClass = iconOnly
        ? (iconOnlyPadding[size] ?? iconOnlyPadding.base)
        : (padding[size] ?? padding.base)

    if (isDisabled.value) {
        return `${common} ${padClass} ${disabledClasses[variant]} ${interactive}`
    }

    if (variant === 'none') {
        return `${common} ${padClass} ${noneBase} ${interactive}`
    }

    const colorClass =
        colorClasses[variant]?.[color] ??
        colorClasses[variant]?.blue ??
        ''

    return `${common} ${padClass} ${colorClass} ${interactive}`
})

onMounted(() => {
    if (import.meta.env.DEV && props.iconOnly && !attrs['aria-label']) {
        console.warn(
            '[OuiButton] iconOnly is true but aria-label is not provided. Add an aria-label to describe the button action for screen readers.'
        )
    }
})
</script>
