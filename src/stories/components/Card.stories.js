import Card from '@Components/Card.vue'
import { faker } from '@faker-js/faker'

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
            description: 'Slot content'
        },
        imageAlt: {
            control: 'text',
            description: 'Image alt text'
        },
        imageSrc: {
            control: 'text',
            description: 'Image source'
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Sets the size of the card.'
        },
        title: {
            control: 'text',
            description: 'Title content'
        },
        vertical: {
            control: 'boolean',
            description: 'Set layout to vertical (true) or horizontal (false)'
        }
    },

    args: {
        badges: [
            { text: faker.lorem.word(), type: 'info' },
            { text: faker.lorem.word(), type: 'success' },
            { text: faker.lorem.word(), type: 'default' }
        ],
        default: faker.lorem.paragraph(2),
        imageAlt: faker.commerce.productName(),
        imageSrc: faker.image.url({ width: 400, height: 300 }), // controlled size
        size: 'base',
        title: faker.commerce.productName(),
        vertical: false
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
        vertical: true,
        imageSrc: faker.image.url({ width: 600, height: 240 })
    }
}
