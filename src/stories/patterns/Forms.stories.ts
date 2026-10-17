import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { nextTick, reactive, ref } from 'vue'
import FormField from '@Components/FormField.vue'
import Input from '@Components/Input.vue'
import Select from '@Components/Select.vue'
import Textarea from '@Components/Textarea.vue'

const meta: Meta = {
    title: 'Patterns/Forms',
    parameters: {
        docs: {
            description: {
                component: 'A complete form using native controls and FormField. The consuming application owns validation, submission and reset behaviour. This example validates on submit, focuses the first invalid control, and clears values and errors on reset. No data is sent.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const ContactForm: Story = {
    render: () => ({
        components: { FormField, Input, Select, Textarea },
        setup() {
            const initialValues = () => ({ name: '', email: '', topic: '', message: '' })
            const values = reactive(initialValues())
            const errors = reactive(initialValues())
            const submitted = ref(false)
            const form = ref<HTMLFormElement | null>(null)

            const submit = async () => {
                submitted.value = false
                errors.name = values.name.trim() ? '' : 'Enter your full name.'
                const emailInput = form.value?.elements.namedItem('email') as HTMLInputElement | null
                errors.email = !values.email.trim()
                    ? 'Enter your email address.'
                    : emailInput?.validity.typeMismatch ? 'Enter a valid email address.' : ''
                errors.topic = values.topic ? '' : 'Choose a topic.'
                errors.message = values.message.trim() ? '' : 'Enter a message.'

                await nextTick()
                if (Object.values(errors).some(Boolean)) {
                    form.value?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
                    return
                }
                submitted.value = true
            }

            const reset = () => {
                Object.assign(values, initialValues())
                Object.assign(errors, initialValues())
                submitted.value = false
            }

            return { errors, form, reset, submit, submitted, values }
        },
        template: `
            <form
                ref="form"
                aria-label="Contact us"
                class="mx-auto flex w-full max-w-xl flex-col gap-6 text-gray-900 dark:text-gray-100"
                novalidate
                @reset.prevent="reset"
                @submit.prevent="submit"
            >
                <header>
                    <h2 class="text-2xl font-semibold">Contact us</h2>
                    <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Send us a question. All fields are required.</p>
                </header>

                <fieldset class="flex min-w-0 flex-col gap-4">
                    <legend class="mb-4 text-lg font-semibold">Your details</legend>
                    <FormField :error="errors.name" label="Full name" required>
                        <Input v-model="values.name" autocomplete="name" name="name" />
                    </FormField>
                    <FormField :error="errors.email" hint="We will only use this to reply to your message." label="Email address" required>
                        <Input v-model="values.email" autocomplete="email" name="email" type="email" />
                    </FormField>
                </fieldset>

                <fieldset class="flex min-w-0 flex-col gap-4">
                    <legend class="mb-4 text-lg font-semibold">Your enquiry</legend>
                    <FormField :error="errors.topic" label="Topic" required>
                        <Select v-model="values.topic" name="topic" :options="['Product question', 'Order support', 'Something else']" placeholder="Choose a topic" />
                    </FormField>
                    <FormField :error="errors.message" hint="Include any details that will help us answer." label="Message" required>
                        <Textarea v-model="values.message" name="message" :rows="4" />
                    </FormField>
                </fieldset>

                <div class="flex flex-wrap gap-3">
                    <button class="rounded-xl bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-500" type="submit">Send message</button>
                    <button class="rounded-xl border border-gray-500 px-4 py-2 font-medium hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-gray-800" type="reset">Reset</button>
                </div>
                <p v-if="submitted" role="status">Your message is ready. This example does not send data.</p>
            </form>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const name = canvas.getByRole('textbox', { name: /full name/i })
        const email = canvas.getByRole('textbox', { name: /email address/i })
        const topic = canvas.getByRole('combobox', { name: /topic/i })
        const message = canvas.getByRole('textbox', { name: /message/i })
        const submit = canvas.getByRole('button', { name: 'Send message' })
        const reset = canvas.getByRole('button', { name: 'Reset' })

        await userEvent.click(submit)
        await expect(canvas.getAllByRole('alert')).toHaveLength(4)
        await expect(name).toHaveFocus()
        await expect(email).toHaveAttribute('aria-invalid', 'true')
        await expect(email.parentElement).toHaveClass('border-red-600')
        await expect(topic).toHaveClass('border-red-600')
        await expect(message).toHaveClass('border-red-600')

        await userEvent.type(name, 'Sam Taylor')
        await userEvent.type(email, 'invalid-email')
        await userEvent.selectOptions(topic, 'Order support')
        await userEvent.type(message, 'Could you help with my order?')
        await userEvent.click(submit)
        await expect(canvas.getByRole('alert')).toHaveTextContent('Enter a valid email address.')
        await expect(email).toHaveFocus()

        await userEvent.clear(email)
        await userEvent.type(email, 'sam@example.com')
        await userEvent.click(submit)
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await expect(email.parentElement).not.toHaveClass('border-red-600')
        await expect(topic).not.toHaveClass('border-red-600')
        await expect(message).not.toHaveClass('border-red-600')
        await expect(canvas.getByRole('status')).toHaveTextContent('Your message is ready.')

        await userEvent.click(reset)
        for (const control of [name, email, topic, message]) {
            await expect(control).toHaveValue('')
            await expect(control).not.toHaveAttribute('aria-invalid')
        }
        await expect(canvas.queryByRole('status')).not.toBeInTheDocument()

        await userEvent.click(submit)
        await userEvent.click(reset)
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
    }
}
