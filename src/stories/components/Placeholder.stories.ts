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

    args: {
        default: 'Placeholder content'
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

export const Default: Story = {}
