<template>
    <ul
        v-if="images.length"
        class="grid gap-4"
        :aria-label="label"
        :style="{ gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${safeMinWidth}px), 1fr))` }"
    >
        <li
            v-for="image in images"
            :key="image.id"
            class="min-w-0"
        >
            <figure class="space-y-2">
                <LightboxImage
                    v-if="lightbox"
                    :key="groupId"
                    :alt="image.alt"
                    :aspect-ratio="aspectRatio"
                    :lightbox-caption="image.caption"
                    :lightbox-group="groupId"
                    :src="image.src"
                />
                <Image
                    v-else
                    :alt="image.alt"
                    :aspect-ratio="aspectRatio"
                    :src="image.src"
                />
                <figcaption
                    v-if="showCaptions && image.caption"
                    class="text-sm text-gray-600 dark:text-gray-400"
                >
                    {{ image.caption }}
                </figcaption>
            </figure>
        </li>
    </ul>
    <div v-else>
        <slot name="empty">
            <p class="text-sm text-gray-600 dark:text-gray-400">
                No images to display.
            </p>
        </slot>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { generateUuid } from '@Utils/uuid'
import Image from '@Components/Image.vue'
import LightboxImage from '@Components/LightboxImage.vue'

export interface GalleryImage {
    /** Stable unique key, retained when the list changes. */
    id: string
    src: string
    alt: string
    caption?: string
}

const props = withDefaults(defineProps<{
    images: GalleryImage[]
    /** Accessible name for the image list. */
    label?: string
    /** Minimum thumbnail width in pixels; columns automatically fit the container. */
    minThumbnailWidth?: number
    aspectRatio?: string
    /** Opens the grouped PhotoSwipe viewer. Requires the optional photoswipe peer. */
    lightbox?: boolean
    showCaptions?: boolean
}>(), { label: 'Image gallery', minThumbnailWidth: 160, aspectRatio: '1 / 1', lightbox: true, showCaptions: true })

const groupId = generateUuid('gallery')
const safeMinWidth = computed(() => Number.isFinite(props.minThumbnailWidth) ? Math.max(1, props.minThumbnailWidth) : 160)
</script>
