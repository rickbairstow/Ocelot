import type { Meta, StoryObj } from '@storybook/vue3'
import Divider from '@Components/Divider.vue'

const meta: Meta<typeof Divider> = {
    title: 'Components/Divider',
    component: Divider,

    argTypes: {
        default: {
            control: 'text',
            description: 'Optional label text'
        },

        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Direction of the divider.'
        },

        variant: {
            control: 'select',
            options: ['solid', 'dashed', 'dotted'],
            description: 'Border style of the divider.'
        },

        color: {
            control: 'select',
            options: ['default', 'subtle', 'strong'],
            description: 'Color intensity of the divider.'
        }
    },

    args: {
        default: '',
        orientation: 'horizontal',
        variant: 'solid',
        color: 'default'
    },

    render: (args) => ({
        components: { Divider },

        setup() {
            return { args }
        },

        template: `
            <div class="p-6 w-96">
                <Divider
                    :orientation="args.orientation"
                    :variant="args.variant"
                    :color="args.color"
                >
                    <template v-if="args.default">{{ args.default }}</template>
                </Divider>
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithText: Story = {
    args: {
        default: 'or'
    }
}

export const Dashed: Story = {
    args: {
        variant: 'dashed'
    }
}

export const Dotted: Story = {
    args: {
        variant: 'dotted'
    }
}

export const Strong: Story = {
    args: {
        color: 'strong'
    }
}

export const Vertical: Story = {
    render: () => ({
        components: { Divider },
        template: `
            <div class="flex items-center gap-4 p-6 h-16">
                <span>Left</span>
                <Divider orientation="vertical" />
                <span>Right</span>
            </div>
        `
    })
}
