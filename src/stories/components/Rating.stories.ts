import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref, watch } from 'vue'
import Rating from '@Components/Rating.vue'
import FormField from '@Components/FormField.vue'
import { runInteractionTests } from '../interactionMode'

const meta: Meta<typeof Rating> = {
    title: 'Components/Inputs/Rating',
    component: Rating,
    parameters: { docs: { description: { component: 'Whole-star rating using native radio buttons. Required modelValue is number | null; null means unrated. name groups the radios and submits the selected number as a form string. Defaults to five stars. max changes the number of choices; supply a positive integer. Native radio keyboard behaviour supports Tab, arrows and Space. Supply label, or place inside a labelled FormField with group. FormField links help/error text; validation belongs to the consumer. readonly displays a non-interactive accessible image and preserves the saved value in form submission. Its label is used in the spoken rating description. disabled prevents changes and excludes the value from form submission. No hover-only or fractional selection. change emits the chosen integer. Exposes element/focus() for the first radio in editable mode.' } } },
    args: { modelValue: null, name: 'rating', label: 'Your rating', max: 5, disabled: false, readonly: false, required: false, invalid: false },
    render: args => ({
        components: { Rating },
        setup() {
            const value = ref(args.modelValue)
            watch(() => args.modelValue, next => { value.value = next })
            return { args, value }
        },
        template: '<Rating v-bind="args" v-model="value" />'
    })
}
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('radio')).toHaveLength(5)
        await userEvent.click(canvas.getByRole('radio', { name: '3 / 5' }))
        await expect(canvas.getByRole('radio', { name: '3 / 5' })).toBeChecked()
        await userEvent.keyboard('{ArrowRight}')
        await expect(canvas.getByRole('radio', { name: '4 / 5' })).toBeChecked()
        await expect(canvas.getAllByRole('radio').filter(input => (input as HTMLInputElement).checked)).toHaveLength(1)
    }
}
export const Readonly: Story = {
    args: { modelValue: 4, readonly: true, label: 'Customer rating' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('img', { name: 'Customer rating: 4 / 5' })).toBeVisible()
        await expect(canvas.queryByRole('radio')).not.toBeInTheDocument()
    }
}
export const Disabled: Story = {
    args: { modelValue: 3, disabled: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        for (const radio of within(canvasElement).getAllByRole('radio')) await expect(radio).toBeDisabled()
    }
}
export const TenStars: Story = {
    args: { max: 10, modelValue: 7 },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('radio')).toHaveLength(10)
        await expect(canvas.getByRole('radio', { name: '7 / 10' })).toBeChecked()
    }
}
export const WithFormField: Story = {
    render: () => ({ components: { Rating, FormField }, setup: () => ({ value: ref<number | null>(null) }), template: '<FormField group label="Delivery rating" hint="Choose from one to five stars." required><Rating v-model="value" name="delivery-rating" /></FormField>' }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const radio = within(canvasElement).getByRole('radio', { name: '1 / 5' })
        await expect(radio).toBeRequired()
        await expect(radio).toHaveAccessibleDescription('Choose from one to five stars.')
    }
}
export const Invalid: Story = {
    render: () => ({ components: { Rating, FormField }, setup: () => ({ value: ref<number | null>(null) }), template: '<FormField group label="Delivery rating" error="Choose a rating before continuing." required><Rating v-model="value" name="delivery-rating" /></FormField>' }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByRole('radio', { name: '1 / 5' })).toHaveAttribute('aria-invalid', 'true')
    }
}
