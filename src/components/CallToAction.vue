<template>
    <section
        class="relative isolate overflow-hidden rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 via-indigo-50 to-white px-6 py-10 text-gray-900 shadow-sm dark:border-blue-800 dark:from-blue-950 dark:via-gray-900 dark:to-indigo-950 dark:text-gray-100 sm:px-10"
        :aria-labelledby="headingId"
    >
        <div
            aria-hidden="true"
            class="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-blue-500 via-indigo-500 to-purple-500"
        />
        <div
            aria-hidden="true"
            class="pointer-events-none absolute -end-16 -top-24 -z-10 size-72 rounded-full bg-blue-200/50 blur-3xl dark:bg-blue-500/15"
        />
        <div
            class="mx-auto flex max-w-6xl flex-col gap-8"
            :class="inline ? 'sm:flex-row sm:items-center sm:justify-between' : 'items-center text-center'"
        >
            <div class="min-w-0 space-y-4">
                <Heading
                    :id="headingId"
                    class="text-balance"
                    :level="headingLevel"
                    :style-level="2"
                >
                    {{ heading }}
                </Heading>
                <div
                    v-if="description || $slots.default"
                    class="max-w-prose text-pretty text-gray-600 dark:text-gray-300"
                >
                    <slot><p>{{ description }}</p></slot>
                </div>
            </div>
            <div
                v-if="$slots.actions"
                class="flex shrink-0 flex-wrap justify-center gap-3"
            >
                <slot name="actions" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { generateUuid } from '@Utils/uuid'
import Heading from '@Components/Heading.vue'

withDefaults(defineProps<{
    heading: string
    description?: string
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
    /** Places actions alongside the copy when space allows. */
    inline?: boolean
}>(), { description: '', headingLevel: 2, inline: false })

const headingId = generateUuid('cta')
</script>
