<template>
    <div class="flex flex-col gap-1.5">
        <span
            v-if="readonly"
            role="img"
            :aria-label="`${label ?? groupLabel ?? 'Rating'}: ${modelValue ?? 0} / ${count}`"
        >
            <span
                aria-hidden="true"
                class="inline-flex gap-1"
            >
                <Icon
                    v-for="value in count"
                    :key="value"
                    class="size-6"
                    :class="(modelValue ?? 0) >= value ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'"
                    :icon="(modelValue ?? 0) >= value ? 'StarFilled' : 'Star'"
                />
            </span>
        </span>
        <fieldset
            v-else
            class="min-w-0"
            :aria-label="groupLabel"
            :disabled="disabled"
        >
            <legend
                v-if="label && !formField"
                class="mb-1.5 text-sm font-medium text-gray-900 dark:text-gray-100"
            >
                {{ label }}
            </legend>
            <div
                class="inline-flex gap-1 rounded-md"
                :class="[isInvalid ? 'ring-2 ring-red-600 ring-offset-2 dark:ring-red-400 dark:ring-offset-gray-950' : '', disabled ? 'opacity-50' : '']"
            >
                <label
                    v-for="value in count"
                    :key="value"
                    class="relative flex size-9 items-center justify-center rounded cursor-pointer has-disabled:cursor-not-allowed"
                >
                    <input
                        v-bind="controlAttrs()"
                        :id="value === 1 ? effectiveId : `${effectiveId}-${value}`"
                        :ref="value === 1 ? setElement : undefined"
                        class="peer sr-only"
                        type="radio"
                        :aria-label="`${value} / ${count}`"
                        :checked="modelValue === value"
                        :name="name"
                        :required="isRequired || formField?.required || undefined"
                        :value="value"
                        @change="select(value)"
                    />
                    <span class="sr-only">{{ value }} / {{ count }}</span>
                    <Icon
                        class="size-6 peer-focus-visible:rounded peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-blue-500"
                        :class="(modelValue ?? 0) >= value ? 'text-amber-700 dark:text-amber-400' : 'text-gray-500 dark:text-gray-400'"
                        :icon="(modelValue ?? 0) >= value ? 'StarFilled' : 'Star'"
                    />
                </label>
            </div>
        </fieldset>
        <input
            v-if="readonly && modelValue !== null"
            type="hidden"
            :disabled="disabled"
            :form="formId"
            :name="name"
            :value="modelValue"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import Icon from '@Components/Icon.vue'
import { useFormControl } from '@Composables/useFormField'
import { generateUuid } from '@Utils/uuid'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
    modelValue: number | null
    name: string
    id?: string
    label?: string
    max?: number
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
}>(), { id: undefined, label: undefined, max: 5, disabled: false, readonly: false, required: false, invalid: false })
const emit = defineEmits<{
    'update:modelValue': [value: number]
    change: [value: number]
}>()
const { formField, effectiveId, isInvalid, isRequired, controlAttrs, element, focus } = useFormControl(props, generateUuid('rating'))
const attrs = useAttrs()
const groupLabel = computed(() => attrs['aria-label'] as string | undefined)
const formId = computed(() => attrs.form as string | undefined)
const count = computed(() => Math.max(1, Math.floor(Number.isFinite(props.max) ? props.max : 5)))
const setElement = (value: Element | ComponentPublicInstance | null) => { element.value = value as HTMLInputElement | null }
const select = (value: number) => {
    if (props.disabled || props.readonly) return
    emit('update:modelValue', value)
    emit('change', value)
}
defineExpose({ element, focus })
</script>
