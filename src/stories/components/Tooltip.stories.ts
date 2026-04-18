import type { Meta, StoryObj } from '@storybook/vue3'
import Tooltip from '@Components/Tooltip.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, waitFor, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof Tooltip> = {
    title: 'Components/Tooltip',
    component: Tooltip,

    parameters: {
        docs: {
            description: {
                component: 'A lightweight tooltip that appears on hover and focus. Wraps FloatingPanel with pre-configured hover interaction, role="tooltip", and aria-describedby wiring. Supports all placement modes and an optional show delay.'
            }
        }
    },

    argTypes: {
        content: { control: 'text', description: 'Tooltip text content.' },
        delay: { control: 'number', description: 'Show delay in milliseconds.' },
        disabled: { control: 'boolean', description: 'Prevents the tooltip from opening.' },
        maxWidth: { control: 'text', description: 'Maximum width of the tooltip panel.' },
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
        content: faker.lorem.sentence(6),
        delay: 0,
        disabled: false,
        placement: 'top'
    },

    render: (args) => ({
        components: { Tooltip, Button },
        setup() {
            return { args }
        },
        template: `
            <div class="flex items-center justify-center p-16">
                <Tooltip v-bind="args">
                    <Button>Hover me</Button>
                </Tooltip>
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: 'Hover me' })

        await userEvent.hover(trigger)

        await waitFor(() => {
            expect(trigger).toHaveAttribute('aria-describedby')
        })

        const tooltipId = trigger.getAttribute('aria-describedby')!
        const tooltip = canvasElement.querySelector(`#${tooltipId}`)
        await expect(tooltip).not.toBeNull()
        await expect(tooltip!.getAttribute('role')).toBe('tooltip')
    }
}

export const Placements: Story = {
    render: () => ({
        components: { Tooltip, Button },
        setup() {
            const label = faker.lorem.words(3)
            return { label }
        },
        template: `
            <div class="grid grid-cols-3 place-items-center gap-4 p-16">
                <div />
                <Tooltip :content="label" :delay="0" placement="top">
                    <Button>top</Button>
                </Tooltip>
                <div />

                <Tooltip :content="label" :delay="0" placement="left">
                    <Button>left</Button>
                </Tooltip>
                <div />
                <Tooltip :content="label" :delay="0" placement="right">
                    <Button>right</Button>
                </Tooltip>

                <div />
                <Tooltip :content="label" :delay="0" placement="bottom">
                    <Button>bottom</Button>
                </Tooltip>
                <div />
            </div>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const topButton = canvas.getByRole('button', { name: 'top' })
        await userEvent.hover(topButton)
        await waitFor(() => {
            expect(topButton).toHaveAttribute('aria-describedby')
        })
    }
}

export const Disabled: Story = {
    args: { disabled: true },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: 'Hover me' })

        await userEvent.hover(trigger)

        await expect(trigger).not.toHaveAttribute('aria-describedby')
    }
}

export const WithDelay: Story = {
    args: {
        content: faker.lorem.sentence(5),
        delay: 600
    },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: 'Hover me' })

        await userEvent.hover(trigger)

        await waitFor(() => {
            expect(trigger).toHaveAttribute('aria-describedby')
        }, { timeout: 2000 })
    }
}
