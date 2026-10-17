<template>
    <section
        class="rounded-xl bg-gray-100 px-6 py-10 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
        :aria-labelledby="headingId"
    >
        <div
            class="mx-auto flex max-w-6xl flex-col gap-6"
            :class="inline ? 'sm:flex-row sm:items-center sm:justify-between' : 'items-center text-center'"
        >
            <div class="min-w-0 space-y-3">
                <Heading
                    :id="headingId"
                    :level="headingLevel"
                    :style-level="2"
                >
                    {{ heading }}
                </Heading>
                <div
                    v-if="description || $slots.default"
                    class="max-w-prose text-gray-600 dark:text-gray-300"
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
