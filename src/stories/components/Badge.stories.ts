import type { Meta, StoryObj } from '@storybook/vue3'
import Badge from '@Components/Badge.vue'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content'
        },

        size: {
            type: 'select',
            options: ['sm', 'md', 'lg'],
            description: 'Sets the size of the badge.'
        },

        type: {
            control: 'select',
            options: ['default', 'info', 'success', 'warning', 'error'],
            description: 'Sets the style of the badge.'
        }
    },
    args: {
        default: faker.lorem.word(),
        size: 'lg',
        type: 'default'
    },

    render: (args) => ({
        components: { Badge },

        setup() {
            return { args }
        },

        template: `
            <Badge
                :size="args.size"
                :type="args.type"
            >
                {{ args.default }}
            </Badge>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        type: 'default'
    }
}
export const Error: Story = {
    args: {
        type: 'error'
    }
}
export const Info: Story = {
    args: {
        type: 'info'
    }
}
export const Success: Story = {
    args: {
        type: 'success'
    }
}
export const Warning: Story = {
    args: {
        type: 'warning'
    }
}
