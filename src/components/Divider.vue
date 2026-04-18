<template>
    <div
        role="separator"
        :class="wrapperCss"
    >
        <span :class="startLineCss" />
        <span
            v-if="hasContent"
            class="px-3 text-sm font-medium whitespace-nowrap shrink-0"
            :class="textColorCss"
        >
            <slot>{{ label }}</slot>
        </span>
        <span :class="endLineCss" />
    </div>
</template>

<script setup lang="ts">
import { Comment, computed, useSlots } from 'vue'

interface Props {
    color?: 'default' | 'subtle' | 'strong'
    label?: string
    labelAlign?: 'start' | 'center' | 'end'
    orientation?: 'horizontal' | 'vertical'
    variant?: 'solid' | 'dashed' | 'dotted'
}

const props = withDefaults(defineProps<Props>(), {
    color: 'default',
    label: undefined,
    labelAlign: 'center',
    orientation: 'horizontal',
    variant: 'solid'
})

const slots = useSlots()

const hasContent = computed(() =>
    !!slots.default?.().some(vnode => vnode.type !== Comment) || !!props.label
)

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

const baseLine = computed(() => {
    const { variant, color } = props
    const { border } = colorMap[color]
    return `border-t ${variantMap[variant]} ${border}`
})

// Start line — full width for 'end' alignment, narrow fixed for 'start'
const startLineCss = computed((): string => {
    if (!hasContent.value) return `flex-1 ${baseLine.value}`
    const { labelAlign } = props
    if (labelAlign === 'start') return `w-4 shrink-0 ${baseLine.value}`
    return `flex-1 ${baseLine.value}`
})

// End line — full width for 'start' alignment, narrow fixed for 'end'
const endLineCss = computed((): string => {
    if (!hasContent.value) return `flex-1 ${baseLine.value}`
    const { labelAlign } = props
    if (labelAlign === 'end') return `w-4 shrink-0 ${baseLine.value}`
    return `flex-1 ${baseLine.value}`
})

const textColorCss = computed((): string => colorMap[props.color].text)
</script>
