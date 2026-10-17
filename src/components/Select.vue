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
                v-bind="controlAttrs()"
                :id="effectiveId"
                ref="element"
                v-model="selectedValue"
                class="oui-select w-full appearance-none rounded-xl border bg-white ps-3 py-2 text-sm transition-[border-color] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 motion-reduce:transition-none dark:bg-gray-800"
                :class="[stateClass, multiple ? 'pe-3' : 'pe-9']"
                :disabled="disabled"
                :multiple="multiple"
                :name="name"
                :required="isRequired || undefined"
            >
                <option
                    v-if="placeholder && !multiple"
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
                v-if="!multiple"
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
defineOptions({ inheritAttrs: false })
import { computed } from 'vue'
import Label from '@Components/Label.vue'
import Icon from '@Components/Icon.vue'
import { generateUuid } from '@Utils/uuid'
import { useFormControl } from '@Composables/useFormField'

type SelectOption = string | { value: string; label: string; disabled?: boolean }

interface NormalizedOption {
    value: string
    label: string
    disabled: boolean
}

interface Props {
    id?: string
    invalid?: boolean
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
    id: undefined,
    invalid: false,
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
const { formField, effectiveId, isInvalid, isRequired, controlAttrs, element, focus } = useFormControl<HTMLSelectElement>(props, uuid)
defineExpose({ element, focus })

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
        : isInvalid.value
            ? 'border-red-600 text-gray-900 dark:border-red-400 dark:text-gray-100'
            : 'border-gray-500 text-gray-900 dark:border-gray-600 dark:text-gray-100'
)

const selectedValue = computed({
    get: () => props.modelValue,
    set: (value: string | string[]) => {
        emit('update:modelValue', value)
        emit('change', value)
    }
})
</script>

<style scoped>
.oui-select option:disabled {
    background: #fff;
    color: #4b5563;
    cursor: not-allowed;
    opacity: 1;
}

.oui-select option:disabled:checked {
    background: #dbeafe;
    color: #1e3a8a;
}

.dark .oui-select option:disabled {
    background: #1f2937;
    color: #d1d5db;
}

.dark .oui-select option:disabled:checked {
    background: #1e3a8a;
    color: #dbeafe;
}

/* Keep native listboxes and progressively enhance single-select pickers. */
@supports (appearance: base-select) {
    .oui-select:not([multiple]),
    .oui-select:not([multiple])::picker(select) {
        appearance: base-select;
    }

    .oui-select:not([multiple]) + .oui-select-chevron {
        display: none;
    }

    .oui-select:not([multiple])::picker(select) {
        border-radius: 0.75rem;
        border: 1px solid #e5e7eb;
        box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
        max-height: min(20rem, 60vh);
        overflow: auto;
        background: white;
        color: #111827;
        padding: 0.25rem;
    }

    .oui-select option {
        border-radius: 0.375rem;
        padding: 0.5rem 0.75rem;
    }

    .oui-select option:checked {
        background: #dbeafe;
        color: #1e3a8a;
    }

    .oui-select option:focus-visible {
        outline: 2px solid #2563eb;
        outline-offset: -2px;
    }

    .dark .oui-select::picker(select) {
        background: #1f2937;
        border-color: #4b5563;
        color: #f3f4f6;
    }

    .dark .oui-select option:checked {
        background: #1e3a8a;
        color: #dbeafe;
    }
}
</style>
