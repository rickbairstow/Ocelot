<template>
    <div
        role="separator"
        :class="wrapperCss"
    >
        <span :class="lineCss" />
        <span
            v-if="hasText"
            class="px-3 text-sm font-medium whitespace-nowrap shrink-0"
            :class="textColorCss"
        >
            <slot />
        </span>
        <span :class="lineCss" />
    </div>
</template>

<script setup lang="ts">
import { Comment, computed, useSlots } from 'vue'

interface Props {
    orientation?: 'horizontal' | 'vertical'
    variant?: 'solid' | 'dashed' | 'dotted'
    color?: 'default' | 'subtle' | 'strong'
}

const props = withDefaults(defineProps<Props>(), {
    orientation: 'horizontal',
    variant: 'solid',
    color: 'default'
})

const slots = useSlots()

const hasText = computed(() => !!slots.default?.().some(vnode => vnode.type !== Comment))

const colorMap = {
    default: { border: 'border-gray-200 dark:border-gray-700', text: 'text-gray-500 dark:text-gray-400' },
    subtle:  { border: 'border-gray-100 dark:border-gray-800', text: 'text-gray-400 dark:text-gray-500' },
    strong:  { border: 'border-gray-400 dark:border-gray-500', text: 'text-gray-700 dark:text-gray-300' }
}

const variantMap: Record<string, string> = {
    solid:  'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted'
}

const wrapperCss = computed((): string => {
    const { orientation, variant, color } = props
    const { border } = colorMap[color]
    const variantCss = variantMap[variant]

    if (orientation === 'vertical') {
        return `inline-block self-stretch border-l ${variantCss} ${border}`
    }

    return 'flex items-center w-full'
})

const lineCss = computed((): string => {
    const { variant, color } = props
    const { border } = colorMap[color]
    return `flex-1 border-t ${variantMap[variant]} ${border}`
})

const textColorCss = computed((): string => {
    return colorMap[props.color].text
})
</script>
