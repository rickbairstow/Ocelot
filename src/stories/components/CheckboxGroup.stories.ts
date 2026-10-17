import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import CheckboxGroup from '@Components/CheckboxGroup.vue'
import Checkbox from '@Components/Checkbox.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof CheckboxGroup> = {
    title: 'Components/Formfields/CheckboxGroup',
    component: CheckboxGroup,
    parameters: { docs: { description: { component: 'A group of independent checkboxes. Consumers validate selection counts; required is never applied to every checkbox automatically. Use FormField group for a shared legend, guidance and errors. Each option retains its own label and unique ID.' } } }
}
export default meta
type Story = StoryObj<typeof meta>

export const WithFormField: Story = {
    render: () => ({
        components: { CheckboxGroup, Checkbox, FormField },
        setup() { return { value: ref<string[]>([]), error: ref('Choose an option.') } },
        template: `
            <div class="grid gap-4">
                <FormField :error="error" group hint="Choose your preferences." label="Preferences" required>
                    <CheckboxGroup v-model="value" name="preferences">
                        <Checkbox label="News" value="news" />
                        <Checkbox label="Offers" value="offers" />
                    </CheckboxGroup>
                </FormField>
                <button type="button" @click="error = ''">Clear error</button>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const first = canvas.getByRole('checkbox', { name: 'News' }) as HTMLInputElement
        const second = canvas.getByRole('checkbox', { name: 'Offers' }) as HTMLInputElement
        await expect(first.id).not.toBe(second.id)
        await expect(first).toHaveAttribute('aria-invalid', 'true')
        await expect(first).not.toBeRequired()
        await userEvent.click(canvas.getByText('News', { selector: 'label' }))
        await expect(first).toBeChecked()
        await userEvent.click(second)
        await expect(second).toBeChecked()
        await expect(first).toBeChecked()
        await userEvent.click(canvas.getByRole('button', { name: 'Clear error' }))
        await expect(first).not.toHaveAttribute('aria-invalid')
        await expect(first).toHaveAccessibleDescription('Choose your preferences.')
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { CheckboxGroup, Checkbox },
        setup() { return { value: ref<string[]>([]) } },
        template: '<CheckboxGroup v-model="value" disabled label="Disabled preferences" name="disabled-preferences"><Checkbox label="News" value="news" /><Checkbox label="Offers" value="offers" /></CheckboxGroup>'
    }),
    play: async ({ canvasElement }) => {
        for (const control of within(canvasElement).getAllByRole('checkbox')) await expect(control).toBeDisabled()
    }
}
