import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import Card from '@Components/Card.vue'
import Badge from '@Components/Badge.vue'
import { faker } from '@faker-js/faker'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'

const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,

    parameters: {
        docs: {
            description: {
                component: 'A flexible content container with named slots for header, body, footer, and actions. Supports an image, badge list, clickable state (renders as a button), and a selected/highlighted variant.\n\nDefault contains only body content. Add a title, image, badges, named slots or selection behaviour only when needed. Interactive cards should have an accessible name; avoid nesting other interactive elements inside a clickable card.'
            }
        }
    },

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
        badges: [],
        clickable: false,
        imageAlt: '',
        imageSrc: null,
        selected: false,
        size: 'base',
        title: undefined,
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

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(canvasElement.querySelector('img')).not.toBeInTheDocument()
        await expect(canvasElement.querySelector('button')).not.toBeInTheDocument()
        await expect(canvasElement.textContent?.trim()).not.toBe('')
    }
}

export const WithBadges: Story = {
    args: { title: 'Weekend escape', badges: [{ text: 'Available', type: 'success' }] },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).getByText('Available')).toBeVisible()
    }
}



export const Horizontal: Story = {
    args: { imageSrc: '/media/gallery-mountains.svg', imageAlt: 'Mountain landscape', title: 'Weekend escape' }
}

export const Vertical: Story = {
    args: {
        vertical: true,
        imageSrc: '/media/gallery-mountains.svg'
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
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const card = canvas.getByRole('button')
        await expect(card).toBeVisible()
        await userEvent.tab()
        await expect(card).toHaveFocus()
    }
}

export const Selected: Story = {
    args: { selected: true, clickable: true, imageSrc: null },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const card = canvas.getByRole('button')
        await expect(card).toHaveAttribute('aria-pressed', 'true')
        await expect(card).toHaveClass('ring-2')
        const tick = canvasElement.querySelector('[aria-hidden="true"]')
        await expect(tick).toBeVisible()
    }
}

export const SelectableToggle: Story = {
    render: () => ({
        components: { Card },
        setup() {
            const selected = ref(false)
            return { selected, title: faker.commerce.productName(), body: faker.lorem.paragraph() }
        },
        template: `
            <Card
                clickable
                :selected="selected"
                :title="title"
                @click="selected = !selected"
            >
                {{ body }}
            </Card>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const card = canvas.getByRole('button')

        await expect(card).toHaveAttribute('aria-pressed', 'false')
        await expect(card).not.toHaveClass('ring-2')
        await userEvent.click(card)
        await expect(card).toHaveAttribute('aria-pressed', 'true')
        await expect(card).toHaveClass('ring-2')
        await userEvent.click(card)
        await expect(card).toHaveAttribute('aria-pressed', 'false')
        await expect(card).not.toHaveClass('ring-2')
    }
}

export const CardGrid: Story = {
    render: () => ({
        components: { Card },
        setup: () => ({
            items: Array.from({ length: 6 }, () => ({
                title: faker.commerce.productName(),
                body: faker.lorem.sentence(),
                img: '/media/gallery-coast.svg'
            }))
        }),
        template: `
            <div class="grid grid-cols-3 gap-4 w-full">
                <Card
                    v-for="(item, i) in items"
                    :key="i"
                    class="!w-auto"
                    vertical
                    :image-src="item.img"
                    :title="item.title"
                >
                    {{ item.body }}
                </Card>
            </div>
        `
    })
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


