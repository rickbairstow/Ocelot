<template>
    <details
        ref="details"
        class="w-full border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden shadow bg-white dark:bg-gray-800 focus-within:outline-1 focus-within:outline-blue-200 dark:focus-within:outline-blue-700"
        @toggle="handleToggle"
    >
        <summary
            class="border-0 flex justify-between gap-4 cursor-pointer p-4 hover:bg-gray-100 dark:hover:bg-gray-700 font-medium focus:outline-none"
            :aria-controls="uuid"
            :aria-expanded="isOpen"
            :class="isOpen ? 'bg-gray-100 text-black dark:bg-gray-700 dark:text-white' : 'text-gray-700 dark:text-gray-300'"
        >
            <span>{{ title }}</span>

            <Icon
                aria-hidden="true"
                :icon="isOpen ? 'ChevronUp' : 'ChevronDown'"
            />
        </summary>

        <div
            :id="uuid"
            class="content p-4 transition-all duration-[1000] ease-in-out text-gray-700 dark:text-gray-200"
        >
            <slot />
        </div>
    </details>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { generateUuid } from '@Utils/uuid'
import Icon from '@/components/Icon.vue'

const uuid = generateUuid('accordion-')

interface Props {
    startOpen?: boolean
    title: string
}

const props = withDefaults(defineProps<Props>(), {
    startOpen: false
})

const details = ref<HTMLDetailsElement | null>(null)
const isOpen = ref<boolean>(false)

const handleToggle = () => {
    isOpen.value = details.value?.open ?? false
}

onMounted(() => {
    if (props.startOpen) details.value!.open = true
    isOpen.value = details.value?.open ?? false
})
</script>
