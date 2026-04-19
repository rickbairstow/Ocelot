import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Textarea from '@Components/Textarea.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Textarea> = {
    title: 'Components/Form Fields/Textarea',
    component: Textarea,
    parameters: {
        docs: {
            description: {
                component: 'A native textarea with consistent styling. Supports auto-resize mode that grows with content, optional character count, and integrates with FormField for label, hint, and error wiring.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof Textarea>

export const Default: Story = {
    render: () => ({
        components: { Textarea },
        setup() { return { value: ref('') } },
        template: '<Textarea v-model="value" label="Message" name="message" placeholder="Write something..." />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const textarea = canvas.getByRole('textbox')
        await userEvent.type(textarea, 'Hello world')
        await expect(textarea).toHaveValue('Hello world')
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { Textarea },
        setup() { return { value: ref('Cannot edit this.') } },
        template: '<Textarea v-model="value" disabled label="Notes" name="notes" />'
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('textbox')).toBeDisabled()
    }
}

export const Readonly: Story = {
    render: () => ({
        components: { Textarea },
        setup() { return { value: ref('Read-only content.') } },
        template: '<Textarea v-model="value" label="Terms" name="terms" readonly />'
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('textbox')).toHaveAttribute('readonly')
    }
}

export const AutoResize: Story = {
    render: () => ({
        components: { Textarea },
        setup() { return { value: ref('') } },
        template: '<Textarea v-model="value" label="Bio" name="bio" placeholder="Start typing..." resize="auto" />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const textarea = canvas.getByRole('textbox')
        const initialHeight = (textarea as HTMLTextAreaElement).style.height
        await userEvent.type(textarea, 'Line 1{Enter}Line 2{Enter}Line 3{Enter}Line 4{Enter}Line 5')
        const newHeight = (textarea as HTMLTextAreaElement).style.height
        await expect(newHeight).not.toBe(initialHeight)
    }
}

export const WithCount: Story = {
    render: () => ({
        components: { Textarea },
        setup() { return { value: ref('Hello') } },
        template: '<Textarea v-model="value" :maxlength="100" label="Bio" name="bio" show-count />'
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('5/100')).toBeInTheDocument()
    }
}

export const CountNearLimit: Story = {
    render: () => ({
        components: { Textarea },
        setup() { return { value: ref('x'.repeat(95)) } },
        template: '<Textarea v-model="value" :maxlength="100" label="Message" name="message" show-count />'
    }),
    play: async ({ canvasElement }) => {
        const counter = within(canvasElement).getByText('95/100')
        await expect(counter).toBeInTheDocument()
        await expect(counter).toHaveClass('text-amber-700')
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Textarea, FormField },
        setup() { return { value: ref('') } },
        template: `
            <FormField error="Message must be at least 10 characters." hint="Max 255 characters." label="Message" required>
                <Textarea v-model="value" name="message" show-count />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const textarea = canvas.getByRole('textbox')
        const error = canvas.getByRole('alert')
        await expect(textarea.getAttribute('aria-describedby')).toContain(error.id)
        await expect(textarea).toHaveAttribute('aria-invalid', 'true')
    }
}
