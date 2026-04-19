import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import { ref } from 'vue'
import FormField from '@Components/FormField.vue'
import Input from '@Components/Input.vue'

const meta: Meta<typeof FormField> = {
    title: 'Components/Form Fields/FormField',
    component: FormField,
    parameters: {
        docs: {
            description: {
                component: 'A structural wrapper that handles label rendering, hint/error text, and ARIA linking (for/id, aria-describedby, aria-invalid) for form inputs. Brings no validation logic — pair it with Vee-Validate, native HTML5 validation, or any other strategy.'
            }
        }
    },
    argTypes: {
        label: { control: 'text' },
        hint: { control: 'text' },
        error: { control: 'text' },
        required: { control: 'boolean' },
        optional: { control: 'boolean' }
    }
}

export default meta
type Story = StoryObj<typeof FormField>

export const Default: Story = {
    render: () => ({
        components: { FormField, Input },
        setup() { return { value: ref('') } },
        template: `
            <FormField label="Email address">
                <Input v-model="value" name="email" type="email" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const label = canvas.getByText('Email address')
        const input = canvas.getByRole('textbox')
        await expect(label.tagName.toLowerCase()).toBe('label')
        await expect(label).toHaveAttribute('for', input.id)
    }
}

export const WithHint: Story = {
    render: () => ({
        components: { FormField, Input },
        setup() { return { value: ref('') } },
        template: `
            <FormField hint="We will never share your email." label="Email address">
                <Input v-model="value" name="email" type="email" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox')
        const hint = canvas.getByText('We will never share your email.')
        await expect(hint).toBeInTheDocument()
        await expect(input).toHaveAttribute('aria-describedby', hint.id)
    }
}

export const WithError: Story = {
    render: () => ({
        components: { FormField, Input },
        setup() { return { value: ref('not-an-email') } },
        template: `
            <FormField error="Please enter a valid email address." label="Email address">
                <Input v-model="value" name="email" type="email" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox')
        const error = canvas.getByRole('alert')
        await expect(error).toHaveTextContent('Please enter a valid email address.')
        await expect(input).toHaveAttribute('aria-describedby', error.id)
        await expect(input).toHaveAttribute('aria-invalid', 'true')
    }
}

export const Required: Story = {
    render: () => ({
        components: { FormField, Input },
        setup() { return { value: ref('') } },
        template: `
            <FormField label="Full name" required>
                <Input v-model="value" name="name" required />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const asterisk = canvasElement.querySelector('[aria-hidden="true"]')
        await expect(asterisk).toBeInTheDocument()
        await expect(asterisk).toHaveTextContent('*')
    }
}

export const Optional: Story = {
    render: () => ({
        components: { FormField, Input },
        setup() { return { value: ref('') } },
        template: `
            <FormField label="Nickname" optional>
                <Input v-model="value" name="nickname" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('(optional)')).toBeInTheDocument()
    }
}

export const ErrorOverridesHint: Story = {
    render: () => ({
        components: { FormField, Input },
        setup() { return { value: ref('') } },
        template: `
            <FormField error="This field is required." hint="Enter your username." label="Username">
                <Input v-model="value" name="username" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('alert')).toBeInTheDocument()
        await expect(canvas.queryByText('Enter your username.')).not.toBeInTheDocument()
    }
}
