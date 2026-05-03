<template>
    <div
        :class="containerCss"
    >
        <button
            class="flex w-full justify-between gap-4 border-0 p-4 text-start font-medium transition-colors hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 dark:hover:bg-gray-700"
            type="button"
            :aria-controls="contentId"
            :aria-expanded="isOpen"
            :class="isOpen ? 'bg-gray-100 text-black dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'"
            @click="toggle"
        >
            <span>
                <slot
                    name="title"
                    :is-open="isOpen"
                >
                    {{ title }}
                </slot>
            </span>

            <slot
                name="expandIcon"
                :is-open="isOpen"
            >
                <Icon
                    aria-hidden="true"
                    :icon="isOpen ? 'ChevronUp' : 'ChevronDown'"
                />
            </slot>
        </button>

        <Transition
            enter-active-class="transition-[grid-template-rows,opacity] duration-200 ease-out motion-reduce:transition-none"
            enter-from-class="grid-rows-[0fr] opacity-0"
            enter-to-class="grid-rows-[1fr] opacity-100"
            leave-active-class="transition-[grid-template-rows,opacity] duration-150 ease-in motion-reduce:transition-none"
            leave-from-class="grid-rows-[1fr] opacity-100"
            leave-to-class="grid-rows-[0fr] opacity-0"
        >
            <div
                v-show="isOpen"
                :id="contentId"
                class="grid"
            >
                <div class="overflow-hidden">
                    <div
                        class="content p-4 text-gray-700 dark:text-gray-200"
                        :class="contentCss"
                    >
                        <slot />
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue'
import { generateUuid } from '@Utils/uuid'
import Icon from '@/components/Icon.vue'
import type { AccordionGroupContext } from './AccordionGroup.vue'

const uuid = generateUuid('accordion')
const contentId = `${uuid}-content`

interface Props {
    id?: string
    startOpen?: boolean
    title: string
    variant?: 'default' | 'flush' | 'contained'
}

const props = withDefaults(defineProps<Props>(), {
    id: undefined,
    startOpen: false,
    variant: 'default'
})

const isOpen = ref<boolean>(false)

// Optional AccordionGroup context for exclusive mode
const group = inject<AccordionGroupContext | null>('accordionGroup', null)
const itemId = props.id ?? uuid

const toggle = () => {
    isOpen.value = !isOpen.value

    if (isOpen.value && group) {
        group.open(itemId)
    }

    if (!isOpen.value && group) {
        group.close(itemId)
    }
}

// Group tells us to close if another item opened
if (group) {
    watch(() => group.activeId.value, (activeId) => {
        if (activeId !== itemId && isOpen.value) {
            isOpen.value = false
        }
    })
}

onMounted(() => {
    const shouldOpen = props.startOpen || (group && group.activeId.value === itemId)
    if (shouldOpen) {
        isOpen.value = true
    }
})

const variantContainerMap: Record<string, string> = {
    default:   'w-full border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow bg-white dark:bg-gray-800 focus-within:outline-1 focus-within:outline-blue-200 dark:focus-within:outline-blue-700',
    flush:     'w-full border-b border-gray-200 dark:border-gray-700 focus-within:outline-1 focus-within:outline-blue-200',
    contained: 'w-full rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800/50 focus-within:outline-1 focus-within:outline-blue-200'
}

const variantContentMap: Record<string, string> = {
    default:   'content',
    flush:     '',
    contained: 'bg-white dark:bg-gray-900'
}

const effectiveVariant = computed(() => group?.variant.value ?? props.variant)
const containerCss = computed(() => variantContainerMap[effectiveVariant.value] ?? variantContainerMap.default)
const contentCss = computed(() => variantContentMap[effectiveVariant.value] ?? '')
</script>
