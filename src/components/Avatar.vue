<template>
    <component
        :is="href ? 'a' : 'span'"
        :aria-label="ariaLabel"
        :class="containerCss"
        :href="href ?? undefined"
    >
        <!-- Image -->
        <img
            v-if="src && !imgError"
            class="w-full h-full object-cover"
            loading="lazy"
            :alt="alt"
            :src="src"
            @error="imgError = true"
        />

        <!-- Initials fallback -->
        <span
            v-else-if="initials"
            aria-hidden="true"
            class="font-semibold leading-none select-none"
            :class="initialsSizeCss"
        >
            {{ initials.slice(0, 2).toUpperCase() }}
        </span>

        <!-- Icon fallback -->
        <Icon
            v-else
            aria-hidden="true"
            icon="User"
            :size="iconSize"
        />
    </component>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Icon from '@Components/Icon.vue'
import type { IconSize } from '@Composables/useIcons'

export type AvatarSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl'
export type AvatarColor = 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo' | 'teal' | 'pink' | 'gray'
export type AvatarShape = 'circle' | 'square'

interface Props {
    alt?: string
    ariaLabel?: string
    color?: AvatarColor
    href?: string | null
    initials?: string
    shape?: AvatarShape
    size?: AvatarSize
    src?: string | null
}

const props = withDefaults(defineProps<Props>(), {
    alt: '',
    ariaLabel: undefined,
    color: 'blue',
    href: null,
    initials: undefined,
    shape: 'circle',
    size: 'base',
    src: null
})

const imgError = ref(false)

const sizeMap: Record<AvatarSize, string> = {
    xs:   'size-6',
    sm:   'size-8',
    base: 'size-10',
    lg:   'size-12',
    xl:   'size-16',
    '2xl': 'size-20'
}

const initialsSizeMap: Record<AvatarSize, string> = {
    xs:   'text-xs',
    sm:   'text-sm',
    base: 'text-base',
    lg:   'text-lg',
    xl:   'text-xl',
    '2xl': 'text-2xl'
}

const iconSizeMap: Record<AvatarSize, IconSize> = {
    xs:   'sm',
    sm:   'base',
    base: 'lg',
    lg:   'xl',
    xl:   '2xl',
    '2xl': '3xl'
}

const colorMap: Record<AvatarColor, string> = {
    blue:   'bg-blue-600 text-white',
    green:  'bg-green-700 text-white',
    red:    'bg-red-600 text-white',
    orange: 'bg-orange-700 text-white',
    purple: 'bg-purple-600 text-white',
    indigo: 'bg-indigo-600 text-white',
    teal:   'bg-teal-700 text-white',
    pink:   'bg-pink-600 text-white',
    gray:   'bg-gray-500 text-white'
}

const shapeMap: Record<AvatarShape, string> = {
    circle: 'rounded-full',
    square: 'rounded-lg'
}

const containerCss = computed((): string => {
    const hasImage = props.src && !imgError.value
    const bg = hasImage ? 'bg-gray-200 dark:bg-gray-700' : colorMap[props.color]
    return [
        'inline-flex items-center justify-center shrink-0 overflow-hidden',
        sizeMap[props.size],
        shapeMap[props.shape],
        bg,
        props.href ? 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500' : ''
    ].filter(Boolean).join(' ')
})

const initialsSizeCss = computed((): string => initialsSizeMap[props.size])
const iconSize = computed((): IconSize => iconSizeMap[props.size])
</script>
