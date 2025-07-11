import Badge from '@Components/Badge.vue'
import { faker } from '@faker-js/faker'

export default {
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

export const Default = {
    args: {
        type: 'default'
    }
}
export const Error = {
    args: {
        type: 'error'
    }
}
export const Info = {
    args: {
        type: 'info'
    }
}
export const Success = {
    args: {
        type: 'success'
    }
}
export const Warning = {
    args: {
        type: 'warning'
    }
}
