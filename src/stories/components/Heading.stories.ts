import { expect, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/vue3'
import Heading from '@Components/Heading.vue'

const meta: Meta<typeof Heading> = {
    title: 'Components/Heading',
    component: Heading,

    parameters: {
        docs: {
            description: {
                component: 'Semantic heading element (h1–h6) with consistent typographic styles. The visual size can be decoupled from the semantic level using styleLevel, allowing correct document hierarchy without sacrificing design.\n\nDefault uses an h1 with the default visual style. Levels compares h1–h6. Visual Level keeps an h2 in the document outline while applying the h4 appearance. Choose level for document structure and styleLevel only for visual size.'
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

    args: { default: 'Heading title' },

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

export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('heading', { level: 1 })).toBeVisible()
    }
}

export const Levels: Story = {
    render: () => ({
        components: { Heading },
        template: '<div class="grid gap-4"><Heading v-for="level in 6" :key="level" :level="level">Heading {{ level }}</Heading></div>'
    }),
    play: async ({ canvasElement }) => {
        for (const level of [1, 2, 3, 4, 5, 6]) {
            await expect(within(canvasElement).getByRole('heading', { level })).toBeVisible()
        }
    }
}



export const VisualLevel: Story = {
    args: { level: '2', styleLevel: '4' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('heading', { level: 2 })).toHaveClass('text-xl')
    }
}







