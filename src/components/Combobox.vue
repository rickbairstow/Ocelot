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
                <template v-for="(item, index) in filteredOptions">
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
import { computed, onMounted, onDestroyed, ref, watch } from 'vue'
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

const breakpoints = ref({
    sm: 640
})

const currentOptionsLength = ref(0)
const floatingStyles = ref({})
const initialMaxHeight = ref(0)
const isOpen = ref(false)
const search = ref('')
const selectedValue = ref([])

// Define refs
const inputContainer = ref(null)
const optionsContainer = ref(null)
const loadMoreButton = ref(null)

onMounted(() => {
    // Sets the current options length, this helps us know when more options have been loaded from the parent.
    this.currentOptionsLength = this.options?.length
})

/**
 * Returns filtered options based upon the provided options and the user's search term. Covering both singular
 * and grouped options.
 * @returns {Array} - returns an array of options.
 */
const filteredOptions = computed(() => {
    if (!props.options) return []
    if (!search.value) return props.options

    const searchTerm = search.value?.trim().toLowerCase()

    return props.options
        ?.map((item) => {
            // Grouped
            if (item.group) {
                const filteredGroupOptions = item.options.filter((option) =>
                    option.text.toLowerCase().includes(searchTerm)
                )
                return filteredGroupOptions.length
                    ? { group: item.group, options: filteredGroupOptions }
                    : null
            }

            // Single
            if (item.text.toLowerCase().includes(searchTerm)) return item
        })
        ?.filter(Boolean)
})

/**
 * Centralises the options ID for use in multiple places.
 * @returns {string}
 */
const optionsId = computed(() => {
    return `${props.id}_options`
})

/**
 * Calculates the max viewport height for the dropdown, based upon the small breakpoint.
 * @returns {number}
 */
const viewportMaxHeight = computed(() => {
    return window.innerWidth < breakpoints.value?.sm ? window.innerHeight : 200
})

/**
 * Calculates the text to display as placeholder on the input, providing the user with feedback on the current
 * selection. For multiselects the text is truncated by using "x options selected".
 * @returns {string|null}
 */
const displayedPlaceholder = computed(() => {
    const allOptions =
        props.options?.flatMap((item) => (item.group ? item.options : item)) ||
        []
    const selectedCount = selectedValue.value?.length || 0

    if (this.multiple && selectedCount) {
        const pluralisation = selectedCount > 1 ? 's' : ''
        return selectedCount === allOptions.length
            ? 'All options selected'
            : `${selectedCount} option${pluralisation} selected`
    }

    if (selectedCount) {
        const selectedOption = allOptions.find(
            (option) => option.value === selectedValue.value?.[0]
        )
        return selectedOption?.text || props.placeholder
    }

    return props.placeholder || null
})

/**
 * Collates aria language strings into one computed object.
 * @returns {{clearSelection: string, listDescription: string, inputLabel: string, instructions: string}}
 */
const ariaLang = computed(() => {
    const controls = `Use the arrow keys to navigate, and press Enter or Space to select ${props.multiple ? 'one or more options' : 'an option'}.`
    const searchHelp = props.searchable ? 'Type to search, ' : ''
    const instructions = `Press Enter to open the list of options. ${searchHelp}${controls}`

    const selectedText = selectedText.value ? `${selectedText.value}.` : ''
    const inputLabel = props.disabled
        ? `${selectedText} Select is disabled.`
        : `${selectedText} ${instructions}`

    return {
        clearSelection: 'Clear selection',
        listDescription: controls,
        inputLabel,
        instructions: props.disabled ? '' : instructions // Only include instructions if not disabled
    }
})

/**
 * ASSISTIVE TECH ONLY
 * Calculates text to announce for assistive tech when selecting or deselecting values. This does not output
 * visually, it is read out when using screen readers.
 * @returns { string }
 */
const selectedAssistiveText = computed(() => {
    const selectedText = props.options
        ?.filter((option) => selectedValue.value?.includes(option.value))
        .map((option) => option.text)
        .join(', ')

    return selectedText
        ? `Selected options: ${selectedText}`
        : 'No options selected.'
})

