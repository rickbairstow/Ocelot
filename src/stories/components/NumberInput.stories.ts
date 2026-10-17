import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, fireEvent, userEvent, within } from 'storybook/test'
import { ref, watch } from 'vue'
import NumberInput from '@Components/NumberInput.vue'
import FormField from '@Components/FormField.vue'
import { runInteractionTests } from '../interactionMode'

const meta: Meta<typeof NumberInput> = {
    title: 'Components/Inputs/NumberInput',
    component: NumberInput,
    parameters: { docs: { description: { component: 'A native number input with decrement/increment buttons. Required modelValue is number | null (empty); name is required for form submission. Defaults to step 1 with no bounds. Native arrow keys step the focused input; pointer buttons use the same native stepping rules. Buttons do not add extra Tab stops. input/update:modelValue emit while typing or stepping; change emits after a native change or button step. min, max, step and required use browser constraint validation. Typed out-of-range values remain editable so consumers can present validation; stepping respects limits. step must be positive. Use Input type="number" if step buttons are unnecessary. Supports FormField, disabled and readonly; readonly remains focusable and submits its value. Validation rules and form resets belong to the consumer. Exposes element and focus().' } } },
    decorators: [() => ({ template: '<div class="max-w-sm"><story /></div>' })],
    args: { modelValue: null, name: 'quantity', label: 'Quantity', step: 1, disabled: false, readonly: false, required: false, invalid: false, increaseLabel: 'Increase value', decreaseLabel: 'Decrease value' },
    render: args => ({
        components: { NumberInput },
        setup() {
            const value = ref(args.modelValue)
            watch(() => args.modelValue, next => { value.value = next })
            return { args, value }
        },
        template: '<NumberInput v-bind="args" v-model="value" />'
    })
}
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        const input = canvas.getByRole('spinbutton', { name: 'Quantity' })
        await expect(input).toHaveValue(null)
        await userEvent.click(canvas.getByRole('button', { name: 'Increase value' }))
        await expect(input).toHaveValue(1)
        await expect(input).toHaveFocus()
        await userEvent.click(canvas.getByRole('button', { name: 'Decrease value' }))
        await expect(input).toHaveValue(0)
        await userEvent.clear(input)
        await expect(input).toHaveValue(null)
        await userEvent.type(input, '12')
        await expect(input).toHaveValue(12)
    }
}
export const Bounded: Story = {
    args: { modelValue: 1, min: 1, max: 3 },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Decrease value' })).toBeDisabled()
        await userEvent.click(canvas.getByRole('button', { name: 'Increase value' }))
        await userEvent.click(canvas.getByRole('button', { name: 'Increase value' }))
        await expect(canvas.getByRole('spinbutton')).toHaveValue(3)
        await expect(canvas.getByRole('button', { name: 'Increase value' })).toBeDisabled()
        const input = canvas.getByRole('spinbutton') as HTMLInputElement
        await fireEvent.input(input, { target: { value: '9' } })
        await expect(input.validity.rangeOverflow).toBe(true)
    }
}
export const DecimalSteps: Story = {
    args: { modelValue: 0.1, step: 0.1, min: 0, max: 1, label: 'Weight' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: 'Increase value' }))
        await userEvent.click(canvas.getByRole('button', { name: 'Increase value' }))
        await expect(canvas.getByRole('spinbutton')).toHaveValue(0.3)
    }
}
export const Disabled: Story = {
    args: { modelValue: 5, disabled: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('spinbutton')).toBeDisabled()
        for (const button of canvas.getAllByRole('button')) await expect(button).toBeDisabled()
    }
}
export const Readonly: Story = {
    args: { modelValue: 5, readonly: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('spinbutton')).toHaveAttribute('readonly')
        for (const button of canvas.getAllByRole('button')) await expect(button).toBeDisabled()
        await userEvent.click(canvas.getByRole('spinbutton'))
        await expect(canvas.getByRole('spinbutton')).toHaveFocus()
    }
}
export const WithFormField: Story = {
    render: () => ({ components: { NumberInput, FormField }, setup: () => ({ value: ref<number | null>(null) }), template: '<FormField label="Tickets" hint="Choose between 1 and 8 tickets." required><NumberInput v-model="value" name="tickets" :min="1" :max="8" /></FormField>' }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const input = within(canvasElement).getByRole('spinbutton', { name: /Tickets/ })
        await expect(input).toBeRequired()
        await expect(input).toHaveAccessibleDescription('Choose between 1 and 8 tickets.')
    }
}
export const Invalid: Story = {
    render: () => ({ components: { NumberInput, FormField }, setup: () => ({ value: ref(12) }), template: '<FormField label="Tickets" error="Choose no more than 8 tickets."><NumberInput v-model="value" name="tickets" :max="8" /></FormField>' }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByRole('spinbutton')).toHaveAttribute('aria-invalid', 'true')
    }
}
