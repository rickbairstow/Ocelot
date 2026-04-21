<template>
    <Teleport :to="portalTarget">
        <Transition
            enter-active-class="transition-opacity duration-150 ease-out motion-reduce:transition-none"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150 ease-in motion-reduce:transition-none"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
            <section
                v-if="isOpen"
                aria-modal="true"
                class="fixed inset-0 z-40 p-4 sm:p-6"
                role="dialog"
                :aria-labelledby="titleId"
                @keydown.esc.prevent="handleClose"
            >
                <Scrim
                    aria-label="Close command palette"
                    class="z-0"
                    @click="handleClose"
                />

                <div
                    class="relative z-10 mx-auto flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-950 shadow-2xl dark:border-gray-800 dark:bg-gray-900 dark:text-gray-50"
                >
                    <div class="border-b border-gray-200 px-4 py-4 dark:border-gray-800 sm:px-5">
                        <div class="flex items-center gap-3">
                            <Icon
                                icon="Search"
                                size="2xl"
                            />

                            <div class="min-w-0 flex-1">
                                <label
                                    :id="titleId"
                                    class="sr-only"
                                    :for="inputId"
                                >
                                    Command palette
                                </label>

                                <input
                                    :id="inputId"
                                    ref="inputRef"
                                    aria-autocomplete="list"
                                    aria-expanded="true"
                                    autocomplete="off"
                                    class="w-full border-none bg-transparent text-base outline-hidden placeholder:text-gray-500 dark:placeholder:text-gray-400 sm:text-lg"
                                    role="combobox"
                                    spellcheck="false"
                                    :aria-activedescendant="activeOptionId"
                                    :aria-controls="listboxId"
                                    :placeholder="placeholder"
                                    :value="query"
                                    @input="query = ($event.target as HTMLInputElement).value"
                                    @keydown="handleInputKeydown"
                                />
                            </div>

                            <kbd class="hidden rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 sm:inline-flex">
                                Esc
                            </kbd>

                            <Button
                                aria-label="Close command palette"
                                color="gray"
                                icon="X"
                                variant="tertiary"
                                @click="handleClose"
                            />
                        </div>
                    </div>

                    <div class="flex items-center justify-between border-b border-gray-200 px-4 py-2 text-xs text-gray-500 dark:border-gray-800 dark:text-gray-400 sm:px-5">
                        <p>{{ filteredCommands.length }} {{ filteredCommands.length === 1 ? 'result' : 'results' }}</p>
                        <p>Arrow keys to navigate, Enter to run</p>
                    </div>

                    <div
                        :id="listboxId"
                        ref="resultsRef"
                        class="max-h-[65vh] overflow-y-auto p-2 sm:p-3"
                        role="listbox"
                    >
                        <div
                            v-for="group in filteredGroups"
                            :key="group.name"
                            class="py-2"
                        >
                            <p class="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500 dark:text-gray-400">
                                {{ group.name }}
                            </p>

                            <div class="space-y-1">
                                <button
                                    v-for="command in group.items"
                                    :id="getOptionId(command.id)"
                                    :key="command.id"
                                    :ref="(el) => setOptionRef(command.id, el as HTMLElement | null)"
                                    class="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors"
                                    role="option"
                                    tabindex="-1"
                                    :aria-selected="activeCommand?.id === command.id"
                                    :class="commandRowClass(command)"
                                    :disabled="command.disabled"
                                    @click="selectCommand(command)"
                                    @mousemove="setActiveCommand(command.id)"
                                >
                                    <div
                                        v-if="command.icon"
                                        class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
                                    >
                                        <Icon
                                            size="xl"
                                            :icon="command.icon"
                                        />
                                    </div>

                                    <div class="min-w-0 flex-1">
                                        <p class="truncate text-sm font-medium sm:text-base">
                                            {{ command.title }}
                                        </p>
                                        <p
                                            v-if="command.description"
                                            class="truncate text-sm text-gray-500 dark:text-gray-400"
                                        >
                                            {{ command.description }}
                                        </p>
                                    </div>

                                    <div class="flex shrink-0 items-center gap-2">
                                        <span
                                            v-if="command.disabled"
                                            class="text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500"
                                        >
                                            Disabled
                                        </span>

                                        <kbd
                                            v-if="command.shortcut"
                                            :id="`${command.id}-shortcut`"
                                            class="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs font-medium text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
                                        >
                                            {{ command.shortcut }}
                                        </kbd>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="filteredGroups.length === 0"
                        class="flex min-h-56 items-center justify-center px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                        role="status"
                    >
                        {{ emptyText }}
                    </div>
                </div>
            </section>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import Button from '@Components/Button.vue'
import Icon from '@Components/Icon.vue'
import Scrim from '@Components/Scrim.vue'
import { useCommandPalette } from '@Composables/useCommandPalette'
import type { CommandPaletteItem } from '@Composables/useCommandPalette'
import useFocusMemory from '@Composables/useFocusMemory'
import { generateUuid } from '@Utils/uuid'

