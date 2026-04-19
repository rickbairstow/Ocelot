<template>
    <fieldset
        class="border-0 p-0 m-0"
        :aria-describedby="formField?.describedBy || undefined"
        :disabled="disabled"
    >
        <legend
            v-if="label"
            class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
            {{ label }}
        </legend>
        <div :class="orientation === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col gap-2'">
            <slot />
        </div>
    </fieldset>
</template>

<script setup lang="ts">
import { computed, provide } from 'vue'
import type { ComputedRef } from 'vue'
import { useFormField } from '@Composables/useFormField'

export interface CheckboxGroupContext {
    name: ComputedRef<string>
    modelValue: ComputedRef<string[]>
    disabled: ComputedRef<boolean>
    toggle: (value: string) => void
}

interface Props {
    modelValue: string[]
    name: string
    label?: string
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
    label: undefined,
    disabled: false,
    orientation: 'vertical'
})

const emit = defineEmits<{
    'update:modelValue': [value: string[]]
}>()

const formField = useFormField()

const toggle = (value: string) => {
    const next = props.modelValue.includes(value)
        ? props.modelValue.filter(v => v !== value)
        : [...props.modelValue, value]
    emit('update:modelValue', next)
}

provide<CheckboxGroupContext>('checkboxGroup', {
    name: computed(() => props.name),
    modelValue: computed(() => props.modelValue),
    disabled: computed(() => props.disabled),
    toggle
})
</script>
