<template>
    <div v-if="dataUrl">
        <img
            class="rounded-xl"
            decoding="async"
            loading="lazy"
            :alt="altText"
            :height="size"
            :src="dataUrl"
            :width="size"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import QRCode from 'qrcode'

interface Props {
    value: string
    size?: number
    margin?: number
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
    background?: string
    foreground?: string
}

/**
 * Props:
 * - value: The content encoded in the QR (e.g. URL, text)
 * - size: Width/height in px (square)
 * - margin: Padding around the QR code
 * - errorCorrectionLevel: L, M, Q, H (higher = more error tolerance)
 * - background / foreground: Colors — when left at defaults, dark mode is respected automatically
 */
const props = withDefaults(defineProps<Props>(), {
    size: 256,
    margin: 4,
    errorCorrectionLevel: 'M',
    background: '#ffffff',
    foreground: '#000000'
})

const dataUrl = ref('')
const isDark = ref(false)

/**
 * When using default colors, flip them for dark mode.
 * Explicit prop values are always respected as-is.
 */
const effectiveBackground = computed((): string => {
    if (props.background !== '#ffffff') return props.background
    return isDark.value ? '#111827' : '#ffffff'
})

const effectiveForeground = computed((): string => {
    if (props.foreground !== '#000000') return props.foreground
    return isDark.value ? '#f9fafb' : '#000000'
})

/**
 * Compute a descriptive alt tag for screen readers
 */
const altText = computed((): string =>
    props.value.startsWith('http')
        ? `QR code linking to ${props.value}`
        : `QR code containing: ${props.value}`
)

/**
 * Generate QR code as a data URL
 */
const generateQrCode = async (text: string): Promise<void> => {
    try {
        dataUrl.value = await QRCode.toDataURL(text, {
            color: {
                light: effectiveBackground.value,
                dark: effectiveForeground.value
            },
            errorCorrectionLevel: props.errorCorrectionLevel,
            margin: props.margin,
            width: props.size
        })
    } catch (err) {
        console.error('QR generation failed:', err)
    }
}

let observer: MutationObserver

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')

    observer = new MutationObserver(() => {
        isDark.value = document.documentElement.classList.contains('dark')
    })
    observer.observe(document.documentElement, { attributeFilter: ['class'] })

    generateQrCode(props.value)
})

onUnmounted(() => {
    observer?.disconnect()
})

watch(
    () => [
        effectiveBackground.value,
        effectiveForeground.value,
        props.errorCorrectionLevel,
        props.margin,
        props.size,
        props.value
    ],
    () => {
        generateQrCode(props.value)
    }
)
</script>
