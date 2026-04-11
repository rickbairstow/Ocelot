<template>
    <div
        class="border rounded-lg overflow-hidden shadow-lg border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-700"
        role="article"
        :class="[sizeCss, vertical ? 'block' : 'flex flex-wrap']"
    >
        <!-- Image -->
        <figure
            v-if="imageSrc"
            class="overflow-hidden"
            :class="
                vertical ? 'w-full h-40' : 'w-[40%] min-w-[120px] max-w-[200px]'
            "
        >
            <Image
                class="w-full h-full object-cover flex-none"
                :alt="imageAlt"
                :src="imageSrc"
            />
        </figure>

        <!-- Content -->
        <div class="px-6 py-4 flex flex-col justify-between flex-1">
            <h2
                v-if="title"
                class="font-bold text-xl mb-1"
            >
                {{ title }}
            </h2>

            <div class="text-base mb-4">
                <slot />
            </div>

            <div
                v-if="badges?.length"
                class="flex flex-wrap gap-2 mt-auto"
            >
                <Badge
                    v-for="badge in badges"
                    :key="badge.text"
                    :type="badge.type || 'info'"
                >
                    {{ badge.text || null }}
                </Badge>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Badge from '@Components/Badge.vue'
import Image from '@Components/Image.vue'

interface BadgeItem {
    text: string
    type: string
}

interface Props {
    badges?: BadgeItem[]
    imageAlt?: string
    imageSrc?: string | null
    title?: string | null
    size?: 'small' | 'base' | 'large'
    vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    badges: () => [],
    imageAlt: '',
    imageSrc: null,
    title: null,
    size: 'base',
    vertical: false
})

/**
 * Computes the width class based on size.
 */
const sizeCss = computed((): string => {
    const localLookup = {
        small: 'w-sm',
        base: 'w-xl',
        large: 'w-4xl'
    }
    return localLookup[props.size] ?? localLookup.base
})
</script>
