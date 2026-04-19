<template>
    <div class="flex flex-col gap-1.5">
        <Label
            v-if="label"
            :for="inputId"
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
        </Label>

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
            v-else-if="hint"
            :id="hintId"
            aria-live="polite"
            class="text-sm text-gray-500 dark:text-gray-400"
        >
            {{ hint }}
        </p>
    </div>
</template>

<script setup lang="ts">
import { reactive, provide } from 'vue'
import Label from '@Components/Label.vue'
import { generateUuid } from '@Utils/uuid'
import { FormFieldKey } from '@Composables/useFormField'
import type { FormFieldContext } from '@Composables/useFormField'

interface Props {
    label?: string
    hint?: string
    error?: string
    required?: boolean
    optional?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: undefined,
    hint: undefined,
    error: undefined,
    required: false,
    optional: false
})

const inputId = generateUuid('field')
const hintId = generateUuid('hint')
const errorId = generateUuid('error')

provide(FormFieldKey, reactive({
    inputId,
    get describedBy(): string | undefined {
        if (props.error) return errorId
        if (props.hint) return hintId
        return undefined
    },
    get hasError(): boolean {
        return !!props.error
    }
}) as FormFieldContext)
</script>
