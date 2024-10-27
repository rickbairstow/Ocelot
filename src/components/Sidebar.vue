<template>
    <Transition>
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
        <div
            v-if="isOpen"
            @keydown.esc="close()"
        >
            <div
                class="fixed inset-y-0 z-20 flex flex-col w-full sm:w-64 max-h-full max-w-full bg-white text-black"
                :class="sideClasses"
            >
                <div
                    v-if="slots?.title"
                    class="flex-none flex items-center justify-between gap-4 border-b py-2 bg-gray-100"
                >
                    <div class="px-4">
                        <slot name="title" />
                    </div>

                    <Button
                        aria-label="Close sidebar"
                        type="none"
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
                    class="flex-none border-t p-4 bg-gray-100"
                >
                    <slot name="footer" />
                </div>

                <button
                    aria-label="Close sidebar"
                    class="sr-only"
                    @click="close()"
                />
            </div>

            <Scrim
                v-if="isOpen && showScrim"
                aria-label="Close sidebar"
                class="z-0"
                @click="close()"
            />
        </div>
    </Transition>
</template>

<script setup>
import { computed, ref, useSlots } from 'vue'
import Button from '@Components/Button.vue'
import Icon from '@Components/Icon.vue'
import Scrim from '@Components/Scrim.vue'

const slots = useSlots()
const isOpen = ref(false)

const props = defineProps({
    showScrim: {
        default: true,
        type: Boolean
    },
    side: {
        default: 'left',
        type: String,
        validator(value) {
            return ['left', 'right'].includes(value)
        }
    }
})

/**
 * Close the sidebar.
 * @returns {boolean}
 */
const close = () => (isOpen.value = false)

/**
 * Open the sidebar.
 * @returns {boolean}
 */
const open = () => (isOpen.value = true)

/**
 * Calculated classes related to position.
 * @type {ComputedRef<string>}
 */
const sideClasses = computed(() => {
    const { side } = props

    if (side === 'left') {
        return 'left-0 border-r'
    }

    return 'right-0 border-l'
})

/**
 * Expose functions and open state.
 */
defineExpose({
    close,
    isOpen,
    open
})
</script>
