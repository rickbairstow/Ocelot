import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Input from '@Components/Input.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Input> = {
    title: 'Components/Form Fields/Input',
    component: Input,

    parameters: {
        docs: {
            description: {
                component: 'A text input supporting all standard HTML input types. Password type includes a built-in show/hide toggle; search type includes a clear button. Integrates with FormField for ARIA-linked labels, hints, and errors.'
            }
        }
    },

    argTypes: {
        autoComplete: {
            control: 'boolean',
            description: 'Whether the input should allow browser autocomplete.'
        },

        disabled: {
            control: 'boolean',
            description: 'Whether the input is disabled.'
        },

        label: {
            control: 'text',
            description: 'The label text for the input.'
        },

        maxlength: {
            control: 'number',
            description: 'Maximum number of characters - defaults to 255.'
        },

        minlength: {
            control: 'number',
            description: 'Minimum number of characters.'
        },

        modelValue: {
            control: false,
            description:
                'Exposes modelValue for use, however the preference is to use v-model instead. Note that for Storybook setting this will only set the initial value, thus it has been disabled to prevent any confusion.'
        },

        name: {
            control: 'text',
            description: 'The name attribute for the input.'
        },

        placeholder: {
            control: 'text',
            description: 'Placeholder text for the input'
        },

        readonly: {
            control: 'boolean',
            description: 'Whether the input is read-only.'
        },

        type: {
            control: 'select',
            options: ['text', 'email', 'number', 'password', 'search', 'tel', 'url'],
            description: 'The input type.'
        },

        prefix: {
            control: 'text',
            description: 'Slot content for prefix.'
        },

        suffix: {
            control: 'text',
            description: 'Slot content for suffix.'
        }
    },

    args: {
        autoComplete: true,
        disabled: false,
        label: 'First name',
        maxlength: 255,
        modelValue: null,
        name: 'input_firstname',
        placeholder: 'Please enter your name...',
        readonly: false,
        type: 'text'
    },

    render: (args, { updateArgs }) => ({
        components: { Input },

        setup() {
            const modelValue = ref(args.modelValue)

            const handleEvent = (newValue: string) => {
                updateArgs({ ...args, modelValue: newValue || null })
            }

            return { args, modelValue, handleEvent }
        },

        template: `
            <Input
                v-bind="args"
                @update:modelValue="handleEvent"
            >
                <template v-if="args?.prefix" #prefix>{{ args.prefix }}</template>
                <template v-if="args?.suffix" #suffix>{{ args.suffix }}</template>
            </Input>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const TextInput: Story = {}

export const EmailInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="email" label="Email address" name="email" placeholder="you@example.com" autocomplete="on" />'
    }),
    play: async ({ canvasElement }) => {
        const input = within(canvasElement).getByRole('textbox')
        await expect(input).toHaveAttribute('type', 'email')
        await userEvent.type(input, 'bad-email')
        await expect(input).toHaveValue('bad-email')
    }
}

export const TelInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="tel" label="Phone number" name="phone" placeholder="+44 7700 900000" />'
    }),
    play: async ({ canvasElement }) => {
        const input = within(canvasElement).getByRole('textbox')
        await expect(input).toHaveAttribute('type', 'tel')
    }
}

export const PasswordInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="password" label="Password" name="password" placeholder="Enter your password" />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByLabelText('Password') as HTMLInputElement
        const toggle = canvas.getByRole('button', { name: 'Show password' })

        await expect(input).toHaveAttribute('type', 'password')
        await userEvent.type(input, 'secret')

        // Toggle to show
        await userEvent.click(toggle)
        await expect(input).toHaveAttribute('type', 'text')
        await expect(canvas.getByRole('button', { name: 'Hide password' })).toBeInTheDocument()

        // Toggle back to hide
        await userEvent.click(canvas.getByRole('button', { name: 'Hide password' }))
        await expect(input).toHaveAttribute('type', 'password')
    }
}

export const SearchInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="search" label="Search" name="search" placeholder="Search…" />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole('searchbox')

        await expect(canvas.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
        await userEvent.type(input, 'vue')
        await expect(canvas.getByRole('button', { name: 'Clear search' })).toBeInTheDocument()
        await userEvent.click(canvas.getByRole('button', { name: 'Clear search' }))
        await expect(input).toHaveValue('')
        await expect(canvas.queryByRole('button', { name: 'Clear search' })).not.toBeInTheDocument()
    }
}

export const NumberInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="number" label="Quantity" name="quantity" :min="1" :max="99" :step="1" placeholder="1" />'
    }),
    play: async ({ canvasElement }) => {
        const input = within(canvasElement).getByRole('spinbutton')
        await expect(input).toHaveAttribute('min', '1')
        await expect(input).toHaveAttribute('max', '99')
        await expect(input).toHaveAttribute('step', '1')
        await userEvent.clear(input)
        await userEvent.type(input, '5')
        await expect(input).toHaveValue(5)
    }
}

export const DateInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="date" label="Date of birth" name="dob" min="1900-01-01" :max="new Date().toISOString().slice(0,10)" />'
    }),
    play: async ({ canvasElement }) => {
        const input = within(canvasElement).getByLabelText('Date of birth') as HTMLInputElement
        await expect(input).toHaveAttribute('type', 'date')
        await expect(input).toHaveAttribute('min', '1900-01-01')
    }
}

export const TimeInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="time" label="Meeting time" name="meeting-time" min="09:00" max="17:00" />'
    }),
    play: async ({ canvasElement }) => {
        const input = within(canvasElement).getByLabelText('Meeting time') as HTMLInputElement
        await expect(input).toHaveAttribute('type', 'time')
        await expect(input).toHaveAttribute('min', '09:00')
        await expect(input).toHaveAttribute('max', '17:00')
    }
}

export const DateTimeInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="datetime-local" label="Appointment" name="appointment" />'
    }),
    play: async ({ canvasElement }) => {
        const input = within(canvasElement).getByLabelText('Appointment') as HTMLInputElement
        await expect(input).toHaveAttribute('type', 'datetime-local')
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Input, FormField },
        setup() { return { value: ref('') } },
        template: `
            <FormField error="Please enter a valid email address." label="Email" required>
                <Input v-model="value" type="email" name="email" placeholder="you@example.com" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox')
        const error = canvas.getByRole('alert')
        await expect(input).toHaveAttribute('aria-describedby', error.id)
        await expect(input).toHaveAttribute('aria-invalid', 'true')
    }
}
