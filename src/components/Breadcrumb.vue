<template>
    <nav aria-label="Breadcrumb">
        <ol class="flex flex-wrap items-center gap-1 text-sm">
            <li
                v-for="(item, index) in items"
                :key="index"
                class="flex items-center gap-1"
            >
                <span
                    v-if="index > 0"
                    aria-hidden="true"
                    :class="separatorClass"
                >
                    <Icon
                        v-if="separator === 'chevron'"
                        icon="ChevronRight"
                        size="xs"
                    />
                    <template v-else>/</template>
                </span>

                <span
                    v-if="index === items.length - 1"
                    aria-current="page"
                    class="flex items-center gap-1 font-medium text-gray-900 dark:text-white"
                >
                    <component
                        :is="resolveIcon(item.icon)"
                        v-if="item.icon && resolveIcon(item.icon)"
                        aria-hidden="true"
                        :height="14"
                        :width="14"
                    />
                    {{ item.label }}
                </span>

                <a
                    v-else-if="item.href"
                    class="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-700 hover:underline dark:text-gray-400 dark:hover:text-gray-200"
                    :href="item.href"
                >
                    <component
                        :is="resolveIcon(item.icon)"
                        v-if="item.icon && resolveIcon(item.icon)"
                        aria-hidden="true"
                        :height="14"
                        :width="14"
                    />
                    {{ item.label }}
                </a>

                <span
                    v-else
                    class="flex items-center gap-1 text-gray-500 dark:text-gray-400"
                >
                    <component
                        :is="resolveIcon(item.icon)"
                        v-if="item.icon && resolveIcon(item.icon)"
                        aria-hidden="true"
                        :height="14"
                        :width="14"
                    />
                    {{ item.label }}
                </span>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Component } from 'vue'
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'
import { availableIcons } from '@Composables/useIcons'

export interface BreadcrumbItem {
    href?: string
    icon?: IconProp
    label: string
}

interface Props {
    items: BreadcrumbItem[]
    separator?: 'chevron' | 'slash'
}

const props = withDefaults(defineProps<Props>(), {
    separator: 'chevron'
})

const separatorClass = computed(() =>
    props.separator === 'slash'
        ? 'text-gray-400 dark:text-gray-600 select-none'
        : 'text-gray-400 dark:text-gray-600'
)

const resolveIcon = (icon: IconProp | undefined): Component | null => {
    if (!icon) return null
    if (typeof icon !== 'string') return icon
    return availableIcons[icon] ?? null
}
</script>
