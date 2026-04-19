import type { Meta, StoryObj } from '@storybook/vue3'
import Popover from '@Components/Popover.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, waitFor, within } from 'storybook/test'

const meta: Meta<typeof Popover> = {
    title: 'Components/Popover',
    component: Popover,

    parameters: {
        docs: {
            description: {
                component: 'A click-triggered floating panel for interactive content such as menus, forms, and detail overlays. Wraps FloatingPanel with click interaction pre-configured. Supports all placement modes.'
            }
        }
    },

    argTypes: {
        disabled: { control: 'boolean', description: 'Prevents the popover from opening.' },
        flush: { control: 'boolean', description: 'Removes default padding from the content area.' },
        maxWidth: { control: 'text', description: 'Maximum width of the popover panel.' },
        placement: {
            control: 'select',
            options: [
                'top', 'top-start', 'top-end',
                'bottom', 'bottom-start', 'bottom-end',
                'left', 'left-start', 'left-end',
                'right', 'right-start', 'right-end'
            ],
            description: 'Preferred placement relative to the trigger.'
        }
    },

    args: {
        disabled: false,
        flush: false,
        placement: 'bottom'
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: (args) => ({
        components: { Popover, Button },
        setup() {
            return {
                args,
                title: 'Popover title',
                body: 'Popover body content'
            }
        },
        template: `
            <div class="flex justify-center p-16">
                <Popover v-bind="args">
                    <template #trigger>
                        <Button>Open popover</Button>
                    </template>
                    <template #content>
                        <div class="flex flex-col gap-1">
                            <p class="font-semibold text-sm text-gray-900 dark:text-white">{{ title }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ body }}</p>
                        </div>
                    </template>
                </Popover>
            </div>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: 'Open popover' })

        await userEvent.click(trigger)

        await waitFor(() => {
            expect(canvas.getByText('Popover title')).toBeVisible()
            expect(canvas.getByText('Popover body content')).toBeVisible()
        })

        await userEvent.click(trigger)

        await waitFor(() => {
            expect(canvas.queryByText('Popover title')).not.toBeInTheDocument()
            expect(canvas.queryByText('Popover body content')).not.toBeInTheDocument()
        })
    }
}

export const WithActions: Story = {
    render: (args) => ({
        components: { Popover, Button },
        setup() {
            return { args }
        },
        template: `
            <div class="flex justify-center p-16">
                <Popover v-bind="args" flush>
                    <template #trigger>
                        <Button variant="secondary">Options</Button>
                    </template>
                    <template #content>
                        <div class="flex flex-col py-1 min-w-40">
                            <button class="text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Edit</button>
                            <button class="text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">Duplicate</button>
                            <button class="text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-800">Delete</button>
                        </div>
                    </template>
                </Popover>
            </div>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: 'Options' })

        await userEvent.click(trigger)

        await waitFor(() => {
            expect(canvas.getByText('Edit')).toBeVisible()
            expect(canvas.getByText('Delete')).toBeVisible()
        })
    }
}

export const Disabled: Story = {
    args: { disabled: true },

    render: (args) => ({
        components: { Popover, Button },
        setup() {
            return { args }
        },
        template: `
            <div class="flex justify-center p-16">
                <Popover v-bind="args">
                    <template #trigger>
                        <Button>Open popover</Button>
                    </template>
                    <template #content>
                        <p class="text-sm">Content</p>
                    </template>
                </Popover>
            </div>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: 'Open popover' })

        await userEvent.click(trigger)

        await expect(trigger).not.toHaveAttribute('aria-expanded', 'true')
    }
}
