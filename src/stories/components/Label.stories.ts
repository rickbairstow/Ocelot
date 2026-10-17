import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Label from '@Components/Label.vue'
import Input from '@Components/Input.vue'

const meta: Meta<typeof Label> = {
    title: 'Components/Label',
    component: Label,

    parameters: {
        docs: {
            description: {
                component: 'A native label that associates with a control through matching for/id attributes. Clicking it focuses the control. Use FormField for automatic linking, required/optional indicators, hints and errors.'
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
        components: { Label, Input },

        setup() {
            return { args, value: ref('') }
        },

        template: `
            <div class="grid gap-2">
                <Label for="label-story-control">
                    {{ args.default }}
                </Label>
                <Input id="label-story-control" v-model="value" name="label-example" />
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox', { name: 'Label content' })
        await userEvent.click(canvas.getByText('Label content', { selector: 'label' }))
        await expect(input).toHaveFocus()
        await userEvent.type(input, 'Example')
        await expect(input).toHaveValue('Example')
    }
}
