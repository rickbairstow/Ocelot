import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { computed, ref } from 'vue'
import CheckboxGroup from '@Components/CheckboxGroup.vue'
import Checkbox from '@Components/Checkbox.vue'
import FormField from '@Components/FormField.vue'
import Button from '@Components/Button.vue'

const meta: Meta<typeof CheckboxGroup> = {
    title: 'Components/Inputs/CheckboxGroup',
    component: CheckboxGroup,
    parameters: { docs: { description: { component: 'A group of independent checkboxes. Consumers validate selection counts; required is never applied to every checkbox automatically. Use FormField group for a shared legend, guidance and errors. Each option retains its own label and unique ID.\n\nDefault is a labelled group with an empty string-array model and named options. Horizontal changes the layout. With Form Field demonstrates a consumer-owned minimum-selection rule; checking one option clears the error and clearing all options restores it. Put group-level examples here rather than on the individual Checkbox page.' } } }
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { CheckboxGroup, Checkbox },
        setup: () => ({ value: ref<string[]>([]) }),
        template: '<CheckboxGroup v-model="value" label="Preferences" name="preferences"><Checkbox label="News" value="news" /><Checkbox label="Offers" value="offers" /></CheckboxGroup>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const controls = within(canvasElement).getAllByRole('checkbox')
        await expect(controls[0]).not.toBeChecked()
        await userEvent.click(controls[0])
        await expect(controls[0]).toBeChecked()
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { CheckboxGroup, Checkbox, FormField, Button },
        setup() {
            const value = ref<string[]>([])
            const submitted = ref(false)
            const error = computed(() => submitted.value && !value.value.length ? 'Choose an option.' : '')
            return { value, error, submitted }
        },
        template: `
            <form class="grid gap-4" novalidate @submit.prevent="submitted = true">
                <FormField :error="error" group hint="Choose your preferences." label="Preferences" required>
                    <CheckboxGroup v-model="value" name="preferences">
                        <Checkbox label="News" value="news" />
                        <Checkbox label="Offers" value="offers" />
                    </CheckboxGroup>
                </FormField>
                <div><Button type="submit">Continue</Button></div>
            </form>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const first = canvas.getByRole('checkbox', { name: 'News' }) as HTMLInputElement
        const second = canvas.getByRole('checkbox', { name: 'Offers' }) as HTMLInputElement
        await expect(first.id).not.toBe(second.id)
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(first).toHaveAttribute('aria-invalid', 'true')
        await expect(first).not.toBeRequired()
        await userEvent.click(canvas.getByText('News', { selector: 'label' }))
        await expect(first).toBeChecked()
        await userEvent.click(second)
        await expect(second).toBeChecked()
        await expect(first).toBeChecked()
        await expect(first).not.toHaveAttribute('aria-invalid')
        await expect(first).toHaveAccessibleDescription('Choose your preferences.')
        await userEvent.click(first)
        await userEvent.click(second)
        await expect(canvas.getByRole('alert')).toHaveTextContent('Choose an option.')
        await expect(first).toHaveAttribute('aria-invalid', 'true')
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { CheckboxGroup, Checkbox },
        setup() { return { value: ref<string[]>([]) } },
        template: '<CheckboxGroup v-model="value" disabled label="Disabled preferences" name="disabled-preferences"><Checkbox label="News" value="news" /><Checkbox label="Offers" value="offers" /></CheckboxGroup>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        for (const control of within(canvasElement).getAllByRole('checkbox')) await expect(control).toBeDisabled()
    }
}


export const Horizontal: Story = {
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
        if (!runInteractionTests) return

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
