<template>
    <div
        class="relative overflow-hidden"
        :class="!hasSize ? 'min-h-16' : ''"
        :style="containerStyle"
    >
        <!-- Skeleton shown while loading -->
        <div
            v-if="state === 'loading'"
            aria-hidden="true"
            class="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse"
        >
            <Icon
                class="w-1/4 h-1/4 max-w-12 max-h-12 text-gray-300 dark:text-gray-600"
                icon="Photo"
            />
        </div>

        <!-- Error state -->
        <div
            v-else-if="state === 'error'"
            class="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-900"
            role="img"
            :aria-label="alt"
        >
            <Icon
                class="w-1/4 h-1/4 max-w-12 max-h-12 text-gray-400 dark:text-gray-500"
                icon="PhotoOff"
            />
        </div>

        <!-- LQIP blur-up: fades out as main image fades in -->
        <img
            v-if="placeholder"
            alt=""
            aria-hidden="true"
            class="absolute inset-0 w-full h-full transition-opacity duration-500 pointer-events-none select-none"
            :class="[fitClass, state === 'loaded' ? 'opacity-0' : 'opacity-100 blur-sm scale-105']"
            :src="placeholder"
            :style="objectPositionStyle"
        />

        <!-- Main image — opacity-0 until loaded, then fades in -->
        <img
            v-if="state !== 'error'"
            v-bind="$attrs"
            class="absolute inset-0 w-full h-full transition-opacity duration-500"
            :alt="alt"
            :class="[fitClass, state === 'loaded' ? 'opacity-100' : 'opacity-0']"
            :decoding="decoding"
            :fetchpriority="fetchpriority"
            :height="numericHeight"
            :loading="loading"
            :sizes="sizes || undefined"
            :src="src"
            :srcset="srcset || undefined"
            :style="objectPositionStyle"
            :width="numericWidth"
            @error="onError"
            @load="onLoad"
        />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Icon from '@/components/Icon.vue'

defineOptions({ inheritAttrs: false })

type ImageState = 'loading' | 'loaded' | 'error'

interface Props {
    /** Alt text — required for accessibility */
    alt: string
    /** Image source URL */
    src: string
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

const state = ref<ImageState>('loading')

const onLoad = () => { state.value = 'loaded' }
const onError = () => { state.value = 'error' }

watch(() => props.src, () => { state.value = 'loading' })

/** Pixel value for the HTML width attribute (improves CLS) */
const numericWidth = computed((): number | undefined => {
    if (!props.width) return undefined
    const n = parseInt(String(props.width))
    return isNaN(n) ? undefined : n
})

/** Pixel value for the HTML height attribute (improves CLS) */
const numericHeight = computed((): number | undefined => {
    if (!props.height) return undefined
    const n = parseInt(String(props.height))
    return isNaN(n) ? undefined : n
})

/** Whether any explicit sizing is provided — used to add min-h fallback for skeleton */
const hasSize = computed(() => !!(props.width || props.height || props.aspectRatio))

/** Ensures a value like "400" becomes "400px"; "100%" or "auto" are passed through unchanged */
const toCssSize = (val: string | number): string => {
    if (typeof val === 'number') return `${val}px`
    return /^\d+(\.\d+)?$/.test(val.trim()) ? `${val}px` : val
}

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

const fitClassMap: Record<NonNullable<Props['fit']>, string> = {
    cover: 'object-cover',
    contain: 'object-contain',
    fill: 'object-fill',
    none: 'object-none',
    'scale-down': 'object-scale-down'
}

const fitClass = computed(() => fitClassMap[props.fit ?? 'cover'])

const objectPositionStyle = computed(() => ({ 'object-position': props.position }))
</script>
