import Button from '@/components/Button.vue'

export default {
    title: 'Components/Button',
    component: Button,

    argTypes: {
        size: {
            control: 'select',
            options: ['small', 'base', 'large']
        },
        type: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'text']
        }
    },
    args: {
        default: 'My Button',
        disabled: false,
        size: 'base',
        type: 'primary'
    },

    render: (args) => ({
        components: { Button },

        setup() {
            return { args }
        },

        template: `
            <Button
                :disabled="args.disabled"
                :href="args.href"
                :size="args.size"
                :type="args.type"
            >
                {{ args.default }}
            </Button>
        `
    })
}

// Default Template
export const Primary = {
    args: {
        type: 'primary'
    }
}
export const Secondary = {
    args: {
        type: 'secondary'
    }
}
export const Tertiary = {
    args: {
        type: 'tertiary'
    }
}
export const Text = {
    args: {
        type: 'text'
    }
}
