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
import { computed, onMounted, ref, watch } from 'vue'
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
 * - background / foreground: Colors
 */
const props = withDefaults(defineProps<Props>(), {
    size: 256,
    margin: 4,
    errorCorrectionLevel: 'M',
    background: '#ffffff',
    foreground: '#000000'
})

const dataUrl = ref('')

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
 * @param text - Text to encode
 */
const generateQrCode = async (text: string): Promise<void> => {
    try {
        dataUrl.value = await QRCode.toDataURL(text, {
            color: {
                light: props.background,
                dark: props.foreground
            },
            errorCorrectionLevel: props.errorCorrectionLevel,
            margin: props.margin,
            width: props.size
        })
    } catch (err) {
        console.error('QR generation failed:', err)
    }
}

onMounted(() => {
    generateQrCode(props.value)
})

watch(
    () => [
        props.background,
        props.errorCorrectionLevel,
        props.foreground,
        props.margin,
        props.size,
        props.value
    ],
    () => {
        generateQrCode(props.value)
    }
)
</script>
