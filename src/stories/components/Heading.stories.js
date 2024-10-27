import Heading from '@Components/Heading.vue'

export default {
    title: 'Components/Heading',
    component: Heading,

    argTypes: {
        default: {
            control: 'text',
            description: 'Heading slot content',
            table: {
                type: { summary: 'any' }
            }
        },

        level: {
            control: 'select',
            description: 'Sets the element used for the heading, ie h1.',
            options: ['1', '2', '3', '4', '5', '6']
        },

        styleLevel: {
            control: 'select',
            description:
                'Sets the style used for the heading, for cases where a specific level is needed but with different heading style.',
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
                :style-level="args.level"
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
