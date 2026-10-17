import { runInteractionTests } from '../interactionMode'
import Button from '@Components/Button.vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import Toast from '@Components/Toast.vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { useToast } from '@Composables/useToast'
import type { ToastType } from '@Composables/useToast'
import { ref } from 'vue'

const placements = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const
const types: ToastType[] = ['default', 'success', 'error', 'warning', 'info']

const meta: Meta<typeof Toast> = {
    title: 'Components/Toast',
    component: Toast,

    parameters: {
        docs: {
            description: {
                component: 'A non-blocking notification that appears temporarily at the screen edge. Managed via the `useToast` composable — call `useToast().add()` from anywhere to trigger a toast. Supports success, error, warning, and info types with optional actions.' + '\n\nDefault uses the default placement and notification type. Mount Toast once and call useToast().add(message, options). With Action demonstrates Undo; On Dismiss demonstrates onClose. Permanent requires explicit dismissal. Stacking shows the collapsed overflow list.'
            }
        }
    },

    argTypes: {
        placement: {
            control: 'select',
            options: placements,
            description: 'Corner of the screen where the toast stack appears.'
        }
    },

    args: {
        placement: 'top-right'
    },

    render: (args) => ({
        components: { Toast, Button },
        setup() {
            const { add, clear } = useToast()
            return { args, add, clear }
        },
        template: `
            <div id="portal-target"></div>

            <Button @click="add('Your changes have been saved.')">
                Add toast
            </Button>

            <Toast :placement="args.placement" />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: /add toast/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())

        const dismiss = canvas.getByRole('button', { name: /dismiss notification/i })
        await userEvent.click(dismiss)

        await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument())
    }
}

export const AllTypes: Story = {
    render: () => ({
        components: { Toast, Button },
        setup() {
            const { add, clear } = useToast()
            return { types, add, clear }
        },
        template: `
            <div id="portal-target"></div>

            <div class="flex flex-wrap gap-2">
                <Button
                    v-for="type in types"
                    :key="type"
                    class="capitalize"
                    @click="add(\`This is a \${type} notification.\`, { type })"
                >
                    {{ type }}
                </Button>
            </div>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)

        for (const type of types) {
            await userEvent.click(canvas.getByRole('button', { name: new RegExp(type, 'i') }))
        }

        const statuses = await canvas.findAllByRole('status')
        const alerts = await canvas.findAllByRole('alert')

        await waitFor(() => {
            expect(statuses.length + alerts.length).toBe(5)
        })
    }
}

export const WithAction: Story = {
    render: () => ({
        components: { Toast, Button },
        setup() {
            const { add, clear } = useToast()
            const deleted = ref(false)
            const addWithAction = () => {
                deleted.value = true
                add('Receipt deleted.', {
                    action: { label: 'Undo', onClick: () => { deleted.value = false } }
                })
            }
            return { addWithAction, clear, deleted }
        },
        template: `
            <div id="portal-target"></div>

            <div class="grid max-w-sm gap-3">
                <p class="text-gray-900 dark:text-gray-100">{{ deleted ? 'Receipt removed.' : 'receipt.pdf' }}</p>
                <Button :disabled="deleted" @click="addWithAction">Delete receipt</Button>
            </div>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /delete receipt/i }))
        await expect(canvas.getByText('Receipt removed.')).toBeVisible()

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())

        const actionBtn = canvas.getByRole('button', { name: /undo/i })
        await expect(actionBtn).toBeVisible()
        await userEvent.click(actionBtn)
        await expect(canvas.getByText('receipt.pdf')).toBeVisible()

        await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument())
    }
}

export const WithCustomIcon: Story = {
    render: () => ({
        components: { Toast, Button },
        setup() {
            const { add, clear } = useToast()
            const addWithIcon = () => add('Custom icon toast.', { icon: 'Stars', type: 'info' })
            return { addWithIcon, clear }
        },
        template: `
            <div id="portal-target"></div>

            <Button @click="addWithIcon">Add custom icon toast</Button>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add custom icon/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())
    }
}

export const OnDismiss: Story = {
    render: () => ({
        components: { Toast, Button },
        setup() {
            const { add, clear } = useToast()
            const saved = ref(false)
            const addWithClose = () => {
                saved.value = false
                add('Your preferences have been saved.', {
                    onClose: () => { saved.value = true }
                })
            }
            return { addWithClose, clear, saved }
        },
        template: `
            <div id="portal-target"></div>

            <div class="grid max-w-sm gap-3">
                <div><Button @click="addWithClose">Save preferences</Button></div>
                <p v-if="saved" role="status" class="text-gray-900 dark:text-gray-100">Preferences saved. Notification dismissed.</p>
            </div>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /save preferences/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())

        const dismiss = canvas.getByRole('button', { name: /dismiss notification/i })
        await userEvent.click(dismiss)

        await waitFor(() => expect(toast).not.toBeInTheDocument())
        await expect(canvas.getByRole('status')).toHaveTextContent('Preferences saved. Notification dismissed.')
    }
}



export const TopLeft: Story = {
    args: { placement: 'top-left' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add toast/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())
    }
}

export const BottomRight: Story = {
    args: { placement: 'bottom-right' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add toast/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())
    }
}

export const BottomLeft: Story = {
    args: { placement: 'bottom-left' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add toast/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())
    }
}

export const Permanent: Story = {
    render: () => ({
        components: { Toast, Button },
        setup() {
            const { add, clear } = useToast()
            return { add, clear }
        },
        template: `
            <div id="portal-target"></div>

            <Button @click="add('This notification will not auto-dismiss.', { permanent: true })">
                Add permanent toast
            </Button>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add permanent toast/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())

        await new Promise((r) => setTimeout(r, 5000))
        await expect(toast).toBeVisible()
    }
}

export const Stacking: Story = {
    render: () => ({
        components: { Toast, Button },
        setup() {
            const { add, clear } = useToast()

            const addMany = () => {
                add('First notification — info', { type: 'info', duration: 30000 })
                add('Second notification — success', { type: 'success', duration: 30000 })
                add('Third notification — warning', { type: 'warning', duration: 30000 })
                add('Fourth notification — error', { type: 'error', duration: 30000 })
                add('Fifth notification — default', { type: 'default', duration: 30000 })
                add('Sixth notification — info', { type: 'info', duration: 30000 })
            }

            return { addMany, clear }
        },
        template: `
            <div id="portal-target"></div>

            <div class="flex gap-2">
                <Button @click="addMany">Add 6 toasts</Button>
                <Button @click="clear()">Clear all</Button>
            </div>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add 6 toasts/i }))

        await waitFor(async () => {
            const statuses = canvas.queryAllByRole('status')
            const alerts = canvas.queryAllByRole('alert')
            expect(statuses.length + alerts.length).toBe(5)
        })

        const moreText = await canvas.findByText(/1 more notification/i)
        await expect(moreText).toBeVisible()

        await userEvent.click(canvas.getByRole('button', { name: /show all/i }))

        await waitFor(async () => {
            const statuses = canvas.queryAllByRole('status')
            const alerts = canvas.queryAllByRole('alert')
            expect(statuses.length + alerts.length).toBe(6)
        })
        await userEvent.click(canvas.getByRole('button', { name: /add 6 toasts/i }))
        await waitFor(() => expect(canvas.queryAllByRole('status').length + canvas.queryAllByRole('alert').length).toBe(12))
        clear()
    }
}
