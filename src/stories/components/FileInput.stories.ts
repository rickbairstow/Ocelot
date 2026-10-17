import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import FileInput from '@Components/FileInput.vue'
import FormField from '@Components/FormField.vue'
import Button from '@Components/Button.vue'

const meta: Meta<typeof FileInput> = {
    title: 'Components/Inputs/FileInput',
    component: FileInput,
    parameters: {
        docs: { description: { component: 'A native file chooser with accept, multiple, required and disabled support. v-model/change return File[] even for a single file. Set the model to [] or call clear() to clear it; browsers do not allow preselecting files. Consumers validate type and size and handle uploads. accept is a chooser hint, not validation.\n\nDefault is a native chooser with a name, label and empty File[] model. With Form Field adds a required image/PDF attachment example; Multiple and Disabled demonstrate independent features. Multiple selection lists every selected filename below the chooser. Choose files together in one selection; a new chooser selection replaces the previous one. Removable Attachment adds an optional consumer-owned removal action. accept is a chooser hint, not file validation.' } }
    }
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { FileInput },
        setup: () => ({ files: ref<File[]>([]) }),
        template: '<FileInput v-model="files" label="Attachment" name="attachment" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByLabelText('Attachment') as HTMLInputElement
        await expect(input).not.toBeRequired()
        await userEvent.upload(input, new File(['receipt'], 'receipt.txt', { type: 'text/plain' }))
        await expect(input.files).toHaveLength(1)
        await userEvent.upload(input, [])
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { FileInput, FormField },
        setup() { return { files: ref<File[]>([]) } },
        template: `
            <FormField hint="Choose an image or PDF document." label="Attachment" required>
                <FileInput v-model="files" accept="image/*,application/pdf" name="attachment" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const input = canvas.getByLabelText(/attachment/i) as HTMLInputElement
        await expect(input).toBeRequired()
        await userEvent.upload(input, new File(['example'], 'receipt.pdf', { type: 'application/pdf' }))
        await expect(input.files).toHaveLength(1)
        await expect(input.files?.[0].name).toBe('receipt.pdf')
        await userEvent.upload(input, [])
        await expect(input.files).toHaveLength(0)
    }
}

export const Multiple: Story = {
    render: () => ({
        components: { FileInput },
        setup() { return { files: ref<File[]>([]) } },
        template: `
            <div class="grid gap-4">
                <FileInput v-model="files" label="Documents" multiple name="documents" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const input = canvas.getByLabelText('Documents') as HTMLInputElement
        await userEvent.upload(input, [new File(['a'], 'a.txt'), new File(['b'], 'b.txt')])
        await expect(input.files).toHaveLength(2)
        await expect(canvas.getByRole('list', { name: 'Selected files' })).toHaveTextContent('a.txt')
        await expect(canvas.getByRole('list', { name: 'Selected files' })).toHaveTextContent('b.txt')
        await userEvent.upload(input, [])
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { FileInput },
        template: '<FileInput disabled label="Attachment" name="disabled-attachment" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).getByLabelText('Attachment')).toBeDisabled()
    }
}

export const RemovableAttachment: Story = {
    render: () => ({
        components: { FileInput, FormField, Button },
        setup() { return { files: ref<File[]>([]) } },
        template: `
            <div class="grid max-w-lg gap-3">
                <FormField hint="Attach your receipt as an image or PDF." label="Receipt">
                    <FileInput v-model="files" accept="image/*,application/pdf" name="receipt" />
                </FormField>
                <div v-if="files.length">
                    <Button variant="secondary" @click="files = []">Remove attachment</Button>
                </div>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const input = canvas.getByLabelText('Receipt') as HTMLInputElement
        await expect(canvas.queryByRole('button', { name: 'Remove attachment' })).not.toBeInTheDocument()
        await userEvent.upload(input, new File(['receipt image'], 'receipt.png', { type: 'image/png' }))
        await expect(input.files).toHaveLength(1)
        await userEvent.click(canvas.getByRole('button', { name: 'Remove attachment' }))
        await expect(input.files).toHaveLength(0)
        await expect(canvas.queryByRole('button', { name: 'Remove attachment' })).not.toBeInTheDocument()
    }
}
