import type { Meta, StoryObj } from '@storybook/vue3'
import Heading from '@Components/Heading.vue'

const meta: Meta<typeof Heading> = {
    title: 'Components/Heading',
    component: Heading,

    parameters: {
        docs: {
            description: {
                component: 'Semantic heading element (h1–h6) with consistent typographic styles. The visual size can be decoupled from the semantic level using styleLevel, allowing correct document hierarchy without sacrificing design.'
            }
        }
    },

    argTypes: {
        default: {
            control: 'text',
            description: 'Heading slot content'
        },

        level: {
            control: 'select',
            description: 'Sets the element used for the heading, ie h1.',
            options: ['1', '2', '3', '4', '5', '6']
        },

        styleLevel: {
            control: 'select',
            description:
                'Overrides the style to a given level, for cases where a specific style is needed with varying heading level elements.',
            options: ['1', '2', '3', '4', '5', '6']
        }
    },

    args: {
        default: 'Heading title',
        level: '1'
    },

    render: (args) => ({
        components: { Heading },

        setup() {
            return { args }
        },

        template: `
            <Heading
                :level="args.level"
                :style-level="args.styleLevel"
            >
                {{ args.default }}
            </Heading>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Heading1: Story = {
    args: {
        level: '1'
    }
}
export const Heading2: Story = {
    args: {
        level: '2'
    }
}
export const Heading3: Story = {
    args: {
        level: '3'
    }
}
export const Heading4: Story = {
    args: {
        level: '4'
    }
}
export const Heading5: Story = {
    args: {
        level: '5'
    }
}
export const Heading6: Story = {
    args: {
        level: '6'
    }
}
