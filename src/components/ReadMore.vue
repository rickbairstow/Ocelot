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
import { computed, ref } from 'vue'
import Button from '@Components/Button.vue'

const props = defineProps({
    lines: {
        type: Number,
        default: 4
    }
})

const contentSlot = ref(null)
const isVisible = ref(false)

const clampLookup = [
    'line-clamp-none',
    'line-clamp-1',
    'line-clamp-2',
    'line-clamp-3',
    'line-clamp-4',
    'line-clamp-5',
    'line-clamp-6'
]

const clampClass = computed(() => {
    if (isVisible.value) return ''
    const { lines } = props
    const val = lines > 0 && lines <= 6 ? lines : 0
    return clampLookup?.[val] ?? ''
})

const buttonText = computed(() => {
    return isVisible.value ? 'Show less' : 'Show more'
})

const isClamped = computed(
    () =>
        contentSlot?.value &&
        contentSlot?.value?.scrollHeight > contentSlot?.value?.clientHeight
)

const toggleVisibility = () => (isVisible.value = !isVisible.value)
</script>
