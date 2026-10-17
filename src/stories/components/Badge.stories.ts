import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from '@Components/Badge.vue'
import { faker } from '@faker-js/faker'
import { expect, fn, userEvent, within } from 'storybook/test'

const colors = ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink', 'gray']
const variants = ['primary', 'secondary', 'outline'] as const
const sizes = ['sm', 'md', 'lg'] as const

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,

    parameters: {
        docs: {
            description: {
                component: 'Small status indicator for labels, counts, and tags. Supports primary, secondary, and outline variants, a dot mode for minimal indicators, and a removable variant that emits remove. Supply label to name the remove button. The remove icon inherits the badge text colour in both themes; the consumer handles removal.'
            }
        }
    },

    argTypes: {
        color: {
            control: 'select',
            options: colors,
            description: 'Base theme color.'
        },
        default: {
            control: 'text',
            description: 'Slot content'
        },
        dot: {
            control: 'boolean',
            description: 'Render as a status dot indicator (no label).'
        },
        removable: {
            control: 'boolean',
            description: 'Show a remove button inside the badge.'
        },
        size: {
            control: 'select',
            options: [...sizes],
            description: 'Badge size.'
        },
        truncate: {
            control: 'boolean',
            description: 'Truncate long text with an ellipsis.'
        },
        variant: {
            control: 'select',
            options: [...variants],
            description: 'Visual style.'
        }
    },

    args: {
        default: 'New',
        ariaLabel: undefined,
        color: 'blue',
        dot: false,
        label: undefined,
        removable: false,
        size: 'lg',
        truncate: false,
        variant: 'primary'
    },

    render: (args) => ({
        components: { Badge },
        setup() { return { args } },
        template: `
            <Badge
                :aria-label="args.ariaLabel"
                :color="args.color"
                :dot="args.dot"
                :label="args.label"
                :removable="args.removable"
                :size="args.size"
                :truncate="args.truncate"
                :variant="args.variant"
            >
                {{ args.default }}
            </Badge>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).getByText('New')).toBeVisible()
    }
}

export const Dot: Story = {
    render: () => ({
        components: { Badge },
        setup: () => ({ colors }),
        template: `
            <div class="flex flex-wrap gap-3 items-center">
                <Badge v-for="color in colors" :key="color" :color="color" dot :aria-label="color + ' status'" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const dots = canvasElement.querySelectorAll('[role="status"]')
        await expect(dots.length).toBeGreaterThan(0)
    }
}

export const Removable: Story = {
    args: { label: 'Featured', removable: true, onRemove: fn() },
    render: args => ({
        components: { Badge },
        setup() { return { args } },
        template: '<Badge :label="args.label" removable @remove="args.onRemove">Featured</Badge>'
    }),
    play: async ({ canvasElement, args }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const removeBtn = canvas.getByRole('button', { name: 'Remove Featured' })
        await expect(removeBtn).toBeVisible()
        await expect(removeBtn).toHaveStyle({ cursor: 'pointer', opacity: '1' })
        await expect(getComputedStyle(removeBtn).color).toBe(getComputedStyle(removeBtn.parentElement!).color)
        await userEvent.click(removeBtn)
        await expect(args.onRemove).toHaveBeenCalledTimes(1)
        removeBtn.focus()
        await userEvent.keyboard('{Enter}')
        await expect(args.onRemove).toHaveBeenCalledTimes(2)
    }
}

export const RemovableVariants: Story = {
    render: () => ({
        components: { Badge },
        setup: () => ({ variants, sizes }),
        template: '<div class="flex flex-wrap items-center gap-3 p-4"><template v-for="variant in variants" :key="variant"><Badge v-for="size in sizes" :key="size" :label="variant + \' \' + size" :size="size" :variant="variant" removable>{{ variant }} {{ size }}</Badge></template></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        for (const button of within(canvasElement).getAllByRole('button')) {
            const badge = button.parentElement!
            const icon = button.querySelector('svg')!
            await expect(getComputedStyle(icon).stroke).toBe(getComputedStyle(badge).color)
            await expect(button).toHaveStyle({ cursor: 'pointer', opacity: '1' })
            const bounds = badge.getBoundingClientRect()
            const iconBounds = icon.getBoundingClientRect()
            await expect(Math.abs(iconBounds.y + iconBounds.height / 2 - bounds.y - bounds.height / 2)).toBeLessThan(1)
        }
    }
}

export const Truncate: Story = {
    render: () => ({
        components: { Badge },
        template: `
            <div class="w-40">
                <Badge truncate>${faker.lorem.sentence(8)}</Badge>
            </div>
        `
    })
}

export const AllVariations: Story = {
    render: () => ({
        components: { Badge },
        setup: () => ({ colors, variants, sizes }),
        template: `
            <div class="flex flex-col gap-8">
                <div v-for="color in colors" :key="color" class="flex flex-col gap-3">
                    <p class="text-sm font-medium capitalize text-gray-600 dark:text-gray-400">{{ color }}</p>
                    <div v-for="variant in variants" :key="variant" class="flex flex-wrap items-end gap-2">
                        <Badge v-for="size in sizes" :key="size" :color="color" :variant="variant" :size="size">
                            {{ variant }}
                        </Badge>
                    </div>
                </div>
            </div>
        `
    })
}
