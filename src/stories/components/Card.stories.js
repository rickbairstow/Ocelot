import Card from '@Components/Card.vue'

export default {
    title: 'Components/Card',
    component: Card,

    argTypes: {
        badges: {
            control: 'object',
            description: 'Array of badge objects (text and type)',
            table: {
                type: { summary: 'Array<{ text: string, type: string }>' }
            }
        },
        default: {
            control: 'text',
            description: 'Slot content',
        },
        imageAlt: {
            control: 'text',
            description: 'Image alt text',
        },
        imageSrc: {
            control: 'text',
            description: 'Image source',
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Sets the size of the card.',
        },
        title: {
            control: 'text',
            description: 'Title content',
        },
        vertical: {
            control: 'boolean',
            description: 'Set layout to vertical (true) or horizontal (false)',
        }
    },

    args: {
        badges: [
            { text: '#foo', type: 'info' },
            { text: '#bar', type: 'success' },
            { text: '#baz', type: 'default' }
        ],
        default: 'Card content goes here.',
        imageAlt: 'Card image',
        imageSrc: 'https://picsum.photos/id/1000/500/300',
        size: 'base',
        title: 'Card Title',
        vertical: false,
    },

    render: (args) => ({
        components: { Card },
        setup() {
            return { args }
        },
        template: `
            <Card
                :badges="args.badges"
                :imageAlt="args.imageAlt"
                :imageSrc="args.imageSrc"
                :size="args.size"
                :title="args.title"
                :vertical="args.vertical"
            >
                <template #default>
                    {{ args.default }}
                </template>
            </Card>
        `
    })
}

export const Horizontal = {
    args: {
        vertical: false
    }
}
export const Vertical = {
    args: {
        vertical: true
    }
}
