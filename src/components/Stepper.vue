<template>
    <div
        class="sr-only"
        role="status"
    >
        {{ progressAnnouncement }}
    </div>
    <ol
        :aria-label="ariaLabel"
        :class="orientation === 'vertical' ? 'flex flex-col' : 'flex w-full'"
    >
        <li
            v-for="(step, index) in steps"
            :key="index"
            :aria-current="index + 1 === modelValue ? 'step' : undefined"
            :class="orientation === 'vertical' ? 'flex gap-3' : 'flex flex-1 flex-col items-center last:flex-none'"
        >
            <!-- Horizontal layout: connector + circle row -->
            <template v-if="orientation === 'horizontal'">
                <div class="flex w-full items-center">
                    <div
                        v-if="index > 0"
                        :class="['flex-1 h-0.5 transition-colors duration-300', isConnectorComplete(index - 1) ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700']"
                    />
                    <div :class="circleClass(index)">
                        <Icon
                            v-if="getState(index) === 'completed'"
                            aria-hidden="true"
                            icon="Check"
                            size="sm"
                        />
                        <component
                            :is="resolveIcon(step.icon)"
                            v-else-if="step.icon && resolveIcon(step.icon)"
                            aria-hidden="true"
                            :height="16"
                            :width="16"
                        />
                        <span
                            v-else
                            class="text-sm font-medium leading-none"
                        >{{ index + 1 }}</span>
                    </div>
                    <div
                        v-if="index < steps.length - 1"
                        :class="['flex-1 h-0.5 transition-colors duration-300', isConnectorComplete(index) ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700']"
                    />
                </div>
                <div class="mt-2 text-center px-1">
                    <p :class="titleClass(index)">
                        {{ step.title }}
                    </p>
                    <p
                        v-if="step.description"
                        class="mt-0.5 text-xs text-gray-500 dark:text-gray-400"
                    >
                        {{ step.description }}
                    </p>
                </div>
            </template>

            <!-- Vertical layout: circle + line column beside text -->
            <template v-else>
                <div class="flex flex-col items-center">
                    <div :class="circleClass(index)">
                        <Icon
                            v-if="getState(index) === 'completed'"
                            aria-hidden="true"
                            icon="Check"
                            size="sm"
                        />
                        <component
                            :is="resolveIcon(step.icon)"
                            v-else-if="step.icon && resolveIcon(step.icon)"
                            aria-hidden="true"
                            :height="16"
                            :width="16"
                        />
                        <span
                            v-else
                            class="text-sm font-medium leading-none"
                        >{{ index + 1 }}</span>
                    </div>
                    <div
                        v-if="index < steps.length - 1"
                        :class="['w-0.5 flex-1 min-h-6 mt-1 transition-colors duration-300', isConnectorComplete(index) ? 'bg-blue-600 dark:bg-blue-500' : 'bg-gray-200 dark:bg-gray-700']"
                    />
                </div>
                <div :class="['pb-8 last:pb-0', index < steps.length - 1 ? 'pb-8' : '']">
                    <p :class="titleClass(index)">
                        {{ step.title }}
                    </p>
                    <p
                        v-if="step.description"
                        class="mt-0.5 text-sm text-gray-500 dark:text-gray-400"
                    >
                        {{ step.description }}
                    </p>
                </div>
            </template>
        </li>
    </ol>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'
import { availableIcons } from '@Composables/useIcons'

export interface StepItem {
    description?: string
    icon?: IconProp
    title: string
}

type StepState = 'completed' | 'current' | 'upcoming'

interface Props {
    ariaLabel?: string
    modelValue: number
    orientation?: 'horizontal' | 'vertical'
    steps: StepItem[]
}

const props = withDefaults(defineProps<Props>(), {
    ariaLabel: 'Progress steps',
    orientation: 'horizontal'
})

const getState = (index: number): StepState => {
    const stepNum = index + 1
    if (stepNum < props.modelValue) return 'completed'
    if (stepNum === props.modelValue) return 'current'
    return 'upcoming'
}

const isConnectorComplete = (index: number): boolean => index + 1 < props.modelValue

const resolveIcon = (icon: IconProp | undefined): Component | null => {
    if (!icon) return null
    if (typeof icon !== 'string') return icon
    return availableIcons[icon] ?? null
}

const circleBase = 'flex shrink-0 items-center justify-center rounded-full w-9 h-9 transition-colors duration-300'

const circleClass = computed(() => (index: number): string => {
    const state = getState(index)
    if (state === 'completed') return `${circleBase} bg-blue-600 text-white dark:bg-blue-500`
    if (state === 'current') return `${circleBase} border-2 border-blue-600 bg-white text-blue-600 dark:border-blue-400 dark:bg-gray-950 dark:text-blue-400`
    return `${circleBase} border-2 border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-950 dark:text-gray-400`
})

const titleClass = computed(() => (index: number): string => {
    const state = getState(index)
    if (state === 'completed') return 'text-sm font-medium text-gray-700 dark:text-gray-300'
    if (state === 'current') return 'text-sm font-semibold text-blue-600 dark:text-blue-400'
    return 'text-sm font-medium text-gray-500 dark:text-gray-400'
})

const progressAnnouncement = computed((): string => {
    const current = Math.min(Math.max(props.modelValue, 1), props.steps.length)
    return `Step ${current} of ${props.steps.length}`
})
</script>