/**
 * Clears the selected values and emits to the parent. This lets us provide a means to "reset" selected values
 * to empty if we need to deselect.
 */
const clearSelection = () => {
    emit('input', props.multiple ? [] : null)
    selectedValue.value = []

    closeOptions()
    focusInput()
}

/**
 * Closes the options, resets related states, and cleans up event listeners.
 * @param { boolean } [focus=false] - Sets if focus should return to the input when closing.
 */
const closeOptions = (focus = false) => {
    if (!isOpen.value || props.disabled) return
    isOpen.value = false

    if (focus) focusInput()

    search.value = ''
    initialMaxHeight.value = 0
    document.removeEventListener('keydown', handleKeyDown)
    document.removeEventListener('mousedown', handleClickOutside)
}

/**
 * Triggers focus on the inputContainer's input element.
 */
const focusInput = () => {
    inputContainer.value?.querySelector('input')?.focus()
}

/**
 * Handles clicking outside the select component and triggers close.
 * @param { MouseEvent } event
 * TODO
 */
const handleClickOutside = (event) => {
    const container = this.$el
    if (!container.contains(event.target)) closeOptions()
}

/**
 * Handles keyboard navigation and controls.
 * Implements arrow key navigation, enter/space for selection, and tab to exit focus.
 * @param { KeyboardEvent } event
 */
const handleKeyDown = (event) => {
    if (!isOpen.value) return

    const flatFilteredOptions = filteredOptions.value?.flatMap((option) =>
        option.group ? option.options : option
    )
    const options = Array.from(
        optionsContainer.value?.querySelectorAll('.select-options-item')
    )
    const loadMoreButtonEl = loadMoreButton.value
    const navigableElements = [...options, loadMoreButton].filter(Boolean)

    const focusedIndex = navigableElements.indexOf(document.activeElement)

    if (event.key === 'ArrowDown') {
        event.preventDefault() // Stops the element scrolling with arrow keys
        const nextIndex =
            focusedIndex === -1
                ? 0
                : (focusedIndex + 1) % navigableElements.length
        navigableElements[nextIndex]?.focus()
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault() // Stops the element scrolling with arrow keys
        const prevIndex =
            focusedIndex === -1
                ? navigableElements.length - 1
                : (focusedIndex - 1 + navigableElements.length) %
                  navigableElements.length
        navigableElements[prevIndex]?.focus()
    }

    if (
        event.key === 'Enter' ||
        (event.key === ' ' &&
            document.activeElement !==
                inputContainer.value?.querySelector('input'))
    ) {
        event.preventDefault()

        if (document.activeElement) {
            const isOption = document.activeElement?.classList.contains(
                'select-options-item'
            )
            const isLoadMore = document.activeElement === loadMoreButtonEl

            if (isOption) {
                const optionIndex = options.indexOf(document.activeElement)
                const selectedOption = flatFilteredOptions?.[optionIndex]

                if (selectedOption) this.setSelected(selectedOption)
            }

            // Trigger load more
            if (isLoadMore) requestMoreOptions()
        }
    }

    // Trigger close when tabbing away from the options.
    if (event.key === 'Tab') {
        closeOptions()
    }
}

/**
 * Initialises FloatingUi and adapts positioning automatically.
 */
const initAutoPositioning = () => {
    const inputContainerEl = inputContainer.value
    const optionsContainerEl = optionsContainer.value

    if (!inputContainerEl || !optionsContainerEl) return

    autoUpdate(inputContainerEl, optionsContainerEl, () => {
        computePosition(inputContainerEl, optionsContainerEl, {
            placement: 'bottom-start',
            middleware: [
                offset(1),
                flip(),
                shift(),
                size({
                    apply: ({ availableHeight, elements }) => {
                        const maxHeight = Math.min(
                            availableHeight,
                            viewportMaxHeight.value
                        )
                        Object.assign(elements.floating.style, {
                            maxHeight: `${maxHeight}px`,
                            overflowY: 'auto',
                            width: '100%'
                        })
                    }
                })
            ]
        }).then(({ x, y }) => {
            floatingStyles.value = {
                position: 'absolute',
                top: `${y}px`,
                left: `${x}px`
            }
        })
    })
}

