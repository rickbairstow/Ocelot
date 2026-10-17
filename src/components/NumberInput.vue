<template>
    <div class="flex flex-col gap-1.5">
        <Label
            v-if="label && !formField"
            :for="effectiveId"
        >{{ label }}</Label>
        <div
            class="flex h-10 rounded-xl border bg-white text-gray-900 focus-within:ring-2 focus-within:ring-blue-500 dark:bg-gray-800 dark:text-gray-100"
            :class="[isInvalid ? 'border-red-600 dark:border-red-400' : 'border-gray-500 dark:border-gray-600', disabled ? 'bg-gray-100 opacity-60 dark:bg-gray-700' : '']"
        >
            <button
                class="flex w-10 shrink-0 cursor-pointer items-center justify-center rounded-s-xl hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-700"
                tabindex="-1"
                type="button"
                :aria-label="decreaseLabel"
                :disabled="disabled || readonly || (modelValue !== null && min !== undefined && modelValue <= min)"
                @click="adjust(-1)"
            >
                <Icon
                    icon="Minus"
                    size="sm"
                />
            </button>
            <input
                v-bind="controlAttrs()"
                :id="effectiveId"
                ref="element"
                class="min-w-0 flex-1 bg-transparent px-2 text-center outline-hidden disabled:cursor-not-allowed"
                type="number"
                :disabled="disabled"
                :max="max"
                :min="min"
                :name="name"
                :placeholder="placeholder"
                :readonly="readonly"
                :required="isRequired || undefined"
                :step="step"
                :value="modelValue"
                @change="emit('change', readValue())"
                @input="updateValue"
            />
            <button
                class="flex w-10 shrink-0 cursor-pointer items-center justify-center rounded-e-xl hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-40 dark:hover:bg-gray-700"
                tabindex="-1"
                type="button"
                :aria-label="increaseLabel"
                :disabled="disabled || readonly || (modelValue !== null && max !== undefined && modelValue >= max)"
                @click="adjust(1)"
            >
                <Icon
                    icon="Plus"
                    size="sm"
                />
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Label from '@Components/Label.vue'
import Icon from '@Components/Icon.vue'
import { useFormControl } from '@Composables/useFormField'
import { generateUuid } from '@Utils/uuid'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
    modelValue: number | null
    name: string
    id?: string
    label?: string
    min?: number
    max?: number
    step?: number
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
    increaseLabel?: string
    decreaseLabel?: string
}>(), { id: undefined, label: undefined, min: undefined, max: undefined, placeholder: undefined, step: 1, disabled: false, readonly: false, required: false, invalid: false, increaseLabel: 'Increase value', decreaseLabel: 'Decrease value' })
const emit = defineEmits<{
    'update:modelValue': [value: number | null]
    input: [value: number | null]
    change: [value: number | null]
}>()
const { formField, effectiveId, isInvalid, isRequired, controlAttrs, element, focus } = useFormControl(props, generateUuid('number'))
const readValue = () => Number.isFinite(element.value?.valueAsNumber) ? element.value!.valueAsNumber : null
const updateValue = () => {
    const value = readValue()
    emit('update:modelValue', value)
    emit('input', value)
}
const adjust = (direction: number) => {
    if (props.disabled || props.readonly || !element.value) return
    // Native stepping respects decimal steps, the step base and min/max limits.
    if (direction > 0) element.value.stepUp()
    else element.value.stepDown()
    updateValue()
    emit('change', readValue())
    focus()
}
defineExpose({ element, focus })
</script>

<style scoped>
input {
    appearance: textfield;
}

input::-webkit-inner-spin-button,
input::-webkit-outer-spin-button {
    appearance: none;
    margin: 0;
}
</style>
