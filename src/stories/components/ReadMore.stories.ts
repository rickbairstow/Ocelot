import type { Meta, StoryObj } from '@storybook/vue3'
import ReadMore from '@Components/ReadMore.vue'
import { userEvent, within, expect, waitFor } from 'storybook/test'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof ReadMore> = {
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

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const button = await canvas.findByRole('button', { name: /show more/i })
        await expect(button).toBeVisible()

        await userEvent.click(button)
        await waitFor(() => expect(button).toHaveTextContent(/show less/i))

        await userEvent.click(button)
        await waitFor(() => expect(button).toHaveTextContent(/show more/i))
    }
}
