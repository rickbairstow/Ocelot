<template>
    <div
        class="border rounded-lg"
        :class="sizeCss"
    >
        <div
            v-if="imageSrc"
            class="w-full h-40 overflow-hidden rounded-t-lg"
        >
            <img
                class="w-full h-full object-cover"
                :alt="imageAlt"
                :src="imageSrc"
            />
        </div>

        <div class="px-6 py-4">
            <h2
                v-if="title"
                class="font-bold text-xl mb-1"
            >
                {{ title }}
            </h2>

            <div class="text-base mb-4">
                <slot />
            </div>

            <div
                v-if="badges"
                class="flex flex-wrap gap-2"
            >
                <Badge
                    v-for="badge in badges"
                    :key="badge"
                    :type="badge.type || 'info'"
                >
                    {{ badge.text || null }}
                </Badge>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import Badge from '@Components/Badge.vue'

const props = defineProps({
    badges: {
        type: Array,
        default: () => [],
        validator: (value) => {
            return value.every(
                (badge) =>
                    typeof badge === 'object' &&
                    typeof badge.text === 'string' &&
                    typeof badge.type === 'string'
            )
        }
    },
    imageAlt: {
        type: String,
        default: null
    },
    imageSrc: {
        type: String,
        default: null
    },
    size: {
        type: String,
        default: 'base',
        validator: (value) => {
            return ['small', 'base', 'large'].includes(value)
        }
    },
    title: {
        type: String,
        default: null
    }
})

const sizeCss = computed(() => {
    const localLookup = {
        small: 'w-sm',
        base: 'w-md',
        large: 'w-lg'
    }
    return localLookup[props.size] ?? localLookup.base
})
</script>
