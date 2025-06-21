import ReadMore from '@Components/ReadMore.vue'
import { userEvent, within, expect } from 'storybook/test'
import { faker } from '@faker-js/faker'

export default {
    title: 'Components/ReadMore',
    component: ReadMore,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content'
        },

        lines: {
            control: {
                type: 'number',
                min: 0,
                max: 6
            }
        }
    },

    args: {
        default: faker.lorem.paragraphs(1, '\n\n'),
        lines: 4
    }
}

export const Default = {
    render: (args) => ({
        components: { ReadMore },
        setup() {
            return { args }
        },
        template: `
            <ReadMore :lines="args.lines">
                {{ args.default }}
            </ReadMore>
        `
    }),

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const button = await canvas.findByRole('button', { name: /show more/i })
        await expect(button).toBeVisible()

        // Click to expand
        await userEvent.click(button)

        // Button should now read "Show less"
        await expect(button).toHaveTextContent(/show less/i)

        // Click again to collapse
        await userEvent.click(button)
        await expect(button).toHaveTextContent(/show more/i)
    }
}
