<template>
    <div>
        <Label
            v-if="label && !formField"
            :for="effectiveId"
        >{{ label }}</Label>
        <input
            v-bind="controlAttrs()"
            :id="effectiveId"
            ref="element"
            class="w-full rounded-xl border bg-white p-2 text-sm text-gray-900 file:me-3 file:rounded-lg file:border-0 file:bg-gray-100 file:px-3 file:py-1 file:text-gray-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:text-gray-100 dark:file:bg-gray-700 dark:file:text-gray-100"
            type="file"
            :accept="accept"
            :class="isInvalid ? 'border-red-600 dark:border-red-400' : 'border-gray-500 dark:border-gray-600'"
            :disabled="disabled"
            :multiple="multiple"
            :name="name"
            :required="isRequired || undefined"
            @change="onChange"
        />
        <p
            v-if="multiple"
            class="mt-2 text-sm text-gray-600 dark:text-gray-300"
        >
            Select multiple files in one selection.
        </p>
        <ul
            v-if="multiple && modelValue.length"
            aria-label="Selected files"
            class="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-200"
        >
            <li
                v-for="(file, index) in modelValue"
                :key="`${file.name}-${index}`"
                class="break-all"
            >
                {{ file.name }}
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import Label from '@Components/Label.vue'
import { useFormControl } from '@Composables/useFormField'
import { generateUuid } from '@Utils/uuid'

defineOptions({ inheritAttrs: false })

interface Props {
    id?: string
    invalid?: boolean
    required?: boolean
    label?: string
    name: string
    modelValue?: File[]
    accept?: string
    multiple?: boolean
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    invalid: false,
    required: false,
    label: undefined,
    modelValue: () => [],
    accept: undefined,
    multiple: false,
    disabled: false
})
const emit = defineEmits<{
    'update:modelValue': [value: File[]]
    change: [value: File[]]
}>()
const { formField, effectiveId, isInvalid, isRequired, controlAttrs, element, focus } = useFormControl(props, generateUuid('file'))
defineExpose({ element, focus, clear })

function clear() {
    if (element.value) element.value.value = ''
    emit('update:modelValue', [])
    emit('change', [])
}

watch(() => props.modelValue, (files) => {
    // Browsers only permit clearing file inputs programmatically.
    if (!files.length && element.value) element.value.value = ''
})

const onChange = (event: Event) => {
    const files = Array.from((event.target as HTMLInputElement).files ?? [])
    emit('update:modelValue', files)
    emit('change', files)
}
</script>
