import type { Meta, StoryObj } from '@storybook/vue3'
import Label from '@Components/Label.vue'

const meta: Meta<typeof Label> = {
    title: 'Components/Label',
    component: Label,

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
