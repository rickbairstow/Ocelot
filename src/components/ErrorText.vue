<template>
    <p
        class="text-sm text-red-600 dark:text-red-400"
        :role="announce ? 'alert' : undefined"
    >
        <slot />
    </p>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    /** Announce newly displayed errors. Disable for static copy or an existing live region. */
    announce?: boolean
}>(), { announce: true })
</script>
