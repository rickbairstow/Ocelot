import type { Meta, StoryObj } from '@storybook/vue3'
import Stepper from '@Components/Stepper.vue'
import type { StepItem } from '@Components/Stepper.vue'
import { userEvent, expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'
import { ref } from 'vue'

const makeSteps = (count = 4): StepItem[] =>
    Array.from({ length: count }, () => ({
        title: faker.lorem.words(2),
        description: faker.lorem.sentence(5)
    }))

const meta: Meta<typeof Stepper> = {
    title: 'Components/Stepper',
    component: Stepper,

    parameters: {
        docs: {
            description: {
                component: 'A step-by-step progress indicator for multi-step forms and wizards. Supports horizontal and vertical orientations with animated connector lines. Steps can display a number, custom icon, or a checkmark when completed.'
            }
        }
    },

    argTypes: {
        modelValue: { control: 'number', description: 'Current step (1-based).' },
        orientation: {
            control: 'select',
            options: ['horizontal', 'vertical'],
            description: 'Layout direction.'
        }
    },

    args: {
        modelValue: 2,
        orientation: 'horizontal',
        steps: makeSteps()
    }
}

meta.render = (args, { updateArgs }) => ({
    components: { Stepper },
    setup() {
        return { args, updateArgs }
    },
    template: '<Stepper v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" />'
})

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement, args }) {
        const steps = args.steps as StepItem[]
        const items = canvasElement.querySelectorAll('li')

        await expect(items.length).toBe(steps.length)

        // Second step is current
        const currentItem = canvasElement.querySelector('[aria-current="step"]')
        await expect(currentItem).not.toBeNull()

        // First step is completed (check icon present)
        const firstCircle = items[0].querySelector('[aria-hidden="true"]')
        await expect(firstCircle).not.toBeNull()

        // Steps after current have no aria-current
        const allCurrent = canvasElement.querySelectorAll('[aria-current="step"]')
        await expect(allCurrent.length).toBe(1)
    }
}

export const FirstStep: Story = {
    args: { modelValue: 1 },

    async play({ canvasElement }) {
        const current = canvasElement.querySelector('[aria-current="step"]')
        await expect(current).not.toBeNull()

        // No completed steps — no check icons
        const items = canvasElement.querySelectorAll('li')
        const firstCircle = items[0].querySelector('svg')
        // First step is current, should show a number not a check
        await expect(firstCircle).toBeNull()
    }
}

export const LastStep: Story = {
    args: { modelValue: 4 },

    async play({ canvasElement, args }) {
        const steps = args.steps as StepItem[]
        const lastIndex = steps.length - 1

        const current = canvasElement.querySelector('[aria-current="step"]')
        await expect(current).not.toBeNull()

        // All previous steps should have check icons (completed)
        const items = canvasElement.querySelectorAll('li')
        for (let i = 0; i < lastIndex; i++) {
            const icon = items[i].querySelector('[aria-hidden="true"]')
            await expect(icon).not.toBeNull()
        }
    }
}

export const Vertical: Story = {
    args: { orientation: 'vertical' },

    async play({ canvasElement }) {
        const current = canvasElement.querySelector('[aria-current="step"]')
        await expect(current).not.toBeNull()
    }
}

export const WithIcons: Story = {
    args: {
        modelValue: 2,
        steps: [
            { title: faker.lorem.words(2), description: faker.lorem.sentence(4), icon: 'User' },
            { title: faker.lorem.words(2), description: faker.lorem.sentence(4), icon: 'CreditCard' },
            { title: faker.lorem.words(2), description: faker.lorem.sentence(4), icon: 'Check' }
        ]
    },

    async play({ canvasElement }) {
        const current = canvasElement.querySelector('[aria-current="step"]')
        await expect(current).not.toBeNull()
    }
}

export const Interactive: Story = {
    render: () => ({
        components: { Stepper },
        setup() {
            const step = ref(1)
            const steps = makeSteps(4)
            return { step, steps }
        },
        template: `
            <div class="flex flex-col gap-6">
                <Stepper v-model="step" :steps="steps" />
                <div class="flex justify-between">
                    <button
                        class="px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
                        :disabled="step === 1"
                        @click="step--"
                    >Back</button>
                    <button
                        class="px-4 py-2 text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
                        :disabled="step === steps.length"
                        @click="step++"
                    >{{ step === steps.length ? 'Finish' : 'Next' }}</button>
                </div>
            </div>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        // Start at step 1
        const current = canvasElement.querySelector('[aria-current="step"]')
        await expect(current).not.toBeNull()
        await expect(canvas.getByRole('button', { name: 'Back' })).toBeDisabled()

        // Advance to step 2
        await userEvent.click(canvas.getByRole('button', { name: 'Next' }))
        await expect(canvas.getByRole('button', { name: 'Back' })).not.toBeDisabled()

        // Current step updated
        const items = canvasElement.querySelectorAll('li')
        await expect(items[1].getAttribute('aria-current')).toBe('step')
        await expect(items[0].getAttribute('aria-current')).toBeNull()
    }
}
