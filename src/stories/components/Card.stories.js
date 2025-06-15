import Card from '@Components/Card.vue'

export default {
    title: 'Components/Card',
    component: Card,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content',
            table: {
                type: { summary: 'any' }
            }
        },

        imageAlt: {
            control: 'text',
            description: 'Image alt text',
            table: {
                type: { summary: 'string' }
            }
        },

        imageSrc: {
            control: 'text',
            description: 'Image source',
            table: {
                type: { summary: 'string' }
            }
        },

        subtitle: {
            control: 'text',
            description: 'Subtitle slot content',
            table: {
                type: { summary: 'string' }
            }
        },

        title: {
            control: 'text',
            description: 'Title slot content',
            table: {
                type: { summary: 'string' }
            }
        }
    },

    args: {
        default: 'Card content',
        imageAlt: 'Card image',
        imageSrc: 'https://picsum.photos/id/1000/500/300',
        subtitle: 'Card subtitle',
        title: 'Card title',
        badges: [
            {
                text: '#foo',
                type: 'info',
            },
            {
                text: '#bar',
                type: 'success',
            },
            {
                text: '#baz',
                type: 'default',
            },
        ]
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
                :subtitle="args.subtitle"
                :title="args.title"
            >
                {{ args.default }}
            </Card>
        `
    })
}

export const Default = {}
