import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import Label from '@Components/Label.vue'

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
        components: { Label },

        setup() {
            return { args }
        },

        template: `
            <div class="grid gap-2">
                <Label>
                    {{ args.default }}
                </Label>
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.getByText('Label content', { selector: 'label' })).toBeVisible()
    }
}
