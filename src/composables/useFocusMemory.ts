import { ref, nextTick } from 'vue'
import type { Ref } from 'vue'

const useFocusMemory = () => {
    const focusFrom: Ref<HTMLElement | null> = ref(null)

    /**
     * Record current focus and move focus into a target element.
     */
    const focusTo = async (targetEl: HTMLElement | null): Promise<void> => {
        focusFrom.value = document.activeElement as HTMLElement | null
        await nextTick()

        if (!targetEl) return

        const focusable = targetEl.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (focusable) {
            focusable.focus()
        } else {
            targetEl.focus?.()
        }
    }

    /**
     * Return focus to the previously active element.
     */
    const returnFocus = (): void => {
        focusFrom.value?.focus()
    }

    return { focusTo, returnFocus, focusFrom }
}

export default useFocusMemory
