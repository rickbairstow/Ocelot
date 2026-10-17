<template>
    <div class="flex flex-col gap-1.5">
        <Label
            v-if="label && !formField"
            :for="effectiveId"
        >{{ label }}</Label>
        <div
            class="flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border p-1.5 text-gray-900 focus-within:ring-2 focus-within:ring-blue-500 dark:text-gray-100"
            :class="[isInvalid ? 'border-red-600 dark:border-red-400' : 'border-gray-500 dark:border-gray-600', disabled ? 'bg-gray-100 dark:bg-gray-900' : 'bg-white dark:bg-gray-800']"
        >
            <span
                v-for="(tag, index) in modelValue"
                :key="tag"
                class="inline-flex max-w-full items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm dark:bg-gray-700"
            >
                <span class="break-all">{{ tag }}</span>
                <button
                    v-if="!readonly"
                    class="flex size-6 shrink-0 cursor-pointer items-center justify-center rounded hover:bg-gray-200 focus-visible:outline-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed dark:hover:bg-gray-600"
                    type="button"
                    :aria-label="`${removeLabel} ${tag}`"
                    :disabled="disabled"
                    @click="remove(index)"
                ><Icon
                    icon="X"
                    size="xs"
                /></button>
            </span>
            <input
                v-bind="controlAttrs()"
                :id="effectiveId"
                ref="element"
                v-model="draft"
                class="min-w-20 flex-1 bg-transparent px-1 py-1 text-sm outline-hidden placeholder:text-gray-500 disabled:cursor-not-allowed dark:placeholder:text-gray-400"
                type="text"
                :disabled="disabled"
                :placeholder="modelValue.length ? undefined : placeholder"
                :readonly="readonly || atLimit"
                :required="isRequired && modelValue.length === 0 || undefined"
                @keydown="onKeydown"
                @paste="onPaste"
            />
        </div>
        <input
            v-for="(tag, index) in modelValue"
            :key="index"
            type="hidden"
            :disabled="disabled"
            :form="formId"
            :name="name"
            :value="tag"
        />
        <span
            class="sr-only"
            role="status"
        >{{ announcement }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, useAttrs, watchEffect } from 'vue'
import Label from '@Components/Label.vue'
import Icon from '@Components/Icon.vue'
import { useFormControl } from '@Composables/useFormField'
import { generateUuid } from '@Utils/uuid'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
    modelValue: string[]
    name: string
    id?: string
    label?: string
    placeholder?: string
    maxTags?: number
    disabled?: boolean
    readonly?: boolean
    required?: boolean
    invalid?: boolean
    removeLabel?: string
    requiredMessage?: string
}>(), { id: undefined, label: undefined, maxTags: undefined, placeholder: undefined, disabled: false, readonly: false, required: false, invalid: false, removeLabel: 'Remove', requiredMessage: 'Add at least one value.' })
const emit = defineEmits<{
    'update:modelValue': [value: string[]]
    change: [value: string[]]
    add: [value: string]
    remove: [value: string]
}>()
const { formField, effectiveId, isInvalid, isRequired, controlAttrs, element, focus } = useFormControl(props, generateUuid('tags'))
const draft = ref('')
const attrs = useAttrs()
const formId = computed(() => attrs.form as string | undefined)
const announcement = ref('')
const atLimit = computed(() => props.maxTags !== undefined && props.modelValue.length >= props.maxTags)
watchEffect(() => {
    // A typed draft is not yet a committed tag, even when the text input is non-empty.
    element.value?.setCustomValidity(isRequired.value && !props.readonly && props.modelValue.length === 0 ? props.requiredMessage : '')
})
const publish = (value: string[]) => {
    emit('update:modelValue', value)
    emit('change', value)
}
const add = (text: string) => {
    if (props.disabled || props.readonly) return
    const values = [...props.modelValue]
    for (const part of text.split(/[,\n\r]+/)) {
        const tag = part.trim()
        if (!tag || values.includes(tag) || (props.maxTags !== undefined && values.length >= props.maxTags)) continue
        values.push(tag)
        emit('add', tag)
    }
    if (values.length !== props.modelValue.length) {
        publish(values)
        announcement.value = values.join(', ')
    }
    draft.value = ''
}
const remove = (index: number) => {
    if (props.disabled || props.readonly) return
    const tag = props.modelValue[index]
    publish(props.modelValue.filter((_, itemIndex) => itemIndex !== index))
    emit('remove', tag)
    announcement.value = props.modelValue.filter((_, itemIndex) => itemIndex !== index).join(', ')
    focus()
}
const onKeydown = (event: KeyboardEvent) => {
    if (event.isComposing || props.disabled || props.readonly) return
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault()
        add(draft.value)
    } else if (event.key === 'Tab' && draft.value.trim()) add(draft.value)
    else if (event.key === 'Backspace' && !draft.value && props.modelValue.length) {
        event.preventDefault()
        remove(props.modelValue.length - 1)
    } else if (event.key === 'Escape') draft.value = ''
}
const onPaste = (event: ClipboardEvent) => {
    if (props.disabled || props.readonly || atLimit.value) return
    const text = event.clipboardData?.getData('text') ?? ''
    if (!/[,\n\r]/.test(text)) return
    event.preventDefault()
    add(draft.value + text)
}
defineExpose({ element, focus })
</script>
