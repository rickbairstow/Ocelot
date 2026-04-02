<template>
    <div>
        <div
            ref="contentSlot"
            class="break-words"
            :class="clampClass"
        >
            <slot />
        </div>
        <Button
            v-if="isClamped"
            class="mt-1"
            type="text"
            :aria-label="buttonText"
            @click="toggleVisibility"
        >
            {{ buttonText }}
        </Button>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from 'vue'
import Button from '@Components/Button.vue'

interface Props {
    lines?: number
}

const props = withDefaults(defineProps<Props>(), {
    lines: 4
})

const contentSlot = ref<HTMLDivElement | null>(null)
const isVisible = ref(false)

/**
 * Tailwind's line-clamp class selection.
 */
const clampLookup = [
    'line-clamp-none',
    'line-clamp-1',
    'line-clamp-2',
    'line-clamp-3',
    'line-clamp-4',
    'line-clamp-5',
    'line-clamp-6'
]

/**
 * Applies clamping unless expanded.
 */
const clampClass = computed((): string => {
    if (isVisible.value) return ''
    const val = props.lines > 0 && props.lines <= 6 ? props.lines : 0
    return clampLookup[val] ?? ''
})

/**
 * Dynamic button text.
 */
const buttonText = computed((): string => {
    return isVisible.value ? 'Show less' : 'Show more'
})

/**
 * Reactive flag to determine whether content is clamped.
 */
const isClamped = ref(false)

/**
 * Reassess clamp state.
 */
const updateClamp = () => {
    const el = contentSlot.value
    if (!el) return
    isClamped.value = props.lines > 0 && el.scrollHeight > el.clientHeight
}

/**
 * Toggle expanded/collapsed state.
 */
const toggleVisibility = () => {
    isVisible.value = !isVisible.value
}

/**
 * Handle window resize events.
 */
const onResize = () => {
    const el = contentSlot.value
    if (!el) return

    const hasOverflow = props.lines > 0 && el.scrollHeight > el.clientHeight

    if (!hasOverflow && isVisible.value) {
        isVisible.value = false
    }

    updateClamp()
}

onMounted(() => {
    nextTick(() => updateClamp())
    window.addEventListener('resize', onResize)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', onResize)
})
</script>
