import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import ButtonGroup from '@Components/ButtonGroup.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within } from 'storybook/test'

const colors = ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink']
const variants = ['primary', 'secondary', 'tertiary', 'text', 'none'] as const
const sizes = ['small', 'base', 'large'] as const

const meta: Meta<typeof ButtonGroup> = {
    title: 'Components/ButtonGroup',
    component: ButtonGroup,

    parameters: {
        docs: {
            description: {
                component: 'Visually joins related action buttons and shares colour, size and variant with children that do not supply their own. Defaults to horizontal layout; unconfigured Buttons use blue, base size and primary styling. Supply an accessible group name through ariaLabel or aria-labelledby. Each button remains an independent action in the normal Tab order; this is not a radio group, segmented selection control or toolbar with arrow-key navigation. Disabled/loading state belongs to individual Buttons.'
            }
        }
    },

    argTypes: {
        ariaLabel: {
            control: 'text',
            description: 'Accessible group name. Alternatively, supply aria-labelledby.'
        },
        color: {
            control: 'select',
            options: ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink'],
            description: 'Cascades to all child buttons that do not specify their own color.'
        },
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
            description: 'Layout direction.'
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Cascades to all child buttons that do not specify their own size.'
        },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'text', 'none'],
            description: 'Cascades to all child buttons that do not specify their own variant.'
        }
    },

    args: { ariaLabel: 'Document actions' }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: (args) => ({
        components: { ButtonGroup, Button },
        setup() { return { args } },
        template: `
            <ButtonGroup :aria-label="args.ariaLabel" :color="args.color" :orientation="args.orientation" :size="args.size" :variant="args.variant">
                <Button>Save</Button>
                <Button>Save and close</Button>
                <Button>Print</Button>
            </ButtonGroup>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const buttons = canvas.getAllByRole('button')
        await expect(buttons).toHaveLength(3)
        await expect(canvas.getByRole('group')).toHaveAttribute('aria-label', 'Document actions')
        buttons[0].focus()
        await userEvent.tab()
        await expect(buttons[1]).toHaveFocus()
        await userEvent.tab()
        await expect(buttons[2]).toHaveFocus()
    }
}

export const Vertical: Story = {
    args: { orientation: 'vertical' },
    render: args => ({
        components: { ButtonGroup, Button },
        setup: () => ({ args }),
        template: '<ButtonGroup :aria-label="args.ariaLabel" :orientation="args.orientation"><Button>Save</Button><Button>Print</Button><Button>Download</Button></ButtonGroup>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const buttons = within(canvasElement).getAllByRole('button')
        const first = buttons[0].getBoundingClientRect()
        const second = buttons[1].getBoundingClientRect()
        await expect(second.top).toBeGreaterThan(first.top)
        await expect(Math.abs(second.left - first.left)).toBeLessThan(1)
        buttons[0].focus()
        await userEvent.tab()
        await expect(buttons[1]).toHaveFocus()
    }
}

export const Variants: Story = {
    render: () => ({
        components: { ButtonGroup, Button },
        setup: () => ({ variants }),
        template: '<div class="flex flex-col items-start gap-4"><div v-for="variant in variants" :key="variant" class="space-y-2"><p class="text-sm text-gray-600 dark:text-gray-400">{{ variant }}</p><ButtonGroup :aria-label="variant + \' actions\'" :variant="variant"><Button>Save</Button><Button>Print</Button></ButtonGroup></div></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        for (const variant of variants) {
            const buttons = within(canvas.getByRole('group', { name: `${variant} actions` })).getAllByRole('button')
            await expect(buttons).toHaveLength(2)
            await expect(getComputedStyle(buttons[0]).backgroundColor).toBe(getComputedStyle(buttons[1]).backgroundColor)
        }
        await expect(within(canvas.getByRole('group', { name: 'primary actions' })).getByRole('button', { name: 'Save' })).toHaveClass('bg-blue-800')
        await expect(within(canvas.getByRole('group', { name: 'secondary actions' })).getByRole('button', { name: 'Save' })).toHaveClass('bg-white')
        await expect(within(canvas.getByRole('group', { name: 'none actions' })).getByRole('button', { name: 'Save' })).toHaveClass('bg-transparent')
    }
}

export const Sizes: Story = {
    render: () => ({
        components: { ButtonGroup, Button },
        setup: () => ({ sizes }),
        template: '<div class="flex flex-col items-start gap-4"><ButtonGroup v-for="size in sizes" :key="size" :aria-label="size + \' actions\'" :size="size"><Button>Save</Button><Button>Print</Button></ButtonGroup></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const heights = sizes.map(size => {
            const buttons = within(within(canvasElement).getByRole('group', { name: `${size} actions` })).getAllByRole('button')
            return buttons.map(button => button.getBoundingClientRect().height)
        })
        for (const [first, second] of heights) await expect(first).toBe(second)
        await expect(heights[0][0]).toBeLessThan(heights[1][0])
        await expect(heights[1][0]).toBeLessThan(heights[2][0])
    }
}

export const Colours: Story = {
    render: () => ({
        components: { ButtonGroup, Button },
        setup: () => ({ colors }),
        template: '<div class="flex flex-wrap gap-4"><ButtonGroup v-for="color in colors" :key="color" :aria-label="color + \' actions\'" :color="color"><Button>Save</Button><Button>Print</Button></ButtonGroup></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const backgrounds = new Set<string>()
        for (const color of colors) {
            const buttons = within(within(canvasElement).getByRole('group', { name: `${color} actions` })).getAllByRole('button')
            const background = getComputedStyle(buttons[0]).backgroundColor
            backgrounds.add(background)
            await expect(getComputedStyle(buttons[1]).backgroundColor).toBe(background)
        }
        await expect(backgrounds.size).toBe(colors.length)
    }
}

export const IconOnly: Story = {
    render: () => ({
        components: { ButtonGroup, Button },
        template: '<ButtonGroup aria-label="Document actions" variant="secondary"><Button aria-label="Save document" icon="DeviceFloppy" icon-only /><Button aria-label="Print document" icon="Printer" icon-only /><Button aria-label="Download document" icon="Download" icon-only /></ButtonGroup>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const save = canvas.getByRole('button', { name: 'Save document' })
        await expect(save.querySelector('svg')).toBeInTheDocument()
        save.focus()
        await userEvent.tab()
        await expect(canvas.getByRole('button', { name: 'Print document' })).toHaveFocus()
        await userEvent.tab()
        await expect(canvas.getByRole('button', { name: 'Download document' })).toHaveFocus()
    }
}

export const IndividualOverrides: Story = {
    args: { color: 'green', size: 'large', variant: 'secondary' },
    render: args => ({
        components: { ButtonGroup, Button },
        setup: () => ({ args }),
        template: '<ButtonGroup :aria-label="args.ariaLabel" :color="args.color" :size="args.size" :variant="args.variant"><Button>Save</Button><Button color="red" variant="primary">Delete</Button><Button size="small">Quick save</Button></ButtonGroup>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Save' })).toHaveClass('text-green-800', 'py-3')
        await expect(canvas.getByRole('button', { name: 'Delete' })).toHaveClass('bg-red-800', 'py-3')
        await expect(canvas.getByRole('button', { name: 'Quick save' })).toHaveClass('text-green-800', 'py-1')
    }
}

export const DisabledAndLoading: Story = {
    render: () => ({
        components: { ButtonGroup, Button },
        template: '<ButtonGroup aria-label="Save actions"><Button>Save draft</Button><Button disabled>Publish</Button><Button loading>Saving</Button></ButtonGroup>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Save draft' })).not.toHaveAttribute('aria-disabled')
        await expect(canvas.getByRole('button', { name: 'Publish' })).toHaveAttribute('aria-disabled', 'true')
        const loading = canvas.getByRole('button', { name: 'Saving' })
        await expect(loading).toHaveAttribute('aria-disabled', 'true')
        await expect(loading).toHaveAttribute('aria-busy', 'true')
    }
}
