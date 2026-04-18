<template>
    <div
        v-if="!dismissed"
        :class="containerCss"
        :role="liveRole"
    >
        <!-- Icon column -->
        <div
            aria-hidden="true"
            class="shrink-0 flex items-start"
            :class="iconColorCss"
        >
            <slot name="icon">
                <Icon :icon="typeIcon[type]" />
            </slot>
        </div>

        <!-- Body -->
        <div
            class="flex-1 min-w-0 text-sm"
            :class="descColorCss"
        >
            <h4
                v-if="slots.title || title"
                class="font-semibold text-sm mb-0.5"
                :class="textColorCss"
            >
                <slot name="title">
                    {{ title }}
                </slot>
            </h4>

            <slot />

            <div
                v-if="slots.actions"
                class="mt-2 flex flex-wrap gap-2"
            >
                <slot name="actions" />
            </div>
        </div>

        <!-- Dismiss button -->
        <button
            v-if="dismissible"
            aria-label="Dismiss"
            class="shrink-0 self-start -mt-0.5 -mr-1 p-1 rounded-md opacity-60 hover:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
            type="button"
            :class="[iconColorCss, focusRingCss]"
            @click="dismiss"
        >
            <Icon
                aria-hidden="true"
                icon="X"
                size="sm"
            />
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, useSlots } from 'vue'
import Icon from '@Components/Icon.vue'

export type BannerType = 'info' | 'success' | 'warning' | 'error'
export type BannerVariant = 'subtle' | 'solid' | 'outline'

interface Props {
    dismissible?: boolean
    title?: string
    type?: BannerType
    variant?: BannerVariant
}

const props = withDefaults(defineProps<Props>(), {
    dismissible: false,
    title: undefined,
    type: 'info',
    variant: 'subtle'
})

const emit = defineEmits<{ dismiss: [] }>()
const slots = useSlots()

const dismissed = ref(false)

const dismiss = (): void => {
    dismissed.value = true
    emit('dismiss')
}

const typeIcon: Record<BannerType, string> = {
    info:    'InfoCircle',
    success: 'CircleCheck',
    warning: 'AlertTriangle',
    error:   'CircleX'
}

// role="alert" for assertive types, role="status" for polite, nothing for static
const liveRole = computed((): string | undefined => {
    if (props.dismissible) return undefined
    return props.type === 'error' || props.type === 'warning' ? 'alert' : 'status'
})

type ColorSet = { container: string; icon: string; text: string; desc: string; ring: string }

const palette: Record<BannerType, Record<BannerVariant, ColorSet>> = {
    info: {
        subtle:  { container: 'bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800', icon: 'text-blue-600 dark:text-blue-400', text: 'text-blue-900 dark:text-blue-100', desc: 'text-blue-800 dark:text-blue-200', ring: 'focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400' },
        solid:   { container: 'bg-blue-600 dark:bg-blue-500', icon: 'text-white', text: 'text-white', desc: 'text-blue-50', ring: 'focus-visible:outline-white' },
        outline: { container: 'border-2 border-blue-500 dark:border-blue-400', icon: 'text-blue-600 dark:text-blue-400', text: 'text-blue-900 dark:text-blue-100', desc: 'text-blue-800 dark:text-blue-200', ring: 'focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400' }
    },
    success: {
        subtle:  { container: 'bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800', icon: 'text-green-700 dark:text-green-400', text: 'text-green-900 dark:text-green-100', desc: 'text-green-800 dark:text-green-200', ring: 'focus-visible:outline-green-700 dark:focus-visible:outline-green-400' },
        solid:   { container: 'bg-green-700 dark:bg-green-600', icon: 'text-white', text: 'text-white', desc: 'text-green-50', ring: 'focus-visible:outline-white' },
        outline: { container: 'border-2 border-green-600 dark:border-green-500', icon: 'text-green-700 dark:text-green-400', text: 'text-green-900 dark:text-green-100', desc: 'text-green-800 dark:text-green-200', ring: 'focus-visible:outline-green-700 dark:focus-visible:outline-green-400' }
    },
    warning: {
        subtle:  { container: 'bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-700', icon: 'text-amber-600 dark:text-amber-400', text: 'text-amber-900 dark:text-amber-100', desc: 'text-amber-800 dark:text-amber-200', ring: 'focus-visible:outline-amber-600 dark:focus-visible:outline-amber-400' },
        solid:   { container: 'bg-amber-500 dark:bg-amber-400', icon: 'text-amber-950 dark:text-amber-950', text: 'text-amber-950 dark:text-amber-950', desc: 'text-amber-950 dark:text-amber-950', ring: 'focus-visible:outline-amber-950 dark:focus-visible:outline-amber-950' },
        outline: { container: 'border-2 border-amber-500 dark:border-amber-400', icon: 'text-amber-600 dark:text-amber-400', text: 'text-amber-900 dark:text-amber-100', desc: 'text-amber-800 dark:text-amber-200', ring: 'focus-visible:outline-amber-600 dark:focus-visible:outline-amber-400' }
    },
    error: {
        subtle:  { container: 'bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800', icon: 'text-red-600 dark:text-red-400', text: 'text-red-900 dark:text-red-100', desc: 'text-red-800 dark:text-red-200', ring: 'focus-visible:outline-red-600 dark:focus-visible:outline-red-400' },
        solid:   { container: 'bg-red-600 dark:bg-red-500', icon: 'text-white', text: 'text-white', desc: 'text-white', ring: 'focus-visible:outline-white' },
        outline: { container: 'border-2 border-red-500 dark:border-red-400', icon: 'text-red-600 dark:text-red-400', text: 'text-red-900 dark:text-red-100', desc: 'text-red-800 dark:text-red-200', ring: 'focus-visible:outline-red-600 dark:focus-visible:outline-red-400' }
    }
}

const colors = computed((): ColorSet => palette[props.type][props.variant])

const containerCss = computed((): string =>
    `flex gap-3 rounded-xl p-4 ${colors.value.container}`
)
const iconColorCss  = computed((): string => colors.value.icon)
const textColorCss  = computed((): string => colors.value.text)
const descColorCss  = computed((): string => colors.value.desc)
const focusRingCss  = computed((): string => colors.value.ring)
</script>
