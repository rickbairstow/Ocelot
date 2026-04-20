<template>
    <component
        :is="clickable ? 'button' : 'div'"
        :class="cardCss"
        :role="clickable ? undefined : 'article'"
        :tabindex="clickable ? 0 : undefined"
        :type="clickable ? 'button' : undefined"
        @click="clickable ? emit('click', $event) : undefined"
    >
        <!-- Media slot (images, video, etc.) — falls back to imageSrc prop -->
        <figure
            v-if="slots.media || imageSrc"
            class="overflow-hidden shrink-0"
            :class="vertical ? 'w-full h-48' : 'w-40 aspect-square'"
        >
            <slot name="media">
                <img
                    class="w-full h-full object-cover block"
                    :alt="imageAlt"
                    :src="imageSrc!"
                />
            </slot>
        </figure>

        <!-- Body -->
        <div class="px-6 py-4 flex flex-col justify-between flex-1 min-w-0">
            <!-- Header slot — falls back to title prop -->
            <div v-if="slots.header || title">
                <slot name="header">
                    <h2 class="font-bold text-xl mb-1 text-gray-900 dark:text-white">
                        {{ title }}
                    </h2>
                </slot>
            </div>

            <!-- Content slot — falls back to default slot -->
            <div class="text-base mb-4 text-gray-700 dark:text-gray-200">
                <slot name="content">
                    <slot />
                </slot>
            </div>

            <!-- Footer / actions row -->
            <div
                v-if="slots.footer || slots.actions || badges?.length"
                class="flex flex-wrap items-center justify-between gap-2 mt-auto"
            >
                <slot name="footer">
                    <div
                        v-if="badges?.length"
                        class="flex flex-wrap gap-2"
                    >
                        <Badge
                            v-for="badge in badges"
                            :key="badge.text"
                        >
                            {{ badge.text }}
                        </Badge>
                    </div>
                </slot>
                <slot name="actions" />
            </div>
        </div>

        <!-- Selected tick indicator -->
        <div
            v-if="selected"
            aria-hidden="true"
            class="absolute top-2 right-2 flex items-center justify-center size-5 rounded-full bg-blue-600 text-white"
        >
            <svg
                fill="none"
                height="10"
                stroke="currentColor"
                stroke-width="2.5"
                viewBox="0 0 12 12"
                width="10"
            >
                <path
                    d="M2 6l3 3 5-5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </div>
    </component>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import type { Slots } from 'vue'
import Badge from '@Components/Badge.vue'

interface BadgeItem {
    text: string
    type: string
}

interface Props {
    badges?: BadgeItem[]
    clickable?: boolean
    imageAlt?: string
    imageSrc?: string | null
    selected?: boolean
    size?: 'small' | 'base' | 'large'
    title?: string | null
    variant?: 'default' | 'bordered' | 'flat'
    vertical?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    badges: () => [],
    clickable: false,
    imageAlt: '',
    imageSrc: null,
    selected: false,
    size: 'base',
    title: undefined,
    variant: 'default',
    vertical: false
})

const emit = defineEmits<{ click: [event: MouseEvent] }>()
const slots: Slots = useSlots()

const sizeCss = computed((): string => {
    const map = {
        small: 'w-sm',
        base: 'w-xl',
        large: 'w-4xl'
    }
    return map[props.size] ?? map.base
})

const variantCss = computed((): string => {
    switch (props.variant) {
        case 'bordered': return 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900'
        case 'flat':     return 'bg-white dark:bg-gray-900'
        default:         return 'border rounded-lg overflow-hidden shadow-lg border-gray-100 bg-white dark:bg-gray-900 dark:border-gray-700'
    }
})

const cardCss = computed((): string => {
    const base = `relative ${variantCss.value} ${sizeCss.value}`
    const layout = props.vertical ? 'block' : 'flex flex-wrap'
    const interactive = props.clickable
        ? 'cursor-pointer hover:shadow-xl transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500 text-start'
        : ''
    const ring = props.selected ? 'ring-2 ring-blue-500' : ''
    return [base, layout, interactive, ring].filter(Boolean).join(' ')
})
</script>
