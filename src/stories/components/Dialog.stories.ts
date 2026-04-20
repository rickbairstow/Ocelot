import type { Meta, StoryObj } from '@storybook/vue3'
import Dialog from '@Components/Dialog.vue'
import Button from '@Components/Button.vue'
import { faker } from '@faker-js/faker'
import { ref } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta: Meta<typeof Dialog> = {
    title: 'Components/Dialog',
    component: Dialog,

    parameters: {
        docs: {
            description: {
                component: 'A modal overlay for focused interactions such as confirmations, forms, and detail views. Manages focus trapping and restoration automatically, and renders outside the component tree via a portal.'
            }
        }
    },

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
                <template #description>
                    <p>Dialog description text.</p>
                </template>
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
        await expect(dialog).toHaveAttribute('aria-describedby')

        const title = await canvas.findByText(/dialog title/i)
        await expect(title).toHaveFocus()

        const closeButtons = await canvas.findAllByRole('button', { name: /close dialog/i })
        const closeButton = closeButtons.find((button) => button.className.includes('self-start'))
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

export const WithScrollingContent: Story = {
    render: () => ({
        components: { Dialog },
        setup() {
            const dialog = ref<InstanceType<typeof Dialog> | null>(null)
            return { dialog, body: faker.lorem.paragraphs(12) }
        },
        template: `
            <div id="portal-target"></div>
            <button id="dialogTrigger" @click="dialog.open()">Open dialog</button>
            <Dialog ref="dialog" aria-label="Long content" focus-from="dialogTrigger">
                <template #title>Long content dialog</template>
                <template #description>
                    <p class="text-gray-700 dark:text-gray-300">This dialog contains enough copy to verify scrolling content and description linkage.</p>
                </template>
                <p class="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{{ body }}</p>
                <template #footer>
                    <button @click="dialog.close()">Close</button>
                </template>
            </Dialog>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /open dialog/i }))
        const dialog = await canvas.findByRole('dialog')
        await waitFor(() => expect(dialog).toBeVisible())
    }
}

export const WithForm: Story = {
    render: () => ({
        components: { Dialog },
        setup() {
            const dialog = ref<InstanceType<typeof Dialog> | null>(null)
            return { dialog }
        },
        template: `
            <div id="portal-target"></div>
            <button id="dialogTrigger" @click="dialog.open()">Open form dialog</button>
            <Dialog ref="dialog" aria-label="Edit profile" focus-from="dialogTrigger">
                <template #title>Edit profile</template>
                <template #description>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Update your personal details below.</p>
                </template>
                <form class="flex flex-col gap-4">
                    <label class="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Name
                        <input id="nameField" class="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600" type="text" placeholder="Your name" />
                    </label>
                    <label class="flex flex-col gap-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email
                        <input class="border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-600" type="email" placeholder="you@example.com" />
                    </label>
                </form>
                <template #footer>
                    <button @click="dialog.close()">Cancel</button>
                    <button @click="dialog.close()">Save</button>
                </template>
            </Dialog>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /open form dialog/i }))
        const dialog = await canvas.findByRole('dialog')
        await waitFor(() => expect(dialog).toBeVisible())
        const nameInput = canvas.getByPlaceholderText('Your name')
        await userEvent.click(nameInput)
        await userEvent.type(nameInput, 'Jane Doe')
        await expect(nameInput).toHaveValue('Jane Doe')
    }
}


export const ConfirmPattern: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Example of composing a confirmation dialog from Dialog + Button. Wire `@close` to handle dismissal (Escape or scrim click).'
            }
        }
    },
    render: () => ({
        components: { Dialog, Button },
        setup() {
            const dialog = ref<InstanceType<typeof Dialog> | null>(null)
            const result = ref<string | null>(null)
            const open = () => {
                result.value = null
                dialog.value?.open()
            }
            const confirm = () => { result.value = 'confirmed'; dialog.value?.close() }
            const cancel = () => { result.value = 'cancelled'; dialog.value?.close() }
            const handleClose = () => { if (result.value === null) result.value = 'cancelled' }
            return { dialog, result, open, confirm, cancel, handleClose }
        },
        template: `
            <div id="portal-target"></div>
            <Button id="deleteTrigger" color="red" @click="open">Delete item</Button>
            <p v-if="result" class="mt-4 text-sm text-gray-600 dark:text-gray-400" data-testid="result">
                Result: {{ result }}
            </p>
            <Dialog
                ref="dialog"
                aria-label="Delete item"
                focus-from="deleteTrigger"
                size="sm"
                @close="handleClose"
            >
                <template #title>Delete item?</template>
                <p class="text-gray-700 dark:text-gray-300">This item will be permanently removed. This action cannot be undone.</p>
                <template #footer>
                    <Button color="gray" variant="secondary" @click="cancel">Cancel</Button>
                    <Button color="red" @click="confirm">Delete</Button>
                </template>
            </Dialog>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: /delete item/i }))
        const dialog1 = await canvas.findByRole('dialog')
        await waitFor(() => expect(dialog1).toBeVisible())
        await userEvent.click(canvas.getByRole('button', { name: /^delete$/i }))
        await waitFor(() => expect(dialog1).not.toBeVisible())
        await expect(canvas.getByTestId('result')).toHaveTextContent('confirmed')

        await userEvent.click(canvas.getByRole('button', { name: /delete item/i }))
        const dialog2 = await canvas.findByRole('dialog')
        await waitFor(() => expect(dialog2).toBeVisible())
        await userEvent.click(canvas.getByRole('button', { name: /cancel/i }))
        await waitFor(() => expect(dialog2).not.toBeVisible())
        await expect(canvas.getByTestId('result')).toHaveTextContent('cancelled')
    }
}
