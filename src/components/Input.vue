<template>
    <div>
        <!-- text inputs -->
        <div class="flex flex-col gap-2">
            <Label :for="uuid">
                {{ label }}
            </Label>

            <!-- wrapper -->
            <div
                class="flex h-10 rounded-xl focus-within:outline overflow-hidden"
                :class="inputClasses"
            >
                <div
                    v-if="slots?.prefix"
                    class="flex-none flex items-center justify-center px-3"
                >
                    <slot name="prefix" />
                </div>

                <input
                    :id="uuid"
                    class="min-w-0 flex-1 outline-hidden"
                    :autocomplete="autoComplete ? 'on' : 'off'"
                    :class="[
                        slots?.prefix ? 'ps-0' : 'ps-3',
                        slots?.suffix ? 'pe-0' : 'pe-3'
                    ]"
                    :disabled="disabled"
                    :maxlength="maxlength"
                    :minlength="minlength ?? undefined"
                    :name="name"
                    :pattern="pattern ?? undefined"
                    :placeholder="placeholder ?? undefined"
                    :readonly="readonly"
                    :required="required || undefined"
                    :type="type"
                    :value="modelValue"
                    @change="emitIntercept(($event.target as HTMLInputElement).value, 'change')"
                    @input="emitIntercept(($event.target as HTMLInputElement).value, 'input')"
                />

                <div
                    v-if="slots?.suffix"
                    class="flex-none flex items-center justify-center px-3"
                >
                    <slot name="suffix" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Label from '@Components/Label.vue'
import { generateUuid } from '@Utils/uuid'

const slots = useSlots()
const uuid = generateUuid('input')

interface Props {
    autoComplete?: boolean
    disabled?: boolean
    label: string
    maxlength?: number
    minlength?: number | null
    modelValue: string | number | boolean | string[] | null
    name: string
    pattern?: string | null
    placeholder?: string | null
    readonly?: boolean
    required?: boolean
    type?: string
}

const props = withDefaults(defineProps<Props>(), {
    autoComplete: true,
    disabled: false,
    maxlength: 255,
    minlength: null,
    pattern: null,
    placeholder: null,
    readonly: false,
    required: false,
    type: 'text'
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    input: [value: string]
    change: [value: string]
}>()

/**
 * Lookup object for styling.
 */
const typeLookup: Record<string, { types: string[]; style: { default: string; disabled: string; placeholder: string } }> = {
    text: {
        types: ['email', 'number', 'password', 'tel', 'text', 'url'],
        style: {
            default: 'border border-gray-500 text-gray-900 bg-white dark:border-gray-600 dark:text-gray-100 dark:bg-gray-800',
            disabled: 'border border-gray-300 text-gray-600 bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:bg-gray-700',
            placeholder: 'placeholder-gray-500 dark:placeholder-gray-400'
        }
    }
}

/**
 * Find the group for the current type.
 */
const findTypeGroup = (type: string) =>
    Object.entries(typeLookup).find(([, group]) =>
        group.types.includes(type)
    )?.[1] || null

/**
 * Calculate the input style.
 */
const inputClasses = computed((): string => {
    const { type, disabled } = props
    const typeGroup = findTypeGroup(type)

    if (!typeGroup) return ''
    return disabled ? typeGroup.style.disabled : typeGroup.style.default
})

/**
 * Emit both the model update and the specific event type.
 * @param value - The value from the input.
 * @param eventType - The type of event (input or change).
 */
const emitIntercept = (value: string, eventType: 'input' | 'change') => {
    // Emit `update:modelValue` for v-model compatibility
    emit('update:modelValue', value)

    // Emit the specific event (input or change)
    emit(eventType, value)
}
</script>
