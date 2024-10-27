<template>
    <button
        class="fixed inset-0 opacity-90 bg-gray-500"
        :aria-label="ariaLabel"
        :class="disabled ? 'pointer-events-none' : ''"
        :disabled="disabled"
    />
</template>

<script setup>
defineProps({
    ariaLabel: {
        required: true,
        type: String
    },
    disabled: {
        default: false,
        type: Boolean
    }
})
</script>
