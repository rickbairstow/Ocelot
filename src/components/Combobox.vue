<template>
    <div ref="root">
        <Label
            v-if="label && !formField"
            :for="effectiveId"
        >{{ label }}</Label>
        <div
            class="flex min-h-10 items-center rounded-xl border bg-white text-gray-900 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 dark:bg-gray-800 dark:text-gray-100 dark:focus-within:ring-offset-gray-950"
            :class="disabled ? 'cursor-not-allowed border-gray-300 dark:border-gray-600' : isInvalid ? 'border-red-600 dark:border-red-400' : 'border-gray-500 dark:border-gray-600'"
        >
            <input
                v-bind="controlAttrs()"
                :id="effectiveId"
                ref="element"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                autocomplete="off"
                class="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-gray-600 disabled:cursor-not-allowed dark:placeholder:text-gray-300"
                role="combobox"
                type="text"
                :aria-activedescendant="isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined"
                :aria-controls="isOpen ? listId : undefined"
                :aria-expanded="isOpen"
                :aria-required="isRequired || undefined"
                :disabled="disabled"
                :placeholder="isOpen ? 'Search options…' : placeholder"
                :value="isOpen ? query : selectedText"
                @blur="onBlur"
                @click="openMenu()"
                @compositionend="onCompositionEnd"
                @compositionstart="onCompositionStart"
                @input="onInput"
                @keydown="onKeydown"
            />
            <button
                v-if="clearable && selectedValues.length && !disabled"
                aria-label="Clear selection"
                class="me-1 rounded p-1 text-gray-600 hover:text-gray-900 focus-visible:outline-2 focus-visible:outline-blue-600 dark:text-gray-300 dark:hover:text-white"
                type="button"
                @click="clearSelection"
                @pointerdown.prevent
            >
                <Icon
                    icon="X"
                    size="sm"
                />
            </button>
            <button
                class="me-2 rounded p-1 text-gray-600 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:cursor-not-allowed dark:text-gray-300"
                tabindex="-1"
                type="button"
                :aria-label="isOpen ? 'Close options' : 'Open options'"
                :disabled="disabled"
                @click="toggleMenu"
                @pointerdown.prevent
            >
                <Icon
                    icon="ChevronDown"
                    size="sm"
                />
            </button>
        </div>
        <!-- Keep submission and native required validation tied to selections, not search text. -->
        <select
            aria-hidden="true"
            class="hidden"
            tabindex="-1"
            :disabled="disabled"
            :form="nativeForm"
            :multiple="multiple"
            :name="name"
            :required="isRequired"
            @invalid.prevent="onNativeInvalid"
        >
            <option
                v-if="!multiple"
                value=""
                :selected="!selectedValues.length"
            />
            <option
                v-for="value in selectedValues"
                :key="value"
                :selected="true"
                :value="value"
            >
                {{ labelFor(value) }}
            </option>
        </select>
        <p
            aria-atomic="true"
            class="sr-only"
            role="status"
        >
            {{ announcement }}
        </p>
        <Teleport to="body">
            <div
                v-if="isOpen"
                :class="isDark ? 'dark' : undefined"
            >
                <div
                    ref="panel"
                    class="fixed z-50 flex flex-col overflow-hidden rounded-xl border border-gray-300 bg-white text-sm text-gray-900 shadow-lg dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    :style="{ visibility: positioned ? 'visible' : 'hidden' }"
                >
                    <ul
                        :id="listId"
                        ref="viewport"
                        class="relative min-h-0 overflow-y-auto overscroll-contain p-1"
                        role="listbox"
                        :aria-busy="loading || undefined"
                        :aria-label="label || 'Options'"
                        :aria-multiselectable="multiple || undefined"
                        @scroll.passive="checkLoadMore"
                    >
                        <li
                            v-for="(option, index) in visibleOptions"
                            :id="optionId(index)"
                            :key="option.value"
                            class="flex min-h-9 cursor-pointer items-center gap-3 rounded-lg px-3 py-2"
                            role="option"
                            tabindex="-1"
                            :aria-disabled="option.disabled || undefined"
                            :aria-selected="selectedValues.includes(option.value)"
                            :class="option.disabled ? 'cursor-not-allowed text-gray-600 dark:text-gray-300' : activeIndex === index ? 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100' : 'hover:bg-gray-100 dark:hover:bg-gray-700'"
                            @click="choose(option)"
                            @keydown.enter.prevent="choose(option)"
                            @keydown.space.prevent="choose(option)"
                            @pointerdown.prevent
                            @pointermove="setActive(index)"
                        >
                            <span class="min-w-0 flex-1 break-words">{{ option.label }}</span>
                            <Icon
                                v-if="selectedValues.includes(option.value)"
                                class="shrink-0"
                                icon="Check"
                                size="sm"
                            />
                        </li>
                    </ul>
                    <div
                        v-if="!visibleOptions.length && !loading"
                        class="grid justify-items-center gap-2 px-4 py-6 text-center"
                    >
                        <Icon
                            class="text-gray-600 dark:text-gray-300"
                            icon="Search"
                        />
                        <p class="font-medium">
                            {{ emptyText }}
                        </p>
                        <p class="text-gray-600 dark:text-gray-300">
                            {{ query ? 'Try a different search.' : 'No options are available.' }}
                        </p>
                    </div>
                    <p
                        v-if="loading"
                        class="flex shrink-0 items-center justify-center gap-2 px-4 py-3 text-gray-600 dark:text-gray-300"
                    >
                        <Icon
                            class="animate-spin motion-reduce:animate-none"
                            icon="Loader2"
                            size="sm"
                        />
                        {{ loadingText }}
                    </p>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script setup lang="ts">
