import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { computed, ref } from 'vue'
import Select from '@Components/Select.vue'
import FormField from '@Components/FormField.vue'

const COUNTRIES = [
    { value: 'gb', label: 'United Kingdom' },
    { value: 'us', label: 'United States' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' },
    { value: 'jp', label: 'Japan' }
]

const meta: Meta<typeof Select> = {
    title: 'Components/Formfields/Select',
    component: Select,
    parameters: {
        docs: {
            description: {
                component: 'A native select with progressively enhanced picker styling in supporting browsers and a native fallback elsewhere. Multiple selection remains a native listbox. Supports invalid, required, explicit IDs and native attributes/events. v-model/change return a string for single selection or string[] for multiple selection.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
    render: () => ({
        components: { Select },
        setup() { return { value: ref(''), options: COUNTRIES } },
        template: '<Select v-model="value" label="Country" name="country" :options="options" placeholder="Select a country..." />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const select = canvas.getByRole('combobox')
        await userEvent.selectOptions(select, 'gb')
        await expect(select).toHaveValue('gb')
    }
}

export const StringOptions: Story = {
    render: () => ({
        components: { Select },
        setup() { return { value: ref(''), options: ['Small', 'Medium', 'Large', 'X-Large'] } },
        template: '<Select v-model="value" label="Size" name="size" :options="options" placeholder="Choose size..." />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.selectOptions(canvas.getByRole('combobox'), 'Medium')
        await expect(canvas.getByRole('combobox')).toHaveValue('Medium')
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { Select },
        setup() { return { value: ref('us'), options: COUNTRIES } },
        template: '<Select v-model="value" disabled label="Country" name="country" :options="options" />'
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('combobox')).toBeDisabled()
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Select, FormField },
        setup() {
            const value = ref('')
            const error = computed(() => value.value ? '' : 'Please select a country.')
            return { value, error, options: COUNTRIES }
        },
        template: `
            <FormField :error="error" label="Country" required>
                <Select v-model="value" name="country" :options="options" placeholder="Select a country..." />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const select = canvas.getByRole('combobox')
        const error = canvas.getByRole('alert')
        await expect(select).toHaveAttribute('aria-invalid', 'true')
        await expect(select).toHaveClass('border-red-600')
        await expect(select).toHaveAttribute('aria-describedby', error.id)
        await userEvent.selectOptions(select, 'gb')
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await expect(select).not.toHaveAttribute('aria-invalid')
        await expect(select).not.toHaveClass('border-red-600')
    }
}

export const WithDisabledOption: Story = {
    render: () => ({
        components: { Select },
        setup() {
            return {
                value: ref(''),
                options: [
                    { value: 'free', label: 'Free' },
                    { value: 'pro', label: 'Pro' },
                    { value: 'enterprise', label: 'Enterprise (contact us)', disabled: true }
                ]
            }
        },
        template: '<Select v-model="value" label="Plan" name="plan" :options="options" placeholder="Select plan..." />'
    }),
    play: async ({ canvasElement }) => {
        const select = within(canvasElement).getByRole('combobox')
        const options = select.querySelectorAll('option')
        const enterpriseOption = Array.from(options).find(o => o.textContent?.includes('Enterprise'))
        await expect(enterpriseOption).toBeDisabled()
    }
}


export const MultipleSelection: Story = {
    render: () => ({
        components: { Select },
        setup() { return { values: ref(['Small', 'Large']), options: ['Small', 'Medium', 'Large'] } },
        template: '<div class="grid gap-3"><Select v-model="values" id="multiple-sizes" invalid label="Sizes" multiple name="sizes" :options="options" :size="3" /><button type="button" @click="values = [\'Medium\']">Choose medium</button></div>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const select = canvas.getByRole('listbox', { name: 'Sizes' })
        await expect(select).toHaveValue(['Small', 'Large'])
        await expect(select).toHaveAttribute('aria-invalid', 'true')
        await expect(select).toHaveAttribute('size', '3')
        await userEvent.click(canvas.getByRole('button', { name: 'Choose medium' }))
        await expect(select).toHaveValue(['Medium'])
        await userEvent.selectOptions(select, 'Large')
        await expect(select).toHaveValue(['Medium', 'Large'])
    }
}

export const DarkPicker: Story = {
    render: () => ({
        components: { Select },
        setup() { return { value: ref('Small') } },
        template: `
            <div class="rounded-xl bg-gray-950 p-4">
                <div class="dark" data-testid="dark-select-panel">
                    <Select v-model="value" label="Dark size" name="dark-size" :options="['Small', 'Medium', 'Large']" />
                </div>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const select = canvas.getByRole('combobox', { name: 'Dark size' })
        await userEvent.selectOptions(select, 'Medium')
        await expect(select).toHaveValue('Medium')
        // Scoped picker rules must never turn into a global .dark background rule.
        await expect(getComputedStyle(canvas.getByTestId('dark-select-panel')).backgroundColor).toBe('rgba(0, 0, 0, 0)')
        await expect(getComputedStyle(select).appearance).toBe(CSS.supports('appearance', 'base-select') ? 'base-select' : 'none')
    }
}
