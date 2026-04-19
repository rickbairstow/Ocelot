<template>
    <div class="flex items-center gap-2">
        <input
            :id="effectiveId"
            ref="inputRef"
            class="size-4 shrink-0 appearance-none rounded border border-gray-300 bg-white cursor-pointer checked:border-transparent checked:bg-blue-600 indeterminate:border-transparent indeterminate:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-blue-500 dark:indeterminate:bg-blue-500"
            type="checkbox"
            :aria-checked="indeterminate ? 'mixed' : undefined"
            :aria-describedby="formField?.describedBy || undefined"
            :aria-invalid="formField?.hasError ? 'true' : undefined"
            :checked="isChecked"
            :disabled="isDisabled"
            :name="effectiveName"
            :required="required || undefined"
            :value="value"
            @change="onChange"
        />
        <Label
            v-if="label"
            class="cursor-pointer select-none font-normal"
            :class="isDisabled ? 'opacity-50 cursor-not-allowed' : ''"
            :for="effectiveId"
        >
            {{ label }}
        </Label>
    </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, ref, watch } from 'vue'
import type { ComputedRef } from 'vue'
import Label from '@Components/Label.vue'
import { generateUuid } from '@Utils/uuid'
import { useFormField } from '@Composables/useFormField'
import type { CheckboxGroupContext } from '@Components/CheckboxGroup.vue'

interface Props {
    modelValue?: boolean
    value?: string
    name?: string
    label?: string
    disabled?: boolean
    required?: boolean
    indeterminate?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    value: undefined,
    name: undefined,
    label: undefined,
    disabled: false,
    required: false,
    indeterminate: false
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
}>()

const uuid = generateUuid('checkbox')
const formField = useFormField()
const effectiveId = formField?.inputId ?? uuid
const inputRef = ref<HTMLInputElement | null>(null)

const groupContext = inject<CheckboxGroupContext>('checkboxGroup', null as unknown as CheckboxGroupContext)

const isInGroup = !!groupContext

const isChecked = computed((): boolean => {
    if (isInGroup) {
        const mv = (groupContext.modelValue as ComputedRef<string[]>).value
        return mv.includes(props.value ?? '')
    }
    return props.modelValue ?? false
})

const isDisabled = computed(() =>
    props.disabled || (isInGroup ? (groupContext.disabled as ComputedRef<boolean>).value : false)
)

const effectiveName = computed(() =>
    isInGroup ? (groupContext.name as ComputedRef<string>).value : props.name
)

onMounted(() => {
    if (inputRef.value) inputRef.value.indeterminate = props.indeterminate ?? false
})

watch(() => props.indeterminate, (val) => {
    if (inputRef.value) inputRef.value.indeterminate = val ?? false
})

const onChange = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked
    if (isInGroup) {
        groupContext.toggle(props.value ?? '')
    } else {
        emit('update:modelValue', checked)
    }
}
</script>

<style scoped>
input[type="checkbox"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}

input[type="checkbox"]:indeterminate {
    background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 16 16'%3e%3cpath stroke='white' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M4 8h8'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}
</style>
