<template>
    <button
        class="fixed inset-0 opacity-90 bg-gray-500"
        :aria-disabled="disabled ? 'true' : undefined"
        :aria-label="ariaLabel"
        :class="disabled ? 'cursor-default' : 'cursor-pointer'"
        @click="handleClick"
    />
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
    ariaLabel: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['click'])

/**
 * Handles click interaction when not disabled.
 * @param {MouseEvent} e
 */
const handleClick = (e) => {
    if (props.disabled) {
        e.preventDefault()
        e.stopImmediatePropagation?.()
        e.stopPropagation()
        return
    }

    emit('click', e)
}
</script>
