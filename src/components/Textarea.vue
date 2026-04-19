<template>
    <div>
        <Label
            v-if="label && !formField"
            :for="effectiveId"
        >
            {{ label }}
        </Label>
        <textarea
            :id="effectiveId"
            ref="textareaRef"
            class="w-full rounded-xl border bg-white px-3 py-2 text-sm transition-[border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-800 dark:placeholder-gray-500"
            :aria-describedby="ariaDescribedBy || undefined"
            :aria-invalid="formField?.hasError ? 'true' : undefined"
            :class="[resizeClass, stateClass]"
            :disabled="disabled"
            :maxlength="maxlength"
            :name="name"
            :placeholder="placeholder ?? undefined"
            :readonly="readonly"
            :required="required || undefined"
            :rows="resize === 'auto' ? undefined : rows"
            :value="modelValue"
            @input="onInput"
        />
        <div
            v-if="showCount"
            :id="countId"
            aria-live="polite"
            class="mt-1 text-end text-xs"
            :class="countClass"
        >
            {{ currentLength }}/{{ maxlength }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import Label from '@Components/Label.vue'
import { generateUuid } from '@Utils/uuid'
import { useFormField } from '@Composables/useFormField'

interface Props {
    modelValue?: string
    name: string
    label?: string
    placeholder?: string
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    rows?: number
    maxlength?: number
    resize?: 'none' | 'vertical' | 'both' | 'horizontal' | 'auto'
    showCount?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: '',
    label: undefined,
    placeholder: undefined,
    disabled: false,
    readonly: false,
    required: false,
    rows: 3,
    maxlength: 255,
    resize: 'vertical',
    showCount: false
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
    input: [value: string]
    change: [value: string]
}>()

const uuid = generateUuid('textarea')
const countId = generateUuid('count')
const formField = useFormField()
const effectiveId = formField?.inputId ?? uuid
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const ariaDescribedBy = computed(() => {
    const parts: string[] = []
    if (formField?.describedBy) parts.push(formField.describedBy)
    if (props.showCount) parts.push(countId)
    return parts.length ? parts.join(' ') : undefined
})

const resizeMap: Record<string, string> = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize',
    auto: 'resize-none overflow-hidden'
}

const resizeClass = computed(() => resizeMap[props.resize] ?? 'resize-y')

const stateClass = computed(() =>
    props.disabled
        ? 'border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
        : 'border-gray-500 text-gray-900 placeholder-gray-400 dark:border-gray-600 dark:text-gray-100'
)

const currentLength = computed(() => (props.modelValue ?? '').length)

const countClass = computed(() => {
    const ratio = currentLength.value / (props.maxlength ?? 255)
    if (ratio >= 1) return 'text-red-600 dark:text-red-400'
    if (ratio >= 0.9) return 'text-amber-700 dark:text-amber-500'
    return 'text-gray-500 dark:text-gray-400'
})

const recalcHeight = () => {
    if (props.resize !== 'auto' || !textareaRef.value) return
    textareaRef.value.style.height = 'auto'
    textareaRef.value.style.height = `${textareaRef.value.scrollHeight}px`
}

onMounted(recalcHeight)

watch(() => props.modelValue, () => {
    if (props.resize === 'auto') recalcHeight()
})

const onInput = (e: Event) => {
    const value = (e.target as HTMLTextAreaElement).value
    emit('update:modelValue', value)
    emit('input', value)
    if (props.resize === 'auto') recalcHeight()
}
</script>
