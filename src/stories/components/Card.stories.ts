import type { Meta, StoryObj } from '@storybook/vue3'
import Card from '@Components/Card.vue'
import Badge from '@Components/Badge.vue'
import { faker } from '@faker-js/faker'
import { expect, userEvent, within } from 'storybook/test'

const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,

    argTypes: {
        badges: {
            control: 'object',
            description: 'Array of badge items (text, type) rendered in the footer.'
        },
        clickable: {
            control: 'boolean',
            description: 'Renders as a button with hover/focus styles.'
        },
        imageAlt: {
            control: 'text',
            description: 'Alt text for the image.'
        },
        imageSrc: {
            control: 'text',
            description: 'Image source URL.'
        },
        selected: {
            control: 'boolean',
            description: 'Shows a selection tick indicator and blue ring.'
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Max width of the card.'
        },
        title: {
            control: 'text',
            description: 'Card title rendered as an h2.'
        },
        variant: {
            control: 'select',
            options: ['default', 'bordered', 'flat'],
            description: 'Visual style of the card.'
        },
        vertical: {
            control: 'boolean',
            description: 'Stack image above body (true) or beside body (false).'
        }
    },

    args: {
        badges: [
            { text: faker.lorem.word(), type: 'info' },
            { text: faker.lorem.word(), type: 'success' }
        ],
        clickable: false,
        imageAlt: faker.commerce.productName(),
        imageSrc: faker.image.url({ width: 400, height: 300 }),
        selected: false,
        size: 'base',
        title: faker.commerce.productName(),
        variant: 'default',
        vertical: false
    },

    render: (args) => ({
        components: { Card },
        setup() {
            return { args }
        },
        template: `
            <Card
                :badges="args.badges"
                :clickable="args.clickable"
                :image-alt="args.imageAlt"
                :image-src="args.imageSrc"
                :selected="args.selected"
                :size="args.size"
                :title="args.title"
                :variant="args.variant"
                :vertical="args.vertical"
            >
                ${faker.lorem.paragraph()}
            </Card>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Horizontal: Story = {
    args: { vertical: false }
}

export const Vertical: Story = {
    args: {
        vertical: true,
        imageSrc: faker.image.url({ width: 600, height: 240 })
    }
}

export const Bordered: Story = {
    args: { variant: 'bordered', imageSrc: null }
}

export const Flat: Story = {
    args: { variant: 'flat', imageSrc: null }
}

export const Clickable: Story = {
    args: { clickable: true, imageSrc: null },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const card = canvas.getByRole('button')
        await expect(card).toBeVisible()
        await userEvent.tab()
        await expect(card).toHaveFocus()
    }
}

export const Selected: Story = {
    args: { selected: true, clickable: true, imageSrc: null }
}

export const WithNamedSlots: Story = {
    render: () => ({
        components: { Card, Badge },
        template: `
            <Card>
                <template #header>
                    <h2 class="font-bold text-xl text-gray-900 dark:text-white">Custom Header</h2>
                </template>
                <template #content>
                    <p class="text-gray-700 dark:text-gray-200">Custom content area with rich markup.</p>
                </template>
                <template #footer>
                    <Badge color="green">Active</Badge>
                </template>
                <template #actions>
                    <button class="text-sm text-blue-600 hover:underline">View details</button>
                </template>
            </Card>
        `
    })
}

export const NoImage: Story = {
    args: { imageSrc: null, badges: [] }
}
