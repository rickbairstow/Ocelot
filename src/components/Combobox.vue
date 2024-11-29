<template>
    <div
        class="relative"
        @keydown.esc="closeOptions(true)"
    >
        <!-- Input / Search -->
        <div
            ref="inputContainer"
            class="flex items-center border rounded-md overflow-hidden"
            :class="wide ? 'w-full' : 'w-56'"
            :class="
                disabled
                    ? 'bg-gray-200 pointer-events-none cursor-not-allowed'
                    : ''
            "
        >
            <input
                :id="id"
                v-model="search"
                aria-haspopup="listbox"
                autocomplete="off"
                class="w-full p-2 text-sm focus:outline-none"
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
            class="absolute z-10 bg-white border border-gray-300 rounded-md shadow-md mt-1 w-full"
            :style="{ ...floatingStyles, maxHeight: `${initialMaxHeight}px` }"
        >
            <template v-if="filteredOptions.length > 0">
                <template
                    v-for="(item, index) in filteredOptions"
                    :key="index"
                >
                    <!-- Grouped options -->
                    <template v-if="item.group">
                        <div
                            :key="`select_group_${index}`"
                            class="bg-gray-50 font-semibold p-2 border-b text-sm"
                            role="presentation"
                            :aria-label="`Group: ${item.group}`"
                        >
                            {{ item.group }}
                        </div>

                        <ul
                            :key="`group-options-${item.group}`"
                            class="list-none"
                            role="group"
                            :aria-labelledby="`select_group_${index}`"
                        >
                            <li
                                v-for="option in item.options"
                                :key="option.value"
                                class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                role="option"
                                tabindex="0"
                                :aria-disabled="option.disabled"
                                :aria-label="option.text"
                                :aria-selected="
                                    isOptionSelected(option.value)
                                        ? 'true'
                                        : 'false'
                                "
                                @click="setSelected(option)"
                            >
                                {{ option.text }}
                                <div
                                    v-if="isOptionSelected(option.value)"
                                    aria-hidden="true"
                                    class="text-green-500 font-bold"
                                >
                                    ✓
                                </div>
                            </li>
                        </ul>
                    </template>
                </template>

                <!-- Ungrouped options -->
                <ul
                    v-if="filteredOptions.some((item) => !item.group)"
                    :key="'ungrouped-options'"
                    class="list-none"
                >
                    <li
                        v-for="(item, index) in filteredOptions.filter(
                            (option) => !option.group
                        )"
                        :key="item.value || `option-${index}`"
                        class="px-4 py-2 cursor-pointer hover:bg-gray-100"
                        role="option"
                        tabindex="0"
                        :aria-disabled="item.disabled"
                        :aria-label="item.text"
                        :aria-selected="
                            isOptionSelected(item.value) ? 'true' : 'false'
                        "
                        @click="setSelected(item)"
                    >
                        {{ item.text }}
                        <div
                            v-if="isOptionSelected(item.value)"
                            aria-hidden="true"
                            class="text-green-500 font-bold"
                        >
                            ✓
                        </div>
                    </li>
                </ul>

                <!-- Load more options -->
                <button
                    v-if="hasMoreOptions"
                    ref="loadMoreButton"
                    class="w-full text-center py-2 bg-gray-50 hover:bg-gray-100 focus:ring focus:ring-gray-300"
                    tabindex="0"
                    type="button"
                    :aria-disabled="loading"
                    @click="requestMoreOptions()"
                >
                    {{ loading ? 'Loading...' : 'Load more options' }}
                </button>
            </template>

            <!-- No options feedback -->
            <p
                v-else
                aria-live="polite"
                class="p-4 text-center text-sm text-gray-500"
            >
                No options found.
            </p>
        </div>

        <!-- Assistive feedback for selected options -->
        <div
            v-if="!disabled && selectedAssistiveText"
            :id="`${id}_selected_values`"
            aria-live="polite"
            class="sr-only"
        >
            {{ selectedAssistiveText }}
        </div>

        <!-- Assistive feedback for instructions -->
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

const isOpen = ref(false)
const search = ref('')
const selectedValue = ref([])
const floatingStyles = ref({})
const initialMaxHeight = ref(200)

const inputContainer = ref(null)
const optionsContainer = ref(null)
const loadMoreButton = ref(null)

const optionsId = computed(() => `${props.id}_options`)
const filteredOptions = computed(() => {
    if (!search.value) return props.options
    const searchTerm = search.value.trim().toLowerCase()
    return props.options.filter((option) =>
        option.text.toLowerCase().includes(searchTerm)
    )
})
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
        .filter((option) => selectedValue.value.includes(option.value))
        .map((option) => option.text)
        .join(', ')
    return selectedText || 'No options selected.'
})

const closeOptions = () => {
    isOpen.value = false
}
const openOptions = () => {
    isOpen.value = true
}
const toggleOptions = () => {
    isOpen.value ? closeOptions() : openOptions()
}
const clearSelection = () => {
    selectedValue.value = []
    emit('input', props.multiple ? [] : null)
}
const setSelected = (option) => {
    if (props.multiple) {
        const newValue = selectedValue.value.includes(option.value)
            ? selectedValue.value.filter((v) => v !== option.value)
            : [...selectedValue.value, option.value]
        selectedValue.value = newValue
        emit('input', newValue)
    } else {
        selectedValue.value = [option.value]
        emit('input', option.value)
        closeOptions()
    }
}
const requestMoreOptions = () => emit('load-more-options')

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
