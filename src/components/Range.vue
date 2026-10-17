<template>
    <div class="flex flex-col gap-2">
        <Label
            v-if="label && !formField"
            :for="effectiveId"
        >{{ label }}</Label>
        <input
            v-bind="controlAttrs()"
            :id="effectiveId"
            ref="element"
            class="w-full cursor-pointer accent-blue-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:accent-blue-400"
            type="range"
            :class="isInvalid ? 'rounded ring-2 ring-red-600 dark:ring-red-400' : ''"
            :disabled="disabled"
            :max="max"
            :min="min"
            :name="name"
            :step="step"
            :value="modelValue"
            @change="emit('change', ($event.target as HTMLInputElement).valueAsNumber)"
            @input="onInput"
        />
    </div>
</template>

<script setup lang="ts">
import Label from '@Components/Label.vue'
import { useFormControl } from '@Composables/useFormField'
import { generateUuid } from '@Utils/uuid'

defineOptions({ inheritAttrs: false })

interface Props {
    id?: string
    invalid?: boolean
    label?: string
    modelValue?: number
    name: string
    min?: number
    max?: number
    step?: number | 'any'
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    invalid: false,
    label: undefined,
    modelValue: 50,
    min: 0,
    max: 100,
    step: 1,
    disabled: false
})
const emit = defineEmits<{
    'update:modelValue': [value: number]
    input: [value: number]
    change: [value: number]
}>()
const { formField, effectiveId, isInvalid, controlAttrs, element, focus } = useFormControl(props, generateUuid('range'))
defineExpose({ element, focus })

const onInput = (event: Event) => {
    const value = (event.target as HTMLInputElement).valueAsNumber
    emit('update:modelValue', value)
    emit('input', value)
}
</script>
