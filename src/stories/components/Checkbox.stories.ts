import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Checkbox from '@Components/Checkbox.vue'
import CheckboxGroup from '@Components/CheckboxGroup.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Form Fields/Checkbox',
    component: Checkbox,
    parameters: {
        docs: {
            description: {
                component: 'A styled native checkbox. Supports indeterminate state, disabled state, and group selection via CheckboxGroup. Integrates with FormField for ARIA-linked error and hint text.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof Checkbox>

export const Default: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { checked: ref(false) } },
        template: '<Checkbox v-model="checked" label="Accept terms and conditions" name="terms" />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const checkbox = canvas.getByRole('checkbox')
        await expect(checkbox).not.toBeChecked()
        await userEvent.click(checkbox)
        await expect(checkbox).toBeChecked()
        await userEvent.click(checkbox)
        await expect(checkbox).not.toBeChecked()
    }
}

export const Checked: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { checked: ref(true) } },
        template: '<Checkbox v-model="checked" label="Subscribe to newsletter" name="newsletter" />'
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('checkbox')).toBeChecked()
    }
}

export const Indeterminate: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { checked: ref(false) } },
        template: '<Checkbox v-model="checked" indeterminate label="Select all" name="select-all" />'
    }),
    play: async ({ canvasElement }) => {
        const checkbox = within(canvasElement).getByRole('checkbox') as HTMLInputElement
        await expect(checkbox.indeterminate).toBe(true)
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { Checkbox },
        setup() { return { checked: ref(false) } },
        template: '<Checkbox v-model="checked" disabled label="Disabled option" name="opt" />'
    }),
    play: async ({ canvasElement }) => {
        const checkbox = within(canvasElement).getByRole('checkbox')
        await expect(checkbox).toBeDisabled()
        await userEvent.click(checkbox)
        await expect(checkbox).not.toBeChecked()
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Checkbox, FormField },
        setup() { return { checked: ref(false) } },
        template: `
            <FormField error="You must accept the terms to continue.">
                <Checkbox v-model="checked" label="I accept the terms and conditions" name="terms" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const checkbox = canvas.getByRole('checkbox')
        const error = canvas.getByRole('alert')
        await expect(checkbox).toHaveAttribute('aria-describedby', error.id)
        await expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    }
}

export const GroupVertical: Story = {
    render: () => ({
        components: { Checkbox, CheckboxGroup },
        setup() { return { selected: ref(['vue']) } },
        template: `
            <CheckboxGroup v-model="selected" name="frameworks">
                <Checkbox value="vue" label="Vue" />
                <Checkbox value="react" label="React" />
                <Checkbox value="svelte" label="Svelte" />
                <Checkbox value="angular" label="Angular" />
            </CheckboxGroup>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const checkboxes = canvas.getAllByRole('checkbox')
        await expect(checkboxes[0]).toBeChecked()
        await expect(checkboxes[1]).not.toBeChecked()
        await userEvent.click(checkboxes[1])
        await expect(checkboxes[1]).toBeChecked()
        await userEvent.click(checkboxes[0])
        await expect(checkboxes[0]).not.toBeChecked()
    }
}

export const GroupHorizontal: Story = {
    render: () => ({
        components: { Checkbox, CheckboxGroup, FormField },
        setup() { return { selected: ref([]) } },
        template: `
            <FormField hint="Select your interests.">
                <CheckboxGroup v-model="selected" label="Interests" name="interests" orientation="horizontal">
                    <Checkbox value="design" label="Design" />
                    <Checkbox value="development" label="Development" />
                    <Checkbox value="marketing" label="Marketing" />
                </CheckboxGroup>
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const checkboxes = canvas.getAllByRole('checkbox')
        await expect(checkboxes).toHaveLength(3)
        await userEvent.click(checkboxes[0])
        await userEvent.click(checkboxes[2])
        await expect(checkboxes[0]).toBeChecked()
        await expect(checkboxes[2]).toBeChecked()
        await expect(checkboxes[1]).not.toBeChecked()
    }
}
