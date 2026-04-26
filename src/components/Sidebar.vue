<template>
    <Transition :name="side === 'left' ? 'slide-left' : 'slide-right'">
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
        <div
            v-if="isOpen"
            ref="sidebarRef"
            aria-label="Sidebar"
            class="fixed inset-y-0 z-40 flex flex-col w-full sm:w-80 max-h-full max-w-full bg-white text-black dark:bg-gray-900 dark:text-white"
            role="complementary"
            tabindex="-1"
            :class="side === 'left' ? 'start-0' : 'end-0'"
        >
            <div
                v-if="slots?.title"
                class="flex-none flex items-center justify-between gap-4 py-2 bg-gray-50 dark:bg-gray-800"
            >
                <div class="px-4">
                    <slot name="title" />
                </div>

                <Button
                    aria-label="Close sidebar"
                    color="gray"
                    variant="tertiary"
                    @click="close()"
                >
                    <Icon icon="X" />
                </Button>
            </div>

            <div class="flex-1 overflow-y-auto">
                <slot />
            </div>

            <div
                v-if="slots?.footer"
                class="flex-none p-4 bg-gray-50 dark:bg-gray-800"
            >
                <slot name="footer" />
            </div>

            <button
                aria-label="Close sidebar"
                class="sr-only"
                @click="close()"
            />
        </div>
    </Transition>

    <transition>
        <Scrim
            v-if="isOpen && showScrim"
            aria-label="Close sidebar"
            class="z-30"
            @click="close()"
        />
    </transition>
</template>

<script setup lang="ts">
import { ref, useSlots, onMounted, onUnmounted } from 'vue'
import useFocusMemory from '@Composables/useFocusMemory'
import Button from '@Components/Button.vue'
import Icon from '@Components/Icon.vue'
import Scrim from '@Components/Scrim.vue'

const { focusFrom, focusTo, returnFocus } = useFocusMemory()
const isOpen = ref(false)
const sidebarRef = ref<HTMLElement | null>(null)
const slots = useSlots()

interface Props {
    showScrim?: boolean
    side?: 'left' | 'right'
}

withDefaults(defineProps<Props>(), {
    showScrim: true,
    side: 'left'
})

/**
 * Close the sidebar and return focus.
 */
const close = (): boolean => {
    isOpen.value = false
    returnFocus()
    return false
}

/**
 * Open the sidebar and move the focus inside.
 */
const open = async (): Promise<boolean> => {
    isOpen.value = true
    await focusTo(sidebarRef.value)
    return true
}

/**
 * Global Escape key listener.
 */
const handleGlobalEscape = (e: KeyboardEvent): void => {
    if (e.key === 'Escape' && isOpen.value) {
        close()
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleGlobalEscape)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleGlobalEscape)
})

/**
 * Expose public methods.
 */
defineExpose({
    close,
    focusFrom,
    focusTo,
    isOpen,
    open
})
</script>
