import Button from '@Components/Button.vue'

export default {
    title: 'Components/Button',
    component: Button,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content',
            table: {
                type: { summary: 'any' }
            }
        },
        disabled: {
            control: 'boolean',
            description:
                'Marks the button as disabled and prevents interaction.'
        },
        href: {
            control: 'text',
            description: 'Sets the link href for anchor rendering.'
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Sets the size of the button.'
        },
        type: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'text', 'none'],
            description: 'Sets the style of the button.'
        }
    },

    args: {
        default: 'My Button',
        disabled: false,
        size: 'base',
        type: 'primary',
        href: null
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
                @click="() => (console.log('Button clicked.'))"
            >
                {{ args.default }}
            </Button>
        `
    })
}

export const Primary = {
    args: {
        type: 'primary',
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

export const None = {
    args: {
        type: 'none'
    }
}

export const AsLink = {
    args: {
        type: 'primary',
        href: 'https://example.com',
        default: 'Link Button'
    }
}
