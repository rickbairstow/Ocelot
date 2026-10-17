<template>
    <footer class="border-t border-gray-200 px-6 py-8 text-gray-700 dark:border-gray-700 dark:text-gray-300">
        <div class="mx-auto max-w-6xl space-y-8">
            <div
                v-if="$slots.brand || $slots.navigation || $slots.default"
                class="flex flex-col gap-8 md:flex-row md:justify-between"
            >
                <div
                    v-if="$slots.brand || $slots.default"
                    class="min-w-0 space-y-3 md:max-w-sm"
                >
                    <slot name="brand" />
                    <slot />
                </div>
                <div v-if="$slots.navigation">
                    <slot name="navigation" />
                </div>
            </div>
            <div
                v-if="copyright || $slots.bottom"
                class="flex flex-wrap items-center justify-between gap-4 text-sm"
            >
                <p v-if="copyright">
                    {{ copyright }}
                </p>
                <slot name="bottom" />
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
defineProps<{
    /** Supply the complete copyright text; dates are owned by the application. */
    copyright?: string
}>()
</script>
