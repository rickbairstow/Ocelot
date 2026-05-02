import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { computed, ref } from 'vue'
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

export const FrontendValidation: Story = {
    render: () => ({
        components: { FormField, Input },
        setup() {
            const email = ref('')
            const touched = ref(false)

            const error = computed(() => {
                if (!touched.value) return ''
                if (!email.value) return 'Email is required.'
                if (!email.value.includes('@')) return 'Enter a valid email address.'
                return ''
            })

            const markTouched = () => {
                touched.value = true
            }

            return { email, error, markTouched }
        },
        template: `
            <form
                novalidate
                @submit.prevent="markTouched"
            >
                <FormField
                    :error="error"
                    hint="Use your work email address."
                    label="Email"
                    required
                >
                    <Input
                        v-model="email"
                        name="email"
                        required
                        type="email"
                        @change="markTouched"
                    />
                </FormField>

                <button
                    class="mt-3 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500 dark:hover:bg-blue-400 dark:focus-visible:outline-blue-400"
                    type="submit"
                >
                    Continue
                </button>
            </form>
        `
    }),
    parameters: {
        docs: {
            description: {
                story: 'A lightweight frontend validation flow showing the same binding contract external libraries use: compute an error string and pass it to FormField.'
            }
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox')

        await userEvent.click(canvas.getByRole('button', { name: /continue/i }))
        await expect(canvas.getByRole('alert')).toHaveTextContent('Email is required.')
        await expect(input).toHaveAttribute('aria-invalid', 'true')

        await userEvent.type(input, 'bad-email')
        await userEvent.tab()
        await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a valid email address.')

        await userEvent.clear(input)
        await userEvent.type(input, 'person@example.com')
        await userEvent.tab()
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await expect(input).not.toHaveAttribute('aria-invalid')
    }
}