import { autoUpdate, computePosition, flip, offset, shift, size } from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, useAttrs, watch } from 'vue'
import Icon from '@Components/Icon.vue'
import Label from '@Components/Label.vue'
import { useFormControl } from '@Composables/useFormField'
import { generateUuid } from '@Utils/uuid'

defineOptions({ inheritAttrs: false })

export interface ComboboxOption {
    value: string
    label: string
    disabled?: boolean
}

export interface ComboboxLoadMoreEvent {
    search: string
}

interface Props {
    options: ComboboxOption[]
    modelValue?: string | string[] | null
    selectedOptions?: ComboboxOption[]
    mode?: 'local' | 'remote'
    multiple?: boolean
    label?: string
    name?: string
    id?: string
    placeholder?: string
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    clearable?: boolean
    loading?: boolean
    hasMore?: boolean
    loadMoreThreshold?: number
    searchDelay?: number
    maxHeight?: number | 'viewport'
    placement?: Placement
    emptyText?: string
    loadingText?: string
}

const props = withDefaults(defineProps<Props>(), {
    modelValue: null,
    selectedOptions: () => [],
    mode: 'local',
    multiple: false,
    label: undefined,
    name: undefined,
    id: undefined,
    placeholder: 'Select an option…',
    disabled: false,
    invalid: false,
    required: false,
    clearable: true,
    loading: false,
    hasMore: false,
    loadMoreThreshold: 1,
    searchDelay: 250,
    maxHeight: 400,
    placement: 'bottom-start',
    emptyText: 'No results found',
    loadingText: 'Loading options…'
})

const emit = defineEmits<{
    'update:modelValue': [value: string | string[] | null]
    change: [value: string | string[] | null]
    search: [query: string]
    'load-more': [event: ComboboxLoadMoreEvent]
    open: []
    close: []
}>()

const attrs = useAttrs()
const nativeForm = computed(() => attrs.form as string | undefined)
const { formField, effectiveId, isInvalid, isRequired, controlAttrs, element, focus } = useFormControl<HTMLInputElement>(props, generateUuid('combobox'))
const listId = generateUuid('combobox-list')
const root = ref<HTMLElement | null>(null)
const panel = ref<HTMLElement | null>(null)
const viewport = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const isDark = ref(false)
const positioned = ref(false)
const query = ref('')
const activeIndex = ref(-1)
const selectedLabels = ref(new Map<string, string>())
let cleanupPosition: (() => void) | undefined
let themeObserver: MutationObserver | undefined
let searchTimer: ReturnType<typeof setTimeout> | undefined
let composing = false
let requestedMore = false
let waitingForSearch = false

const selectedValues = computed(() => Array.isArray(props.modelValue)
    ? (props.multiple ? [...new Set(props.modelValue)] : props.modelValue.slice(0, 1))
    : props.modelValue === null ? [] : [props.modelValue])
const visibleOptions = computed(() => props.mode === 'remote'
    ? props.options
    : props.options.filter(option => option.label.toLocaleLowerCase().includes(query.value.trim().toLocaleLowerCase())))
