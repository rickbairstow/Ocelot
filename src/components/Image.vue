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
        class="flex items-center justify-center text-gray-300 bg-gray-100 rounded-lg"
        :class="{ 'animate-pulse': !isFailed }"
        :style="{
            height: height ? `${height}` : '100%',
            width: width ? `${width}` : '100%'
        }"
    >
        <Icon
            class="w-1/2 h-1/2"
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
        type: String,
        default: null
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
        type: String,
        default: null
    }
})

/**
 * Tracks whether the image has successfully loaded or failed.
 */
const isLoaded = ref(false)
const isFailed = ref(false)

/**
 * Loads the image manually using the native Image API.
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

onMounted(loadImage)
watch(() => props.src, loadImage)
</script>
