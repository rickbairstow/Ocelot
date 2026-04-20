import type { Meta, StoryObj } from '@storybook/vue3'
import Loader from '@Components/Loader.vue'
import { faker } from '@faker-js/faker'
import { expect, within } from 'storybook/test'

const meta: Meta<typeof Loader> = {
    title: 'Components/Loader',
    component: Loader,

    parameters: {
        docs: {
            description: {
                component: 'An animated loading indicator. Supports inline, absolute overlay (fills a relative-positioned container), and fixed full-screen variants. Icon, animation style, and colour are all configurable.'
            }
        }
    },

    argTypes: {
        animation: {
            control: 'select',
            options: ['bounce', 'none', 'ping', 'pulse', 'spin'],
            description: 'Animation applied to the loader icon.'
        },
        color: {
            control: 'select',
            options: ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink', 'gray', 'default'],
            description: 'Color of the icon and text.'
        },
        icon: {
            control: 'select',
            options: ['Loader', 'Loader2', 'Loader3'],
            description: 'Icon to display.'
        },
        size: {
            control: 'select',
            options: ['xs', 'sm', 'base', 'lg', 'xl'],
            description: 'Size of the loader icon and text.'
        },
        text: {
            control: 'text',
            description: 'Optional text to display alongside the loader.'
        },
        variant: {
            control: 'select',
            options: ['absolute', 'fixed', 'inline'],
            description: 'Positioning variant.'
        },
        vertical: {
            control: 'boolean',
            description: 'Stack icon and text vertically.'
        }
    },

    args: {
        animation: 'spin',
        color: 'default',
        icon: 'Loader2',
        size: 'base',
        text: `${faker.lorem.sentence(2)}...`,
        variant: 'inline',
        vertical: false
    },

    render: (args) => ({
        components: { Loader },
        setup() {
            return { args }
        },
        template: `
            <Loader
                :animation="args.animation"
                :color="args.color"
                :icon="args.icon"
                :size="args.size"
                :text="args.text"
                :variant="args.variant"
                :vertical="args.vertical"
            />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const loader = canvas.getByRole('status')
        await expect(loader).toBeVisible()
    }
}

export const Absolute: Story = {
    args: { variant: 'absolute' }
}

export const Fixed: Story = {
    args: { variant: 'fixed' }
}

export const Inline: Story = {
    args: { variant: 'inline' },
    play: Default.play
}

export const Vertical: Story = {
    args: { vertical: true },
    play: Default.play
}

export const WithAlternateIcon: Story = {
    args: { icon: 'Photo' }
}

export const AllSizes: Story = {
    render: () => ({
        components: { Loader },
        setup: () => ({ sizes: ['xs', 'sm', 'base', 'lg', 'xl'] }),
        template: `
            <div class="flex flex-col gap-4">
                <Loader v-for="size in sizes" :key="size" :size="size" :text="size" />
            </div>
        `
    })
}

export const AllColors: Story = {
    render: () => ({
        components: { Loader },
        setup: () => ({ colors: ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink', 'gray'] }),
        template: `
            <div class="flex flex-col gap-4">
                <div v-for="color in colors" :key="color" class="flex items-center gap-3">
                    <Loader :color="color" />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ color }}</span>
                </div>
            </div>
        `
    })
}
