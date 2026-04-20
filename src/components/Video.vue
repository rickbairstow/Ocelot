<template>
    <div :style="containerStyle">
        <!-- YouTube / Vimeo — Plyr mounts onto this div -->
        <div
            v-if="embedProvider"
            ref="embedRef"
            :data-plyr-embed-id="embedId"
            :data-plyr-provider="embedProvider"
        />

        <!-- Native HTML5 video — captions are consumer-supplied via the captions prop -->
        <!-- eslint-disable-next-line vuejs-accessibility/media-has-caption -->
        <video
            v-else
            ref="videoRef"
            crossorigin="anonymous"
            :playsinline="playsinline ? true : undefined"
            :poster="poster || undefined"
            :title="title"
        >
            <source
                :src="src"
                :type="mimeType"
            />
            <track
                v-for="(caption, i) in captions"
                :key="i"
                kind="subtitles"
                :default="caption.default"
                :label="caption.label"
                :src="caption.src"
                :srclang="caption.srclang"
            />
        </video>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'

interface Caption {
    /** URL to a VTT/SRT caption file */
    src: string
    /** BCP 47 language tag, e.g. "en", "fr" */
    srclang: string
    /** Human-readable track label shown in the captions menu */
    label: string
    /** Whether this track is active by default */
    default?: boolean
}

interface Props {
    /** Video source — YouTube URL, Vimeo URL, or a direct video file URL */
    src: string
    /** Accessible title passed to the Plyr player */
    title: string
    /** Aspect ratio passed to Plyr, e.g. "16:9" or "4:3" */
    ratio?: string
    /** Poster image URL (native video only) */
    poster?: string
    /** Start playback automatically on mount (implies muted) */
    autoplay?: boolean
    /** Start with audio muted */
    muted?: boolean
    /** Loop playback when the video ends */
    loop?: boolean
    /** Show player controls */
    controls?: boolean
    /** Prevent full-screen-on-play on iOS WebViews */
    playsinline?: boolean
    /** Caption/subtitle tracks (native video only) */
    captions?: Caption[]
    /** Fixed width (number = px, string = any CSS unit). Defaults to 100% */
    width?: string | number
}

const props = withDefaults(defineProps<Props>(), {
    ratio: '16:9',
    poster: '',
    autoplay: false,
    muted: false,
    loop: false,
    controls: true,
    playsinline: true,
    captions: () => [],
    width: ''
})

const emit = defineEmits<{
    play: []
    pause: []
    ended: []
    error: []
}>()

const videoRef = ref<HTMLVideoElement | null>(null)
const embedRef = ref<HTMLElement | null>(null)
let player: Plyr | null = null

/** Detected embed provider, or null for native video. */
const embedProvider = computed((): 'youtube' | 'vimeo' | null => {
    if (/youtube\.com|youtu\.be/.test(props.src)) return 'youtube'
    if (/vimeo\.com/.test(props.src)) return 'vimeo'
    return null
})

/** Video ID extracted from YouTube or Vimeo URL. */
const embedId = computed((): string => {
    const { src } = props
    if (embedProvider.value === 'youtube') {
        return src.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1] ?? ''
    }
    if (embedProvider.value === 'vimeo') {
        return src.match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1] ?? ''
    }
    return ''
})

/** MIME type inferred from the file extension. */
const mimeType = computed((): string => {
    const { src } = props
    if (/\.m3u8(\?|$)/i.test(src)) return 'application/x-mpegurl'
    if (/\.mpd(\?|$)/i.test(src)) return 'application/dash+xml'
    if (/\.webm(\?|$)/i.test(src)) return 'video/webm'
    if (/\.ogg(\?|$)/i.test(src)) return 'video/ogg'
    return 'video/mp4'
})

const toCssSize = (val: string | number): string => {
    if (typeof val === 'number') return `${val}px`
    return /^\d+(\.\d+)?$/.test(val.trim()) ? `${val}px` : val
}

const containerStyle = computed(() => ({
    width: props.width ? toCssSize(props.width) : '100%'
}))

const initPlayer = () => {
    const el = (embedRef.value ?? videoRef.value) as HTMLElement | null
    if (!el) return

    player = new Plyr(el, {
        autoplay: props.autoplay,
        muted: props.muted || props.autoplay,
        loop: { active: props.loop },
        ratio: props.ratio,
        controls: props.controls
            ? ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'fullscreen']
            : [],
        storage: { enabled: false }
    })

    player.on('play', () => emit('play'))
    player.on('pause', () => emit('pause'))
    player.on('ended', () => emit('ended'))
    player.on('error', () => emit('error'))

    // Plyr sets both `allow="fullscreen"` and the legacy boolean `allowfullscreen`
    // on its generated iframe. Modern browsers warn that `allow` takes precedence,
    // so remove the redundant boolean once the player is ready. Also set an explicit
    // title for embed iframes to keep the embedded player accessible.
    player.on('ready', () => {
        const iframe = player?.elements.container?.querySelector('iframe')
        iframe?.removeAttribute('allowfullscreen')
        if (props.title) {
            iframe?.setAttribute('title', props.title)
        }
    })
}

onMounted(initPlayer)

onUnmounted(() => {
    player?.destroy()
    player = null
})

watch(() => props.src, () => {
    if (!player) return

    if (embedProvider.value) {
        player.source = {
            type: 'video',
            sources: [{ src: embedId.value, provider: embedProvider.value }]
        }
    } else {
        player.source = {
            type: 'video',
            sources: [{ src: props.src, type: mimeType.value }]
        }
    }
})
</script>
