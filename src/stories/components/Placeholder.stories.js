import Placeholder from '@Components/Placeholder.vue'

export default {
    title: 'Components/Placeholder',
    component: Placeholder,

    argTypes: {
        variant: {
            control: 'select',
            options: [
                'badge',
                'button',
                'card',
                'heading',
                'image',
                'input',
                'paragraph',
                'text'
            ],
            description: 'Placeholder slot content'
        }
    },

    args: {
        default: 'Placeholder content'
    },

    render: (args) => ({
        components: { Placeholder },

        setup() {
            return { args }
        },

        template: `
            <Placeholder :variant="args.variant" />
        `
    })
}

export const Default = {}
