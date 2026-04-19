<template>
    <div class="flex items-center gap-3">
        <!-- sr-only native checkbox — form serialization + keyboard/AT semantics -->
        <input
            :id="effectiveId"
            ref="inputRef"
            class="sr-only"
            role="switch"
            type="checkbox"
            :aria-describedby="formField?.describedBy || undefined"
            :aria-invalid="formField?.hasError ? 'true' : undefined"
            :aria-label="!label ? ariaLabel : undefined"
            :checked="modelValue"
            :disabled="disabled"
            :name="name"
            @change="onChange"
        />
        <!-- Visual track — aria-hidden div; clicks forwarded to the real checkbox -->
        <div
            aria-hidden="true"
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors motion-reduce:transition-none"
            :class="[modelValue ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700', disabled ? 'opacity-50 cursor-not-allowed' : '']"
            @click="onTrackClick"
        >
            <span
                class="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform motion-reduce:transition-none"
                :class="modelValue ? 'translate-x-5' : 'translate-x-0.5'"
            />
        </div>
        <!-- Text label -->
        <label
            v-if="label"
            class="cursor-pointer select-none text-sm font-medium text-gray-900 dark:text-gray-100"
            :class="disabled ? 'cursor-not-allowed opacity-50' : ''"
            :for="effectiveId"
        >{{ label }}</label>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { generateUuid } from '@Utils/uuid'
import { useFormField } from '@Composables/useFormField'

interface Props {
    modelValue: boolean
    name?: string
    label?: string
    ariaLabel?: string
    disabled?: boolean
}

const { label, ariaLabel, disabled } = withDefaults(defineProps<Props>(), {
    name: undefined,
    label: undefined,
    ariaLabel: undefined,
    disabled: false
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    change: [value: boolean]
}>()

const uuid = generateUuid('switch')
const formField = useFormField()
const effectiveId = formField?.inputId ?? uuid
const inputRef = ref<HTMLInputElement | null>(null)

const onTrackClick = () => {
    if (!disabled) inputRef.value?.click()
}

const onChange = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked
    emit('update:modelValue', checked)
    emit('change', checked)
}
</script>
