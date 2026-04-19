<template>
    <div>
        <Label
            v-if="label && !formField"
            :for="effectiveId"
        >
            {{ label }}
        </Label>

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
                :id="effectiveId"
                class="min-w-0 flex-1 outline-hidden"
                :aria-describedby="formField?.describedBy || undefined"
                :aria-invalid="formField?.hasError ? 'true' : undefined"
                :autocomplete="autoComplete ? 'on' : 'off'"
                :class="[
                    slots?.prefix ? 'ps-0' : 'ps-3',
                    hasSuffix ? 'pe-0' : 'pe-3'
                ]"
                :disabled="disabled"
                :max="max ?? undefined"
                :maxlength="type !== 'number' ? maxlength : undefined"
                :min="min ?? undefined"
                :minlength="minlength ?? undefined"
                :name="name"
                :pattern="pattern ?? undefined"
                :placeholder="placeholder ?? undefined"
                :readonly="readonly"
                :required="required || undefined"
                :step="step ?? undefined"
                :type="effectiveType"
                :value="modelValue"
                @change="emitIntercept(($event.target as HTMLInputElement).value, 'change')"
                @input="emitIntercept(($event.target as HTMLInputElement).value, 'input')"
            />

            <!-- Password show/hide toggle -->
            <button
                v-if="type === 'password'"
                class="flex-none flex items-center justify-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:pointer-events-none"
                type="button"
                :aria-label="showPassword ? 'Hide password' : 'Show password'"
                :disabled="disabled"
                @click="showPassword = !showPassword"
            >
                <Icon
                    size="sm"
                    :icon="showPassword ? 'EyeOff' : 'Eye'"
                />
            </button>

            <!-- Search clear button -->
            <button
                v-if="type === 'search' && modelValue"
                aria-label="Clear search"
                class="flex-none flex items-center justify-center px-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:pointer-events-none"
                type="button"
                :disabled="disabled"
                @click="clearSearch"
            >
                <Icon
                    icon="X"
                    size="sm"
                />
            </button>

            <div
                v-if="slots?.suffix"
                class="flex-none flex items-center justify-center px-3"
            >
                <slot name="suffix" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import Label from '@Components/Label.vue'
import Icon from '@Components/Icon.vue'
import { generateUuid } from '@Utils/uuid'
import { useFormField } from '@Composables/useFormField'

type InputType = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url'

const slots = useSlots()
const uuid = generateUuid('input')
const formField = useFormField()
const effectiveId = formField?.inputId ?? uuid
const showPassword = ref(false)

interface Props {
    autoComplete?: boolean
    disabled?: boolean
    label?: string
    max?: number | null
    maxlength?: number
    min?: number | null
    minlength?: number | null
    modelValue: string | number | boolean | string[] | null
    name: string
    pattern?: string | null
    placeholder?: string | null
    readonly?: boolean
    required?: boolean
    step?: number | string | null
    type?: InputType
}

const props = withDefaults(defineProps<Props>(), {
    autoComplete: true,
    disabled: false,
    label: undefined,
    max: null,
    maxlength: 255,
    min: null,
    minlength: null,
    pattern: null,
    placeholder: null,
    readonly: false,
    required: false,
    step: null,
    type: 'text'
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    input: [value: string]
    change: [value: string]
}>()

const effectiveType = computed(() =>
    props.type === 'password' && showPassword.value ? 'text' : props.type
)

const hasSuffix = computed(() =>
    !!slots?.suffix || props.type === 'password' || (props.type === 'search' && !!props.modelValue)
)

const typeLookup: Record<string, { types: string[]; style: { default: string; disabled: string; placeholder: string } }> = {
    text: {
        types: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'],
        style: {
            default: 'border border-gray-500 text-gray-900 bg-white dark:border-gray-600 dark:text-gray-100 dark:bg-gray-800',
            disabled: 'border border-gray-300 text-gray-600 bg-gray-100 dark:border-gray-600 dark:text-gray-400 dark:bg-gray-700',
            placeholder: 'placeholder-gray-500 dark:placeholder-gray-400'
        }
    }
}

const findTypeGroup = (type: string) =>
    Object.entries(typeLookup).find(([, group]) =>
        group.types.includes(type)
    )?.[1] || null

const inputClasses = computed((): string => {
    const { type, disabled } = props
    const typeGroup = findTypeGroup(type)
    if (!typeGroup) return ''
    return disabled ? typeGroup.style.disabled : typeGroup.style.default
})

const clearSearch = () => {
    emit('update:modelValue', '')
    emit('input', '')
}

const emitIntercept = (value: string, eventType: 'input' | 'change') => {
    emit('update:modelValue', value)
    emit(eventType, value)
}
</script>
