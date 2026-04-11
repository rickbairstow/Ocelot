import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '@Components/Button.vue'
import { userEvent, expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const colors = ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink']
const types = ['primary', 'secondary', 'tertiary', 'text', 'none'] as const

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,

    argTypes: {
        color: {
            control: 'select',
            options: colors,
            description: 'Base theme color, automatically derives hover and border shades.'
        },
        default: {
            control: 'text',
            description: 'Slot content'
        },
        disabled: {
            control: 'boolean',
            description: 'Marks the button as disabled and prevents interaction.'
        },
        href: {
            control: 'text',
            description: 'Sets the link href for anchor rendering.'
        },
        loading: {
            control: 'boolean',
            description: 'Shows a loading spinner overlay without changing the button dimensions.'
        },
        loadingIcon: {
            control: 'select',
            options: ['Loader', 'Loader2', 'Loader3'],
            description: 'Icon to use for the loading spinner.'
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Sets the size of the button.'
        },
        variant: {
            control: 'select',
            options: [...types],
            description: 'Sets the visual style of the button.'
        }
    },

    args: {
        color: 'blue',
        default: faker.lorem.word(),
        disabled: false,
        loading: false,
        loadingIcon: 'Loader2',
        size: 'base',
        variant: 'primary',
        href: null
    },

    render: (args) => ({
        components: { Button },
        setup() {
            return { args }
        },
        template: `
            <Button
                :color="args.color"
                :disabled="args.disabled"
                :href="args.href"
                :loading="args.loading"
                :loading-icon="args.loadingIcon"
                :size="args.size"
                :variant="args.variant"
                @click="() => console.log('Button clicked')"
            >
                {{ args.default }}
            </Button>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
    }
}

export const Primary: Story = {
    args: { variant: 'primary' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
    }
}

export const Secondary: Story = {
    args: { variant: 'secondary' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
    }
}

export const Tertiary: Story = {
    args: { variant: 'tertiary' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
    }
}

export const Link: Story = {
    args: { variant: 'text' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
    }
}

export const None: Story = {
    args: { variant: 'none' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
    }
}

export const Disabled: Story = {
    args: { disabled: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole('button')
        await expect(button).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(button)
    }
}

export const Loading: Story = {
    args: { loading: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole('button')
        await expect(button).toHaveAttribute('aria-busy', 'true')
        await expect(button).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(button)
    }
}

export const AllColors: Story = {
    render: () => ({
        components: { Button },
        template: `
            <div class="flex flex-wrap gap-3">
                <Button v-for="color in colors" :key="color" :color="color">
                    {{ color }}
                </Button>
            </div>
        `,
        setup: () => ({ colors })
    })
}

export const AllVariations: Story = {
    render: () => ({
        components: { Button },
        setup: () => ({ colors, types }),
        template: `
            <div class="flex flex-col gap-6">
                <div v-for="color in colors" :key="color" class="flex flex-col gap-2">
                    <p class="text-sm font-medium capitalize text-gray-500">{{ color }}</p>
                    <div class="flex flex-wrap gap-2">
                        <Button v-for="type in types" :key="type" :color="color" :variant="type">
                            {{ type }}
                        </Button>
                        <Button :color="color" disabled>Disabled</Button>
                        <Button :color="color" loading>Loading</Button>
                    </div>
                </div>
            </div>
        `
    })
}
