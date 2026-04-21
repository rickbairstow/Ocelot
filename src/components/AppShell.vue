<template>
    <div class="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-50">
        <transition>
            <Scrim
                v-if="hasSidebar && isSidebarOpen"
                aria-label="Close navigation"
                class="z-30"
                :class="mobileOnlyClass"
                @click="closeSidebar()"
            />
        </transition>

        <div
            class="min-h-screen"
            :class="layoutClass"
        >
            <aside
                v-if="hasSidebar"
                ref="sidebarRef"
                class="flex max-h-screen flex-col overflow-y-auto bg-white text-gray-900 shadow-xl transition-transform duration-200 ease-out dark:bg-gray-900 dark:text-gray-100"
                tabindex="-1"
                :aria-label="sidebarLabel"
                :class="sidebarClass"
                :style="sidebarStyle"
            >
                <div
                    class="flex items-center justify-end border-b border-gray-200 px-3 py-3 dark:border-gray-800"
                    :class="mobileOnlyClass"
                >
                    <Button
                        aria-label="Close navigation"
                        color="gray"
                        icon="X"
                        variant="tertiary"
                        @click="closeSidebar()"
                    />
                </div>

                <div class="min-h-0 flex-1 overflow-y-auto">
                    <slot
                        name="sidebar"
                        :close-sidebar="closeSidebar"
                        :open-sidebar="openSidebar"
                        :sidebar-open="isSidebarOpen"
                        :toggle-sidebar="toggleSidebar"
                    />
                </div>
            </aside>

            <div class="flex min-w-0 flex-1 flex-col">
                <div
                    v-if="slots.header"
                    :class="headerClass"
                >
                    <slot
                        name="header"
                        :close-sidebar="closeSidebar"
                        :open-sidebar="openSidebar"
                        :sidebar-open="isSidebarOpen"
                        :toggle-sidebar="toggleSidebar"
                    />
                </div>

                <main
                    :id="mainId"
                    class="min-w-0 flex-1"
                    tabindex="-1"
                >
                    <slot
                        :close-sidebar="closeSidebar"
                        :open-sidebar="openSidebar"
                        :sidebar-open="isSidebarOpen"
                        :toggle-sidebar="toggleSidebar"
                    />
                </main>

                <footer
                    v-if="slots.footer"
                    class="border-t border-gray-200 dark:border-gray-800"
                >
                    <slot
                        name="footer"
                        :close-sidebar="closeSidebar"
                        :open-sidebar="openSidebar"
                        :sidebar-open="isSidebarOpen"
                        :toggle-sidebar="toggleSidebar"
                    />
                </footer>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, useSlots } from 'vue'
import type { CSSProperties } from 'vue'
import Button from '@Components/Button.vue'
import Scrim from '@Components/Scrim.vue'
import useFocusMemory from '@Composables/useFocusMemory'

interface Props {
    fixedHeader?: boolean
    hasSidebar?: boolean
    mainId?: string
    sidebarBreakpoint?: 'md' | 'lg'
    sidebarLabel?: string
    sidebarPosition?: 'left' | 'right'
    sidebarWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
    fixedHeader: false,
    hasSidebar: true,
    mainId: 'main',
    sidebarBreakpoint: 'lg',
    sidebarLabel: 'Sidebar',
    sidebarPosition: 'left',
    sidebarWidth: '18rem'
})

const { focusTo, returnFocus } = useFocusMemory()
const isSidebarOpen = ref(false)
const sidebarRef = ref<HTMLElement | null>(null)
const slots = useSlots()

const breakpointClassMap = {
    lg: {
        desktopSidebar: 'lg:static lg:inset-auto lg:z-auto lg:h-auto lg:translate-x-0 lg:shrink-0 lg:shadow-none',
        layout: {
            left: 'lg:flex',
            right: 'lg:flex lg:flex-row-reverse'
        },
        mobileOnly: 'lg:hidden'
    },
    md: {
        desktopSidebar: 'md:static md:inset-auto md:z-auto md:h-auto md:translate-x-0 md:shrink-0 md:shadow-none',
        layout: {
            left: 'md:flex',
            right: 'md:flex md:flex-row-reverse'
        },
        mobileOnly: 'md:hidden'
    }
} as const

const breakpointConfig = computed(() => breakpointClassMap[props.sidebarBreakpoint])

const mobileOnlyClass = computed(() => breakpointConfig.value.mobileOnly)

const layoutClass = computed(() => breakpointConfig.value.layout[props.sidebarPosition])

const headerClass = computed(() => props.fixedHeader ? 'sticky top-0 z-20' : '')

const sidebarClass = computed(() => {
    const sideClass = props.sidebarPosition === 'left'
        ? 'fixed inset-y-0 left-0 z-40 border-r border-gray-200 dark:border-gray-800'
        : 'fixed inset-y-0 right-0 z-40 border-l border-gray-200 dark:border-gray-800'
    const transformClass = isSidebarOpen.value
        ? 'translate-x-0'
        : (props.sidebarPosition === 'left' ? '-translate-x-full' : 'translate-x-full')

    return [
        sideClass,
        transformClass,
        breakpointConfig.value.desktopSidebar
    ]
})

const sidebarStyle = computed<CSSProperties>(() => ({
    width: props.sidebarWidth
}))

const openSidebar = async (): Promise<boolean> => {
    if (!props.hasSidebar) return false
    if (isSidebarOpen.value) return true
    isSidebarOpen.value = true
    await focusTo(sidebarRef.value)
    return true
}

const closeSidebar = (): boolean => {
    if (!props.hasSidebar) return false
    if (!isSidebarOpen.value) return false
    isSidebarOpen.value = false
    returnFocus()
    return false
}

const toggleSidebar = async (): Promise<boolean> => {
    if (isSidebarOpen.value) return closeSidebar()
    return openSidebar()
}

const handleGlobalEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isSidebarOpen.value) {
        closeSidebar()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleGlobalEscape)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalEscape)
})

defineExpose({
    closeSidebar,
    isSidebarOpen,
    openSidebar,
    toggleSidebar
})
</script>
