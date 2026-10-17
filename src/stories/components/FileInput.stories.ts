import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import FileInput from '@Components/FileInput.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof FileInput> = {
    title: 'Components/Formfields/FileInput',
    component: FileInput,
    parameters: {
        docs: { description: { component: 'A native file chooser with accept, multiple, required and disabled support. v-model/change return File[] even for a single file. Set the model to [] or call clear() to clear it; browsers do not allow preselecting files. Consumers validate type and size and handle uploads. accept is a chooser hint, not validation.' } }
    }
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { FileInput, FormField },
        setup() { return { files: ref<File[]>([]) } },
        template: `
            <div class="grid gap-3">
                <FormField hint="Choose a PDF document." label="Attachment" required>
                    <FileInput v-model="files" accept="application/pdf" name="attachment" />
                </FormField>
                <p role="status">{{ files.map(file => file.name).join(', ') || 'No files selected' }}</p>
                <button type="button" @click="files = []">Clear attachment</button>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByLabelText(/attachment/i) as HTMLInputElement
        await expect(input).toBeRequired()
        await userEvent.upload(input, new File(['example'], 'receipt.pdf', { type: 'application/pdf' }))
        await expect(input.files).toHaveLength(1)
        await expect(canvas.getByRole('status')).toHaveTextContent('receipt.pdf')
        await userEvent.click(canvas.getByRole('button', { name: 'Clear attachment' }))
        await expect(input.files).toHaveLength(0)
        await expect(canvas.getByRole('status')).toHaveTextContent('No files selected')
    }
}

export const MultipleAndDisabled: Story = {
    render: () => ({
        components: { FileInput },
        setup() { return { files: ref<File[]>([]) } },
        template: `
            <div class="grid gap-4">
                <FileInput v-model="files" invalid label="Documents" multiple name="documents" />
                <FileInput disabled label="Disabled attachment" name="disabled-attachment" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const input = canvas.getByLabelText('Documents') as HTMLInputElement
        await userEvent.upload(input, [new File(['a'], 'a.txt'), new File(['b'], 'b.txt')])
        await expect(input.files).toHaveLength(2)
        await expect(input).toHaveAttribute('aria-invalid', 'true')
        await expect(canvas.getByLabelText('Disabled attachment')).toBeDisabled()
    }
}
