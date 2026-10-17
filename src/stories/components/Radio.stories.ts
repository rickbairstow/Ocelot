import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Radio from '@Components/Radio.vue'
import RadioGroup from '@Components/RadioGroup.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Radio> = {
    title: 'Components/Inputs/Radio',
    component: Radio,
    parameters: {
        docs: {
            description: {
                component: 'A styled native radio button. Use RadioGroup for mutually exclusive option sets — it renders a fieldset/legend for correct group semantics and manages state via provide/inject.\n\nDefault renders one unchecked radio with a value and an accessible label. Use RadioGroup for an option set; Shared Name shows native grouping without RadioGroup. A radio cannot be toggled off by clicking it again.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof Radio>

export const Default: Story = {
    render: () => ({
        components: { Radio },
        setup: () => ({ value: ref('') }),
        template: '<Radio v-model="value" label="Standard delivery" name="delivery" value="standard" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const control = within(canvasElement).getByRole('radio', { name: 'Standard delivery' })
        await expect(control).not.toBeChecked()
        await userEvent.click(control)
        await expect(control).toBeChecked()
    }
}







export const WithFormField: Story = {
    render: () => ({
        components: { Radio, RadioGroup, FormField },
        setup() { return { selected: ref('') } },
        template: `
            <FormField group hint="Choose the plan that suits you." label="Plan" required>
                <RadioGroup v-model="selected" name="plan">
                    <Radio value="free" label="Free" />
                    <Radio value="pro" label="Pro — $9/mo" />
                </RadioGroup>
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        const radios = canvas.getAllByRole('radio')
        await userEvent.click(radios[1])
        await expect(radios[1]).toBeChecked()
    }
}

export const SharedName: Story = {
    render: () => ({
        components: { Radio },
        setup() { return { selected: ref('b') } },
        template: `
            <div class="flex flex-col gap-2">
                <Radio v-model="selected" name="opt" value="a" label="Option A" />
                <Radio v-model="selected" name="opt" value="b" label="Option B" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const radios = canvas.getAllByRole('radio')
        await expect(radios[1]).toBeChecked()
        await expect(radios[0]).not.toBeChecked()
        await userEvent.click(radios[0])
        await expect(radios[0]).toBeChecked()
        await expect(radios[1]).not.toBeChecked()
    }
}


export const RequiredAndInvalid: Story = {
    render: () => ({
        components: { Radio },
        setup() { return { value: ref('') } },
        template: '<div class="grid gap-3"><Radio id="standalone-radio" v-model="value" :invalid="!value" label="Confirm choice" name="choice" required value="choice" /></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const control = canvas.getByRole('radio', { name: 'Confirm choice' })
        await expect(control).toHaveAttribute('id', 'standalone-radio')
        await expect(control).toBeRequired()
        await expect(control).toHaveAttribute('aria-invalid', 'true')
        await userEvent.click(canvas.getByText('Confirm choice', { selector: 'label' }))
        await expect(control).toBeChecked()
        await expect(control).not.toHaveAttribute('aria-invalid')
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { Radio },
        template: '<Radio disabled label="Unavailable plan" name="disabled-plan" value="archived" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const radio = within(canvasElement).getByRole('radio', { name: 'Unavailable plan' })
        await expect(radio).toBeDisabled()
        await userEvent.click(radio)
        await expect(radio).not.toBeChecked()
    }
}
