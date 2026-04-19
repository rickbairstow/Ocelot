<template>
    <nav
        class="flex flex-col gap-1 p-2"
        :aria-label="ariaLabel"
    >
        <slot />
    </nav>
</template>

<script setup lang="ts">
interface Props {
    ariaLabel?: string
}

withDefaults(defineProps<Props>(), {
    ariaLabel: 'Navigation'
})
</script>
