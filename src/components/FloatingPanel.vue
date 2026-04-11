<template>
    <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
    <div
        @focusin="handleFocusIn"
        @focusout="handleFocusOut"
        @keydown.esc="close"
    >
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions,vuejs-accessibility/mouse-events-have-key-events -->
        <div
            ref="triggerRef"
            @click="handleTriggerClick"
            @keydown.enter.prevent="handleTriggerClick"
            @mouseenter="handleTriggerMouseEnter"
            @mouseleave="handleTriggerMouseLeave"
            @pointerdown="handleTriggerPointerDown"
        >
            <slot name="trigger" />
        </div>

        <Transition
            enter-active-class="transition-opacity duration-150 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-opacity duration-150 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
        >
            <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions,vuejs-accessibility/mouse-events-have-key-events -->
            <div
                v-if="isOpen && !disabled"
                :id="panelId"
                ref="contentRef"
                class="z-30 rounded-lg bg-white text-black text-xs break-words drop-shadow-lg dark:bg-gray-800 dark:text-white"
                :role="role ?? undefined"
                :style="floatingStyle"
                @mouseenter="handleContentMouseEnter"
                @mouseleave="handleContentMouseLeave"
            >
                <div
                    ref="arrowRef"
                    aria-hidden="true"
                    class="absolute h-0 w-0"
                    :style="arrowComputedStyle"
                />

                <div
                    class="rounded-[10px] text-xs leading-4"
                    :class="{ 'px-[15px]': !flush, 'py-[10px]': !flush }"
                    :style="{ maxWidth: normalizedMaxWidth }"
                >
                    <slot name="content" />
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import type { CSSProperties } from 'vue'
import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift
} from '@floating-ui/dom'
import type { Placement } from '@floating-ui/dom'
import { generateUuid } from '@Utils/uuid'

type Interaction = 'all' | 'click' | 'hover'
type PanelRole = 'listbox' | 'menu' | 'tooltip' | null

interface Props {
    disabled?: boolean
    flush?: boolean
    interaction?: Interaction
    maxWidth?: number | string
    placement?: Placement
    role?: PanelRole
}

const props = withDefaults(defineProps<Props>(), {
    disabled: false,
    flush: false,
    interaction: 'all',
    maxWidth: '260px',
    placement: 'bottom',
    role: null
})

const emit = defineEmits<{
    close: []
    open: []
}>()

const arrowRef = ref<HTMLElement | null>(null)
const arrowDirection = ref<string>(props.placement.split('-')[0])
const arrowStyle = ref<Record<string, string>>({})
const cleanupAutoUpdate = ref<(() => void) | null>(null)
const closeTimeoutId = ref<ReturnType<typeof setTimeout> | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const isDark = ref(false)
const isHoveringContent = ref(false)
const isHoveringTrigger = ref(false)
const isOpen = ref(false)
const panelId = generateUuid('floating-panel')
const triggerRef = ref<HTMLElement | null>(null)
const x = ref(0)
const y = ref(0)

let darkObserver: MutationObserver | null = null
let pointerFocusPending = false
let wasOpenAtPointerDown = false

const POSITION_STRATEGY = 'fixed' as const

const VALID_PLACEMENTS: Placement[] = [
    'top', 'top-start', 'top-end',
    'right', 'right-start', 'right-end',
    'bottom', 'bottom-start', 'bottom-end',
    'left', 'left-start', 'left-end'
]

const OPPOSITE_SIDE: Record<string, string> = {
    bottom: 'top',
    left: 'right',
    right: 'left',
    top: 'bottom'
}

/**
 * ARIA attributes that this component manages on the trigger's focusable child.
 * These are removed and re-applied whenever triggerAria changes.
 */
const MANAGED_ARIA_ATTRS = ['aria-controls', 'aria-describedby', 'aria-expanded', 'aria-haspopup'] as const

const arrowColor = computed(() => isDark.value ? 'rgb(31 41 55)' : 'white')

const normalizedMaxWidth = computed((): string => {
    const val = String(props.maxWidth)
    return /^\d+$/.test(val) ? `${val}px` : val
})

const floatingStyle = computed((): CSSProperties => ({
    left: `${x.value}px`,
    position: POSITION_STRATEGY,
    top: `${y.value}px`
}))

const arrowComputedStyle = computed((): Record<string, string> => {
    const color = arrowColor.value
    const directionStyles: Record<string, Record<string, string>> = {
        bottom: { borderBottomColor: color, borderWidth: '0 9px 9px' },
        left:   { borderLeftColor: color, borderWidth: '9px 0 9px 9px' },
        right:  { borderRightColor: color, borderWidth: '9px 9px 9px 0' },
        top:    { borderTopColor: color, borderWidth: '9px 9px 0' }
    }
    return {
        borderColor: 'transparent',
        borderStyle: 'solid',
        ...(directionStyles[arrowDirection.value] ?? {}),
        ...arrowStyle.value
    }
})

const triggerAria = computed((): Record<string, string> => {
    if (props.disabled) return {}

    if (props.role === 'tooltip' && isOpen.value) {
        return { 'aria-describedby': panelId }
    }

    if (props.role === 'menu' || props.role === 'listbox') {
        return {
            'aria-controls': panelId,
            'aria-expanded': isOpen.value ? 'true' : 'false',
            'aria-haspopup': props.role
        }
    }

    return {}
})

/**
 * Propagates ARIA attributes to the first focusable descendant inside the trigger
 * slot (or the trigger wrapper itself when no focusable child exists). This ensures
 * screen readers receive aria-describedby / aria-haspopup on the interactive element
 * rather than on a non-interactive wrapper div.
 */
