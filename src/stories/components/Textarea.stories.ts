import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { computed, ref } from 'vue'
import Textarea from '@Components/Textarea.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Textarea> = {
    title: 'Components/Inputs/Textarea',
    component: Textarea,
    parameters: {
        docs: {
            description: {
                component: 'A native textarea with consistent styling. Supports auto-resize mode that grows with content, optional character count, and integrates with FormField for label, hint, and error wiring.' + '\n\nDefault is an empty labelled textarea with native rows, resize and length defaults. Auto Resize, With Count, Readonly and Disabled isolate those features. With Form Field shows a consumer-owned error that clears when the message is corrected.'
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
        template: '<Textarea v-model="value" label="Message" name="message" />'
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
        setup() {
            const value = ref('')
            const error = computed(() => value.value.length < 10 ? 'Message must be at least 10 characters.' : '')
            return { value, error }
        },
        template: `
            <FormField :error="error" hint="Max 255 characters." label="Message" required>
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
        await expect(textarea).toHaveClass('border-red-600')
        await userEvent.type(textarea, 'Please send me more information.')
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await expect(textarea).not.toHaveAttribute('aria-invalid')
    }
}


export const Invalid: Story = {
    render: () => ({
        components: { Textarea },
        setup() { return { value: ref('') } },
        template: '<div class="grid gap-3"><Textarea id="standalone-message" v-model="value" autocomplete="off" invalid label="Standalone message" name="message" required /></div>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const textarea = canvas.getByRole('textbox', { name: 'Standalone message' })
        await expect(textarea).toHaveAttribute('id', 'standalone-message')
        await expect(textarea).toHaveAttribute('aria-invalid', 'true')
        await expect(textarea).toHaveAttribute('autocomplete', 'off')
        await userEvent.type(textarea, 'A message')
        await userEvent.tab()
        await expect(textarea).toHaveValue('A message')
    }
}
