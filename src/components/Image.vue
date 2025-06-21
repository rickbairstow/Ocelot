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
        class="flex items-center justify-center animate-pulse text-gray-300 bg-gray-100 p-8 rounded-lg"
        :style="{
            width: width ? `${width}px` : '150px',
            height: height ? `${height}px` : '150px'
        }"
    >
        <Icon
            class="w-full h-full"
            icon="Photo"
        />
    </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import Icon from '@/components/Icon.vue'

const props = defineProps({
    src: { type: String, required: true },
    alt: { type: String, required: true },
    srcset: { type: String, default: '' },
    sizes: { type: String, default: '' },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
})

const isLoaded = ref(false)

const loadImage = () => {
    isLoaded.value = false
    const img = new Image()
    img.src = props.src
    if (props.srcset) img.srcset = props.srcset
    if (props.sizes) img.sizes = props.sizes
    img.onload = () => (isLoaded.value = true)
    img.onerror = () => (isLoaded.value = true)
}

onMounted(loadImage)
watch(() => props.src, loadImage)
</script>
