<template>
    <section
        class="px-6 py-12 text-gray-900 dark:text-gray-100 sm:py-20"
        :aria-labelledby="headingId"
    >
        <div
            class="mx-auto flex max-w-6xl flex-col gap-8"
            :class="[$slots.media ? 'md:flex-row md:items-center md:gap-12' : '', centered && !$slots.media ? 'items-center text-center' : '']"
        >
            <div class="min-w-0 flex-1 space-y-5">
                <p
                    v-if="eyebrow"
                    class="text-sm font-semibold text-gray-600 dark:text-gray-400"
                >
                    {{ eyebrow }}
                </p>
                <Heading
                    :id="headingId"
                    :level="headingLevel"
                    :style-level="1"
                >
                    {{ heading }}
                </Heading>
                <div
                    v-if="description || $slots.default"
                    class="max-w-prose text-lg text-gray-600 dark:text-gray-300"
                    :class="centered && !$slots.media ? 'mx-auto' : ''"
                >
                    <slot><p>{{ description }}</p></slot>
                </div>
                <div
                    v-if="$slots.actions"
                    class="flex flex-wrap gap-3"
                    :class="centered && !$slots.media ? 'justify-center' : ''"
                >
                    <slot name="actions" />
                </div>
            </div>
            <div
                v-if="$slots.media"
                class="min-w-0 flex-1"
            >
                <slot name="media" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { generateUuid } from '@Utils/uuid'
import Heading from '@Components/Heading.vue'

withDefaults(defineProps<{
    /** The page introduction's accessible heading. */
    heading: string
    description?: string
    eyebrow?: string
    /** Match the document hierarchy; visual size remains the same. */
    headingLevel?: 1 | 2 | 3 | 4 | 5 | 6
    /** Centers text-only heroes. A media slot uses a split layout on wider screens. */
    centered?: boolean
}>(), { description: '', eyebrow: '', headingLevel: 1, centered: false })

const headingId = generateUuid('hero')
</script>
