<template>
    <div
        role="group"
        :aria-label="ariaLabel"
        :class="wrapperClass"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import type { ComputedRef } from 'vue'

export interface ButtonGroupContext {
    color: ComputedRef<string | undefined>
    size: ComputedRef<'small' | 'base' | 'large' | undefined>
    variant: ComputedRef<'primary' | 'secondary' | 'tertiary' | 'text' | 'none' | undefined>
}

interface Props {
    ariaLabel?: string
    color?: string
    orientation?: 'horizontal' | 'vertical'
    size?: 'small' | 'base' | 'large'
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'none'
}

const props = withDefaults(defineProps<Props>(), {
    ariaLabel: undefined,
    color: undefined,
    orientation: 'horizontal',
    size: undefined,
    variant: undefined
})

provide<ButtonGroupContext>('buttonGroup', {
    color: computed(() => props.color),
    size: computed(() => props.size),
    variant: computed(() => props.variant)
})

const horizontalClasses = 'inline-flex [&>*:not(:last-child)]:!rounded-r-none [&>*:not(:first-child)]:!rounded-l-none [&>*:not(:first-child)]:-ml-px [&>*]:z-0 [&>*:hover]:z-10 [&>*:focus-visible]:z-10'
const verticalClasses = 'inline-flex flex-col [&>*:not(:last-child)]:!rounded-b-none [&>*:not(:first-child)]:!rounded-t-none [&>*:not(:first-child)]:-mt-px [&>*]:z-0 [&>*:hover]:z-10 [&>*:focus-visible]:z-10'

const wrapperClass = computed(() =>
    props.orientation === 'vertical' ? verticalClasses : horizontalClasses
)
</script>
