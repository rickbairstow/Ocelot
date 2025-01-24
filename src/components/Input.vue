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
                    :name="name"
                    :placeholder="placeholder"
                    :readonly="readonly"
                    :type="type"
                    :value="modelValue"
                    @change="emitIntercept($event.target.value, 'change')"
                    @input="emitIntercept($event.target.value, 'input')"
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

<script setup>
import { computed, useSlots } from 'vue'
import Label from '@Components/Label.vue'
import { generateUuid } from '@Utils/uuid.js'

const slots = useSlots()
const uuid = generateUuid('input')

const props = defineProps({
    autoComplete: {
        type: Boolean,
        default: true
    },

    disabled: {
        type: Boolean,
        default: false
    },

    label: {
        required: true,
        type: String
    },

    maxlength: {
        type: Number,
        default: 255
    },

    minlength: {
        type: Number,
        default: null
    },

    modelValue: {
        required: true,
        type: [Array, Boolean, Number, String, null]
    },

    name: {
        type: String,
        required: true
    },

    pattern: {
        type: String,
        default: null
    },

    placeholder: {
        type: String,
        default: null
    },

    readonly: {
        type: Boolean,
        default: false
    },

    required: {
        type: Boolean,
        default: false
    },

    type: {
        type: String,
        default: 'text'
    }
})

const emit = defineEmits(['update:modelValue', 'input', 'change'])

/**
 * Lookup object for styling.
 */
const typeLookup = {
    text: {
        types: ['email', 'number', 'password', 'tel', 'text', 'url'],
        style: {
            default: 'border border-gray-500 text-gray-900 bg-white',
            disabled: 'border border-gray-300 text-gray-600 bg-gray-100',
            placeholder: 'placeholder-gray-500'
        }
    }
}

/**
 * Find the group for the current type.
 * @param {String} type
 * @returns {*|null}
 */
const findTypeGroup = (type) =>
    Object.entries(typeLookup).find(([, group]) =>
        group.types.includes(type)
    )?.[1] || null

/**
 * Calculate the input style.
 */
const inputClasses = computed(() => {
    const { type, disabled } = props
    const typeGroup = findTypeGroup(type)

    if (!typeGroup) return ''
    return disabled ? typeGroup.style.disabled : typeGroup.style.default
})

/**
 * Emit both the model update and the specific event type.
 * @param {String|Number} value - The value from the input.
 * @param {String} eventType - The type of event (input or change).
 */
const emitIntercept = (value, eventType) => {
    // Emit `update:modelValue` for v-model compatibility
    emit('update:modelValue', value)

    // Emit the specific event (input or change)
    emit(eventType, value)
}
</script>
