import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from '@Components/Badge.vue'
import { faker } from '@faker-js/faker'
import { expect, userEvent, within } from 'storybook/test'

const colors = ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink', 'gray']
const variants = ['primary', 'secondary', 'outline'] as const

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,

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
            options: ['sm', 'md', 'lg'],
            description: 'Sets the size of the badge.'
        },

        truncate: {
            control: 'boolean',
            description: 'Truncate long text with an ellipsis.'
        },

        variant: {
            control: 'select',
            options: variants,
            description: 'Sets the visual style of the badge.'
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
        setup() {
            return { args }
        },
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

export const Primary: Story = {
    args: { variant: 'primary' }
}

export const Secondary: Story = {
    args: { variant: 'secondary' }
}

export const Outline: Story = {
    args: { variant: 'outline' }
}

export const Dot: Story = {
    args: { dot: true, ariaLabel: 'Online status' },
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
        setup() {
            return { label: faker.lorem.word() }
        },
        template: `
            <Badge color="blue" removable label="my badge">{{ label }}</Badge>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const removeBtn = canvas.getByRole('button', { name: /remove/i })
        await expect(removeBtn).toBeVisible()
        await userEvent.click(removeBtn)
    }
}

export const Truncate: Story = {
    args: {
        default: faker.lorem.sentence(10),
        truncate: true
    },
    render: (args) => ({
        components: { Badge },
        setup() { return { args } },
        template: `
            <div class="w-40">
                <Badge :color="args.color" :truncate="args.truncate">{{ args.default }}</Badge>
            </div>
        `
    })
}

export const AllColors: Story = {
    render: () => ({
        components: { Badge },
        setup: () => ({ colors }),
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge v-for="color in colors" :key="color" :color="color">
                    {{ color }}
                </Badge>
            </div>
        `
    })
}

export const AllVariations: Story = {
    render: () => ({
        components: { Badge },
        setup: () => ({ colors, variants, sizes: ['sm', 'md', 'lg'] }),
        template: `
            <div class="flex flex-col gap-6">
                <div v-for="color in colors" :key="color" class="flex flex-col gap-2">
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
