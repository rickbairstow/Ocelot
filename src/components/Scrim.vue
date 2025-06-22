<template>
    <component
        :is="clickable ? 'button' : 'div'"
        class="inset-0 bg-gray-500 opacity-90 z-0"
        :aria-disabled="!clickable ? 'true' : undefined"
        :aria-label="ariaLabel"
        :class="[
            clickable ? 'cursor-pointer' : 'cursor-default',
            absolute ? 'absolute' : 'fixed'
        ]"
        @click="clickable ? handleClick : undefined"
    />
</template>

<script setup>
import { defineEmits, defineProps } from 'vue'

const props = defineProps({
    absolute: {
        default: false,
        type: Boolean,
    },
    ariaLabel: {
        default: null,
        type: String,
    },
    clickable: {
        type: Boolean,
        default: true
    }
})

const emit = defineEmits(['click'])

/**
 * Emits click only if the scrim is clickable.
 * @param {MouseEvent} e
 */
const handleClick = (e) => {
    if (!props.clickable) {
        e.preventDefault()
        e.stopImmediatePropagation?.()
        e.stopPropagation()
        return
    }

    emit('click', e)
}
</script>
