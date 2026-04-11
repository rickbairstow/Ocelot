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

<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import Scrim from './Scrim.vue'

const animationLookup: Record<string, string> = {
    bounce: 'animate-bounce',
    none: 'animate-none',
    ping: 'animate-ping',
    pulse: 'animate-pulse',
    spin: 'animate-spin'
}

interface Props {
    animation?: 'bounce' | 'none' | 'ping' | 'pulse' | 'spin'
    icon?: string
    text?: string | null
    variant?: 'absolute' | 'fixed' | 'inline'
    vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    animation: 'spin',
    icon: 'Loader2',
    text: null,
    variant: 'inline',
    vertical: false
})

/**
 * Whether to show a scrim background.
 */
const showScrim = computed((): boolean => {
    return ['absolute', 'fixed'].includes(props.variant)
})

/**
 * Container layout based on variant.
 */
const variantCss = computed((): string => {
    switch (props.variant) {
        case 'absolute':
            return 'absolute inset-0 flex items-center justify-center text-white'
        case 'fixed':
            return 'fixed inset-0 flex items-center justify-center text-white'
        default:
            return 'flex items-center justify-center text-black dark:text-white'
    }
})
</script>
