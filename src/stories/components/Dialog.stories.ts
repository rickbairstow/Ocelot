import type { Meta, StoryObj } from '@storybook/vue3'
import Dialog from '@Components/Dialog.vue'
import { ref } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta: Meta<typeof Dialog> = {
    title: 'Components/Dialog',
    component: Dialog,

    argTypes: {
        ariaLabel: {
            control: 'text',
            description: 'Accessible label when no title slot is provided.'
        },
        focusFrom: {
            control: 'text',
            description: 'ID of the element to return focus to when the dialog closes.'
        },
        focusTo: {
            control: 'text',
            description: 'ID of the element to focus when the dialog opens.'
        },
        size: {
            control: 'select',
            options: ['sm', 'md', 'lg', 'xl', 'fullscreen'],
            description: 'Dialog width. sm=384px, md=512px, lg=672px, xl=896px, fullscreen=viewport.'
        }
    },

    args: {
        ariaLabel: 'My dialog',
        focusFrom: 'dialogTrigger',
        focusTo: '',
        size: 'md'
    },

    render: (args) => ({
        components: { Dialog },
        setup() {
            const dialog = ref<{ open(): void } | null>(null)
            const openDialog = () => dialog.value?.open()
            return { args, dialog, openDialog }
        },
        template: `
            <div id="portal-target"></div>

            <button
                id="dialogTrigger"
                class="focus:outline-1"
                @click="openDialog"
            >
                Click to open the Dialog
            </button>

            <Dialog
                ref="dialog"
                :aria-label="args.ariaLabel"
                :focus-from="args.focusFrom"
                :focus-to="args.focusTo"
                :size="args.size"
            >
                <template #title>Dialog title</template>
                Dialog content goes here.
                <template #footer>
                    <button @click="dialog.close()">Close</button>
                </template>
            </Dialog>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const openButton = await canvas.findByRole('button', { name: /click to open the dialog/i })
        await userEvent.click(openButton)

        const dialog = await canvas.findByRole('dialog', { name: /dialog title/i })
        await waitFor(() => expect(dialog).toBeVisible())

        const title = await canvas.findByText(/dialog title/i)
        await expect(title).toHaveFocus()

        const closeButtons = await canvas.findAllByRole('button', { name: /close dialog/i })
        const closeButton = closeButtons.find(
            (btn) => getComputedStyle(btn).display !== 'none' && !btn.classList.contains('sr-only')
        )
        await userEvent.click(closeButton!)

        await waitFor(() => expect(dialog).not.toBeVisible())
        await expect(openButton).toHaveFocus()
    }
}

export const Small: Story = {
    args: { size: 'sm' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /click to open/i }))
        const dialog = await canvas.findByRole('dialog')
        await waitFor(() => expect(dialog).toBeVisible())
    }
}

export const Large: Story = {
    args: { size: 'lg' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /click to open/i }))
        const dialog = await canvas.findByRole('dialog')
        await waitFor(() => expect(dialog).toBeVisible())
    }
}

export const Fullscreen: Story = {
    args: { size: 'fullscreen' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /click to open/i }))
        const dialog = await canvas.findByRole('dialog')
        await waitFor(() => expect(dialog).toBeVisible())
    }
}

export const WithDescription: Story = {
    render: () => ({
        components: { Dialog },
        setup() {
            const dialog = ref<{ open(): void } | null>(null)
            return { dialog }
        },
        template: `
            <div id="portal-target"></div>

            <button id="dialogTrigger" @click="dialog.open()">Open dialog</button>

            <Dialog ref="dialog" aria-label="Confirm delete" focus-from="dialogTrigger">
                <template #title>Confirm deletion</template>
                <template #description>This action cannot be undone. All associated data will be permanently removed.</template>
                Are you sure you want to delete this item?
            </Dialog>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }))
        const dialog = await canvas.findByRole('dialog')
        await waitFor(() => expect(dialog).toBeVisible())
        const desc = canvas.getByText(/cannot be undone/i)
        await expect(desc).toBeVisible()
    }
}

