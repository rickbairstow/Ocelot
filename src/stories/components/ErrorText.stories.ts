import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'
import ErrorText from '@Components/ErrorText.vue'
import Input from '@Components/Input.vue'
import Button from '@Components/Button.vue'

const meta = {
    title: 'Components/ErrorText', component: ErrorText,
    parameters: { docs: { description: { component: 'An inline error message with consistent light/dark colours and role="alert" by default. Render it when an error becomes relevant; the consumer owns validation. Set announce=false for static copy or when another live region already announces the error. FormField uses ErrorText internally. Outside FormField, supply an id, link it with aria-describedby, and mark the control invalid. The message alone does not change a control’s validity.' } } },
    render: args => ({ components: { ErrorText }, setup: () => ({ args }), template: '<ErrorText v-bind="args">Enter a valid email address.</ErrorText>' })
} satisfies Meta<typeof ErrorText>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).getByRole('alert')).toHaveTextContent('Enter a valid email address.')
    }
}

export const StaticMessage: Story = {
    args: { announce: false },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).queryByRole('alert')).not.toBeInTheDocument()
        await expect(within(canvasElement).getByText('Enter a valid email address.')).toBeVisible()
    }
}

export const WithValidation: Story = {
    render: () => ({
        components: { ErrorText, Input, Button },
        setup() {
            const email = ref('')
            const error = ref('')
            return { email, error, validate: () => { error.value = email.value.includes('@') ? '' : 'Enter a valid email address.' } }
        },
        template: '<form class="max-w-sm space-y-3" novalidate @submit.prevent="validate"><Input v-model="email" :aria-describedby="error ? \'standalone-email-error\' : undefined" :invalid="!!error" label="Email" type="email" /><ErrorText v-if="error" id="standalone-email-error">{{ error }}</ErrorText><Button type="submit">Subscribe</Button></form>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
        const input = canvas.getByRole('textbox', { name: 'Email' })
        await expect(input).toHaveAttribute('aria-invalid', 'true')
        await expect(input).toHaveAccessibleDescription('Enter a valid email address.')
        await userEvent.type(input, 'hello@example.com')
        await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await expect(input).not.toHaveAttribute('aria-invalid', 'true')
        await userEvent.clear(input)
        await userEvent.click(canvas.getByRole('button', { name: 'Subscribe' }))
        await expect(input).toHaveValue('')
        await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a valid email address.')
    }
}
