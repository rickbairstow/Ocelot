<template>
    <component
        :is="group ? 'fieldset' : 'div'"
        class="flex min-w-0 flex-col gap-1.5"
    >
        <component
            :is="group ? 'legend' : Label"
            v-if="label"
            :for="group ? undefined : inputId"
        >
            {{ label }}
            <span
                v-if="required"
                aria-hidden="true"
                class="ms-0.5 text-red-500"
            >*</span>
            <span
                v-if="optional"
                class="ms-1 text-xs font-normal text-gray-500 dark:text-gray-400"
            >(optional)</span>
        </component>

        <slot />

        <p
            v-if="error"
            :id="errorId"
            class="text-sm text-red-600 dark:text-red-400"
            role="alert"
        >
            {{ error }}
        </p>
        <p
            v-if="hint"
            :id="hintId"
            class="text-sm text-gray-500 dark:text-gray-400"
        >
            {{ hint }}
        </p>
    </component>
</template>

<script setup lang="ts">
import { reactive, provide, ref } from 'vue'
import Label from '@Components/Label.vue'
import { generateUuid } from '@Utils/uuid'
import { FormFieldKey } from '@Composables/useFormField'
import type { FormFieldContext } from '@Composables/useFormField'

interface Props {
    group?: boolean
    invalid?: boolean
    label?: string
    hint?: string
    error?: string
    required?: boolean
    optional?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    group: false,
    invalid: false,
    label: undefined,
    hint: undefined,
    error: undefined,
    required: false,
    optional: false
})

const inputId = ref(generateUuid('field'))
const hintId = generateUuid('hint')
const errorId = generateUuid('error')

provide(FormFieldKey, reactive({
    get inputId() { return inputId.value },
    get required() { return props.required },
    get grouped() { return props.group },
    setInputId(id: string) { inputId.value = id },
    get describedBy(): string | undefined {
        return [props.hint ? hintId : '', props.error ? errorId : ''].filter(Boolean).join(' ') || undefined
    },
    get hasError(): boolean {
        return props.invalid || !!props.error
    }
}) as FormFieldContext)
</script>
