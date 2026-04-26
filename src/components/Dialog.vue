<template>
    <Teleport
        v-if="portalReady"
        :to="resolvedPortalTarget"
    >
        <Transition>
            <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
            <section
                v-if="isOpen"
                aria-modal="true"
                class="fixed inset-0 z-20 flex items-center justify-center sm:p-6"
                role="dialog"
                :aria-describedby="hasDescription ? descriptionId : undefined"
                :aria-label="slots?.title ? undefined : ariaLabel"
                :aria-labelledby="slots?.title ? titleId : undefined"
                @keydown.esc="close"
            >
                <Scrim
                    aria-label="Close dialog"
                    @click="close"
                />

                <div
                    class="relative flex flex-col w-full h-full sm:h-auto sm:rounded-2xl sm:max-h-[90vh] overflow-hidden text-black bg-white dark:text-white dark:bg-gray-900 z-10"
                    :class="sizeClass"
                >
                    <div
                        class="flex items-center justify-between shrink-0 border-b border-gray-100 dark:border-gray-700"
                    >
                        <div
                            :id="titleId"
                            class="px-6 py-4"
                            tabindex="-1"
                        >
                            <slot name="title" />
                        </div>

                        <Button
                            aria-label="Close dialog"
                            class="self-start mr-2 mt-2"
                            color="gray"
                            variant="tertiary"
                            @click="close"
                        >
                            <Icon icon="X" />
                        </Button>
                    </div>

                    <div
                        ref="dialogueContent"
                        class="flex-1 min-h-0 p-6 overflow-auto"
                        tabindex="0"
                    >
                        <div
                            v-if="hasDescription"
                            :id="descriptionId"
                            class="mb-4"
                        >
                            <slot name="description" />
                        </div>
                        <slot />
                    </div>

                    <div
                        v-if="slots?.footer"
                        class="flex items-center justify-end gap-3 shrink-0 px-6 py-4 border-t border-gray-100 dark:border-gray-700"
                    >
                        <slot name="footer" />
                    </div>
                </div>
            </section>
        </Transition>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, useSlots } from 'vue'
import type { Slots } from 'vue'
import Button from '@Components/Button.vue'
import Icon from '@Components/Icon.vue'
import Scrim from '@Components/Scrim.vue'
import useFocusMemory from '@Composables/useFocusMemory'
import useTeleportTarget from '@Composables/useTeleportTarget'
import { generateUuid } from '@Utils/uuid'

const slots: Slots = useSlots()

const titleId = generateUuid('dialog-title')
const descriptionId = generateUuid('dialog-description')

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
    portalTarget: undefined,
    size: 'md',
    small: false
})

const {
    isReady: portalReady,
    target: resolvedPortalTarget
} = useTeleportTarget({ target: props.portalTarget })

const emit = defineEmits<{ close: [] }>()

const { focusTo: applyFocusTo, returnFocus } = useFocusMemory()
const hasDescription = computed((): boolean => !!slots.description)

const sizeClass = computed((): string => {
    const effectiveSize = props.small ? 'sm' : props.size
    const map: Record<string, string> = {
        sm:         'sm:max-w-sm',
        md:         'sm:max-w-lg',
        lg:         'sm:max-w-2xl',
        xl:         'sm:max-w-4xl',
        fullscreen: 'sm:max-w-full sm:h-full sm:max-h-full'
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
    if (!isOpen.value) return
    isOpen.value = false
    returnFocus()
    emit('close')
}

defineExpose({ open, close, isOpen })
</script>
