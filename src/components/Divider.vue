<template>
    <div
        :class="wrapperCss"
        role="separator"
    >
        <span
            v-if="hasText"
            :class="lineCss"
        />
        <span
            v-if="hasText"
            class="px-3 text-sm font-medium whitespace-nowrap shrink-0"
            :class="textColorCss"
        >
            <slot />
        </span>
        <span
            v-if="hasText"
            :class="lineCss"
        />
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
    default: { border: 'border-gray-200', text: 'text-gray-500' },
    subtle:  { border: 'border-gray-100', text: 'text-gray-400' },
    strong:  { border: 'border-gray-400', text: 'text-gray-700' }
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

    if (hasText.value) {
        return 'flex items-center w-full'
    }

    return `block w-full border-t ${variantCss} ${border}`
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
