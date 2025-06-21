<template>
    <Teleport :to="portalTarget">
        <Transition>
            <section
                v-if="isOpen"
                class="fixed inset-0 z-20 flex items-center justify-center sm:p-6"
                role="dialog"
                :aria-label="ariaLabel"
                @keydown.esc="close"
            >
                <Scrim
                    aria-label="Close dialog"
                    @click="close"
                />

                <div
                    class="relative flex flex-col justify-between max-h-full h-full overflow-hidden text-black bg-white z-10 sm:h-auto sm:rounded-2xl"
                    :class="sizeClass"
                >
                    <div
                        class="flex items-center justify-between border-b border-gray-100"
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
                            type="tertiary"
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
                        <slot />
                    </div>

                    <div
                        v-if="slots?.footer"
                        class="flex p-6 border-t border-gray-100"
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
import { computed, nextTick, ref, useSlots } from 'vue'
import Button from '@Components/Button.vue'
import Icon from '@Components/Icon.vue'
import Scrim from '@Components/Scrim.vue'
import useFocusMemory from '@Composables/useFocusMemory.js'

/**
 * Provides access to slot presence like `footer`.
 */
const slots = useSlots()

/**
 * Track the open state of the dialog.
 * @type {import('vue').Ref<boolean>}
 */
const isOpen = ref(false)

/**
 * Ref to the scrollable content region of the dialog.
 * @type {import('vue').Ref<HTMLElement|null>}
 */
const dialogueContent = ref(null)

/**
 * Props accepted by the dialog.
 * - ariaLabel: Descriptive label for screen readers.
 * - focusFrom: ID of the element to return focus to when dialog closes.
 * - focusTo: ID of the element to focus when dialog opens.
 * - portalTarget: Target for Teleport (e.g. #portal-target).
 * - small: If true, renders a narrower dialog width.
 */
const props = defineProps({
    ariaLabel: { type: String, required: true },
    focusFrom: { type: String, default: null },
    focusTo: { type: String, default: null },
    portalTarget: { type: String, default: '#portal-target' },
    small: { type: Boolean, default: true }
})

/**
 * Import focus tracking utilities.
 * `focusTo` sets the initial focus; `returnFocus` restores it.
 */
const { focusTo: applyFocusTo, returnFocus } = useFocusMemory()

/**
 * Returns dialog width class based on `small` prop.
 * @type {import('vue').ComputedRef<string>}
 */
const sizeClass = computed(() => {
    return props.small ? 'w-80 max-w-full' : 'w-full max-w-full'
})

/**
 * Opens the dialog and focuses on the target element.
 * Falls back to the dialog title if `focusTo` is not set.
 * @returns {Promise<void>}
 */
const open = async () => {
    isOpen.value = true
    await nextTick()

    const targetEl = props.focusTo
        ? document.getElementById(props.focusTo)
        : document.getElementById('dialogueTitle')

    await applyFocusTo(targetEl)
}

/**
 * Closes the dialog and restores focus to original trigger.
 */
const close = () => {
    isOpen.value = false
    returnFocus()
}

/**
 * Expose dialog methods to parent components via ref.
 */
defineExpose({ open, close, isOpen })
</script>
