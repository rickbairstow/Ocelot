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
    title: 'Components/Inputs/Select',
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
        template: '<div class="grid gap-3"><Select v-model="values" id="multiple-sizes" invalid label="Sizes" multiple name="sizes" :options="options" :size="3" /></div>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const select = canvas.getByRole('listbox', { name: 'Sizes' })
        await expect(select).toHaveValue(['Small', 'Large'])
        await expect(select).toHaveAttribute('aria-invalid', 'true')
        await expect(select).toHaveAttribute('size', '3')
        await userEvent.deselectOptions(select, ['Small', 'Large'])
        await userEvent.selectOptions(select, 'Medium')
        await expect(select).toHaveValue(['Medium'])
        await userEvent.selectOptions(select, 'Large')
        await expect(select).toHaveValue(['Medium', 'Large'])
    }
}

export const DarkTheme: Story = {
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

export const DisabledSelectedOption: Story = {
    render: () => ({
        components: { Select },
        setup() {
            return {
                placeholder: ref(''),
                selected: ref('retired'),
                options: [
                    { value: 'current', label: 'Available plan' },
                    { value: 'retired', label: 'Retired plan (unavailable)', disabled: true },
                    { value: 'future', label: 'Future plan (unavailable)', disabled: true }
                ]
            }
        },
        template: `
            <div class="grid gap-4">
                <div v-for="theme in ['light', 'dark']" :key="theme" :class="theme === 'dark' ? 'dark bg-gray-950 p-4' : 'bg-white p-4'">
                    <Select v-model="placeholder" :label="theme + ' placeholder'" :name="theme + '-placeholder'" :options="options" placeholder="Choose a plan..." />
                    <Select v-model="selected" :label="theme + ' selected disabled option'" :name="theme + '-selected'" :options="options" />
                </div>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const luminance = (color: string) => {
            const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
                const channel = value / 255
                return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
            })
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
        }
        for (const theme of ['light', 'dark']) {
            for (const label of ['placeholder', 'selected disabled option']) {
                const select = canvas.getByRole('combobox', { name: `${theme} ${label}` })
                for (const option of select.querySelectorAll<HTMLOptionElement>('option:disabled')) {
                    const style = getComputedStyle(option)
                    await expect(style.opacity).toBe('1')
                    const foreground = luminance(style.color)
                    const background = luminance(style.backgroundColor)
                    const contrast = (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
                    await expect(contrast).toBeGreaterThanOrEqual(4.5)
                }
                const unavailable = within(select).getByRole('option', { name: 'Future plan (unavailable)' })
                await userEvent.selectOptions(select, unavailable)
                await expect(select).toHaveValue(label === 'placeholder' ? '' : 'retired')
            }
        }
    }
}
