import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Radio from '@Components/Radio.vue'
import RadioGroup from '@Components/RadioGroup.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Radio> = {
    title: 'Components/Form Fields/Radio',
    component: Radio,
    parameters: {
        docs: {
            description: {
                component: 'A styled native radio button. Use RadioGroup for mutually exclusive option sets — it renders a fieldset/legend for correct group semantics and manages state via provide/inject.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof Radio>

export const Group: Story = {
    render: () => ({
        components: { Radio, RadioGroup },
        setup() { return { selected: ref('monthly') } },
        template: `
            <RadioGroup v-model="selected" label="Billing cycle" name="billing">
                <Radio value="monthly" label="Monthly" />
                <Radio value="yearly" label="Yearly (save 20%)" />
                <Radio value="lifetime" label="Lifetime" />
            </RadioGroup>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const radios = canvas.getAllByRole('radio')
        await expect(radios[0]).toBeChecked()
        await expect(radios[1]).not.toBeChecked()
        await userEvent.click(radios[1])
        await expect(radios[1]).toBeChecked()
        await expect(radios[0]).not.toBeChecked()
    }
}

export const GroupHorizontal: Story = {
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
        const canvas = within(canvasElement)
        const radios = canvas.getAllByRole('radio')
        await expect(radios[0]).toBeChecked()
        await userEvent.click(radios[2])
        await expect(radios[2]).toBeChecked()
        await expect(radios[0]).not.toBeChecked()
    }
}

export const GroupDisabled: Story = {
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
        const canvas = within(canvasElement)
        for (const radio of canvas.getAllByRole('radio')) {
            await expect(radio).toBeDisabled()
        }
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Radio, RadioGroup, FormField },
        setup() { return { selected: ref('') } },
        template: `
            <FormField error="Please select a plan." required>
                <RadioGroup v-model="selected" name="plan">
                    <Radio value="free" label="Free" />
                    <Radio value="pro" label="Pro — $9/mo" />
                </RadioGroup>
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('alert')).toBeInTheDocument()
        const radios = canvas.getAllByRole('radio')
        await userEvent.click(radios[1])
        await expect(radios[1]).toBeChecked()
    }
}

export const IndividualStandalone: Story = {
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
        const canvas = within(canvasElement)
        const radios = canvas.getAllByRole('radio')
        await expect(radios[1]).toBeChecked()
        await expect(radios[0]).not.toBeChecked()
        await userEvent.click(radios[0])
        await expect(radios[0]).toBeChecked()
        await expect(radios[1]).not.toBeChecked()
    }
}
