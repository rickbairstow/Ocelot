<template>
    <div class="flex items-center gap-2">
        <input
            :id="effectiveId"
            class="size-4 shrink-0 appearance-none rounded-full border border-gray-300 bg-white cursor-pointer checked:border-transparent checked:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:checked:bg-blue-500"
            type="radio"
            :aria-describedby="formField?.describedBy || undefined"
            :aria-invalid="formField?.hasError ? 'true' : undefined"
            :checked="isChecked"
            :disabled="isDisabled"
            :name="effectiveName"
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
import { computed, inject } from 'vue'
import type { ComputedRef } from 'vue'
import Label from '@Components/Label.vue'
import { generateUuid } from '@Utils/uuid'
import { useFormField } from '@Composables/useFormField'
import type { RadioGroupContext } from '@Components/RadioGroup.vue'

interface Props {
    value: string
    name?: string
    label?: string
    disabled?: boolean
    modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
    name: undefined,
    label: undefined,
    disabled: false,
    modelValue: undefined
})

const emit = defineEmits<{
    'update:modelValue': [value: string]
}>()

const uuid = generateUuid('radio')
const formField = useFormField()

const groupContext = inject<RadioGroupContext>('radioGroup', null as unknown as RadioGroupContext)
const isInGroup = !!groupContext

const effectiveId = !isInGroup && formField?.inputId ? formField.inputId : uuid

const isChecked = computed((): boolean => {
    if (isInGroup) {
        return (groupContext.modelValue as ComputedRef<string>).value === props.value
    }
    return props.modelValue === props.value
})

const isDisabled = computed(() =>
    props.disabled || (isInGroup ? (groupContext.disabled as ComputedRef<boolean>).value : false)
)

const effectiveName = computed(() =>
    isInGroup ? (groupContext.name as ComputedRef<string>).value : props.name
)

const onChange = () => {
    if (isInGroup) {
        groupContext.select(props.value)
    } else {
        emit('update:modelValue', props.value)
    }
}
</script>

<style scoped>
input[type="radio"]:checked {
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}
</style>
