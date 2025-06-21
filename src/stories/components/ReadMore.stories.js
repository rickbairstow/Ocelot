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
        default: faker.lorem.paragraphs(8, '\n\n'),
        lines: 4
    },

    render: (args) => ({
        components: { ReadMore },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 300px">
                <ReadMore :lines="args.lines">
                    {{ args.default }}
                </ReadMore>
            </div>
        `
    })
}

export const Default = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const button = await canvas.findByRole('button', { name: /show more/i })
        await expect(button).toBeVisible()

        await userEvent.click(button)
        await expect(button).toHaveTextContent(/show less/i)

        await userEvent.click(button)
        await expect(button).toHaveTextContent(/show more/i)
    }
}
