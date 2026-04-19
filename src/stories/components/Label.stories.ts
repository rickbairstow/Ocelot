import type { Meta, StoryObj } from '@storybook/vue3'
import Label from '@Components/Label.vue'

const meta: Meta<typeof Label> = {
    title: 'Components/Form Fields/Label',
    component: Label,

    parameters: {
        docs: {
            description: {
                component: 'A form label that associates with an input via the for attribute. Supports required and optional indicators, making field intent clear without relying on placeholder text alone.'
            }
        }
    },

    argTypes: {
        default: {
            control: 'text',
            description: 'Label slot content'
        }
    },

    args: {
        default: 'Label content'
    },

    render: (args) => ({
        components: { Label },

        setup() {
            return { args }
        },

        template: `
            <Label>
                {{ args.default }}
            </Label>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
