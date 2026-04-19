<template>
    <div
        v-show="isActive"
        :id="`${ctx!.baseId}-panel-${sanitizedValue}`"
        role="tabpanel"
        tabindex="0"
        :aria-labelledby="`${ctx!.baseId}-tab-${sanitizedValue}`"
    >
        <slot />
    </div>
</template>

<script setup lang="ts">
import { inject, computed } from 'vue'
import type { TabsContext } from './Tabs.vue'

interface Props {
    value: string
}

const props = defineProps<Props>()

const ctx = inject<TabsContext>('tabs')

const sanitizedValue = computed(() => props.value.replace(/\s+/g, '-'))

const isActive = computed(() => ctx?.activeTab.value === props.value)
</script>
