import { runInteractionTests } from '../interactionMode'
import { iconControl } from '../iconControl'
import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '@Components/Button.vue'
import { userEvent, expect, within } from 'storybook/test'

const colors = ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink']
const variants = ['primary', 'secondary', 'tertiary', 'text', 'none'] as const

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,

    parameters: {
        docs: {
            description: {
                component: 'Triggers an action or navigates to a URL. Supports multiple variants, colours, and sizes, leading and trailing icons, a loading state that disables interaction and shows a spinner, and renders as an anchor when an href is provided.\n\nDefaults to blue, base size and the primary variant, with no icon, link, loading or disabled state. Within ButtonGroup, omitted colour, size and variant inherit the group settings before falling back to these defaults. Supply visible button text, or aria-label for an icon-only action. Use href for navigation and a button for actions.'
            }
        }
    },

    argTypes: {
        color: {
            control: 'select',
            options: colors,
            description: 'Base theme color. Inherits ButtonGroup colour when omitted.',
            table: { defaultValue: { summary: 'blue (or ButtonGroup colour)' } }
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
            description: 'Renders as an anchor tag.'
        },
        icon: iconControl,
        iconOnly: {
            control: 'boolean',
            description: 'Square icon-only button. Requires aria-label.'
        },
        iconPosition: {
            control: 'select',
            options: ['start', 'end'],
            description: 'Icon placement. Follows document direction.'
        },
        loading: {
            control: 'boolean',
            description: 'Shows a loading spinner without changing button dimensions.'
        },
        loadingIcon: {
            control: 'select',
            options: ['Loader', 'Loader2', 'Loader3'],
            description: 'Icon used for the loading spinner.'
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Button size. Inherits ButtonGroup size when omitted.',
            table: { defaultValue: { summary: 'base (or ButtonGroup size)' } }
        },
        variant: {
            control: 'select',
            options: [...variants],
            description: 'Visual style. Inherits ButtonGroup variant when omitted.',
            table: { defaultValue: { summary: 'primary (or ButtonGroup variant)' } }
        }
    },

    args: {
        default: 'Continue',
        color: 'blue',
        disabled: false,
        href: null,
        icon: undefined,
        iconOnly: false,
        iconPosition: 'start',
        loading: false,
        loadingIcon: 'Loader2',
        size: 'base',
        variant: 'primary'
    },

    render: (args) => ({
        components: { Button },
        setup() { return { args } },
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
                @click="args.href ? $event.preventDefault() : undefined"
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
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button'))
    }
}

export const Disabled: Story = {
    args: { disabled: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const button = canvas.getByRole('button')
        await expect(button).toHaveAttribute('aria-disabled', 'true')
    }
}

export const Loading: Story = {
    args: { loading: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const button = canvas.getByRole('button')
        await expect(button).toHaveAttribute('aria-busy', 'true')
        await expect(button).toHaveAttribute('aria-disabled', 'true')
    }
}

export const Icons: Story = {
    render: () => ({
        components: { Button },
        template: `
            <div class="flex flex-wrap items-center gap-3">
                <Button icon="Plus" icon-position="start">Icon start</Button>
                <Button icon="ArrowRight" icon-position="end">Icon end</Button>
                <Button icon="Plus" icon-only aria-label="Add item" />
                <Button icon="Plus" icon-only aria-label="Add item" size="small" />
                <Button icon="Plus" icon-only aria-label="Add item" size="large" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        for (const button of within(canvasElement).getAllByRole('button')) {
            await expect(button.querySelector('svg')).toBeInTheDocument()
        }
    }
}

export const AllVariations: Story = {
    render: () => ({
        components: { Button },
        setup: () => ({ colors, variants, sizes: ['small', 'base', 'large'] }),
        template: `
            <div class="flex flex-col gap-8">
                <div v-for="color in colors" :key="color" class="flex flex-col gap-3">
                    <p class="text-sm font-medium capitalize text-gray-600 dark:text-gray-400">{{ color }}</p>
                    <div v-for="size in sizes" :key="size" class="flex flex-wrap items-center gap-2">
                        <Button v-for="variant in variants" :key="variant" :color="color" :variant="variant" :size="size">
                            {{ variant }}
                        </Button>
                        <Button :color="color" :size="size" icon="Plus" icon-position="start">Icon</Button>
                        <Button :color="color" :size="size" icon="Plus" icon-only aria-label="Icon only" />
                        <Button :color="color" :size="size" disabled>Disabled</Button>
                        <Button :color="color" :size="size" loading>Loading</Button>
                    </div>
                </div>
            </div>
        `
    })
}
