<template>
    <div
        class="select-container"
        @keydown.esc="closeOptions(true)"
    >
        <!-- Input / Search -->
        <div
            ref="inputContainer"
            class="select-input-container"
            :class="{
                'select-input-container--disabled': disabled,
                'select-input-container--wide': wide
            }"
        >
            <input
                :id="id"
                v-model="search"
                aria-haspopup="listbox"
                autocomplete="off"
                class="select-input-input"
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
                class="select-input-clear"
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
            class="select-options-container"
            role="listbox"
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
                            class="select-options-group-header"
                            role="presentation"
                            :aria-label="`Group: ${item.group}`"
                        >
                            {{ item.group }}
                        </div>

                        <ul
                            :key="`group-options-${item.group}`"
                            class="select-options-list"
                            role="group"
                            :aria-labelledby="`select_group_${index}`"
                        >
                            <li
                                v-for="option in item.options"
                                :key="option.value"
                                class="select-options-item"
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
                                    aria-hidden="true"
                                    class="select-options-item--check"
                                >
                                    TICK
                                </div>
                            </li>
                        </ul>
                    </template>
                </template>

                <!-- Ungrouped options -->
                <ul
                    v-if="filteredOptions.some((item) => !item.group)"
                    :key="'ungrouped-options'"
                    class="select-options-list"
                >
                    <li
                        v-for="(item, index) in filteredOptions.filter(
                            (option) => !option.group
                        )"
                        :key="item.value || `option-${index}`"
                        class="select-options-item"
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
                            aria-hidden="true"
                            class="select-options-item--check"
                        >
                            TICK
                        </div>
                    </li>
                </ul>

                <!-- Load more options -->
                <button
                    v-if="hasMoreOptions"
                    ref="loadMoreButton"
                    class="select-options-load-more"
                    tabindex="0"
                    type="button"
                    :aria-disabled="loading"
                    :class="{ 'select-options-load-more--disabled': loading }"
                    @click="requestMoreOptions()"
                >
                    {{ loading ? 'Loading...' : 'Load more options' }}
                </button>
            </template>

            <!-- No options feedback -->
            <p
                v-else
                aria-live="polite"
                class="select-options-none"
            >
                No options found.
            </p>
        </div>

        <!-- Assistive feedback for selected options -->
        <div
            v-if="!disabled && selectedAssistiveText"
            :id="`${id}_selected_values`"
            aria-live="polite"
            class="select-sr-only"
        >
            {{ selectedAssistiveText }}
        </div>

        <!-- Assistive feedback for instructions -->
        <div
            id="id_instructions"
            class="select-sr-only"
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
    clearable: {
        default: false,
        type: Boolean
    },
    disabled: {
        default: false,
        type: Boolean
    },
    id: {
        required: true,
        type: String
    },
    hasMoreOptions: {
        default: false,
        type: Boolean
    },
    loading: {
        default: false,
        type: Boolean
    },
    multiple: {
        default: false,
        type: Boolean
    },
    options: {
        default: () => [],
        type: Array,
        validator: (value) => {
            // Custom validator to check that the data structure contains text and value keys, for both single and grouped options.
            if (!value) return false

            const isValid = value.every((item) =>
                item.group
                    ? typeof item.group === 'string' &&
                      Array.isArray(item.options) &&
                      item.options.every(
                          (option) => option?.text && option?.value
                      )
                    : item?.text && item?.value
            )

            // Throw a custom error to give better context, instead of Vue's limited "invalid prop" error.
            if (!isValid) {
                throw new Error(
                    'Invalid options: Each item must be an option with "text" and "value", or a group with "label" and "options".\n' +
                        JSON.stringify(value, null, 2)
                )
            }

            return isValid
        }
    },
    placeholder: {
        type: String,
        default: 'Select an option.'
    },
    searchable: {
        default: true,
        type: Boolean
    },
    wide: {
        default: false,
        type: Boolean
    },
    value: {
        type: [String, Number, Array],
        default: null
    }
})

const emit = defineEmits(['input', 'load-more-options'])

// Reactive state
const isOpen = ref(false)
const search = ref('')
const selectedValue = ref([])
const floatingStyles = ref({})
const initialMaxHeight = ref(200)

// Refs for DOM elements
const inputContainer = ref(null)
const optionsContainer = ref(null)
const loadMoreButton = ref(null)

// Computed properties
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

// Methods
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

// Watchers
watch(
    () => props.value,
    (newValue) => {
        selectedValue.value = Array.isArray(newValue) ? newValue : [newValue]
    }
)

// Lifecycle hooks
onMounted(() => {
    selectedValue.value = Array.isArray(props.value)
        ? props.value
        : [props.value]
})
onBeforeUnmount(() => {
    document.removeEventListener('mousedown', closeOptions)
})
</script>

<style>
.select-container {
    font-size: 16px; /* reset */
    position: relative;
}

.select-input-container {
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
    display: flex;
    height: 40px;
    max-width: 100%;
    overflow: hidden;
    width: 100%;
}

.select-input-container--disabled {
    background: #eee;
    cursor: not-allowed;
    pointer-events: none;
}

.select-input-input {
    all: unset; /* reset */

    box-sizing: border-box;
    display: block;
    height: 100%;
    min-width: 0;
    padding: 0 12px;
    width: 100%;
}

.select-input-input:placeholder-shown {
    text-overflow: ellipsis;
}

.select-input-clear {
    all: unset; /* reset */

    align-items: center;
    background: transparent;
    box-sizing: border-box;
    cursor: pointer;
    display: flex;
    height: 100%;
    justify-content: center;
    width: 44px;
}

.select-input-clear:hover,
.select-input-clear:focus {
    background: #eee;
}

.select-options-container {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-shadow:
        0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
    color: #000;
    position: relative;
    transition:
        transform 0.2s ease,
        opacity 0.2s ease;
    z-index: 10;
}

.select-options-list {
    list-style: none;
    padding: 0;
    margin: 0;
}

.select-options-group-header {
    font-weight: 700;
    padding: 8px 16px;
    background-color: #f9f9f9;
    border-bottom: 1px solid #ddd;
}

.select-options-container .select-options-group-header:not(:first-of-type) {
    border-top: 1px solid #ccc;
}

.select-options-item,
.select-options-none {
    margin: 0;
    padding: 8px 16px;
}

.select-options-item {
    cursor: pointer;
    display: flex;
    gap: 8px;
    justify-content: space-between;
}

.select-options-item[aria-disabled='true'],
.select-options-item[aria-disabled='true']:hover,
.select-options-item[aria-disabled='true']:focus {
    background-color: #eee;
    color: #666;
    cursor: not-allowed;
    pointer-events: none;
}

.select-options-item:hover,
.select-options-item:focus,
.select-options-load-more:hover,
.select-options-load-more:focus {
    background-color: #ccc;
}

.select-options-item--check {
    display: none;
}

.select-options-item[aria-selected='true'] .select-options-item--check {
    display: block;
    flex: none;
}

.select-options-load-more {
    all: unset;

    box-sizing: border-box;
    cursor: pointer;
    padding: 8px 16px;
    width: 100%;
}

.select-options-load-more--disabled {
    pointer-events: none;
}

.select-sr-only {
    border: 0;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.select-input-container:focus-within,
.select-input-clear:focus,
.select-options-item:focus,
.select-options-load-more:focus {
    outline: 1px solid;
}
.select-options-item:focus,
.select-options-load-more:focus {
    outline-offset: -1px;
}

@media (min-width: 640px) {
    .select-input-container {
        width: 224px;
    }

    .select-input-container--wide {
        width: 100%;
    }
}
</style>
