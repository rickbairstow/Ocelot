import type { Meta, StoryObj } from '@storybook/vue3'
import Divider from '@Components/Divider.vue'

const meta: Meta<typeof Divider> = {
    title: 'Components/Divider',
    component: Divider,

    parameters: {
        docs: {
            description: {
                component: 'A horizontal rule for separating content sections. Supports an optional centred, left-aligned, or right-aligned label and three colour intensities.'
            }
        }
    },

    argTypes: {
        color: {
            control: 'select',
            options: ['default', 'subtle', 'strong'],
            description: 'Color intensity of the divider.'
        },

        label: {
            control: 'text',
            description: 'Optional label text rendered in the divider line.'
        },

        labelAlign: {
            control: 'select',
            options: ['start', 'center', 'end'],
            description: 'Horizontal alignment of the label.'
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
        }
    },

    args: {
        color: 'default',
        label: '',
        labelAlign: 'center',
        orientation: 'horizontal',
        variant: 'solid'
    },

    render: (args) => ({
        components: { Divider },
        setup() {
            return { args }
        },
        template: `
            <div class="p-6 w-96">
                <Divider
                    :color="args.color"
                    :label="args.label || undefined"
                    :label-align="args.labelAlign"
                    :orientation="args.orientation"
                    :variant="args.variant"
                />
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithLabel: Story = {
    args: { label: 'or' }
}

export const LabelStart: Story = {
    args: { label: 'Section', labelAlign: 'start' }
}

export const LabelEnd: Story = {
    args: { label: 'Section', labelAlign: 'end' }
}

export const Dashed: Story = {
    args: { variant: 'dashed' }
}

export const Dotted: Story = {
    args: { variant: 'dotted' }
}

export const Strong: Story = {
    args: { color: 'strong' }
}

export const Subtle: Story = {
    args: { color: 'subtle' }
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
