<template>
    <component
        :is="clickable ? 'button' : 'div'"
        class="inset-0 bg-slate-600 dark:bg-slate-900 opacity-90 z-0"
        :aria-disabled="!clickable ? 'true' : undefined"
        :aria-label="clickable && ariaLabel ? ariaLabel : undefined"
        :class="[
            clickable ? 'cursor-pointer' : 'cursor-default',
            absolute ? 'absolute' : 'fixed'
        ]"
        @click="handleClick"
    />
</template>

<script setup lang="ts">
interface Props {
    absolute?: boolean
    ariaLabel?: string | null
    clickable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
    absolute: false,
    ariaLabel: null,
    clickable: true
})

const emit = defineEmits<{
    click: [e: MouseEvent]
}>()

/**
 * Emits click only if the scrim is clickable.
 */
const handleClick = (e: MouseEvent) => {
    if (!props.clickable) {
        e.preventDefault()
        e.stopPropagation()
        return
    }

    emit('click', e)
}
</script>
