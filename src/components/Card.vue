<template>
    <div
        class="border rounded-lg overflow-hidden shadow-lg border-gray-100"
        :class="[sizeCss, vertical ? 'block' : 'flex']"
    >
        <!-- Image -->
        <div
            v-if="imageSrc"
            :class="[
                vertical ? 'w-full h-40' : 'w-1/3 h-auto',
                'overflow-hidden'
            ]"
        >
            <img
                class="w-full h-full object-cover"
                :alt="imageAlt"
                :src="imageSrc"
            />
        </div>

        <div class="px-6 py-4 flex flex-col justify-between">
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
                v-if="badges?.length"
                class="flex flex-wrap gap-2 mt-auto"
            >
                <Badge
                    v-for="badge in badges"
                    :key="badge.text"
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
        default: () => [],
        type: Array,
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
        default: null,
        type: String
    },
    imageSrc: {
        default: null,
        type: String
    },
    title: {
        default: null,
        type: String
    },
    size: {
        default: 'base',
        type: String,
        validator: (value) => ['small', 'base', 'large'].includes(value)
    },
    vertical: {
        default: false,
        type: Boolean
    },
})

const sizeCss = computed(() => {
    const localLookup = {
        small: 'w-sm',
        base: 'w-md',
        large: 'w-lg'
    }
    return localLookup[props.size] ?? localLookup.base
})

const isVertical = computed(() => props.vertical)
</script>
