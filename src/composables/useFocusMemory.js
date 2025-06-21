import { ref, nextTick } from 'vue'

/**
 * Manage focus in/out of a popup-like component.
 * Records the element that had focus before opening, and provides a method to return focus.
 */
export function useFocusMemory() {
    const focusFrom = ref(null)

    /**
     * Record current focus and move focus into target element.
     * @param {HTMLElement} targetEl - The element to move focus into.
     * @returns {Promise<void>}
     */
    const focusTo = async (targetEl) => {
        focusFrom.value = document.activeElement
        await nextTick()

        if (!targetEl) return

        const focusable = targetEl.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        if (focusable instanceof HTMLElement) {
            focusable.focus()
        } else {
            targetEl.focus?.()
        }
    }

    /**
     * Return focus to previously active element.
     * @returns {void}
     */
    const returnFocus = () => {
        if (focusFrom.value instanceof HTMLElement) {
            focusFrom.value.focus()
        }
    }

    return {
        focusTo,
        returnFocus,
        focusFrom
    }
}
