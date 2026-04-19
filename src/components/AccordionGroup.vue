<template>
    <div
        class="flex flex-col"
        :class="gap"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, provide, computed } from 'vue'
import type { ComputedRef } from 'vue'

export interface AccordionGroupContext {
    activeId: ReturnType<typeof ref<string | null>>
    open: (id: string) => void
    variant: ComputedRef<'default' | 'flush' | 'contained'>
}

interface Props {
    defaultOpen?: string
    exclusive?: boolean
    variant?: 'default' | 'flush' | 'contained'
}

const props = withDefaults(defineProps<Props>(), {
    defaultOpen: undefined,
    exclusive: true,
    variant: 'default'
})

const activeId = ref<string | null>(props.defaultOpen ?? null)

const open = (id: string) => {
    if (props.exclusive) activeId.value = id
}

const groupVariant = computed(() => props.variant)

provide<AccordionGroupContext>('accordionGroup', { activeId, open, variant: groupVariant })

const gap = computed(() => props.variant === 'flush' ? '' : 'gap-2')
</script>
