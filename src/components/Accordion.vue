<template>
    <details
        ref="details"
        :class="containerCss"
        @toggle="handleToggle"
    >
        <summary
            class="list-none border-0 flex justify-between gap-4 cursor-pointer p-4 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium focus:outline-none [&::-webkit-details-marker]:hidden"
            :class="isOpen ? 'bg-gray-100 text-black dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'"
        >
            <span>{{ title }}</span>

            <slot name="expandIcon">
                <Icon
                    aria-hidden="true"
                    :icon="isOpen ? 'ChevronUp' : 'ChevronDown'"
                />
            </slot>
        </summary>

        <div
            :id="uuid"
            class="p-4 text-gray-700 dark:text-gray-200"
            :class="contentCss"
        >
            <slot />
        </div>
    </details>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, inject, watch } from 'vue'
import { generateUuid } from '@Utils/uuid'
import Icon from '@/components/Icon.vue'
import type { AccordionGroupContext } from './AccordionGroup.vue'

const uuid = generateUuid('accordion-')

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

const details = ref<HTMLDetailsElement | null>(null)
const isOpen = ref<boolean>(false)

// Optional AccordionGroup context for exclusive mode
const group = inject<AccordionGroupContext | null>('accordionGroup', null)
const itemId = props.id ?? uuid

const handleToggle = () => {
    const nowOpen = details.value?.open ?? false
    isOpen.value = nowOpen
    if (nowOpen && group) {
        group.open(itemId)
    }
}

// Group tells us to close if another item opened
if (group) {
    watch(() => group.activeId.value, (activeId) => {
        if (activeId !== itemId && details.value?.open) {
            details.value.open = false
            isOpen.value = false
        }
    })
}

onMounted(() => {
    const shouldOpen = props.startOpen || (group && group.activeId.value === itemId)
    if (shouldOpen && details.value) {
        details.value.open = true
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
