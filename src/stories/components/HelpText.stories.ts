import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import HelpText from '@Components/HelpText.vue'
import Input from '@Components/Input.vue'

const meta = {
    title: 'Components/HelpText', component: HelpText,
    parameters: { docs: { description: { component: 'Supporting text with consistent small type and light/dark colours. Content comes from the default slot, which can include links. FormField uses HelpText for its hint prop and links it automatically. Outside FormField, give HelpText an id and pass that id through the control’s aria-describedby. This component does not validate or announce changes.' } } },
    render: args => ({ components: { HelpText }, setup: () => ({ args }), template: '<HelpText v-bind="args">We only use your email to reply.</HelpText>' })
} satisfies Meta<typeof HelpText>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).getByText('We only use your email to reply.')).toBeVisible()
        await expect(within(canvasElement).queryByRole('alert')).not.toBeInTheDocument()
    }
}

export const WithInput: Story = {
    render: () => ({
        components: { HelpText, Input },
        template: '<div class="max-w-sm space-y-2"><Input aria-describedby="standalone-email-help" label="Email" type="email" /><HelpText id="standalone-email-help">Read our <a href="#privacy" class="underline">privacy policy</a> before subscribing.</HelpText></div><p id="privacy">We keep your details private.</p>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox', { name: 'Email' })
        await expect(input).toHaveAccessibleDescription('Read our privacy policy before subscribing.')
        input.focus()
        await userEvent.tab()
        await expect(canvas.getByRole('link', { name: 'privacy policy' })).toHaveFocus()
    }
}
