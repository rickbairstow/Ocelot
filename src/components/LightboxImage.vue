<template>
    <div
        ref="rootRef"
        class="relative"
        :class="!hasSize ? 'min-h-16' : ''"
        :style="containerStyle"
    >
        <Image
            :alt="alt"
            :aspect-ratio="aspectRatio"
            :decoding="decoding"
            :fetchpriority="fetchpriority"
            :fit="fit"
            :height="height"
            :loading="loading"
            :placeholder="placeholder"
            :position="position"
            :sizes="sizes"
            :src="src"
            :srcset="srcset"
            :width="width"
        />
        <button
            class="group absolute inset-0 flex cursor-zoom-in items-center justify-center border-0 bg-black/0 transition-colors duration-200 hover:bg-black/20 focus-visible:bg-black/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white"
            type="button"
            :aria-label="`Open ${alt} in lightbox`"
            @click="handleClick"
        >
            <Icon
                aria-hidden="true"
                class="text-white opacity-0 drop-shadow transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                icon="ZoomIn"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Image from '@/components/Image.vue'
import Icon from '@/components/Icon.vue'
import {
    registerInGroup,
    unregisterFromGroup,
    openGroup,
    openSingle
} from '@Composables/useLightboxRegistry'
import type { LightboxEntry } from '@Composables/useLightboxRegistry'

interface Props {
    /** Alt text — required for accessibility */
    alt: string
    /** Image source URL */
    src: string
    /** Group name — LightboxImages sharing the same group open as a gallery with thumbnail strip */
    lightboxGroup?: string
    /** Caption shown beneath the image when open in the lightbox */
    lightboxCaption?: string
    /** Fixed width (number = px, string = any CSS unit) */
    width?: string | number | null
    /** Fixed height (number = px, string = any CSS unit) */
    height?: string | number | null
    /** CSS aspect-ratio value, e.g. "16/9" or "4/3" */
    aspectRatio?: string
    /** Responsive sizes attribute */
    sizes?: string
    /** Responsive srcset attribute */
    srcset?: string
    /** Native loading strategy */
    loading?: 'lazy' | 'eager'
    /** Image decoding hint */
    decoding?: 'auto' | 'async' | 'sync'
    /** Fetch priority hint */
    fetchpriority?: 'high' | 'low' | 'auto'
    /** CSS object-fit value */
    fit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
    /** CSS object-position value, e.g. "center", "top left" */
    position?: string
    /** Low-quality placeholder URL or data URI for blur-up effect */
    placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
    lightboxGroup: '',
    lightboxCaption: '',
    width: null,
    height: null,
    aspectRatio: '',
    sizes: '',
    srcset: '',
    loading: 'lazy',
    decoding: 'async',
    fetchpriority: 'auto',
    fit: 'cover',
    position: 'center',
    placeholder: ''
})

const toCssSize = (val: string | number): string => {
    if (typeof val === 'number') return `${val}px`
    return /^\d+(\.\d+)?$/.test(val.trim()) ? `${val}px` : val
}

/** Mirrors Image.vue's containerStyle so the wrapper always has explicit dimensions,
 *  which is required for `absolute inset-0` on the button to stretch correctly. */
const containerStyle = computed((): Record<string, string> => {
    const style: Record<string, string> = {}
    style.width = props.width ? toCssSize(props.width) : '100%'
    if (props.aspectRatio) {
        style['aspect-ratio'] = props.aspectRatio
    } else if (props.height) {
        style.height = toCssSize(props.height)
    }
    return style
})

const hasSize = computed(() => !!(props.width || props.height || props.aspectRatio))

const rootRef = ref<HTMLElement | null>(null)

/** Read natural dimensions from the already-loaded <img> in the DOM if available. */
const getNaturalDimensions = (): { width?: number; height?: number } => {
    const img = rootRef.value?.querySelector('img')
    if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
        return { width: img.naturalWidth, height: img.naturalHeight }
    }
    return {}
}

const getSlide = () => ({
    src: props.src,
    alt: props.alt,
    ...getNaturalDimensions(),
    caption: props.lightboxCaption || undefined
})

let entry: LightboxEntry | null = null

const handleClick = () => {
    if (props.lightboxGroup) {
        openGroup(props.lightboxGroup, entry!)
    } else {
        openSingle(getSlide())
    }
}

onMounted(() => {
    if (props.lightboxGroup) {
        entry = { getSlide }
        registerInGroup(props.lightboxGroup, entry)
    }
})

onUnmounted(() => {
    if (props.lightboxGroup && entry) {
        unregisterFromGroup(props.lightboxGroup, entry)
        entry = null
    }
})
</script>
