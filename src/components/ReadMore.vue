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

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watchPostEffect } from 'vue'
import Button from '@Components/Button.vue'

const props = defineProps({
    lines: {
        type: Number,
        default: 4
    }
})

const contentSlot = ref(null)
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
const clampClass = computed(() => {
    if (isVisible.value) return ''
    const val = props.lines > 0 && props.lines <= 6 ? props.lines : 0
    return clampLookup[val] ?? ''
})

/**
 * Dynamic button text.
 */
const buttonText = computed(() => {
    return isVisible.value ? 'Show less' : 'Show more'
})

/**
 * Reactive flag to determine whether content is clamped.
 */
const isClamped = ref(false)

/**
 * Reassess clamp state when layout changes.
 */
const updateClamp = () => {
    const el = contentSlot.value
    if (!el || isVisible.value) return // don't recalculate if expanded
    isClamped.value = props.lines > 0 && el.scrollHeight > el.clientHeight
}

/**
 * Toggle expanded/collapsed state.
 */
const toggleVisibility = () => {
    isVisible.value = !isVisible.value
}

let resizeObserver

onMounted(() => {
    updateClamp()

    const onResize = () => {
        const el = contentSlot.value
        if (!el) return

        const hasOverflow = props.lines > 0 && el.scrollHeight > el.clientHeight

        if (!hasOverflow && isVisible.value) {
            isVisible.value = false
        }

        updateClamp()
    }

    window.addEventListener('resize', onResize)

    onBeforeUnmount(() => {
        window.removeEventListener('resize', onResize)
    })
})

onBeforeUnmount(() => {
    if (resizeObserver && contentSlot.value) {
        resizeObserver.unobserve(contentSlot.value)
    }
})

/**
 * Recalculate when slot content changes (after render).
 */
watchPostEffect(() => {
    // isVisible.value = false // reset expanded state
    updateClamp()
})
</script>
