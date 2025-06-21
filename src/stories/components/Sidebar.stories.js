import Sidebar from '@Components/Sidebar.vue'
import { ref } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'

export default {
    title: 'Components/Sidebar',
    component: Sidebar,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content'
        },
        title: {
            control: 'text',
            description: 'Title slot content'
        },
        footer: {
            control: 'text',
            description: 'Footer slot content'
        },
        showScrim: {
            control: 'boolean',
            description: 'Sets if the scrim should show when the menu is open.'
        },
        side: {
            control: 'select',
            options: ['left', 'right'],
            description: 'Sets what side the sidebar displays on.'
        }
    },

    args: {
        default: 'Sidebar content',
        footer: 'Sidebar footer',
        showScrim: true,
        side: 'left',
        title: 'Sidebar title'
    },

    render: (args) => ({
        components: { Sidebar },
        setup() {
            const sidebar = ref(null)
            const triggerRef = ref(null)

            const openSidebar = () => {
                sidebar.value.open()
            }

            return {
                args,
                sidebar,
                triggerRef,
                openSidebar
            }
        },

        template: `
            <button
                ref="triggerRef"
                type="button"
                class="mb-4 border px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                @click="openSidebar"
            >
                Open Sidebar
            </button>

            <Sidebar
                ref="sidebar"
                :side="args.side"
                :show-scrim="args.showScrim"
            >
                <template #title>{{ args.title }}</template>
                <template #default>{{ args.default }}</template>
                <template #footer>{{ args.footer }}</template>
            </Sidebar>
        `
    })
}

// ✅ Interaction test for focus behavior
export const Left = {
    args: { side: 'left' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const openButton = await canvas.getByRole('button', {
            name: 'Open Sidebar'
        })
        await userEvent.click(openButton)

        const closeButtons = await canvas.findAllByRole('button', {
            name: 'Close sidebar'
        })
        const visibleCloseButton = closeButtons.find(
            (btn) => btn.offsetParent !== null
        )

        await waitFor(() => {
            expect(visibleCloseButton).toBeVisible()
        })

        visibleCloseButton.focus()
        await expect(visibleCloseButton).toHaveFocus()

        // Click the close button instead of Escape
        await userEvent.click(visibleCloseButton)

        // Assert focus returns to the original trigger
        await waitFor(() => {
            expect(openButton).toHaveFocus()
        })
    }
}

export const Right = {
    args: { side: 'right' },
    play: Left.play // same test logic
}
