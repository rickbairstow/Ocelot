import Badge from '@Components/Badge.vue'

export default {
    title: 'Components/Badge',
    component: Badge,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content',
            table: {
                type: { summary: 'any' }
            }
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
        default: 'Badge content',
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
                <p>{{ args.default }}</p>
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
