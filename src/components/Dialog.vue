<template>
    <Teleport :to="portalTarget">
        <Transition>
            <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
            <section
                v-if="isOpen"
                aria-modal="true"
                class="fixed inset-0 z-20 flex flex-col items-stretch justify-end sm:items-center sm:justify-center sm:p-6"
                role="dialog"
                :aria-describedby="slots?.description ? descriptionId : undefined"
                :aria-label="slots?.title ? undefined : ariaLabel"
                :aria-labelledby="slots?.title ? titleId : undefined"
                @keydown.esc="close"
            >
                <Scrim
                    aria-label="Close dialog"
                    @click="close"
                />

                <div
                    class="relative flex flex-col max-h-[92dvh] w-full overflow-hidden text-black bg-white dark:text-white dark:bg-gray-900 z-10 rounded-t-2xl sm:rounded-2xl sm:max-h-[90vh] sm:h-auto"
                    :class="sizeClass"
                >
                    <div
                        class="flex items-center justify-between border-b border-gray-100 dark:border-gray-700"
                    >
                        <div
                            :id="titleId"
                            class="flex p-6"
                            tabindex="-1"
                        >
                            <slot name="title" />
                        </div>

                        <Button
                            aria-label="Close dialog"
                            class="mr-2"
                            color="gray"
                            variant="tertiary"
                            @click="close"
                        >
                            <Icon icon="X" />
                        </Button>
                    </div>

                    <div
                        v-if="slots?.description"
                        :id="descriptionId"
                        class="px-6 pt-4 text-sm text-gray-600 dark:text-gray-400"
                    >
                        <slot name="description" />
                    </div>

                    <div
                        ref="dialogueContent"
                        class="flex-1 min-h-0 p-6 overflow-auto"
                        tabindex="0"
                    >
                        <slot />
                    </div>

                    <div
                        v-if="slots?.footer"
                        class="flex items-center justify-end gap-3 shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700"
                    >
                        <slot name="footer" />
                    </div>

                    <Button
                        aria-label="Close dialog"
                        class="sr-only"
                        color="gray"
                        variant="tertiary"
                        @click="close"
                    >
                        Close {{ ariaLabel }}
                    </Button>
                </div>
            </section>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useSlots } from 'vue'
import Button from '@Components/Button.vue'
import Icon from '@Components/Icon.vue'
import Scrim from '@Components/Scrim.vue'
import useFocusMemory from '@Composables/useFocusMemory'
import { generateUuid } from '@Utils/uuid'

const slots = useSlots()

const titleId = generateUuid('dialog-title')
const descriptionId = generateUuid('dialog-desc')

const isOpen = ref(false)
const dialogueContent = ref<HTMLDivElement | null>(null)

interface Props {
    ariaLabel: string
    focusFrom?: string | null
    focusTo?: string | null
    portalTarget?: string
    /** Dialog width. 'sm'=384px, 'md'=512px (default), 'lg'=672px, 'xl'=896px, 'fullscreen'=full viewport. */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'fullscreen'
    /** @deprecated Use size="sm" instead. */
    small?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    focusFrom: null,
    focusTo: null,
    portalTarget: '#portal-target',
    size: 'md',
    small: false
})

const { focusTo: applyFocusTo, returnFocus } = useFocusMemory()

const sizeClass = computed((): string => {
    const effectiveSize = props.small ? 'sm' : props.size
    const map: Record<string, string> = {
        sm:         'w-full sm:max-w-sm',
        md:         'w-full sm:max-w-lg',
        lg:         'w-full sm:max-w-2xl',
        xl:         'w-full sm:max-w-4xl',
        fullscreen: 'w-full max-w-full h-full max-h-full'
    }
    return map[effectiveSize] ?? map.md
})

const open = async (): Promise<void> => {
    isOpen.value = true
    await nextTick()

    const targetEl = props.focusTo
        ? document.getElementById(props.focusTo)
        : document.getElementById(titleId)

    await applyFocusTo(targetEl)
}

const close = (): void => {
    isOpen.value = false
    returnFocus()
}

defineExpose({ open, close, isOpen })
</script>
