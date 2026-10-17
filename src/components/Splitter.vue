<template>
    <div
        ref="container"
        class="flex min-h-0 min-w-0 overflow-hidden"
        :class="orientation === 'vertical' ? 'flex-col' : 'flex-row'"
    >
        <div
            :id="primaryId"
            class="min-h-0 min-w-0 overflow-auto"
            :style="{ flex: `${value} 1 0%` }"
        >
            <slot name="primary" />
        </div>
        <!-- A focusable separator is the ARIA window-splitter widget. -->
        <!-- eslint-disable-next-line vuejs-accessibility/no-static-element-interactions -->
        <div
            ref="handle"
            class="relative flex shrink-0 items-center justify-center bg-gray-200 outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-blue-600 dark:bg-gray-700 dark:focus-visible:outline-blue-400"
            role="separator"
            :aria-controls="primaryId"
            :aria-disabled="disabled || undefined"
            :aria-label="label"
            :aria-orientation="orientation === 'horizontal' ? 'vertical' : 'horizontal'"
            :aria-valuemax="upper"
            :aria-valuemin="lower"
            :aria-valuenow="value"
            :class="[orientation === 'horizontal' ? 'w-3 touch-none cursor-col-resize' : 'h-3 touch-none cursor-row-resize', disabled ? 'cursor-default opacity-50' : 'hover:bg-blue-200 dark:hover:bg-blue-800']"
            :tabindex="disabled ? -1 : 0"
            @keydown="onKeydown"
            @lostpointercapture="stopDrag"
            @pointercancel="stopDrag"
            @pointerdown="startDrag"
            @pointermove="onPointermove"
            @pointerup="stopDrag"
        >
            <span
                aria-hidden="true"
                class="rounded-full bg-gray-500 dark:bg-gray-400"
                :class="orientation === 'horizontal' ? 'h-8 w-1' : 'h-1 w-8'"
            />
        </div>
        <div
            class="min-h-0 min-w-0 overflow-auto"
            :style="{ flex: `${100 - value} 1 0%` }"
        >
            <slot name="secondary" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { generateUuid } from '@Utils/uuid'

const props = withDefaults(defineProps<{
    label: string
    orientation?: 'horizontal' | 'vertical'
    min?: number
    max?: number
    step?: number
    disabled?: boolean
}>(), { orientation: 'horizontal', min: 10, max: 90, step: 1, disabled: false })
const model = defineModel<number>({ default: 50 })
const emit = defineEmits<{ change: [value: number] }>()
const primaryId = generateUuid('pane')
const container = ref<HTMLElement | null>(null)
const handle = ref<HTMLElement | null>(null)
const lower = computed(() => Math.min(100, Math.max(0, Number.isFinite(props.min) ? props.min : 10)))
const upper = computed(() => Math.max(lower.value, Math.min(100, Number.isFinite(props.max) ? props.max : 90)))
const value = computed(() => Math.min(upper.value, Math.max(lower.value, Number.isFinite(model.value) ? model.value : 50)))
const setValue = (next: number) => {
    const bounded = Math.round(Math.min(upper.value, Math.max(lower.value, next)) * 100) / 100
    model.value = bounded
    return bounded
}
const onKeydown = (event: KeyboardEvent) => {
    if (props.disabled) return
    const vertical = props.orientation === 'vertical'
    const keys = vertical ? ['ArrowUp', 'ArrowDown'] : ['ArrowLeft', 'ArrowRight']
    if (![...keys, 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    let next = value.value
    if (event.key === 'Home') next = lower.value
    else if (event.key === 'End') next = upper.value
    else {
        const direction = event.key === keys[0] ? -1 : 1
        const rtl = !vertical && container.value && getComputedStyle(container.value).direction === 'rtl' ? -1 : 1
        const step = Number.isFinite(props.step) && props.step > 0 ? props.step : 1
        next += direction * rtl * step * (event.shiftKey ? 10 : 1)
    }
    emit('change', setValue(next))
}
let drag: { id: number; coordinate: number; size: number; initial: number; rtl: number } | null = null
const startDrag = (event: PointerEvent) => {
    if (props.disabled || event.button !== 0 || !container.value || !handle.value) return
    event.preventDefault()
    handle.value.focus()
    const vertical = props.orientation === 'vertical'
    const rect = container.value.getBoundingClientRect()
    const bar = handle.value.getBoundingClientRect()
    const size = vertical ? rect.height - bar.height : rect.width - bar.width
    if (size <= 0) return
    drag = { id: event.pointerId, coordinate: vertical ? event.clientY : event.clientX, size, initial: value.value, rtl: !vertical && getComputedStyle(container.value).direction === 'rtl' ? -1 : 1 }
    handle.value.setPointerCapture(event.pointerId)
}
const onPointermove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id || props.disabled) return
    const coordinate = props.orientation === 'vertical' ? event.clientY : event.clientX
    setValue(drag.initial + (coordinate - drag.coordinate) / drag.size * 100 * drag.rtl)
}
const stopDrag = () => {
    if (!drag) return
    const id = drag.id
    drag = null
    if (handle.value?.hasPointerCapture(id)) handle.value.releasePointerCapture(id)
    emit('change', value.value)
}
</script>
