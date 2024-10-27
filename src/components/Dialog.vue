<template>
    <Teleport :to="portalTarget">
        <Transition>
            <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
            <section
                v-if="isOpen"
                class="fixed inset-0 z-20 flex items-center justify-center sm:p-6"
                role="complementary"
                @keydown.esc="close"
            >
                <Scrim
                    aria-label="Close dialog"
                    @click="close"
                />

                <div
                    class="relative flex flex-col justify-between max-h-full h-full overflow-hidden text-black bg-white z-10 sm:h-auto sm:rounded-2xl"
                    role="dialog"
                    :aria-label="ariaLabel"
                    :class="sizeClass"
                >
                    <div
                        class="flex items-center justify-between border-gray-300 border-b"
                    >
                        <div
                            id="dialogueTitle"
                            class="flex p-6"
                            tabindex="0"
                        >
                            <slot name="title" />
                        </div>

                        <Button
                            aria-label="Close dialog"
                            class="mr-2"
                            type="none"
                            @click="close"
                        >
                            <Icon icon="X" />
                        </Button>
                    </div>

                    <div
                        ref="dialogueContent"
                        class="p-6 bg-white overflow-auto"
                        tabindex="0"
                    >
                        <slot name="default" />
                    </div>

                    <div
                        v-if="slots?.footer"
                        class="flex p-6 border-t border-gray-300"
                    >
                        <slot name="footer" />
                    </div>

                    <Button
                        aria-label="Close dialog"
                        button-type="tertiary"
                        class="sr-only"
                        @click="close"
                    >
                        Close {{ ariaLabel }}
                    </Button>
                </div>
            </section>
        </Transition>
    </Teleport>
</template>

<script setup>
import { computed, ref, useSlots, watch } from 'vue'
import Button from '@Components/Button.vue'
import Icon from '@Components/Icon.vue'
import Scrim from '@Components/Scrim.vue'

const slots = useSlots()
const dialogueContent = ref(null)
const isOpen = ref(false)

const props = defineProps({
    ariaLabel: {
        required: true,
        type: String
    },

    focusFrom: {
        default: null,
        type: String // ID of element
    },

    focusTo: {
        default: null,
        type: String // ID of element
    },

    portalTarget: {
        default: '#portal-target',
        type: String
    },

    small: {
        default: true,
        type: Boolean
    }
})

/**
 * Closes the dialog.
 * @returns {boolean}
 */
const close = () => (isOpen.value = false)

/**
 * Check if an id resolves to a valid DOM element.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
const getEl = (id) => document.getElementById(id) ?? null

/**
 * Opens the dialog.
 * @returns {boolean}
 */
const open = () => (isOpen.value = true)

/**
 * Triggers focus on a given element.
 * @param {HTMLElement} element
 * @returns {*}
 */
const setFocus = (element) => element && element?.focus()

/**
 * Calculate size constraints.
 */
const sizeClass = computed(() => {
    const { small } = props
    return `${small ? 'w-80' : 'w-full'} max-w-full`
})

/**
 * Handles focus events with 1ms timeout for teleport functionality.
 */
watch(
    () => isOpen.value,
    (val) => {
        const { focusTo, focusFrom } = props

        if (val && focusTo)
            setTimeout(() => {
                setFocus(getEl(focusTo))
            }, 50)

        if (val === false && focusFrom)
            setTimeout(() => {
                setFocus(getEl(focusFrom))
            }, 50)
    }
)

/**
 * Expose functions and open state.
 */
defineExpose({
    close,
    isOpen,
    open
})
</script>
