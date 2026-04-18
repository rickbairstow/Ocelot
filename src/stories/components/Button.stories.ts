import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '@Components/Button.vue'
import { userEvent, expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'
import { IconBrandGithub } from '@tabler/icons-vue'

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
        icon: {
            control: 'text',
            description: 'Icon registry key or Vue component. Renders alongside the label.'
        },
        iconOnly: {
            control: 'boolean',
            description: 'Square icon-only button. Requires aria-label.'
        },
        iconPosition: {
            control: 'select',
            options: ['start', 'end'],
            description: 'Icon placement relative to label. Follows document direction (start = inline-start).'
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
        href: null,
        iconPosition: 'start'
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
                :icon="args.icon"
                :icon-only="args.iconOnly"
                :icon-position="args.iconPosition"
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

export const IconStart: Story = {
    args: { icon: 'Plus', iconPosition: 'start', default: 'Add item' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole('button')
        const svg = button.querySelector('svg')
        await expect(svg).toBeInTheDocument()
        // SVG is the first child of the inner flex span
        const flex = button.querySelector('.flex')
        await expect(flex?.firstElementChild?.tagName.toLowerCase()).toBe('svg')
    }
}

export const IconEnd: Story = {
    args: { icon: 'ArrowRight', iconPosition: 'end', default: 'Next' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole('button')
        const svg = button.querySelector('svg')
        await expect(svg).toBeInTheDocument()
        // SVG is the last child of the inner flex span
        const flex = button.querySelector('.flex')
        await expect(flex?.lastElementChild?.tagName.toLowerCase()).toBe('svg')
    }
}

export const IconComponent: Story = {
    render: () => ({
        components: { Button },
        setup() {
            return { IconBrandGithub }
        },
        template: `
            <Button :icon="IconBrandGithub">
                GitHub
            </Button>
        `
    }),
    play: async ({ canvasElement }) => {
        const svg = canvasElement.querySelector('svg')
        await expect(svg).toBeInTheDocument()
    }
}

export const IconOnly: Story = {
    render: () => ({
        components: { Button },
        template: `
            <div class="flex gap-3">
                <Button icon="Plus" icon-only aria-label="Add item" size="small" />
                <Button icon="Plus" icon-only aria-label="Add item" size="base" />
                <Button icon="Plus" icon-only aria-label="Add item" size="large" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const buttons = within(canvasElement).getAllByRole('button')
        for (const button of buttons) {
            await expect(button).toHaveAttribute('aria-label')
            const svg = button.querySelector('svg')
            await expect(svg).toBeInTheDocument()
        }
    }
}

export const IconNotFound: Story = {
    args: { icon: 'NonExistentIcon' as never, default: 'Button' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = canvas.getByRole('button')
        const svg = button.querySelector('svg')
        // No icon rendered for unknown registry key
        await expect(svg).not.toBeInTheDocument()
    }
}

export const IconAllSizes: Story = {
    render: () => ({
        components: { Button },
        template: `
            <div class="flex items-center gap-3">
                <Button icon="Check" size="small">Small</Button>
                <Button icon="Check" size="base">Base</Button>
                <Button icon="Check" size="large">Large</Button>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const svgs = canvasElement.querySelectorAll('svg')
        await expect(svgs).toHaveLength(3)
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
