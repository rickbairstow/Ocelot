<template>
    <img
        v-if="isLoaded"
        :alt="alt"
        :height="height"
        :sizes="sizes"
        :src="src"
        :srcset="srcset"
        :width="width"
    />

    <div
        v-else
        class="flex items-center justify-center text-gray-300 bg-gray-100 p-8 rounded-lg"
        :class="{ 'animate-pulse': !isFailed }"
        :style="{
            height: height ? `${height}px` : '150px',
            width: width ? `${width}px` : '150px'
        }"
    >
        <Icon
            class="w-full h-full"
            :icon="isFailed ? 'PhotoOff' : 'Photo'"
        />
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import Icon from '@/components/Icon.vue'

/**
 * Props for the image component.
 * - `src` and `alt` are required.
 * - `srcset`, `sizes`, `width`, and `height` are optional for responsive/fixed rendering.
 */
const props = defineProps({
    alt: {
        type: String,
        required: true
    },
    height: {
        type: Number,
        default: 0
    },
    sizes: {
        type: String,
        default: ''
    },
    src: {
        type: String,
        required: true
    },
    srcset: {
        type: String,
        default: ''
    },
    width: {
        type: Number,
        default: 0
    }
})

/**
 * Tracks whether the image has successfully loaded or if it has failed to load.
 */
const isLoaded = ref(false)
const isFailed = ref(false)

/**
 * Loads the image manually using the native Image API.
 * Handles both load and error states to update visibility.
 */
const loadImage = () => {
    isLoaded.value = isFailed.value = false

    const img = new Image()
    img.src = props.src

    if (props.srcset) img.srcset = props.srcset
    if (props.sizes) img.sizes = props.sizes

    img.onload = () => (isLoaded.value = true)
    img.onerror = () => (isLoaded.value = isFailed.value = true)
}

/**
 * Triggers image loading on mount.
 */
onMounted(() => {
    loadImage()
})

/**
 * Reloads the image if the `src` changes dynamically.
 */
watch(() => props.src, loadImage)
</script>
