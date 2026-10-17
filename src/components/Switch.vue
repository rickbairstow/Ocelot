<template>
    <div class="flex items-center gap-3">
        <!-- sr-only native checkbox — form serialization + keyboard/AT semantics -->
        <input
            v-bind="controlAttrs()"
            :id="effectiveId"
            ref="element"
            class="peer sr-only"
            role="switch"
            type="checkbox"
            :aria-label="ariaLabel || undefined"
            :checked="modelValue"
            :disabled="disabled"
            :name="name"
            :required="isRequired || undefined"
            @change="onChange"
        />
        <!-- Visual track — aria-hidden div; clicks forwarded to the real checkbox -->
        <div
            aria-hidden="true"
            class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors motion-reduce:transition-none peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-blue-500"
            :class="[isInvalid ? 'ring-2 ring-red-600 dark:ring-red-400' : '', modelValue ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700', disabled ? 'opacity-50 cursor-not-allowed' : '']"
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
defineOptions({ inheritAttrs: false })
import { computed } from 'vue'
import { generateUuid } from '@Utils/uuid'
import { useFormControl } from '@Composables/useFormField'

interface Props {
    id?: string
    invalid?: boolean
    required?: boolean
    modelValue: boolean
    name?: string
    label?: string
    ariaLabel?: string
    disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    invalid: false,
    required: false,
    name: undefined,
    label: undefined,
    ariaLabel: undefined,
    disabled: false
})

const modelValue = computed(() => props.modelValue)
const name = computed(() => props.name)
const label = computed(() => props.label)
const ariaLabel = computed(() => props.ariaLabel)
const disabled = computed(() => props.disabled)

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    change: [value: boolean]
}>()

const uuid = generateUuid('switch')
const { effectiveId, isInvalid, isRequired, controlAttrs, element, focus } = useFormControl(props, uuid)
defineExpose({ element, focus })

const onTrackClick = () => {
    if (props.disabled) return
    element.value?.focus()
    element.value?.click()
}

const onChange = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked
    emit('update:modelValue', checked)
    emit('change', checked)
}
</script>
