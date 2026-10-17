import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, fireEvent, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Input from '@Components/Input.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Input> = {
    title: 'Components/Inputs/Input',
    component: Input,

    parameters: {
        docs: {
            description: {
                component: 'A native input for text, email, password, search, tel, url, number, date, time, datetime-local, month, week and color. Values and input/change events are strings, including number/date inputs. Native browser pickers and unsupported-type fallbacks are preserved. Use Range, FileInput, Checkbox and Radio for their distinct value contracts. Supports invalid, explicit IDs, native attributes/events, element and focus().\n\nDefault passes only a name, an empty model and an accessible label. Use type for native input behaviour. Number values remain strings. Prefix and suffix slots provide surrounding content; they do not format or validate the value. Native attributes such as autocomplete, inputmode, min and pattern reach the control. Validation rules and error timing belong to the consuming application.'
            }
        }
    },

    argTypes: {
        autoComplete: {
            control: 'text',
            description: 'Legacy boolean or a native autocomplete token. Prefer autocomplete="email", "name", etc.'
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
            options: ['text', 'email', 'number', 'password', 'search', 'tel', 'url', 'color', 'date', 'time', 'datetime-local', 'month', 'week'],
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

    args: { label: 'First name', modelValue: '', name: 'first-name' },

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

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('textbox', { name: 'First name' })
        await expect(input).toHaveAttribute('type', 'text')
        await expect(input).not.toBeRequired()
        await userEvent.type(input, 'Jane')
        await expect(input).toHaveValue('Jane')
        await userEvent.clear(input)
    }
}

export const Disabled: Story = {
    args: { disabled: true, modelValue: 'Unavailable', label: 'Disabled field' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByRole('textbox')).toBeDisabled()
    }
}

export const PrefixAndSuffix: Story = {
    render: () => ({
        components: { Input },
        setup: () => ({ value: ref('') }),
        template: '<Input v-model="value" label="Amount" name="amount" type="number"><template #prefix>£</template><template #suffix>GBP</template></Input>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.getByText('£')).toBeVisible()
        await expect(canvas.getByText('GBP')).toBeVisible()
        await userEvent.type(canvas.getByRole('spinbutton'), '25')
        await expect(canvas.getByRole('spinbutton')).toHaveValue(25)
    }
}



export const EmailInput: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('') } },
        template: '<Input v-model="value" type="email" label="Email address" name="email" placeholder="you@example.com" autocomplete="on" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox')
        const error = canvas.getByRole('alert')
        await expect(input).toHaveAttribute('aria-describedby', error.id)
        await expect(input).toHaveAttribute('aria-invalid', 'true')
        await expect(input.parentElement).toHaveClass('border-red-600')
    }
}


export const AdditionalTypes: Story = {
    render: () => ({
        components: { Input },
        setup() {
            return { colour: ref('#2563eb'), month: ref('2026-10'), week: ref('2026-W42'), number: ref('2') }
        },
        template: `
            <div class="grid gap-4">
                <Input v-model="colour" label="Brand colour" name="colour" type="color" />
                <Input v-model="month" label="Billing month" name="month" type="month" />
                <Input v-model="week" label="Delivery week" name="week" type="week" />
                <Input v-model="number" label="Quantity" :max="10" :min="1" name="quantity" type="number" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        for (const [label, type, value] of [
            ['Brand colour', 'color', '#ff0000'],
            ['Billing month', 'month', '2027-02'],
            ['Delivery week', 'week', '2027-W04'],
            ['Quantity', 'number', '4']
        ]) {
            const input = canvas.getByLabelText(label) as HTMLInputElement
            await expect(input).toHaveAttribute('type', type)
            input.value = value
            await fireEvent.input(input)
            await fireEvent.change(input)
            await expect(input).toHaveValue(type === 'number' ? Number(value) : value)
        }
    }
}

export const NativeAttributes: Story = {
    render: () => ({
        components: { Input, FormField },
        setup() {
            return { value: ref('') }
        },
        template: `
            <div class="grid gap-3">
                <p id="native-email-extra" class="text-sm text-gray-700 dark:text-gray-300">We only use this address to reply.</p>
                <FormField hint="Use your work email." label="Work email" required>
                    <Input id="native-contract-email" v-model="value" aria-describedby="native-email-extra" autocomplete="email" inputmode="email" :invalid="!value" name="email" type="email" />
                </FormField>

            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox', { name: /work email/i })
        await expect(input).toHaveAttribute('id', 'native-contract-email')
        await expect(input).toHaveAttribute('autocomplete', 'email')
        await expect(input).toHaveAttribute('inputmode', 'email')
        await expect(input).toBeRequired()
        await expect(input).toHaveAccessibleDescription('We only use this address to reply. Use your work email.')
        await expect(input).toHaveAttribute('aria-invalid', 'true')
        await userEvent.click(input)
        await expect(input).toHaveFocus()
        await userEvent.tab()
        await expect(input).not.toHaveFocus()
        await userEvent.type(input, 'person@example.com')
        await expect(input).not.toHaveAttribute('aria-invalid')
    }
}

export const Readonly: Story = {
    render: () => ({
        components: { Input },
        setup() { return { value: ref('Keep this value') } },
        template: '<div class="grid gap-3"><Input v-model="value" label="Readonly search" name="readonly-search" readonly type="search" /><Input v-model="value" label="Readonly password" name="readonly-password" readonly type="password" /></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
        await expect(canvas.getByLabelText('Readonly search')).toHaveAttribute('readonly')
    }
}
