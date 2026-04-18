import type { Meta, StoryObj } from '@storybook/vue3'
import { expect } from 'storybook/test'
import { IconBrandGithub } from '@tabler/icons-vue'
import { availableIcons, availableSizes } from '@Composables/useIcons'
import Icon from '@Components/Icon.vue'

const meta: Meta<typeof Icon> = {
    title: 'Components/Icon',
    component: Icon,

    argTypes: {
        icon: {
            control: 'select',
            options: [...Object.keys(availableIcons).sort()],
            description:
                'The icon to render. Pass a registry key string or any Vue component directly.'
        },
        size: {
            control: 'select',
            options: [...Object.keys(availableSizes)]
        }
    },

    args: {
        icon: 'ArrowDown',
        size: '2xl'
    },

    render: (args) => ({
        components: { Icon },

        setup() {
            return { args }
        },

        template: `
            <Icon
                :icon="args.icon"
                :size="args.size"
            />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const svg = canvasElement.querySelector('svg')
        await expect(svg).toBeInTheDocument()
    }
}

export const IconGrid: Story = {
    render: () => ({
        components: { Icon },

        setup() {
            const icons = Object.keys(availableIcons).sort()
            const sizes = ['sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const
            return { icons, sizes }
        },

        template: `
            <div class="space-y-8 p-4">
                <div
                    v-for="size in sizes"
                    :key="size"
                >
                    <p class="mb-3 text-sm font-medium text-gray-500">{{ size }}</p>
                    <div class="flex flex-wrap gap-4">
                        <div
                            v-for="name in icons"
                            :key="name"
                            class="flex flex-col items-center gap-1"
                            :title="name"
                        >
                            <Icon
                                :icon="name"
                                :size="size"
                            />
                            <span class="text-xs text-gray-600 dark:text-gray-400 max-w-16 truncate">{{ name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }),

    play: async ({ canvasElement }) => {
        const svgs = canvasElement.querySelectorAll('svg')
        await expect(svgs.length).toBeGreaterThan(0)
    }
}

export const CustomIcon: Story = {
    render: () => ({
        components: { Icon },

        setup() {
            return { IconBrandGithub }
        },

        template: `
            <div class="flex items-center gap-4">
                <Icon
                    :icon="IconBrandGithub"
                    size="xl"
                />
                <span class="text-sm text-gray-600">Passing a Tabler component directly — no registry lookup needed</span>
            </div>
        `
    }),

    play: async ({ canvasElement }) => {
        const svg = canvasElement.querySelector('svg')
        await expect(svg).toBeInTheDocument()
    }
}

export const NotInRegistry: Story = {
    args: {
        icon: 'NonExistentIcon' as never,
        size: '2xl'
    },

    play: async ({ canvasElement }) => {
        const svgs = canvasElement.querySelectorAll('svg')
        await expect(svgs).toHaveLength(0)
    }
}
