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
    title: 'Components/Form Fields/Select',
    component: Select,
    parameters: {
        docs: {
            description: {
                component: 'A styled native <select> with appearance: none and a custom chevron. In Chrome 130+ the dropdown panel gains rounded corners via ::picker(select) as a progressive enhancement. Accepts string or object options and integrates with FormField.'
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
        await expect(select).toHaveAttribute('aria-describedby', error.id)
        await userEvent.selectOptions(select, 'gb')
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await expect(select).not.toHaveAttribute('aria-invalid')
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
