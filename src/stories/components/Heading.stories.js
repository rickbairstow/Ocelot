import Heading from '@Components/Heading.vue'

export default {
    title: 'Components/Heading',
    component: Heading,

    argTypes: {
        default: {
            control: 'text',
            description: 'Heading slot content'
        },

        level: {
            control: 'select',
            description: 'Sets the element used for the heading, ie h1.',
            options: ['1', '2', '3', '4', '5', '6']
        },

        styleLevel: {
            control: 'select',
            description:
                'Overrides the style to a given level, for cases where a specific style is needed with varying heading level elements.',
            options: ['1', '2', '3', '4', '5', '6']
        }
    },

    args: {
        default: 'Heading title',
        level: '1'
    },

    render: (args) => ({
        components: { Heading },

        setup() {
            return { args }
        },

        template: `
            <Heading
                :level="args.level"
                :style-level="args.styleLevel"
            >
                {{ args.default }}
            </Heading>
        `
    })
}

export const Heading1 = {
    args: {
        level: '1'
    }
}
export const Heading2 = {
    args: {
        level: '2'
    }
}
export const Heading3 = {
    args: {
        level: '3'
    }
}
export const Heading4 = {
    args: {
        level: '4'
    }
}
export const Heading5 = {
    args: {
        level: '5'
    }
}
export const Heading6 = {
    args: {
        level: '6'
    }
}
