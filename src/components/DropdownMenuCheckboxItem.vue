<template>
    <button
        role="menuitemcheckbox"
        tabindex="-1"
        :aria-checked="checked ? 'true' : 'false'"
        :aria-disabled="disabled ? 'true' : undefined"
        :class="itemClass"
        @click="handleClick"
    >
        <span
            aria-hidden="true"
            class="flex h-4 w-4 shrink-0 items-center justify-center"
        >
            <Icon
                v-if="checked"
                icon="Check"
                size="xs"
            />
        </span>
        <Icon
            v-if="icon"
            aria-hidden="true"
            size="base"
            :icon="icon"
        />
        <span class="flex-1 text-start">{{ label }}</span>
    </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from './Icon.vue'
import type { IconProp } from '@Composables/useIcons'

interface Props {
    checked?: boolean
    disabled?: boolean
    icon?: IconProp
    label: string
}

const props = withDefaults(defineProps<Props>(), {
    checked: false,
    disabled: false,
    icon: undefined
})

const emit = defineEmits<{
    'update:checked': [value: boolean]
}>()

const handleClick = () => {
    if (props.disabled) return
    emit('update:checked', !props.checked)
}

const base = 'flex w-full cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 focus:bg-gray-100 dark:hover:bg-gray-800 dark:focus:bg-gray-800'

const itemClass = computed(() =>
    props.disabled ? `${base} cursor-not-allowed opacity-50` : base
)
</script>
