<template>
    <component
        :is="element"
        :aria-busy="loading ? 'true' : undefined"
        :aria-disabled="isDisabled ? 'true' : undefined"
        :class="componentStyle"
        :href="href"
        :role="href ? 'link' : 'button'"
        :style="colorStyle"
        @click="handleInteraction"
        @keydown.enter.prevent="handleInteraction"
        @keydown.space.prevent="handleInteraction"
    >
        <span :class="loading ? 'opacity-0' : 'contents'">
            <slot />
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
import { computed } from 'vue'
import Icon from './Icon.vue'
import type { IconSize } from '@Composables/useIcons'

interface Props {
    color?: string
    disabled?: boolean
    href?: string | null
    loading?: boolean
    loadingIcon?: string
    size?: 'small' | 'base' | 'large'
    type?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
    color: 'blue',
    disabled: false,
    href: null,
    loading: false,
    loadingIcon: 'Loader2',
    size: 'base',
    type: 'primary'
})

/**
 * Functionally disabled when explicitly disabled or currently loading.
 */
const isDisabled = computed((): boolean => props.disabled || props.loading)

/**
 * Handles both click and keyboard activation (Enter/Space).
 * Prevents action if aria-disabled or loading.
 */
const handleInteraction = (e: MouseEvent | KeyboardEvent) => {
    if (isDisabled.value) {
        e.preventDefault();
        (e as MouseEvent).stopImmediatePropagation?.()
        e.stopPropagation()
    }
}

const element = computed((): string => (props.href ? 'a' : 'button'))

/**
 * Maps button size to Icon size for the loading spinner.
 */
const spinnerSize = computed((): IconSize => {
    const map: Record<string, IconSize> = {
        small: 'sm',
        base: 'base',
        large: 'lg'
    }
    return map[props.size] ?? 'base'
})

const styles = {
    padding: {
        small: 'py-1 px-2',
        base: 'py-2 px-3',
        large: 'py-3 px-4'
    },
    common: 'relative inline-flex items-center justify-center border rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--btn-accent)]',
    primary: {
        base: 'text-white bg-[var(--btn-bg)] border-[var(--btn-border)] hover:bg-[var(--btn-bg-hover)]',
        disabled: 'text-white bg-gray-400 border-gray-400 opacity-50'
    },
    secondary: {
        base: 'text-[var(--btn-accent)] bg-white border-[var(--btn-border)] hover:bg-[var(--btn-bg-subtle)]',
        disabled: 'text-gray-400 bg-white border-gray-200 opacity-50'
    },
    tertiary: {
        base: 'text-[var(--btn-accent)] bg-transparent border-transparent hover:bg-[var(--btn-bg-subtle)]',
        disabled: 'text-gray-400 bg-transparent border-transparent opacity-50'
    },
    text: {
        base: 'text-[var(--btn-accent)] bg-transparent border-transparent hover:text-[var(--btn-accent-hover)] hover:underline',
        disabled: 'text-gray-400 bg-transparent border-transparent opacity-50'
    },
    none: {
        base: 'text-black bg-transparent border-transparent',
        disabled: 'text-gray-400 bg-transparent border-transparent opacity-50'
    }
}

/**
 * Computed button classes based on props.
 * Loading state uses normal (non-disabled) visuals — only `disabled` prop affects appearance.
 */
const componentStyle = computed((): string => {
    const { size, type, disabled } = props
    const interactive = isDisabled.value ? 'cursor-not-allowed' : 'cursor-pointer'
    const visual = styles[type]?.[disabled ? 'disabled' : 'base'] || ''
    return `${styles.common} ${styles.padding[size]} ${visual} ${interactive}`
})

/**
 * CSS custom properties for theming, derived from the `color` prop.
 * Leverages Tailwind v4's built-in color CSS variables (--color-{name}-{shade}).
 */
const colorStyle = computed((): Record<string, string> => {
    const c = props.color
    return {
        '--btn-bg': `var(--color-${c}-600)`,
        '--btn-bg-hover': `var(--color-${c}-700)`,
        '--btn-bg-subtle': `var(--color-${c}-50)`,
        '--btn-border': `var(--color-${c}-300)`,
        '--btn-accent': `var(--color-${c}-600)`,
        '--btn-accent-hover': `var(--color-${c}-700)`
    }
})
</script>
