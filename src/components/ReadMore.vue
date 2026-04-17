<template>
    <div>
        <div
            ref="contentSlot"
            class="break-words"
            :style="contentStyle"
        >
            <slot />
        </div>

        <Button
            v-if="isClamped"
            class="mt-1"
            variant="text"
            :aria-label="buttonText"
            @click="toggleVisibility"
        >
            {{ buttonText }}
        </Button>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Button from '@Components/Button.vue'

interface Props {
    collapseLabel?: string
    expandLabel?: string
    lines?: number
}

const props = withDefaults(defineProps<Props>(), {
    collapseLabel: 'Show less',
    expandLabel: 'Show more',
    lines: 4
})

const contentSlot = ref<HTMLDivElement | null>(null)
const isVisible = ref(false)
const isClamped = ref(false)
const collapsedHeight = ref<number | null>(null)

let resizeObserver: ResizeObserver | null = null

const buttonText = computed((): string => {
    return isVisible.value ? props.collapseLabel : props.expandLabel
})

const contentStyle = computed(() => {
    if (isVisible.value || !isClamped.value || !collapsedHeight.value) {
        return {}
    }

    return {
        maxHeight: `${collapsedHeight.value}px`,
        overflow: 'hidden'
    }
})

const getLineHeight = (el: HTMLElement): number => {
    const styles = window.getComputedStyle(el)
    const lineHeight = styles.lineHeight
    const fontSize = parseFloat(styles.fontSize || '16')

    if (lineHeight === 'normal') {
        return fontSize * 1.2
    }

    const parsed = parseFloat(lineHeight)
    return Number.isNaN(parsed) ? fontSize * 1.2 : parsed
}

const updateClamp = async () => {
    const el = contentSlot.value

    if (!el || props.lines <= 0) {
        isClamped.value = false
        collapsedHeight.value = null
        return
    }

    const wasVisible = isVisible.value

    if (wasVisible) {
        isVisible.value = false
        await nextTick()
    }

    const lineHeight = getLineHeight(el)
    const nextCollapsedHeight = Math.ceil(lineHeight * props.lines)

    collapsedHeight.value = nextCollapsedHeight

    const fullHeight = el.scrollHeight
    isClamped.value = fullHeight > nextCollapsedHeight + 1

    if (!isClamped.value && isVisible.value) {
        isVisible.value = false
    }

    if (wasVisible) {
        isVisible.value = true
        await nextTick()
    }
}

const toggleVisibility = () => {
    isVisible.value = !isVisible.value
}

onMounted(async () => {
    await nextTick()

    const el = contentSlot.value
    if (!el) return

    resizeObserver = new ResizeObserver(() => {
        void updateClamp()
    })

    resizeObserver.observe(el)

    void updateClamp()
})

watch(
    () => props.lines,
    () => {
        void updateClamp()
    }
)

onBeforeUnmount(() => {
    resizeObserver?.disconnect()
})
</script>
