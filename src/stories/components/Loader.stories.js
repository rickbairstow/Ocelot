import Loader from '@Components/Loader.vue'
import { faker } from '@faker-js/faker'

export default {
    title: 'Components/Loader',
    component: Loader,

    argTypes: {
        animation: {
            control: 'select',
            options: ['bounce', 'none', 'ping', 'pulse', 'spin'],
            description:
                'The animation to display the loader as, this changes the animation speed.'
        },
        icon: {
            control: 'select',
            options: ['Loader', 'Loader2', 'Loader3'],
            description: 'Change the displayed icon.'
        },
        text: {
            control: 'text',
            description: 'Optional text to display with the loader.'
        },
        variant: {
            control: 'select',
            options: ['absolute', 'fixed', 'inline'],
            description:
                'The variant to display the loader as, this changes positioning and sizing.'
        },
        vertical: {
            control: 'boolean',
            description: 'Set the loader to be vertical.'
        }
    },

    args: {
        animation: 'spin',
        icon: 'Loader2',
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
                :icon="args.icon"
                :text="args.text"
                :variant="args.variant"
                :vertical="args.vertical"
            />
        `
    })
}

export const Default = {}

export const Absolute = {
    args: {
        variant: 'absolute'
    }
}

export const Fixed = {
    args: {
        variant: 'fixed'
    }
}

export const Inline = {
    args: {
        variant: 'inline'
    }
}

export const WithAlternateIcon = {
    args: {
        icon: 'Photo'
    }
}
