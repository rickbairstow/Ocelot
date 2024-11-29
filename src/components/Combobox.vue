<template>
    <div
        class="relative"
        @keydown.esc="closeOptions(true)"
    >
        <!-- Input / Search -->
        <div
            ref="inputContainer"
            class="flex items-center border rounded-lg overflow-hidden h-10"
            :class="{
                'bg-gray-200 cursor-not-allowed pointer-events-none': disabled,
                'w-full': wide,
                'w-56': !wide
            }"
        >
            <input
                :id="id"
                v-model="search"
                aria-haspopup="listbox"
                autocomplete="off"
                class="w-full px-3 text-sm focus:outline-none"
                type="text"
                :aria-controls="optionsId"
                :aria-describedby="`${id}_instructions`"
                :aria-expanded="isOpen"
                :aria-label="ariaLang.inputLabel"
                :placeholder="search ? '' : displayedPlaceholder"
                :readonly="!searchable || disabled"
                @click="searchable ? openOptions() : toggleOptions()"
                @keydown.down="openOptions(true)"
                @keydown.enter="openOptions(true)"
                @keydown.space="searchable || openOptions(true)"
            />

            <button
                v-if="clearable && selectedValue.length && !disabled"
                class="h-full w-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 focus:ring focus:ring-gray-300"
                type="button"
                :aria-label="ariaLang.clearSelection"
                @click="clearSelection"
            >
                X
            </button>
        </div>

        <!-- Options list -->
        <div
            v-show="isOpen && !disabled"
            :id="optionsId"
            ref="optionsContainer"
            class="absolute z-10 bg-white border border-gray-300 rounded-lg shadow-md mt-1 w-full max-h-60 overflow-auto"
            role="listbox"
            :style="floatingStyles"
        >
            <ul class="list-none">
                <template v-if="filteredOptions.length > 0">
                    <li
                        v-for="(item, index) in mergedOptions"
                        :key="`option-${index}`"
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        tabindex="!item.group ? 0 : null"
                        :aria-disabled="item.disabled || null"
                        :aria-selected="
                            !item.group && isOptionSelected(item.value)
                                ? 'true'
                                : 'false'
                        "
                        :role="item.group ? 'presentation' : 'option'"
                        @click="!item.group && setSelected(item)"
                    >
                        <span
                            v-if="item.group"
                            class="font-semibold text-sm text-gray-500"
                        >
                            {{ item.group }}
                        </span>
                        <span v-else>
                            {{ item.text }}
                            <span
                                v-if="isOptionSelected(item.value)"
                                class="text-green-500 font-bold"
                            >
                                ✓
                            </span>
                        </span>
                    </li>
                </template>

                <!-- Load more options -->
                <li
                    v-if="hasMoreOptions"
                    role="presentation"
                >
                    <button
                        ref="loadMoreButton"
                        class="w-full text-center py-2 bg-gray-50 hover:bg-gray-100 focus:ring focus:ring-gray-300"
                        type="button"
                        :aria-disabled="loading"
                        @click="requestMoreOptions"
                    >
                        {{ loading ? 'Loading...' : 'Load more options' }}
                    </button>
                </li>
            </ul>

            <!-- No options feedback -->
            <p
                v-else
                aria-live="polite"
                class="p-4 text-center text-sm text-gray-500"
            >
                No options found.
            </p>
        </div>

        <!-- Assistive feedback -->
        <div
            v-if="!disabled && selectedAssistiveText"
            :id="`${id}_selected_values`"
            aria-live="polite"
            class="sr-only"
        >
            {{ selectedAssistiveText }}
        </div>
        <div
            id="id_instructions"
            class="sr-only"
        >
            {{ ariaLang.instructions }}
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import {
    computePosition,
    autoUpdate,
    offset,
    flip,
    shift,
    size
} from '@floating-ui/dom'

const props = defineProps({
    clearable: { default: false, type: Boolean },
    disabled: { default: false, type: Boolean },
    id: { required: true, type: String },
    hasMoreOptions: { default: false, type: Boolean },
    loading: { default: false, type: Boolean },
    multiple: { default: false, type: Boolean },
    options: {
        default: () => [],
        type: Array,
        validator: (value) => {
            if (!value) return false
            return value.every((item) =>
                item.group
                    ? typeof item.group === 'string' &&
                      Array.isArray(item.options) &&
                      item.options.every(
                          (option) => option?.text && option?.value
                      )
                    : item?.text && item?.value
            )
        }
    },
    placeholder: { type: String, default: 'Select an option.' },
    searchable: { default: true, type: Boolean },
    wide: { default: false, type: Boolean },
    value: { type: [String, Number, Array], default: null }
})

const emit = defineEmits(['input', 'load-more-options'])

// Reactive states
const isOpen = ref(false)
const search = ref('')
const selectedValue = ref([])
const floatingStyles = ref({})
const initialMaxHeight = ref(200)

const inputContainer = ref(null)
const optionsContainer = ref(null)
const loadMoreButton = ref(null)

// Computed properties
const optionsId = computed(() => `${props.id}_options`)
const filteredOptions = computed(() => {
    if (!search.value) return props.options
    const searchTerm = search.value.trim().toLowerCase()
    return props.options
        .map((item) => {
            if (item.group) {
                const filteredGroupOptions = item.options.filter((option) =>
                    option.text.toLowerCase().includes(searchTerm)
                )
                return filteredGroupOptions.length
                    ? { group: item.group, options: filteredGroupOptions }
                    : null
            }
            if (item.text.toLowerCase().includes(searchTerm)) return item
        })
        .filter(Boolean)
})
const mergedOptions = computed(() =>
    filteredOptions.value.flatMap((item) =>
        item.group ? [{ group: item.group }, ...item.options] : [item]
    )
)
const displayedPlaceholder = computed(() =>
    selectedValue.value.length
        ? `${selectedValue.value.length} selected`
        : props.placeholder
)
const ariaLang = computed(() => ({
    inputLabel: 'Select an option',
    clearSelection: 'Clear selection',
    instructions: 'Use arrow keys to navigate options'
}))
const selectedAssistiveText = computed(() => {
    const selectedText = props.options
        .flatMap((option) => (option.group ? option.options : [option]))
        .filter((option) => selectedValue.value.includes(option.value))
        .map((option) => option.text)
        .join(', ')
    return selectedText || 'No options selected.'
})

// **isOptionSelected**: Checks if an option is selected
const isOptionSelected = (value) => selectedValue.value.includes(value)

// Methods
const closeOptions = () => (isOpen.value = false)
const openOptions = () => (isOpen.value = true)
const toggleOptions = () => (isOpen.value ? closeOptions() : openOptions())
const clearSelection = () => {
    selectedValue.value = []
    emit('input', props.multiple ? [] : null)
}
const setSelected = (option) => {
    if (option.disabled) return
    if (props.multiple) {
        selectedValue.value = selectedValue.value.includes(option.value)
            ? selectedValue.value.filter((v) => v !== option.value)
            : [...selectedValue.value, option.value]
        emit('input', selectedValue.value)
    } else {
        selectedValue.value = [option.value]
        emit('input', option.value)
        closeOptions()
    }
}
const requestMoreOptions = () => emit('load-more-options')

// Watchers
watch(
    () => props.value,
    (newValue) => {
        selectedValue.value = Array.isArray(newValue) ? newValue : [newValue]
    }
)

onMounted(() => {
    selectedValue.value = Array.isArray(props.value)
        ? props.value
        : [props.value]
})
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', closeOptions)
})
</script>
