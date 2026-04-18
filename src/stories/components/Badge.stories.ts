import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from '@Components/Badge.vue'
import { faker } from '@faker-js/faker'
import { expect, userEvent, within } from 'storybook/test'

const colors = ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink', 'gray']
const variants = ['primary', 'secondary', 'outline'] as const
const sizes = ['sm', 'md', 'lg'] as const

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,

    parameters: {
        docs: {
            description: {
                component: 'Small status indicator for labels, counts, and tags. Supports primary, secondary, and outline variants, a dot mode for minimal indicators, and a removable variant that emits a dismiss event.'
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
        color: 'blue',
        default: faker.lorem.word(),
        dot: false,
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
                :color="args.color"
                :dot="args.dot"
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

export const Default: Story = {}

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
        const dots = canvasElement.querySelectorAll('[role="status"]')
        await expect(dots.length).toBeGreaterThan(0)
    }
}

export const Removable: Story = {
    render: () => ({
        components: { Badge },
        setup() { return { label: faker.lorem.word() } },
        template: '<Badge color="blue" removable label="my badge">{{ label }}</Badge>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const removeBtn = canvas.getByRole('button', { name: /remove/i })
        await expect(removeBtn).toBeVisible()
        await userEvent.click(removeBtn)
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
