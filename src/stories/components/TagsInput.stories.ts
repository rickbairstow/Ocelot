import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { ref, watch } from 'vue'
import TagsInput from '@Components/TagsInput.vue'
import FormField from '@Components/FormField.vue'
import { runInteractionTests } from '../interactionMode'

const meta: Meta<typeof TagsInput> = {
    title: 'Components/Inputs/TagsInput',
    component: TagsInput,
    parameters: { docs: { description: { component: 'Free-form string values, without an option catalogue or suggestion popup. Supply a string[] model and name. Enter, comma or Tab commits trimmed text; paste accepts comma/newline-separated values. Empty values and exact duplicates are ignored. Backspace on an empty editor removes the last tag; Escape clears the draft. Removal buttons are keyboard accessible and focus returns to the editor. maxTags limits additions. Values must be unique strings. change emits the new array; add/remove emit the affected string. The draft is not submitted. A hidden input per tag submits repeated name values (read with FormData.getAll(name)); disabled omits them. Native required checks that at least one tag exists; it does not validate individual tags. Consumers own email/keyword rules and resets. Supports FormField, invalid, disabled, readonly, label or aria-label, and exposes element/focus(). readonly prevents changes but preserves submission. Localise the remove button prefix with removeLabel.' } } },
    decorators: [() => ({ template: '<div class="max-w-md"><story /></div>' })],
    args: { modelValue: [], name: 'tags', label: 'Tags', disabled: false, readonly: false, required: false, invalid: false, removeLabel: 'Remove' },
    render: args => ({
        components: { TagsInput },
        setup() {
            const value = ref(args.modelValue)
            watch(() => args.modelValue, next => { value.value = next })
            return { args, value }
        },
        template: '<TagsInput v-bind="args" v-model="value" />'
    })
}
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox', { name: 'Tags' })
        await userEvent.type(input, 'Vue{Enter}Vue{Enter}CSS,')
        await expect(canvas.getAllByRole('button')).toHaveLength(2)
        await userEvent.click(canvas.getByRole('button', { name: 'Remove Vue' }))
        await expect(input).toHaveFocus()
        await userEvent.keyboard('{Backspace}')
        await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
        await userEvent.type(input, '  Design  {Tab}')
        await expect(canvas.getByRole('button', { name: 'Remove Design' })).toBeVisible()
    }
}
export const Populated: Story = {
    args: { modelValue: ['Design', 'Vue', 'Accessibility'] },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getAllByRole('button')).toHaveLength(3)
        await expect(Array.from(canvasElement.querySelectorAll<HTMLInputElement>('input[type="hidden"]')).map(input => input.value)).toEqual(['Design', 'Vue', 'Accessibility'])
    }
}
export const MaxTags: Story = {
    args: { modelValue: ['Design', 'Vue'], maxTags: 3, placeholder: 'Add up to three tags' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        const input = canvas.getByRole('textbox')
        const clipboardData = new DataTransfer()
        clipboardData.setData('text', 'CSS,HTML,Vue')
        input.dispatchEvent(new ClipboardEvent('paste', { clipboardData, bubbles: true, cancelable: true }))
        await waitFor(() => expect(canvas.getAllByRole('button')).toHaveLength(3))
        await expect(input).toHaveAttribute('readonly')
        await userEvent.click(canvas.getByRole('button', { name: 'Remove CSS' }))
        await expect(input).not.toHaveAttribute('readonly')
    }
}
export const Disabled: Story = {
    args: { modelValue: ['Design', 'Vue'], disabled: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('textbox')).toBeDisabled()
        for (const button of canvas.getAllByRole('button')) await expect(button).toBeDisabled()
    }
}
export const Readonly: Story = {
    args: { modelValue: ['Design', 'Vue'], readonly: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('textbox')).toHaveAttribute('readonly')
        await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    }
}
export const WithFormField: Story = {
    render: () => ({ components: { TagsInput, FormField }, setup: () => ({ value: ref<string[]>([]) }), template: '<FormField label="Keywords" hint="Press Enter or comma to add each keyword." required><TagsInput v-model="value" name="keywords" /></FormField>' }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const input = within(canvasElement).getByRole('textbox', { name: /Keywords/ })
        await expect(input).toBeRequired()
        await expect(input).toHaveAccessibleDescription('Press Enter or comma to add each keyword.')
        await userEvent.type(input, 'Nature')
        await expect((input as HTMLInputElement).validity.valid).toBe(false)
        await userEvent.keyboard('{Enter}')
        await expect(input).not.toBeRequired()
        await expect((input as HTMLInputElement).validity.valid).toBe(true)
    }
}
export const Invalid: Story = {
    render: () => ({ components: { TagsInput, FormField }, setup: () => ({ value: ref(['not-an-email']) }), template: '<FormField label="Recipients" error="Enter a valid email address for each recipient."><TagsInput v-model="value" name="recipients" /></FormField>' }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
    }
}
