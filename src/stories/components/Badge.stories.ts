import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from '@Components/Badge.vue'
import { faker } from '@faker-js/faker'

const colors = ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink']
const types = ['primary', 'secondary'] as const

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,

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

        size: {
            control: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Sets the size of the badge.'
        },

        variant: {
            control: 'select',
            options: ['primary', 'secondary'],
            description: 'Sets the visual style of the badge.'
        }
    },

    args: {
        color: 'blue',
        default: faker.lorem.word(),
        size: 'lg',
        variant: 'primary'
    },

    render: (args) => ({
        components: { Badge },
        setup() {
            return { args }
        },
        template: `
            <Badge
                :color="args.color"
                :size="args.size"
                :variant="args.variant"
            >
                {{ args.default }}
            </Badge>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Primary: Story = {
    args: { variant: 'primary' }
}

export const Secondary: Story = {
    args: { variant: 'secondary' }
}

export const AllColors: Story = {
    render: () => ({
        components: { Badge },
        setup: () => ({ colors }),
        template: `
            <div class="flex flex-wrap gap-2">
                <Badge v-for="color in colors" :key="color" :color="color">
                    {{ color }}
                </Badge>
            </div>
        `
    })
}

export const AllVariations: Story = {
    render: () => ({
        components: { Badge },
        setup: () => ({ colors, types, sizes: ['sm', 'md', 'lg'] }),
        template: `
            <div class="flex flex-col gap-6">
                <div v-for="color in colors" :key="color" class="flex flex-col gap-2">
                    <p class="text-sm font-medium capitalize text-gray-500">{{ color }}</p>
                    <div v-for="type in types" :key="type" class="flex flex-wrap items-end gap-2">
                        <Badge v-for="size in sizes" :key="size" :color="color" :variant="type" :size="size">
                            {{ type }}
                        </Badge>
                    </div>
                </div>
            </div>
        `
    })
}
