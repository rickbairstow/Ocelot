<template>
    <header
        class="w-full bg-white/95 text-gray-950 backdrop-blur dark:bg-gray-950/95 dark:text-gray-50"
        :class="rootClass"
    >
        <div class="flex min-h-16 items-center gap-4 px-4 sm:px-6">
            <div class="flex min-w-0 items-center gap-3">
                <Button
                    v-if="showMenuToggle"
                    class="shrink-0"
                    color="gray"
                    icon="Menu"
                    variant="tertiary"
                    :aria-label="menuToggleLabel"
                    :class="menuToggleVisibilityClass"
                    @click="emit('menu-toggle')"
                />

                <div
                    v-if="slots.brand"
                    class="min-w-0 shrink-0"
                >
                    <slot name="brand" />
                </div>
            </div>

            <nav
                v-if="slots.nav"
                class="min-w-0 flex-1 items-center gap-2"
                :aria-label="navLabel"
                :class="navVisibilityClass"
            >
                <slot name="nav" />
            </nav>

            <div
                v-if="slots.actions"
                class="ml-auto flex items-center gap-2"
            >
                <slot name="actions" />
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, useSlots } from 'vue'
import Button from '@Components/Button.vue'

interface Props {
    bordered?: boolean
    menuToggleBreakpoint?: 'sm' | 'md' | 'lg'
    menuToggleLabel?: string
    navLabel?: string
    sticky?: boolean
    showMenuToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    bordered: true,
    menuToggleBreakpoint: 'lg',
    menuToggleLabel: 'Open navigation',
    navLabel: 'Primary navigation',
    sticky: false,
    showMenuToggle: false
})

const emit = defineEmits<{
    'menu-toggle': []
}>()

const slots = useSlots()

const breakpointVisibilityMap = {
    lg: {
        nav: 'hidden lg:flex',
        toggle: 'lg:hidden'
    },
    md: {
        nav: 'hidden md:flex',
        toggle: 'md:hidden'
    },
    sm: {
        nav: 'hidden sm:flex',
        toggle: 'sm:hidden'
    }
} as const

const navVisibilityClass = computed(() => breakpointVisibilityMap[props.menuToggleBreakpoint].nav)
const menuToggleVisibilityClass = computed(() => breakpointVisibilityMap[props.menuToggleBreakpoint].toggle)

const rootClass = computed(() => [
    props.bordered ? 'border-b border-gray-200 dark:border-gray-800' : '',
    props.sticky ? 'sticky top-0 z-30' : ''
])
</script>
