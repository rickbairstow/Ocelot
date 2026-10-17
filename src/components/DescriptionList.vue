<template>
    <dl class="text-sm text-gray-900 dark:text-gray-100">
        <div
            v-for="(item, index) in items"
            :key="item.id ?? index"
            class="py-3 first:pt-0 last:pb-0"
            :class="[layout === 'horizontal' ? 'grid grid-cols-1 gap-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-4' : 'flex flex-col gap-1', divided && index > 0 ? 'border-t border-gray-200 dark:border-gray-700' : '']"
        >
            <dt class="font-medium text-gray-600 dark:text-gray-300">
                <slot
                    name="term"
                    :index="index"
                    :item="item"
                >
                    {{ item.term }}
                </slot>
            </dt>
            <dd class="min-w-0 break-words">
                <slot
                    name="value"
                    :index="index"
                    :item="item"
                >
                    {{ item.value }}
                </slot>
            </dd>
        </div>
    </dl>
</template>

<script setup lang="ts">
export interface DescriptionListItem {
    id?: string
    term: string
    value?: string | number
}

withDefaults(defineProps<{
    items: DescriptionListItem[]
    layout?: 'stacked' | 'horizontal'
    divided?: boolean
}>(), { layout: 'stacked', divided: false })
</script>
