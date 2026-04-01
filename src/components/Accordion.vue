<template>
    <details
        ref="details"
        class="w-full border border-gray-100 rounded-xl overflow-hidden shadow focus-within:outline-1 focus-within:outline-blue-200"
        @toggle="handleToggle"
    >
        <summary
            class="border-0 flex justify-between gap-4 cursor-pointer p-4 hover:bg-gray-100 font-medium focus:outline-none"
            :aria-controls="uuid"
            :aria-expanded="isOpen.toString()"
            :class="isOpen ? 'bg-gray-100 text-black' : 'text-gray-700'"
        >
            <span>{{ title }}</span>
            <Icon
                aria-hidden="true"
                :icon="isOpen ? 'ChevronUp' : 'ChevronDown'"
            />
        </summary>

        <div
            :id="uuid"
            class="content p-4 transition-all duration-[1000] ease-in-out"
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
const isOpen = ref(false)

const handleToggle = () => {
    isOpen.value = details.value?.open ?? false
}

onMounted(() => {
    if (props.startOpen) details.value!.open = true
    isOpen.value = details.value?.open ?? false
})
</script>