interface Props {
    emptyText?: string
    listenForShortcut?: boolean
    placeholder?: string
    portalTarget?: string
}

const props = withDefaults(defineProps<Props>(), {
    emptyText: 'No commands found.',
    listenForShortcut: true,
    placeholder: 'Search commands…',
    portalTarget: '#portal-target'
})

const inputId = generateUuid('command-palette-input')
const listboxId = generateUuid('command-palette-listbox')
const titleId = generateUuid('command-palette-title')

const inputRef = ref<HTMLInputElement | null>(null)
const optionRefs = ref<Record<string, HTMLElement | null>>({})
const query = ref('')
const resultsRef = ref<HTMLElement | null>(null)

const { close, commands, isOpen, open, toggle } = useCommandPalette()
const { focusTo, returnFocus } = useFocusMemory()

const filteredCommands = computed(() => {
    const normalizedQuery = query.value.trim().toLowerCase()

    if (!normalizedQuery) return commands.value

    return commands.value.filter((command) => {
        const haystack = [
            command.title,
            command.description ?? '',
            command.group ?? '',
            command.shortcut ?? '',
            ...(command.keywords ?? [])
        ].join(' ').toLowerCase()

        return haystack.includes(normalizedQuery)
    })
})

const filteredGroups = computed(() => {
    const grouped = new Map<string, CommandPaletteItem[]>()

    filteredCommands.value.forEach((command) => {
        const groupName = command.group ?? 'Commands'
        const existing = grouped.get(groupName) ?? []
        existing.push(command)
        grouped.set(groupName, existing)
    })

    return Array.from(grouped.entries()).map(([name, items]) => ({ name, items }))
})
const enabledCommands = computed(() => filteredCommands.value.filter((command) => !command.disabled))
const activeIndex = ref(-1)
const activeCommand = computed(() => enabledCommands.value[activeIndex.value] ?? null)
const activeOptionId = computed(() => activeCommand.value ? getOptionId(activeCommand.value.id) : undefined)

const setInitialActiveIndex = (): void => {
    activeIndex.value = enabledCommands.value.length > 0 ? 0 : -1
}

const handleClose = (): void => {
    close()
}

const moveActiveIndex = (direction: 1 | -1): void => {
    if (enabledCommands.value.length === 0) {
        activeIndex.value = -1
        return
    }

    const nextIndex = activeIndex.value === -1
        ? 0
        : (activeIndex.value + direction + enabledCommands.value.length) % enabledCommands.value.length

    activeIndex.value = nextIndex
}

const setActiveCommand = (commandId: string): void => {
    const nextIndex = enabledCommands.value.findIndex((command) => command.id === commandId)
    if (nextIndex !== -1) activeIndex.value = nextIndex
}

const selectCommand = (command: CommandPaletteItem | null): void => {
    if (!command || command.disabled) return
    command.onSelect?.()
    close()
}

const handleInputKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown') {
        event.preventDefault()
        moveActiveIndex(1)
    } else if (event.key === 'ArrowUp') {
        event.preventDefault()
        moveActiveIndex(-1)
    } else if (event.key === 'Enter') {
        if (!activeCommand.value) return
        event.preventDefault()
        selectCommand(activeCommand.value)
    }
}

const getOptionId = (commandId: string): string => `command-palette-option-${commandId}`

const setOptionRef = (commandId: string, element: HTMLElement | null): void => {
    optionRefs.value[commandId] = element
}

const commandRowClass = (command: CommandPaletteItem): string => {
    const isActive = activeCommand.value?.id === command.id

    if (command.disabled) {
        return 'cursor-not-allowed bg-transparent text-gray-400 dark:text-gray-500'
    }

    return isActive
        ? 'bg-blue-50 text-blue-950 dark:bg-blue-950/60 dark:text-blue-100'
        : 'text-gray-900 hover:bg-gray-100 dark:text-gray-100 dark:hover:bg-gray-800'
}

const handleGlobalShortcut = (event: KeyboardEvent): void => {
    if (!props.listenForShortcut) return
    if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'k') return

    event.preventDefault()
    toggle()
}

watch(filteredCommands, () => {
    setInitialActiveIndex()
})

watch(activeCommand, async (command) => {
    if (!command) return
    await nextTick()
    optionRefs.value[command.id]?.scrollIntoView({ block: 'nearest' })
})

watch(isOpen, async (visible, wasVisible) => {
    if (visible) {
        query.value = ''
        setInitialActiveIndex()
        await nextTick()
        await focusTo(inputRef.value)
    } else if (wasVisible) {
        query.value = ''
        activeIndex.value = -1
        await nextTick()
        returnFocus()
    }
})

onMounted(() => {
    window.addEventListener('keydown', handleGlobalShortcut)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalShortcut)
})

defineExpose({ close: handleClose, isOpen, open, resultsRef })
</script>
