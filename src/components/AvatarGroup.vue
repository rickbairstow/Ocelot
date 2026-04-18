<template>
    <div class="flex items-center">
        <Avatar
            v-for="(avatar, i) in visible"
            :key="i"
            :alt="avatar.alt"
            :color="avatar.color"
            :initials="avatar.initials"
            :shape="avatar.shape"
            :size="resolvedSize"
            :src="avatar.src"
            class="ring-2 ring-white dark:ring-gray-900 -ml-2 first:ml-0"
        />

        <!-- Overflow badge -->
        <span
            v-if="overflow > 0"
            :aria-label="`${overflow} more`"
            class="inline-flex items-center justify-center shrink-0 ring-2 ring-white dark:ring-gray-900 -ml-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-semibold select-none"
            :class="[overflowSizeMap[resolvedSize], shapeClass]"
        >
            +{{ overflow }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Avatar from '@Components/Avatar.vue'
import type { AvatarSize, AvatarColor, AvatarShape } from '@Components/Avatar.vue'

interface AvatarItem {
    alt?: string
    color?: AvatarColor
    initials?: string
    shape?: AvatarShape
    src?: string | null
}

interface Props {
    avatars: AvatarItem[]
    max?: number
    shape?: AvatarShape
    size?: AvatarSize
}

const props = withDefaults(defineProps<Props>(), {
    max: 5,
    shape: 'circle',
    size: 'base',
})

const resolvedSize = computed((): AvatarSize => props.size)
const visible = computed(() => props.avatars.slice(0, props.max))
const overflow = computed(() => Math.max(0, props.avatars.length - props.max))
const shapeClass = computed(() => props.shape === 'square' ? 'rounded-lg' : 'rounded-full')

const overflowSizeMap: Record<AvatarSize, string> = {
    xs:   'size-6 text-xs',
    sm:   'size-8 text-xs',
    base: 'size-10 text-sm',
    lg:   'size-12 text-sm',
    xl:   'size-16 text-base',
    '2xl': 'size-20 text-lg',
}
</script>
