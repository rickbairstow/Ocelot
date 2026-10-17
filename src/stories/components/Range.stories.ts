import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, fireEvent, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Range from '@Components/Range.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Range> = {
    title: 'Components/Inputs/Range',
    component: Range,
    parameters: {
        docs: { description: { component: 'A native range input. v-model and input/change events return numbers. Supports native min, max, step, disabled, keyboard interaction and FormField. Range always has a value, so required does not apply.' } }
    }
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { Range },
        setup: () => ({ value: ref(50) }),
        template: '<Range v-model="value" label="Volume" name="volume" />'
    }),
    play: async ({ canvasElement }) => {
        const slider = within(canvasElement).getByRole('slider', { name: 'Volume' })
        await expect(slider).toHaveValue('50')
        await expect(slider).toHaveAttribute('min', '0')
        await expect(slider).toHaveAttribute('max', '100')
        await expect(slider).toHaveAttribute('step', '1')
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Range, FormField },
        setup() { return { value: ref(40) } },
        template: `
            <FormField hint="Choose a volume between 0 and 100." label="Volume">
                <Range v-model="value" name="volume" :step="5" />
                <output>{{ value }}</output>
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const slider = canvas.getByRole('slider', { name: 'Volume' }) as HTMLInputElement
        await userEvent.click(canvas.getByText('Volume'))
        await expect(slider).toHaveFocus()
        slider.value = '65'
        await fireEvent.input(slider)
        await fireEvent.change(slider)
        await expect(canvas.getByRole('status')).toHaveTextContent('65')
        await expect(slider).toHaveAttribute('step', '5')
        await expect(slider).toHaveAccessibleDescription('Choose a volume between 0 and 100.')
    }
}

export const States: Story = {
    render: () => ({
        components: { Range },
        setup() { return { value: ref(20) } },
        template: `
            <div class="grid gap-6">
                <Range v-model="value" disabled label="Disabled volume" name="disabled-volume" />
                <Range v-model="value" invalid label="Invalid volume" name="invalid-volume" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('slider', { name: 'Disabled volume' })).toBeDisabled()
        await expect(canvas.getByRole('slider', { name: 'Invalid volume' })).toHaveAttribute('aria-invalid', 'true')
    }
}
