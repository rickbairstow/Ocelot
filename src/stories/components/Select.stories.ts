import { runInteractionTests } from '../interactionMode'
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
                component: 'A native select with progressively enhanced picker styling in supporting browsers and a native fallback elsewhere. Multiple selection remains a native listbox. Supports invalid, required, explicit IDs and native attributes/events. v-model/change return a string for single selection or string[] for multiple selection.' + '\n\nDefault supplies name, model, options and an accessible label without placeholder or validation overrides. Use a disabled empty-value placeholder when no initial choice is appropriate. Single selection returns a string; multiple returns string[]. Disabled Selected Option shows an unavailable saved value and follows the selected Storybook theme. Native picker appearance varies by browser.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof Select>

export const Default: Story = {
    render: () => ({
        components: { Select },
        setup() { return { value: ref('gb'), options: COUNTRIES } },
        template: '<Select v-model="value" label="Country" name="country" :options="options" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

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
                <div class="grid gap-4">
                    <Select v-model="placeholder" label="Placeholder" name="placeholder" :options="options" placeholder="Choose a plan..." />
                    <Select v-model="selected" label="Saved plan" name="selected" :options="options" />
                </div>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const luminance = (color: string) => {
            const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
                const channel = value / 255
                return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
            })
            return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722
        }
        for (const label of ['Placeholder', 'Saved plan']) {
            const select = canvas.getByRole('combobox', { name: label })
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
            await expect(select).toHaveValue(label === 'Placeholder' ? '' : 'retired')
        }
    }
}