watchEffect(() => {
    const wrapper = triggerRef.value
    if (!wrapper) return

    const focusable = wrapper.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const target = focusable ?? wrapper

    MANAGED_ARIA_ATTRS.forEach((attr) => target.removeAttribute(attr))
    Object.entries(triggerAria.value).forEach(([key, val]) => target.setAttribute(key, val))
})

const clearCloseTimeout = (): void => {
    if (closeTimeoutId.value) {
        clearTimeout(closeTimeoutId.value)
        closeTimeoutId.value = null
    }
}

const close = (): void => {
    isOpen.value = false
    emit('close')
}

const open = (): void => {
    if (props.disabled) return
    isOpen.value = true
    emit('open')
}

const destroyAutoPositioning = (): void => {
    if (cleanupAutoUpdate.value) {
        cleanupAutoUpdate.value()
        cleanupAutoUpdate.value = null
    }
}

const closeIfNotInteracting = (): void => {
    const active = document.activeElement
    const hasFocusInside =
        triggerRef.value?.contains(active) || contentRef.value?.contains(active)
    const isHovering = isHoveringTrigger.value || isHoveringContent.value

    if (!isHovering && !hasFocusInside) {
        close()
    }
}

const scheduleClose = (): void => {
    clearCloseTimeout()
    closeTimeoutId.value = window.setTimeout(() => {
        closeTimeoutId.value = null
        closeIfNotInteracting()
    }, 200)
}

const setHoverState = (hoverRef: { value: boolean }, hovering: boolean): void => {
    hoverRef.value = hovering
    if (hovering) {
        clearCloseTimeout()
        open()
    } else {
        scheduleClose()
    }
}

const handleFocusIn = (): void => {
    if (props.disabled || props.interaction === 'click') return
    if (pointerFocusPending) {
        pointerFocusPending = false
        return
    }
    clearCloseTimeout()
    open()
}

const handleTriggerPointerDown = (): void => {
    pointerFocusPending = true
    wasOpenAtPointerDown = isOpen.value
}

const handleFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null
    if (next && (triggerRef.value?.contains(next) || contentRef.value?.contains(next))) return
    scheduleClose()
}

const handleTriggerClick = (): void => {
    if (props.disabled || props.interaction === 'hover') return
    if (wasOpenAtPointerDown) {
        close()
    } else {
        open()
    }
}

const handleContentMouseEnter = (): void => {
    if (props.disabled || props.interaction === 'click') return
    setHoverState(isHoveringContent, true)
}

const handleContentMouseLeave = (): void => {
    if (props.disabled || props.interaction === 'click') return
    setHoverState(isHoveringContent, false)
}

const handleTriggerMouseEnter = (): void => {
    if (props.disabled || props.interaction === 'click') return
    setHoverState(isHoveringTrigger, true)
}

const handleTriggerMouseLeave = (): void => {
    if (props.disabled || props.interaction === 'click') return
    setHoverState(isHoveringTrigger, false)
}

/**
 * Closes the panel when the user clicks or taps outside both the trigger and content.
 * Uses pointerdown so it fires before focus changes, keeping close logic consistent
 * across mouse and touch input.
 */
const handleOutsidePointerDown = (event: PointerEvent): void => {
    const target = event.target as Node
    if (
        triggerRef.value?.contains(target) ||
        contentRef.value?.contains(target)
    ) return
    close()
}

const initAutoPositioning = (): void => {
    if (!triggerRef.value || !contentRef.value || !arrowRef.value) return

    cleanupAutoUpdate.value = autoUpdate(triggerRef.value, contentRef.value, () => {
        if (!triggerRef.value || !contentRef.value || !arrowRef.value) return

        computePosition(triggerRef.value, contentRef.value, {
            middleware: [
                offset(12),
                flip({
                    fallbackPlacements: VALID_PLACEMENTS.filter((p) => p !== props.placement),
                    fallbackStrategy: 'initialPlacement'
                }),
                shift({ padding: 8 }),
                arrow({ element: arrowRef.value, padding: 4 })
            ],
            placement: props.placement,
            strategy: POSITION_STRATEGY
        }).then(({ middlewareData, placement: finalPlacement, x: nextX, y: nextY }) => {
            x.value = nextX
            y.value = nextY

            const side = finalPlacement.split('-')[0]
            arrowDirection.value = side

            const arrowData = middlewareData.arrow ?? {}
            const style: Record<string, string> = {}
            const oppositePlacement = OPPOSITE_SIDE[side]

            if (oppositePlacement) {
                style[oppositePlacement] = '-9px'
            }

            if ((side === 'top' || side === 'bottom') && typeof arrowData.x === 'number') {
                style.left = `${arrowData.x}px`
            }

            if ((side === 'left' || side === 'right') && typeof arrowData.y === 'number') {
                style.top = `${arrowData.y}px`
            }

            arrowStyle.value = style
        })
    })
}

watch(isOpen, async (visible) => {
    if (visible && !props.disabled) {
        await nextTick()
        initAutoPositioning()
        document.addEventListener('pointerdown', handleOutsidePointerDown)
    } else {
        destroyAutoPositioning()
        document.removeEventListener('pointerdown', handleOutsidePointerDown)
    }
})

watch(
    () => props.disabled,
    (disabled) => {
        if (disabled) close()
    }
)

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
    darkObserver = new MutationObserver(() => {
        isDark.value = document.documentElement.classList.contains('dark')
    })
    darkObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
})

onBeforeUnmount(() => {
    destroyAutoPositioning()
    clearCloseTimeout()
    document.removeEventListener('pointerdown', handleOutsidePointerDown)
    darkObserver?.disconnect()
    darkObserver = null
})

defineExpose({ close, isOpen, open, panelId })
</script>
