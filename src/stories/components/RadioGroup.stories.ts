import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { computed, ref } from 'vue'
import RadioGroup from '@Components/RadioGroup.vue'
import Radio from '@Components/Radio.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof RadioGroup> = {
    title: 'Components/Inputs/RadioGroup',
    component: RadioGroup,
    parameters: { docs: { description: { component: 'A native radio group. required applies to the choice as a whole. Use FormField group for a shared legend, guidance and errors. Each option retains its own label and unique ID.\n\nDefault is a labelled group with an initially empty string model. All options share the group name. The native required constraint applies to the whole choice, rather than requiring every option. Use FormField group to link a shared hint or error.' } } }
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { RadioGroup, Radio },
        setup: () => ({ value: ref('') }),
        template: '<RadioGroup v-model="value" label="Preferences" name="preferences"><Radio label="News" value="news" /><Radio label="Offers" value="offers" /></RadioGroup>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const controls = within(canvasElement).getAllByRole('radio')
        await expect(controls[0]).not.toBeChecked()
        await userEvent.click(controls[0])
        await expect(controls[0]).toBeChecked()
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { RadioGroup, Radio, FormField },
        setup() {
            const value = ref('')
            const error = computed(() => value.value.length ? '' : 'Choose an option.')
            return { value, error }
        },
        template: `
            <div class="grid gap-4">
                <FormField :error="error" group hint="Choose your preferences." label="Preferences" required>
                    <RadioGroup v-model="value" name="preferences">
                        <Radio label="Email" value="email" />
                        <Radio label="Phone" value="phone" />
                    </RadioGroup>
                </FormField>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

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
        if (!runInteractionTests) return

        for (const control of within(canvasElement).getAllByRole('radio')) await expect(control).toBeDisabled()
    }
}


export const Horizontal: Story = {
    render: () => ({
        components: { Radio, RadioGroup },
        setup() { return { selected: ref('sm') } },
        template: `
            <RadioGroup v-model="selected" label="Size" name="size" orientation="horizontal">
                <Radio value="sm" label="Small" />
                <Radio value="md" label="Medium" />
                <Radio value="lg" label="Large" />
            </RadioGroup>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const radios = canvas.getAllByRole('radio')
        await expect(radios[0]).toBeChecked()
        await userEvent.click(radios[2])
        await expect(radios[2]).toBeChecked()
        await expect(radios[0]).not.toBeChecked()
    }
}


export const WithDisabledSelection: Story = {
    render: () => ({
        components: { Radio, RadioGroup },
        setup() { return { selected: ref('pro') } },
        template: `
            <RadioGroup v-model="selected" disabled label="Plan" name="plan">
                <Radio value="free" label="Free" />
                <Radio value="pro" label="Pro" />
                <Radio value="enterprise" label="Enterprise" />
            </RadioGroup>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        for (const radio of canvas.getAllByRole('radio')) {
            await expect(radio).toBeDisabled()
        }
    }
}
