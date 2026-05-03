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
                    variant="tertiary"
                    :aria-controls="slots['mobile-menu'] ? mobileMenuId : undefined"
                    :aria-expanded="String(isMobileMenuOpen)"
                    :aria-label="menuToggleLabel"
                    :class="menuToggleVisibilityClass"
                    :icon="isMobileMenuOpen ? 'X' : 'Menu'"
                    @click="toggleMobileMenu"
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

        <div
            v-if="slots['mobile-menu']"
            v-show="isMobileMenuOpen"
            :id="mobileMenuId"
            class="border-t border-gray-200 px-4 py-3 dark:border-gray-800"
            :class="mobileMenuVisibilityClass"
        >
            <slot name="mobile-menu" />
        </div>
    </header>
</template>

<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue'
import Button from '@Components/Button.vue'
import { generateUuid } from '@Utils/uuid'

interface Props {
    bordered?: boolean
    mobileMenuOpen?: boolean
    menuToggleBreakpoint?: 'sm' | 'md' | 'lg'
    menuToggleLabel?: string
    navLabel?: string
    sticky?: boolean
    showMenuToggle?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    bordered: true,
    mobileMenuOpen: undefined,
    menuToggleBreakpoint: 'lg',
    menuToggleLabel: 'Open navigation',
    navLabel: 'Primary navigation',
    sticky: false,
    showMenuToggle: false
})

const emit = defineEmits<{
    'menu-toggle': []
    'update:mobileMenuOpen': [value: boolean]
}>()

const slots = useSlots()
const internalMobileMenuOpen = ref(false)
const mobileMenuId = `navigation-bar-mobile-menu-${generateUuid()}`

const isControlled = computed(() => props.mobileMenuOpen !== undefined)
const isMobileMenuOpen = computed(() => isControlled.value ? props.mobileMenuOpen : internalMobileMenuOpen.value)

const breakpointVisibilityMap = {
    lg: {
        nav: 'hidden lg:flex',
        panel: 'lg:hidden',
        toggle: 'lg:hidden'
    },
    md: {
        nav: 'hidden md:flex',
        panel: 'md:hidden',
        toggle: 'md:hidden'
    },
    sm: {
        nav: 'hidden sm:flex',
        panel: 'sm:hidden',
        toggle: 'sm:hidden'
    }
} as const

const navVisibilityClass = computed(() => breakpointVisibilityMap[props.menuToggleBreakpoint].nav)
const mobileMenuVisibilityClass = computed(() => breakpointVisibilityMap[props.menuToggleBreakpoint].panel)
const menuToggleVisibilityClass = computed(() => breakpointVisibilityMap[props.menuToggleBreakpoint].toggle)

const rootClass = computed(() => [
    props.bordered ? 'border-b border-gray-200 dark:border-gray-800' : '',
    props.sticky ? 'sticky top-0 z-30' : ''
])

const setMobileMenuOpen = (value: boolean): void => {
    if (!isControlled.value) {
        internalMobileMenuOpen.value = value
    }

    emit('update:mobileMenuOpen', value)
}

const toggleMobileMenu = (): void => {
    setMobileMenuOpen(!isMobileMenuOpen.value)
    emit('menu-toggle')
}

watch(
    () => props.showMenuToggle,
    (showMenuToggle) => {
        if (!showMenuToggle) {
            setMobileMenuOpen(false)
        }
    }
)
</script>
