<template>
    <div>
        <!-- Bar variant -->
        <template v-if="variant === 'bar'">
            <div
                v-if="label || (showValue && !isIndeterminate)"
                class="flex items-center justify-between mb-1.5"
            >
                <span
                    v-if="label"
                    :class="labelTextClass"
                >{{ label }}</span>
                <span
                    v-if="showValue && !isIndeterminate"
                    :class="valueTextClass"
                >{{ percentage }}%</span>
            </div>
            <div
                aria-valuemin="0"
                role="progressbar"
                :aria-label="label"
                :aria-valuemax="max"
                :aria-valuenow="isIndeterminate ? undefined : percentage"
                :class="trackClass"
            >
                <div
                    v-if="!isIndeterminate"
                    :class="[colorFillClass, 'h-full rounded-full transition-[width] duration-500 ease-out motion-reduce:transition-none']"
                    :style="{ width: `${percentage}%` }"
                />
                <div
                    v-else
                    :class="[colorFillClass, 'absolute inset-y-0 w-1/3 rounded-full [animation:oui-indeterminate_1.5s_ease-in-out_infinite] motion-reduce:animate-none']"
                />
            </div>
        </template>

        <!-- Circle variant -->
        <template v-else>
            <div
                aria-valuemin="0"
                role="progressbar"
                :aria-label="label"
                :aria-valuemax="max"
                :aria-valuenow="isIndeterminate ? undefined : percentage"
                :class="['relative inline-flex items-center justify-center', circleSizeClass]"
            >
                <svg
                    aria-hidden="true"
                    fill="none"
                    viewBox="0 0 36 36"
                    :class="'w-full h-full -rotate-90'"
                >
                    <circle
                        class="stroke-gray-200 dark:stroke-gray-700"
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke-width="2.5"
                    />
                    <circle
                        cx="18"
                        cy="18"
                        r="15.9155"
                        stroke-linecap="round"
                        stroke-width="2.5"
                        :class="colorStrokeClass"
                        :stroke-dasharray="`${percentage} ${100 - percentage}`"
                        :style="circleTransitionStyle"
                    />
                </svg>
                <span
                    v-if="showValue"
                    :class="['absolute font-medium text-gray-700 dark:text-gray-300', circleValueClass]"
                >{{ percentage }}%</span>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const prefersReducedMotion = typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches

const circleTransitionStyle = prefersReducedMotion ? {} : { transition: 'stroke-dasharray 0.5s ease-out' }

interface Props {
    color?: 'blue' | 'green' | 'red' | 'orange' | 'purple' | 'indigo' | 'teal' | 'pink'
    label?: string
    max?: number
    showValue?: boolean
    size?: 'sm' | 'base' | 'lg'
    value?: number
    variant?: 'bar' | 'circle'
}

const props = withDefaults(defineProps<Props>(), {
    color: 'blue',
    label: undefined,
    max: 100,
    showValue: false,
    size: 'base',
    value: undefined,
    variant: 'bar'
})

const isIndeterminate = computed(() => props.value === undefined)

const percentage = computed(() => {
    if (isIndeterminate.value) return 0
    return Math.round(Math.min(Math.max(props.value!, 0), props.max) / props.max * 100)
})

const colorFillMap: Record<string, string> = {
    blue:   'bg-blue-600 dark:bg-blue-500',
    green:  'bg-green-600 dark:bg-green-500',
    red:    'bg-red-600 dark:bg-red-500',
    orange: 'bg-orange-600 dark:bg-orange-500',
    purple: 'bg-purple-600 dark:bg-purple-500',
    indigo: 'bg-indigo-600 dark:bg-indigo-500',
    teal:   'bg-teal-600 dark:bg-teal-500',
    pink:   'bg-pink-600 dark:bg-pink-500'
}

const colorStrokeMap: Record<string, string> = {
    blue:   'stroke-blue-600 dark:stroke-blue-500',
    green:  'stroke-green-600 dark:stroke-green-500',
    red:    'stroke-red-600 dark:stroke-red-500',
    orange: 'stroke-orange-600 dark:stroke-orange-500',
    purple: 'stroke-purple-600 dark:stroke-purple-500',
    indigo: 'stroke-indigo-600 dark:stroke-indigo-500',
    teal:   'stroke-teal-600 dark:stroke-teal-500',
    pink:   'stroke-pink-600 dark:stroke-pink-500'
}

const colorFillClass = computed(() => colorFillMap[props.color] ?? colorFillMap.blue)
const colorStrokeClass = computed(() => colorStrokeMap[props.color] ?? colorStrokeMap.blue)

const barHeightMap: Record<string, string> = {
    sm:   'h-1.5',
    base: 'h-2.5',
    lg:   'h-4'
}

const labelTextSizeMap: Record<string, string> = {
    sm:   'text-xs font-medium text-gray-700 dark:text-gray-300',
    base: 'text-sm font-medium text-gray-700 dark:text-gray-300',
    lg:   'text-base font-medium text-gray-700 dark:text-gray-300'
}

const valueTextSizeMap: Record<string, string> = {
    sm:   'text-xs text-gray-500 dark:text-gray-400',
    base: 'text-sm text-gray-500 dark:text-gray-400',
    lg:   'text-base text-gray-500 dark:text-gray-400'
}

const circleSizeMap: Record<string, string> = {
    sm:   'w-16 h-16',
    base: 'w-24 h-24',
    lg:   'w-32 h-32'
}

const circleValueSizeMap: Record<string, string> = {
    sm:   'text-xs',
    base: 'text-sm',
    lg:   'text-base'
}

const trackClass = computed(() => {
    const h = barHeightMap[props.size] ?? barHeightMap.base
    return `w-full relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${h}`
})

const labelTextClass = computed(() => labelTextSizeMap[props.size] ?? labelTextSizeMap.base)
const valueTextClass = computed(() => valueTextSizeMap[props.size] ?? valueTextSizeMap.base)
const circleSizeClass = computed(() => circleSizeMap[props.size] ?? circleSizeMap.base)
const circleValueClass = computed(() => circleValueSizeMap[props.size] ?? circleValueSizeMap.base)
</script>