/**
 * Checks if the given option is selected.
 * @param {string|number} value
 * @returns {boolean}
 */
const isOptionSelected = (value) => {
    return !!selectedValue.value?.includes(value)
}

/**
 * Opens the options dropdown and runs initial positioning.
 * @param { boolean } [focus=false] - Focuses on the first enabled option when opening.
 * @returns {Promise<void>}
 */
const openOptions = (focus = false) => {
    if (isOpen.value || props.disabled) return

    isOpen.value = true
    initialMaxHeight.value = viewportMaxHeight.value
    initAutoPositioning()

    if (focus) {
        new Promise((resolve) => {
            requestAnimationFrame(resolve)
        }).then(() => {
            const options = Array.from(
                optionsContainer.value?.querySelectorAll('.select-options-item')
            )
            for (let i = 0; i < options.length; i++) {
                const option = options[i]
                if (option.getAttribute('aria-disabled') !== 'true') {
                    option.focus()
                    break
                }
            }
        })
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
}

/**
 * Emits a "load-more-options" event to the parent, this puts responsibility of loading options on the
 * parent, including the provision of loading state.
 */
const requestMoreOptions = () => {
    emit('load-more-options')
}

/**
 * Sets the initial selected values that are passed down from the parent via the watcher. Handling both
 * grouped (multiselect) and ungrouped options.
 * @param {Array|string|number} newValue - the selected values.
 */
const setInitialSelected = (newValue) => {
    const values = Array.isArray(newValue) ? newValue : [newValue]

    const flattenedOptions = props.options?.flatMap((option) =>
        option.group ? option.options : option
    )

    selectedValue.value = flattenedOptions
        ?.filter((option) => values.includes(option.value))
        .map((option) => option.value)
        .reduce((unique, value) => {
            if (!unique.includes(value)) unique.push(value)
            return unique
        }, [])
}

/**
 * Manages selection and emits the updated value(s) to the parent. Emits an array of values for multiple select
 * or single value for single select - similar to Vue's default behaviour.
 * @param {Object} option - The selected option object.
 */
const setSelected = (option) => {
    if (option.disabled) return

    const newValue = option.value

    if (props.multiple) {
        selectedValue.value = selectedValue.value?.includes(newValue)
            ? selectedValue.value.filter((val) => val !== newValue)
            : (selectedValue.value = [...selectedValue.value, newValue])
    } else {
        selectedValue.value = [newValue]
        closeOptions(true)
    }

    emit('input', props.multiple ? selectedValue.value : newValue)
}

/**
 * Toggle options - this is used specifically for when search is disabled, to provide a way to toggle.
 */
const toggleOptions = () => {
    if (props.disabled) return

    isOpen.value ? closeOptions() : openOptions()
}

/**
 * Abstracted logic to calculate what element we need to focus on when loading more options.
 * @returns {*|null}
 */
const calculateFocusTarget = () => {
    const optionsContainer = optionsContainer.value
    if (!optionsContainer) return null

    const allOptions = Array.from(
        optionsContainer?.querySelectorAll('.select-options-item')
    )
    return allOptions.length > 0 ? allOptions[allOptions.length - 1] : null
}

/**
 * Handles external option updates, ie load more, managing focus, tracking option length, and resetting the loading state.
 * @param {Array} updatedOptions
 */
watch(
    () => props.options,
    (updatedOptions) => {
        if (currentOptionsLength.value !== updatedOptions?.length) {
            const focusTarget = calculateFocusTarget()
            if (focusTarget) focusTarget?.focus()
        }
        currentOptionsLength.value = updatedOptions.length
    }
)

/**
 * Open the options when the user starts typing.
 * @param newValue
 */
watch(
    () => search.value,
    (newValue) => {
        if (newValue && !isOpen.value && !props.disabled) openOptions()
    }
)

/**
 * Tracks changes to values passed in from the parent, and updates the selected values.
 */
watch(
    () => value,
    (newValue) => {
        setInitialSelected(newValue)
    }
)

/**
 * Clean up event listeners.
 */
onDestroyed(() => {
    document.removeEventListener('mousedown', this.handleClickOutside)
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
