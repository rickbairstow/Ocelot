import type { Meta, StoryObj } from '@storybook/vue3'
import Progress from '@Components/Progress.vue'
import { expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof Progress> = {
    title: 'Components/Progress',
    component: Progress,

    parameters: {
        docs: {
            description: {
                component: 'A bar or circle indicator showing task completion. Supports determinate values with a visible label and percentage, and an indeterminate animated mode for tasks of unknown duration.'
            }
        }
    },

    argTypes: {
        color: {
            control: 'select',
            options: ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink']
        },
        size: {
            control: 'select',
            options: ['sm', 'base', 'lg']
        },
        value: { control: 'number' },
        variant: {
            control: 'select',
            options: ['bar', 'circle']
        }
    },

    args: {
        color: 'blue',
        label: faker.lorem.words(3),
        max: 100,
        showValue: true,
        size: 'base',
        value: 65,
        variant: 'bar'
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement, args }) {
        const canvas = within(canvasElement)
        const bar = canvas.getByRole('progressbar')

        await expect(bar).toHaveAttribute('aria-valuenow', String(args.value))
        await expect(bar).toHaveAttribute('aria-valuemin', '0')
        await expect(bar).toHaveAttribute('aria-valuemax', String(args.max))
        await expect(canvas.getByText(`${args.value}%`)).toBeVisible()
        await expect(canvas.getByText(args.label as string)).toBeVisible()
    }
}

export const Indeterminate: Story = {
    args: { value: undefined, showValue: false },

    async play({ canvasElement }) {
        const bar = within(canvasElement).getByRole('progressbar')
        await expect(bar).not.toHaveAttribute('aria-valuenow')
        await expect(bar).toHaveAttribute('aria-busy', 'true')
        await expect(bar).toHaveAttribute('aria-valuetext', 'Loading progress')
    }
}

export const Sizes: Story = {
    render: (args) => ({
        components: { Progress },
        setup() {
            return {
                args,
                labels: [faker.lorem.words(3), faker.lorem.words(3), faker.lorem.words(3)]
            }
        },
        template: `
            <div class="flex flex-col gap-6 w-full">
                <Progress :color="args.color" :label="labels[0]" show-value size="sm" :value="args.value" />
                <Progress :color="args.color" :label="labels[1]" show-value size="base" :value="args.value" />
                <Progress :color="args.color" :label="labels[2]" show-value size="lg" :value="args.value" />
            </div>
        `
    }),

    async play({ canvasElement }) {
        const bars = within(canvasElement).getAllByRole('progressbar')
        await expect(bars).toHaveLength(3)
        for (const bar of bars) {
            await expect(bar).toHaveAttribute('aria-valuenow', '65')
        }
    }
}

export const Colors: Story = {
    render: (args) => ({
        components: { Progress },
        setup() {
            return {
                args,
                labels: ['blue', 'green', 'red', 'orange', 'purple', 'teal'].map(() => faker.lorem.words(3))
            }
        },
        template: `
            <div class="flex flex-col gap-4 w-full">
                <Progress color="blue"   :label="labels[0]" show-value :size="args.size" :value="args.value" />
                <Progress color="green"  :label="labels[1]" show-value :size="args.size" :value="args.value" />
                <Progress color="red"    :label="labels[2]" show-value :size="args.size" :value="args.value" />
                <Progress color="orange" :label="labels[3]" show-value :size="args.size" :value="args.value" />
                <Progress color="purple" :label="labels[4]" show-value :size="args.size" :value="args.value" />
                <Progress color="teal"   :label="labels[5]" show-value :size="args.size" :value="args.value" />
            </div>
        `
    }),

    async play({ canvasElement }) {
        const bars = within(canvasElement).getAllByRole('progressbar')
        await expect(bars).toHaveLength(6)
    }
}

export const Circle: Story = {
    args: { variant: 'circle', showValue: true },

    async play({ canvasElement, args }) {
        const canvas = within(canvasElement)
        const bar = canvas.getByRole('progressbar')

        await expect(bar).toHaveAttribute('aria-valuenow', String(args.value))
        await expect(canvas.getByText(`${args.value}%`)).toBeVisible()
    }
}

export const CircleSizes: Story = {
    render: (args) => ({
        components: { Progress },
        setup() { return { args } },
        template: `
            <div class="flex items-end gap-8">
                <Progress :color="args.color" label="Small" show-value size="sm" :value="args.value" variant="circle" />
                <Progress :color="args.color" label="Base" show-value size="base" :value="args.value" variant="circle" />
                <Progress :color="args.color" label="Large" show-value size="lg" :value="args.value" variant="circle" />
            </div>
        `
    }),

    async play({ canvasElement }) {
        const bars = within(canvasElement).getAllByRole('progressbar')
        await expect(bars).toHaveLength(3)
        for (const bar of bars) {
            await expect(bar).toHaveAttribute('aria-valuenow', '65')
        }
    }
}
