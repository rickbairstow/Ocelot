<template>
    <div :class="variantCss">
        <Scrim
            v-if="showScrim"
            absolute
            aria-label="Loader background."
            class="z-0"
            :clickable="false"
        />

        <div
            class="z-1 flex items-center justify-center gap-2"
            :class="vertical ? 'flex-col' : 'flex-row'"
        >
            <Icon
                :class="
                    animationLookup?.[props.animation] ?? animationLookup.spin
                "
                :icon="icon"
                :size="variant === 'inline' ? 'base' : '2xl'"
            />

            <p
                v-if="text"
                :class="variant === 'inline' ? 'text-base' : 'text-xl'"
            >
                {{ text }}
            </p>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Icon from './Icon.vue'
import Scrim from './Scrim.vue'

const animationLookup = {
    bounce: 'animate-bounce',
    none: 'animate-none',
    ping: 'animate-ping',
    pulse: 'animate-pulse',
    spin: 'animate-spin'
}

const props = defineProps({
    animation: {
        type: String,
        default: 'spin',
        validator: (value) =>
            ['bounce', 'none', 'ping', 'pulse', 'spin'].includes(value)
    },
    icon: {
        type: String,
        default: 'Loader2'
    },
    text: {
        type: String,
        default: null
    },
    variant: {
        type: String,
        default: 'inline',
        validator: (value) => ['absolute', 'fixed', 'inline'].includes(value)
    },
    vertical: {
        type: Boolean,
        default: false
    }
})

/**
 * Whether to show a scrim background.
 */
const showScrim = computed(() => {
    return ['absolute', 'fixed'].includes(props.variant)
})

/**
 * Container layout based on variant.
 */
const variantCss = computed(() => {
    switch (props.variant) {
        case 'absolute':
            return 'absolute inset-0 flex items-center justify-center text-white'
        case 'fixed':
            return 'fixed inset-0 flex items-center justify-center text-white'
        default:
            return 'flex items-center justify-center text-black'
    }
})
</script>
