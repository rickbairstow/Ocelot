<template>
    <component
        :is="formField?.grouped ? 'div' : 'fieldset'"
        v-bind="controlAttrs()"
        :id="effectiveId"
        ref="element"
        class="border-0 p-0 m-0"
        :disabled="formField?.grouped ? undefined : disabled"
    >
        <legend
            v-if="label && !formField?.grouped"
            class="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
            {{ label }}
        </legend>
        <div :class="orientation === 'horizontal' ? 'flex flex-row flex-wrap gap-4' : 'flex flex-col gap-2'">
            <slot />
        </div>
    </component>
</template>

<script setup lang="ts">
defineOptions({ inheritAttrs: false })
import { computed, provide } from 'vue'
import type { ComputedRef } from 'vue'
import { useFormControl } from '@Composables/useFormField'
import { generateUuid } from '@Utils/uuid'

export interface CheckboxGroupContext {
    name: ComputedRef<string>
    modelValue: ComputedRef<string[]>
    disabled: ComputedRef<boolean>
    invalid: ComputedRef<boolean>
    required: ComputedRef<boolean>
    toggle: (value: string) => void
}

interface Props {
    id?: string
    invalid?: boolean
    required?: boolean
    modelValue: string[]
    name: string
    label?: string
    disabled?: boolean
    orientation?: 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    invalid: false,
    required: false,
    label: undefined,
    disabled: false,
    orientation: 'vertical'
})

const emit = defineEmits<{
    'update:modelValue': [value: string[]]
}>()

const { formField, effectiveId, isInvalid, controlAttrs, element } = useFormControl<HTMLElement>(props, generateUuid('group'))
const focus = () => element.value?.querySelector<HTMLInputElement>('input:not(:disabled)')?.focus()
defineExpose({ element, focus })

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
    invalid: isInvalid,
    required: computed(() => props.required || formField?.required || false),
    toggle
})
</script>