const labelFor = (value: string) => selectedLabels.value.get(value) ?? value
const selectedText = computed(() => selectedValues.value.map(labelFor).join(', '))
const announcement = computed(() => !isOpen.value ? '' : props.loading ? props.loadingText
    : `${visibleOptions.value.length} ${visibleOptions.value.length === 1 ? 'result' : 'results'} available.${props.multiple ? ` ${selectedValues.value.length} selected.` : ''}`)
const optionId = (index: number) => `${listId}-${index}`

watch([() => props.options, () => props.selectedOptions, selectedValues], () => {
    const available = new Map([...props.selectedOptions, ...props.options].map(option => [option.value, option.label]))
    selectedLabels.value = new Map(selectedValues.value.map(value => [value, available.get(value) ?? selectedLabels.value.get(value) ?? value]))
}, { deep: true, immediate: true })

function updateModel(value: string | string[] | null) {
    emit('update:modelValue', value)
    emit('change', value)
}

function choose(option: ComboboxOption) {
    if (option.disabled || props.disabled) return
    selectedLabels.value.set(option.value, option.label)
    if (props.multiple) {
        updateModel(selectedValues.value.includes(option.value)
            ? selectedValues.value.filter(value => value !== option.value)
            : [...selectedValues.value, option.value])
    } else {
        updateModel(option.value)
        closeMenu()
    }
    focus()
}

function clearSelection() {
    updateModel(props.multiple ? [] : null)
    query.value = ''
    focus()
}

function toggleMenu() {
    focus()
    if (isOpen.value) closeMenu()
    else void openMenu()
}

function scheduleSearch() {
    clearTimeout(searchTimer)
    if (!isOpen.value || composing) return
    if (props.mode === 'local') {
        emit('search', query.value)
        return
    }
    waitingForSearch = true
    searchTimer = setTimeout(() => {
        emit('search', query.value)
    }, Math.max(0, props.searchDelay))
}

function checkLoadMore() {
    const list = viewport.value
    if (!isOpen.value || !positioned.value || !list || !props.hasMore || props.loading || requestedMore || waitingForSearch) return
    const threshold = Number.isFinite(props.loadMoreThreshold) ? Math.max(0, props.loadMoreThreshold) : 1
    if (list.clientHeight > 0 && list.scrollHeight - list.scrollTop - list.clientHeight <= list.clientHeight * threshold) {
        requestMore()
    }
}

function requestMore() {
    if (!isOpen.value || !props.hasMore || props.loading || requestedMore || waitingForSearch) return
    requestedMore = true
    emit('load-more', { search: query.value })
}

function retryLoadMore() {
    requestedMore = false
    waitingForSearch = false
    requestMore()
}

async function updatePosition() {
    const anchor = root.value?.querySelector('input')?.parentElement
    const popup = panel.value
    if (!anchor || !popup) return
    const result = await computePosition(anchor, popup, {
        strategy: 'fixed',
        placement: props.placement,
        middleware: [offset(4), flip({ padding: 8 }), shift({ padding: 8 }), size({
            padding: 8,
            apply({ availableHeight, availableWidth, rects, elements }) {
                const limit = props.maxHeight === 'viewport' ? availableHeight : Math.max(80, props.maxHeight)
                Object.assign(elements.floating.style, {
                    width: `${Math.max(0, Math.min(rects.reference.width, availableWidth))}px`,
                    maxHeight: `${Math.max(0, Math.min(limit, availableHeight))}px`
                })
            }
        })]
    })
    if (panel.value !== popup || !isOpen.value) return
    Object.assign(popup.style, { left: `${result.x}px`, top: `${result.y}px` })
    const firstPosition = !positioned.value
    positioned.value = true
    if (firstPosition) await scrollActiveIntoView()
    checkLoadMore()
}

async function openMenu() {
    if (props.disabled || isOpen.value) return
    isOpen.value = true
    positioned.value = false
    activeIndex.value = -1
    waitingForSearch = false
    emit('open')
    if (props.mode === 'remote') scheduleSearch()
    await nextTick()
    const anchor = element.value?.parentElement
    if (isOpen.value && anchor && panel.value) cleanupPosition = autoUpdate(anchor, panel.value, () => { void updatePosition() })
}

function closeMenu() {
    if (!isOpen.value) return
    isOpen.value = false
    query.value = ''
    activeIndex.value = -1
    clearTimeout(searchTimer)
    cleanupPosition?.()
    cleanupPosition = undefined
    emit('close')
}

