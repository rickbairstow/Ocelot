import { runInteractionTests } from '../interactionMode'
import { expect } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import Placeholder from '@Components/Placeholder.vue'

const meta: Meta<typeof Placeholder> = {
    title: 'Components/Placeholder',
    component: Placeholder,

    parameters: {
        docs: {
            description: {
                component: 'A skeleton loading placeholder that mimics the shape of real content while data is being fetched. Supports preset variants for common patterns — text, heading, image, card, badge, button, and input.'
            }
        }
    },

    argTypes: {
        variant: {
            control: 'select',
            options: [
                'badge',
                'button',
                'card',
                'heading',
                'image',
                'input',
                'paragraph',
                'text'
            ],
            description: 'Placeholder slot content'
        }
    },

    render: (args) => ({
        components: { Placeholder },

        setup() {
            return { args }
        },

        template: `
            <Placeholder :variant="args.variant" />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(canvasElement.querySelector('.animate-pulse')).toBeVisible()
    }
}

export const Variants: Story = {
    render: () => ({
        components: { Placeholder },
        setup: () => ({ variants: ['badge', 'button', 'heading', 'image', 'input', 'paragraph', 'text'] }),
        template: '<div class="grid gap-6"><div v-for="variant in variants" :key="variant"><p class="mb-2 text-sm text-gray-700 dark:text-gray-300">{{ variant }}</p><Placeholder :variant="variant" /></div></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(canvasElement.querySelectorAll('.animate-pulse')).toHaveLength(7)
    }
}
