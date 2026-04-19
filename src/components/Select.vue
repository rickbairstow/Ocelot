<template>
    <div>
        <Label
            v-if="label && !formField"
            :for="effectiveId"
        >
            {{ label }}
        </Label>
        <div class="relative">
            <select
                :id="effectiveId"
                class="oui-select w-full appearance-none rounded-xl border bg-white pe-9 ps-3 py-2 text-sm transition-[border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-800"
                :aria-describedby="formField?.describedBy || undefined"
                :aria-invalid="formField?.hasError ? 'true' : undefined"
                :class="stateClass"
                :disabled="disabled"
                :multiple="multiple"
                :name="name"
                :required="required || undefined"
                :value="modelValue"
                @change="onChange"
            >
                <option
                    v-if="placeholder"
                    disabled
                    value=""
                >
                    {{ placeholder }}
                </option>
                <option
                    v-for="opt in normalizedOptions"
                    :key="opt.value"
                    :disabled="opt.disabled"
                    :value="opt.value"
                >
                    {{ opt.label }}
                </option>
            </select>
            <!-- Custom chevron — hidden when ::picker is supported -->
            <div
                aria-hidden="true"
                class="oui-select-chevron pointer-events-none absolute inset-y-0 end-3 flex items-center"
            >
                <Icon
                    class="text-gray-400"
                    icon="ChevronDown"
                    size="sm"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Label from '@Components/Label.vue'
import Icon from '@Components/Icon.vue'
import { generateUuid } from '@Utils/uuid'
import { useFormField } from '@Composables/useFormField'

type SelectOption = string | { value: string; label: string; disabled?: boolean }

interface NormalizedOption {
    value: string
    label: string
    disabled: boolean
}

interface Props {
    modelValue: string | string[]
    name: string
    options: SelectOption[]
    label?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    multiple?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    label: undefined,
    placeholder: undefined,
    disabled: false,
    required: false,
    multiple: false
})

const emit = defineEmits<{
    'update:modelValue': [value: string | string[]]
    change: [value: string | string[]]
}>()

const uuid = generateUuid('select')
const formField = useFormField()
const effectiveId = formField?.inputId ?? uuid

const normalizedOptions = computed((): NormalizedOption[] =>
    props.options.map(opt =>
        typeof opt === 'string'
            ? { value: opt, label: opt, disabled: false }
            : { value: opt.value, label: opt.label, disabled: opt.disabled ?? false }
    )
)

const stateClass = computed(() =>
    props.disabled
        ? 'border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400'
        : 'border-gray-500 text-gray-900 dark:border-gray-600 dark:text-gray-100'
)

const onChange = (e: Event) => {
    const select = e.target as HTMLSelectElement
    const value = props.multiple
        ? Array.from(select.selectedOptions).map(o => o.value)
        : select.value
    emit('update:modelValue', value)
    emit('change', value)
}
</script>

<style scoped>
/* Progressive enhancement: rounded dropdown panel in supporting browsers (Chrome 130+) */
@supports (appearance: base-select) {
    .oui-select {
        appearance: base-select;
    }

    .oui-select-chevron {
        display: none;
    }

    .oui-select::picker(select) {
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        overflow: hidden;
        padding: 0.25rem;
    }
}
</style>
