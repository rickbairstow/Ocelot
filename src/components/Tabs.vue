<template>
    <div class="w-full">
        <slot />
    </div>
</template>

<script setup lang="ts">
import { ref, provide, watch } from 'vue'
import type { Ref } from 'vue'
import { generateUuid } from '@Utils/uuid'

export interface TabsContext {
    activeTab: Ref<string>
    setActiveTab: (value: string) => void
    registerTab: (value: string) => void
    unregisterTab: (value: string) => void
    tabOrder: Ref<string[]>
    baseId: string
    variant: 'line' | 'pill' | 'contained'
}

interface Props {
    defaultValue?: string
    modelValue?: string
    variant?: 'line' | 'pill' | 'contained'
}

const props = withDefaults(defineProps<Props>(), {
    defaultValue: undefined,
    modelValue: undefined,
    variant: 'line'
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const baseId = generateUuid()
const tabOrder = ref<string[]>([])
const activeTab = ref<string>(props.modelValue ?? props.defaultValue ?? '')

watch(() => props.modelValue, (val) => {
    if (val !== undefined) activeTab.value = val
})

const setActiveTab = (value: string) => {
    activeTab.value = value
    emit('update:modelValue', value)
}

const registerTab = (value: string) => {
    if (!tabOrder.value.includes(value)) {
        tabOrder.value.push(value)
        if (!activeTab.value) activeTab.value = value
    }
}

const unregisterTab = (value: string) => {
    const index = tabOrder.value.indexOf(value)
    if (index !== -1) tabOrder.value.splice(index, 1)
}

provide<TabsContext>('tabs', {
    activeTab,
    setActiveTab,
    registerTab,
    unregisterTab,
    tabOrder,
    baseId,
    variant: props.variant
})
</script>