function setActive(index: number) {
    if (!visibleOptions.value[index]?.disabled) activeIndex.value = index
}

function onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value
    void openMenu()
    query.value = value
}

function onCompositionStart() {
    composing = true
    clearTimeout(searchTimer)
}

function onCompositionEnd() {
    composing = false
    scheduleSearch()
}

function onKeydown(event: KeyboardEvent) {
    if (event.isComposing || composing) return
    if (event.key === 'Escape' && isOpen.value) {
        event.preventDefault()
        event.stopPropagation()
        closeMenu()
    } else if (event.key === 'Tab') closeMenu()
    else if (event.altKey && event.key === 'ArrowUp') {
        event.preventDefault()
        closeMenu()
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        void openMenu()
        const direction = event.key === 'ArrowDown' ? 1 : -1
        let index = activeIndex.value < 0 ? (direction === 1 ? -1 : visibleOptions.value.length) : activeIndex.value
        do { index += direction } while (visibleOptions.value[index]?.disabled)
        if (index >= 0 && index < visibleOptions.value.length) activeIndex.value = index
    } else if (isOpen.value && activeIndex.value >= 0 && (event.key === 'Home' || event.key === 'End')) {
        event.preventDefault()
        const options = visibleOptions.value.map((option, index) => ({ option, index })).filter(({ option }) => !option.disabled)
        activeIndex.value = (event.key === 'Home' ? options[0] : options.at(-1))?.index ?? -1
    } else if (event.key === 'Enter' && isOpen.value) {
        event.preventDefault()
        const option = visibleOptions.value[activeIndex.value]
        if (option) choose(option)
    }
}

function inside(target: EventTarget | null) {
    return target instanceof Node && (root.value?.contains(target) || panel.value?.contains(target))
}

function onBlur(event: FocusEvent) {
    if (!inside(event.relatedTarget)) closeMenu()
}

function onOutsidePointer(event: PointerEvent) {
    if (!inside(event.target)) closeMenu()
}

function onNativeInvalid() {
    focus()
    void openMenu()
}

watch(query, () => {
    activeIndex.value = -1
    requestedMore = false
    scheduleSearch()
    if (viewport.value) viewport.value.scrollTop = 0
})
watch(visibleOptions, (next, previous) => {
    const value = previous?.[activeIndex.value]?.value
    activeIndex.value = value === undefined ? -1 : next.findIndex(option => option.value === value && !option.disabled)
})
watch([() => props.options, () => props.options.length], async () => {
    requestedMore = false
    waitingForSearch = false
    await nextTick()
    checkLoadMore()
})
watch(() => props.loading, async (loading, previous) => {
    if (!loading && previous) {
        waitingForSearch = false
        await nextTick()
        checkLoadMore()
    }
})
watch([() => props.hasMore, () => props.maxHeight, () => props.placement], () => {
    if (isOpen.value) void updatePosition()
})
watch(() => props.disabled, (disabled) => { if (disabled) closeMenu() })
watch(() => props.mode, () => {
    requestedMore = false
    waitingForSearch = false
    scheduleSearch()
})
async function scrollActiveIntoView() {
    await nextTick()
    if (!positioned.value) return
    const list = viewport.value
    const option = list?.children[activeIndex.value] as HTMLElement | undefined
    if (!list || !option) return
    if (option.offsetTop < list.scrollTop) list.scrollTop = option.offsetTop
    else if (option.offsetTop + option.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = option.offsetTop + option.offsetHeight - list.clientHeight
}
watch(activeIndex, scrollActiveIntoView)

onMounted(() => {
    document.addEventListener('pointerdown', onOutsidePointer, true)
    const updateTheme = () => { isDark.value = Boolean(root.value?.closest('.dark')) }
    updateTheme()
    themeObserver = new MutationObserver(updateTheme)
    for (let ancestor = root.value; ancestor; ancestor = ancestor.parentElement) {
        themeObserver.observe(ancestor, { attributes: true, attributeFilter: ['class'] })
    }
})
onBeforeUnmount(() => {
    clearTimeout(searchTimer)
    cleanupPosition?.()
    themeObserver?.disconnect()
    document.removeEventListener('pointerdown', onOutsidePointer, true)
})

defineExpose({ element, focus, open: () => { focus(); void openMenu() }, close: closeMenu, isOpen, retryLoadMore })
</script>
