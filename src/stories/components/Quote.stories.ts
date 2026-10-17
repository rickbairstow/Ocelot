import { runInteractionTests } from '../interactionMode'
import { iconControl } from '../iconControl'
import type { Meta, StoryObj } from '@storybook/vue3'
import Quote from '@Components/Quote.vue'
import { expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

faker.seed(42)

const quote = faker.lorem.sentences(2)
const author = faker.person.fullName()
const source = faker.person.jobTitle() + ', ' + faker.company.name()
const avatar = '/media/avatar-person.svg'

const meta: Meta<typeof Quote> = {
    title: 'Components/Quote',
    component: Quote,

    parameters: {
        docs: {
            description: {
                component: 'A styled blockquote for pull quotes, testimonials, and editorial content. Supports bordered, card, and plain variants with optional author, source, and avatar attribution.\n\nDefault contains only the quotation text using the component styling. With Attribution adds the author and source. With Avatar adds a profile image; Card changes the container style.'
            }
        }
    },

    argTypes: {
        author: { control: 'text', description: 'Attribution name.' },
        avatar: { control: 'text', description: 'Avatar image URL.' },
        icon: iconControl,
        color: {
            control: 'select',
            options: ['blue', 'green', 'indigo', 'orange', 'pink', 'purple', 'red', 'teal'],
            description: 'Accent colour.'
        },
        source: { control: 'text', description: 'Role, title, or publication shown beneath the author.' },
        variant: {
            control: 'select',
            options: ['bordered', 'card'],
            description: 'Visual style.'
        }
    },

    args: {
        author: undefined,
        avatar: undefined,
        color: 'blue',
        icon: 'QuoteFilled',
        source: undefined,
        variant: 'bordered'
    },

    render: (args) => ({
        components: { Quote },
        setup() { return { args, quote } },
        template: `
            <div class="max-w-xl p-8">
                <Quote v-bind="args">{{ quote }}</Quote>
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(canvasElement.querySelector('blockquote')).toBeVisible()
        await expect(canvasElement.querySelector('figcaption')).not.toBeInTheDocument()
    }
}

export const Card: Story = {
    args: { color: 'purple', variant: 'card' },

    async play({ canvasElement }) {
        if (!runInteractionTests) return

        await expect(canvasElement.querySelector('blockquote')).not.toBeNull()
    }
}

export const WithAvatar: Story = {
    args: { author, source, avatar, variant: 'card', color: 'indigo' },

    async play({ canvasElement }) {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const img = canvasElement.querySelector('img')
        await expect(img).not.toBeNull()
        await expect(canvas.getByText(author)).toBeVisible()
    }
}

export const WithAttribution: Story = {
    args: { author, source },

    async play({ canvasElement }) {
        if (!runInteractionTests) return

        const figcaption = canvasElement.querySelector('figcaption')
        await expect(figcaption).toBeVisible()
    }
}
