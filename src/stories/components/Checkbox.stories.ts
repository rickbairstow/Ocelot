import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Checkbox from '@Components/Checkbox.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Inputs/Checkbox',
    component: Checkbox,
    parameters: {
        docs: {
            description: {
                component: 'A styled native checkbox. Supports indeterminate state, disabled state, and group selection via CheckboxGroup. Integrates with FormField for ARIA-linked error and hint text.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { checked: ref(false) } },
        template: '<Checkbox v-model="checked" label="Accept terms and conditions" name="terms" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const checkbox = canvas.getByRole('checkbox')
        await expect(checkbox).not.toBeChecked()
        await userEvent.click(checkbox)
        await expect(checkbox).toBeChecked()
        await userEvent.click(checkbox)
        await expect(checkbox).not.toBeChecked()
    }
}

export const Checked: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { checked: ref(true) } },
        template: '<Checkbox v-model="checked" label="Subscribe to newsletter" name="newsletter" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).getByRole('checkbox')).toBeChecked()
    }
}

export const Indeterminate: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { checked: ref(false) } },
        template: '<Checkbox v-model="checked" indeterminate label="Select all" name="select-all" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const checkbox = within(canvasElement).getByRole('checkbox') as HTMLInputElement
        await expect(checkbox.indeterminate).toBe(true)
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { checked: ref(false) } },
        template: '<Checkbox v-model="checked" disabled label="Disabled option" name="opt" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const checkbox = within(canvasElement).getByRole('checkbox')
        await expect(checkbox).toBeDisabled()
        await userEvent.click(checkbox)
        await expect(checkbox).not.toBeChecked()
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Checkbox, FormField },
        setup() { return { checked: ref(false) } },
        template: `
            <FormField error="You must accept the terms to continue.">
                <Checkbox v-model="checked" label="I accept the terms and conditions" name="terms" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const checkbox = canvas.getByRole('checkbox')
        const error = canvas.getByRole('alert')
        await expect(checkbox).toHaveAttribute('aria-describedby', error.id)
        await expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    }
}






export const RequiredAndInvalid: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { value: ref(false) } },
        template: '<div class="grid gap-3"><Checkbox id="standalone-checkbox" v-model="value" :invalid="!value" label="Confirm choice" name="choice" required  /></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const control = canvas.getByRole('checkbox', { name: 'Confirm choice' })
        await expect(control).toHaveAttribute('id', 'standalone-checkbox')
        await expect(control).toBeRequired()
        await expect(control).toHaveAttribute('aria-invalid', 'true')
        await userEvent.click(canvas.getByText('Confirm choice', { selector: 'label' }))
        await expect(control).toBeChecked()
        await expect(control).not.toHaveAttribute('aria-invalid')
    }
}
