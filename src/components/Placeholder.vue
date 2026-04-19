<template>
    <div class="animate-pulse motion-reduce:animate-none">
        <!-- Badge -->
        <div
            v-if="variant === 'badge'"
            class="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-full"
        />

        <!-- Button -->
        <div
            v-else-if="variant === 'button'"
            class="h-10 w-32 bg-gray-300 dark:bg-gray-600 rounded-lg"
        />

        <!-- Card (default) -->
        <div
            v-if="variant === 'card'"
            class="flex w-xl bg-gray-200 dark:bg-gray-700 p-4 rounded-lg space-x-2"
        >
            <div
                class="flex justify-center items-center p-4 bg-gray-300 dark:bg-gray-600 rounded-lg"
            >
                <Icon
                    class="text-gray-400 dark:text-gray-500"
                    icon="Photo"
                    size="8xl"
                />
            </div>
            <div class="flex flex-col">
                <div class="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded-full mb-1" />
                <div class="h-4 w-3xs bg-gray-300 dark:bg-gray-600 rounded-full mb-4" />
                <div class="flex gap-4">
                    <div class="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <div class="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-full" />
                    <div class="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded-full" />
                </div>
            </div>
        </div>

        <!-- Heading -->
        <div
            v-else-if="variant === 'heading'"
            class="h-6 w-32 bg-gray-300 dark:bg-gray-600 rounded-full"
        />

        <!-- Image -->
        <div
            v-else-if="variant === 'image'"
            class="w-32 h-32 flex items-center justify-center bg-gray-300 dark:bg-gray-600 rounded-lg"
        >
            <Icon
                class="text-gray-400 dark:text-gray-500"
                icon="Photo"
                size="8xl"
            />
        </div>

        <!-- Input -->
        <div
            v-else-if="variant === 'input'"
            class="h-10 w-56 bg-gray-300 dark:bg-gray-600 rounded-xl border border-gray-400 dark:border-gray-500"
        />

        <!-- Paragraph -->
        <div
            v-else-if="variant === 'paragraph'"
            class="space-y-2"
        >
            <div class="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div class="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded-full" />
            <div class="h-4 w-5/6 bg-gray-300 dark:bg-gray-600 rounded-full" />
        </div>

        <!-- Text -->
        <div
            v-if="variant === 'text'"
            class="h-4 w-3xs bg-gray-300 dark:bg-gray-600 rounded-full"
        />
    </div>
</template>

<script setup lang="ts">
import Icon from './Icon.vue'

interface Props {
    variant?: string
}

withDefaults(defineProps<Props>(), {
    variant: 'card'
})
</script>
