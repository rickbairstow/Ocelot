<template>
    <nav aria-label="Pagination">
        <ul class="flex items-center gap-1">
            <li>
                <button
                    aria-label="Previous page"
                    :class="[navButtonClass, modelValue === 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer']"
                    :disabled="modelValue === 1"
                    @click="go(modelValue - 1)"
                >
                    <Icon
                        aria-hidden="true"
                        icon="ChevronLeft"
                        size="sm"
                    />
                </button>
            </li>

            <li
                v-for="(page, index) in pages"
                :key="index"
            >
                <span
                    v-if="page === ELLIPSIS"
                    aria-hidden="true"
                    class="flex h-9 w-9 items-center justify-center text-sm text-gray-400 dark:text-gray-500 select-none"
                >…</span>

                <button
                    v-else
                    :aria-current="page === modelValue ? 'page' : undefined"
                    :aria-label="`Page ${page}`"
                    :class="page === modelValue ? activePageClass : pageClass"
                    @click="go(page as number)"
                >
                    {{ page }}
                </button>
            </li>

            <li>
                <button
                    aria-label="Next page"
                    :class="[navButtonClass, modelValue === total ? 'cursor-not-allowed opacity-40' : 'cursor-pointer']"
                    :disabled="modelValue === total"
                    @click="go(modelValue + 1)"
                >
                    <Icon
                        aria-hidden="true"
                        icon="ChevronRight"
                        size="sm"
                    />
                </button>
            </li>
        </ul>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'

const ELLIPSIS = '...' as const

interface Props {
    modelValue: number
    siblings?: number
    total: number
}

const props = withDefaults(defineProps<Props>(), {
    siblings: 1
})

const emit = defineEmits<{
    'update:modelValue': [page: number]
}>()

const go = (page: number) => {
    if (page < 1 || page > props.total || page === props.modelValue) return
    emit('update:modelValue', page)
}

const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, i) => start + i)

const pages = computed((): (number | typeof ELLIPSIS)[] => {
    const { modelValue: current, total, siblings } = props

    if (total <= siblings * 2 + 5) return range(1, total)

    const leftEdge = Math.max(current - siblings, 1)
    const rightEdge = Math.min(current + siblings, total)

    const showLeftDots = leftEdge > 2
    const showRightDots = rightEdge < total - 1

    if (!showLeftDots && showRightDots) {
        return [...range(1, 3 + siblings * 2), ELLIPSIS, total]
    }

    if (showLeftDots && !showRightDots) {
        return [1, ELLIPSIS, ...range(total - (2 + siblings * 2), total)]
    }

    return [1, ELLIPSIS, ...range(leftEdge, rightEdge), ELLIPSIS, total]
})

const base = 'flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950'

const pageClass = `${base} text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer`
const activePageClass = `${base} bg-blue-600 text-white dark:bg-blue-500 cursor-default`
const navButtonClass = `${base} text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent`
</script>
