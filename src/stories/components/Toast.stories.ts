import type { Meta, StoryObj } from '@storybook/vue3'
import Toast from '@Components/Toast.vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { useToast } from '@Composables/useToast'
import type { ToastType } from '@Composables/useToast'

const placements = ['top-right', 'top-left', 'bottom-right', 'bottom-left'] as const
const types: ToastType[] = ['default', 'success', 'error', 'warning', 'info']

const meta: Meta<typeof Toast> = {
    title: 'Components/Toast',
    component: Toast,

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
        components: { Toast },
        setup() {
            const { add, clear } = useToast()
            return { args, add, clear }
        },
        template: `
            <div id="portal-target"></div>

            <button @click="add('Your changes have been saved.')">
                Add toast
            </button>

            <Toast :placement="args.placement" />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
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
        components: { Toast },
        setup() {
            const { add, clear } = useToast()
            return { types, add, clear }
        },
        template: `
            <div id="portal-target"></div>

            <div class="flex flex-col gap-2">
                <button
                    v-for="type in types"
                    :key="type"
                    class="capitalize"
                    @click="add(\`This is a \${type} notification.\`, { type })"
                >
                    {{ type }}
                </button>
            </div>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
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
        components: { Toast },
        setup() {
            const { add, clear } = useToast()
            const addWithAction = () => add('File deleted.', {
                type: 'default',
                action: { label: 'Undo', onClick: () => console.log('Undo clicked') }
            })
            return { addWithAction, clear }
        },
        template: `
            <div id="portal-target"></div>

            <button @click="addWithAction">Add toast with action</button>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add toast with action/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())

        const actionBtn = canvas.getByRole('button', { name: /undo/i })
        await expect(actionBtn).toBeVisible()
        await userEvent.click(actionBtn)

        await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument())
    }
}

export const WithCustomIcon: Story = {
    render: () => ({
        components: { Toast },
        setup() {
            const { add, clear } = useToast()
            const addWithIcon = () => add('Custom icon toast.', { icon: 'Star', type: 'info' })
            return { addWithIcon, clear }
        },
        template: `
            <div id="portal-target"></div>

            <button @click="addWithIcon">Add custom icon toast</button>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add custom icon/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())
    }
}

export const WithOnClose: Story = {
    render: () => ({
        components: { Toast },
        setup() {
            const { add, clear } = useToast()
            const log = (msg: string) => console.log(msg)
            const addWithClose = () => add('Closing will trigger callback.', {
                onClose: () => log('Toast closed!')
            })
            return { addWithClose, clear }
        },
        template: `
            <div id="portal-target"></div>

            <button @click="addWithClose">Add toast with onClose</button>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add toast with onclose/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())

        const dismiss = canvas.getByRole('button', { name: /dismiss notification/i })
        await userEvent.click(dismiss)

        await waitFor(() => expect(canvas.queryByRole('status')).not.toBeInTheDocument())
    }
}

export const TopRight: Story = {
    args: { placement: 'top-right' },
    play: async ({ canvasElement }) => {
        const { clear } = useToast()
        clear()

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /add toast/i }))

        const toast = await canvas.findByRole('status')
        await waitFor(() => expect(toast).toBeVisible())
    }
}

export const TopLeft: Story = {
    args: { placement: 'top-left' },
    play: async ({ canvasElement }) => {
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
        components: { Toast },
        setup() {
            const { add, clear } = useToast()
            return { add, clear }
        },
        template: `
            <div id="portal-target"></div>

            <button @click="add('This notification will not auto-dismiss.', { permanent: true })">
                Add permanent toast
            </button>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
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

export const StackingDemo: Story = {
    render: () => ({
        components: { Toast },
        setup() {
            const { add, clear } = useToast()

            const addMany = () => {
                clear()
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
                <button @click="addMany">Add 6 toasts</button>
                <button @click="clear()">Clear all</button>
            </div>

            <Toast placement="top-right" />
        `
    }),
    play: async ({ canvasElement }) => {
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
    }
}
