<template>
    <Teleport to="#portal-target">
        <div
            aria-label="Notifications"
            role="region"
            :class="containerClass"
        >
            <!-- sr-only live regions for screen reader announcements -->
            <div
                aria-atomic="true"
                aria-live="polite"
                class="sr-only"
            >
                {{ politeMsg }}
            </div>

            <div
                aria-atomic="true"
                aria-live="assertive"
                class="sr-only"
            >
                {{ assertiveMsg }}
            </div>

            <!-- Toast stack — scrollable when expanded, overflow-x-hidden contains slide transitions -->
            <div
                class="overflow-x-hidden"
                :class="{ 'flex-1 overflow-y-auto min-h-0': isExpanded }"
            >
                <TransitionGroup
                    class="relative flex flex-col gap-2"
                    tag="div"
                    :name="transitionName"
                >
                    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
                    <div
                        v-for="toast in visibleToasts"
                        :key="toast.id"
                        class="flex items-start gap-3 rounded-xl p-4 shadow border"
                        :class="[typeBorder[toast.type], typeBg[toast.type]]"
                        :role="toast.type === 'error' ? 'alert' : 'status'"
                        @focusin="!toast.permanent && pauseTimer(toast.id)"
                        @focusout="!toast.permanent && resumeTimer(toast.id, toast.duration)"
                        @mouseenter="!toast.permanent && pauseTimer(toast.id)"
                        @mouseleave="!toast.permanent && resumeTimer(toast.id, toast.duration)"
                    >
                        <Icon
                            aria-hidden="true"
                            class="my-2"
                            size="xl"
                            :class="typeIconColor[toast.type]"
                            :icon="toast.icon ?? typeIcon[toast.type]"
                        />

                        <div class="flex-1 my-2 min-w-0">
                            <p class="text-sm font-medium text-black dark:text-white">
                                {{ toast.message }}
                            </p>

                            <button
                                v-if="toast.action"
                                class="mt-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline focus-visible:outline focus-visible:outline-blue-500"
                                type="button"
                                @click="toast.action.onClick(); remove(toast.id)"
                            >
                                {{ toast.action.label }}
                            </button>
                        </div>

                        <Button
                            aria-label="Dismiss notification"
                            class="shrink-0"
                            variant="tertiary"
                            @click="remove(toast.id)"
                        >
                            <Icon
                                aria-hidden="true"
                                icon="X"
                                size="base"
                            />
                        </Button>
                    </div>
                </TransitionGroup>
            </div>

            <!-- Unified control bar — no transition, content switches in place -->
            <div
                v-if="toasts.length > MAX_VISIBLE"
                class="shrink-0 flex items-center justify-between rounded-xl px-4 py-2 shadow border bg-white dark:bg-gray-900 text-sm"
                :class="typeBorder.default"
            >
                <template v-if="!isExpanded">
                    <span class="text-black dark:text-white">
                        {{ hiddenCount }} {{ hiddenCount === 1 ? moreLabelSingular : moreLabelPlural }}
                    </span>
                    <div class="flex">
                        <Button
                            size="small"
                            variant="text"
                            @click="isExpanded = true"
                        >
                            {{ showAllLabel }}
                        </Button>

                        <Button
                            size="small"
                            variant="text"
                            @click="clear()"
                        >
                            {{ dismissAllLabel }}
                        </Button>
                    </div>
                </template>

                <template v-else>
                    <Button
                        class="ml-auto"
                        size="small"
                        variant="text"
                        @click="isExpanded = false"
                    >
                        {{ showLessLabel }}
                    </Button>
                </template>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'
import Icon from '@Components/Icon.vue'
import Button from '@Components/Button.vue'
import { useToast } from '@Composables/useToast'
import type { ToastType } from '@Composables/useToast'
import type { IconName } from '@Composables/useIcons'

type Placement = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

const props = withDefaults(defineProps<{
    dismissAllLabel?: string
    moreLabelPlural?: string
    moreLabelSingular?: string
    placement?: Placement
    showAllLabel?: string
    showLessLabel?: string
}>(), {
    dismissAllLabel: 'Dismiss all',
    moreLabelPlural: 'more notifications',
    moreLabelSingular: 'more notification',
    placement: 'top-right',
    showAllLabel: 'Show all',
    showLessLabel: 'Show less'
})

const { toasts, remove, clear, pauseTimer, resumeTimer } = useToast()

const MAX_VISIBLE = 5
const isExpanded = ref(false)

const isBottom = computed(() => props.placement.startsWith('bottom'))
const isRight = computed(() => props.placement.endsWith('right'))

const orderedToasts = computed(() =>
    isBottom.value ? [...toasts].reverse() : [...toasts]
)

const visibleToasts = computed(() =>
    isExpanded.value ? orderedToasts.value : orderedToasts.value.slice(0, MAX_VISIBLE)
)

const hiddenCount = computed(() => Math.max(0, toasts.length - MAX_VISIBLE))

const containerClass = computed(() => [
    'fixed z-100 flex gap-2 min-w-80 max-w-[calc(100vw-2rem)]',
    isBottom.value ? 'flex-col-reverse' : 'flex-col',
    isBottom.value ? 'bottom-4' : 'top-4',
    isRight.value ? 'right-4' : 'left-4',
    isExpanded.value ? 'max-h-[calc(100vh-2rem)]' : ''
])

const transitionName = computed(() => isRight.value ? 'toast-slide-right' : 'toast-slide-left')

const typeIcon: Record<ToastType, IconName> = {
    default: 'Bell',
    success: 'CircleCheck',
    error: 'CircleX',
    warning: 'AlertTriangle',
    info: 'InfoCircle'
}

const typeIconColor: Record<ToastType, string> = {
    default: 'text-gray-500 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-amber-500 dark:text-amber-400',
    info: 'text-blue-600 dark:text-blue-400'
}

const typeBorder: Record<ToastType, string> = {
    default: 'border-gray-200 dark:border-gray-700',
    success: 'border-green-200 dark:border-green-800',
    error: 'border-red-200 dark:border-red-800',
    warning: 'border-amber-200 dark:border-amber-700',
    info: 'border-blue-200 dark:border-blue-800'
}

const typeBg: Record<ToastType, string> = {
    default: 'bg-gray-50 dark:bg-gray-900',
    success: 'bg-green-50 dark:bg-green-950',
    error: 'bg-red-50 dark:bg-red-950',
    warning: 'bg-amber-50 dark:bg-amber-950',
    info: 'bg-blue-50 dark:bg-blue-950'
}

// Screen reader announcements — cleared after a tick so identical messages re-trigger
const politeMsg = ref('')
const assertiveMsg = ref('')

watch(() => toasts.length, (newLen, oldLen) => {
    if (newLen > oldLen) {
        const newest = toasts[newLen - 1]
        if (newest.type === 'error') {
            assertiveMsg.value = newest.message
            nextTick(() => { assertiveMsg.value = '' })
        } else {
            politeMsg.value = newest.message
            nextTick(() => { politeMsg.value = '' })
        }
    }
})
</script>
