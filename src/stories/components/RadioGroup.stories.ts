import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import RadioGroup from '@Components/RadioGroup.vue'
import Radio from '@Components/Radio.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof RadioGroup> = {
    title: 'Components/Formfields/RadioGroup',
    component: RadioGroup,
    parameters: { docs: { description: { component: 'A native radio group. required applies to the choice as a whole. Use FormField group for a shared legend, guidance and errors. Each option retains its own label and unique ID.' } } }
}
export default meta
type Story = StoryObj<typeof meta>

export const WithFormField: Story = {
    render: () => ({
        components: { RadioGroup, Radio, FormField },
        setup() { return { value: ref(''), error: ref('Choose an option.') } },
        template: `
            <div class="grid gap-4">
                <FormField :error="error" group hint="Choose your preferences." label="Preferences" required>
                    <RadioGroup v-model="value" name="preferences">
                        <Radio label="Email" value="email" />
                        <Radio label="Phone" value="phone" />
                    </RadioGroup>
                </FormField>
                <button type="button" @click="error = ''">Clear error</button>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const first = canvas.getByRole('radio', { name: 'Email' }) as HTMLInputElement
        const second = canvas.getByRole('radio', { name: 'Phone' }) as HTMLInputElement
        await expect(first.id).not.toBe(second.id)
        await expect(first).toHaveAttribute('aria-invalid', 'true')
        await expect(first).toBeRequired()
        await userEvent.click(canvas.getByText('Email', { selector: 'label' }))
        await expect(first).toBeChecked()
        await userEvent.click(second)
        await expect(second).toBeChecked()
        await expect(first).not.toBeChecked()
        await userEvent.click(canvas.getByRole('button', { name: 'Clear error' }))
        await expect(first).not.toHaveAttribute('aria-invalid')
        await expect(first).toHaveAccessibleDescription('Choose your preferences.')
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { RadioGroup, Radio },
        setup() { return { value: ref('') } },
        template: '<RadioGroup v-model="value" disabled label="Disabled preferences" name="disabled-preferences"><Radio label="Email" value="email" /><Radio label="Phone" value="phone" /></RadioGroup>'
    }),
    play: async ({ canvasElement }) => {
        for (const control of within(canvasElement).getAllByRole('radio')) await expect(control).toBeDisabled()
    }
}
