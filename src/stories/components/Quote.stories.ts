import type { Meta, StoryObj } from '@storybook/vue3'
import Quote from '@Components/Quote.vue'
import { expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

faker.seed(42)

const quote = faker.lorem.sentences(2)
const author = faker.person.fullName()
const source = faker.person.jobTitle() + ', ' + faker.company.name()
const avatar = 'https://i.pravatar.cc/80?img=12'

const meta: Meta<typeof Quote> = {
    title: 'Components/Quote',
    component: Quote,

    parameters: {
        docs: {
            description: {
                component: 'A styled blockquote for pull quotes, testimonials, and editorial content. Supports bordered, card, and plain variants with optional author, source, and avatar attribution.'
            }
        }
    },

    argTypes: {
        author: { control: 'text', description: 'Attribution name.' },
        avatar: { control: 'text', description: 'Avatar image URL.' },
        icon: { control: 'text', description: 'Icon shown above the quote. Accepts any registry key or Vue component.' },
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
        author,
        avatar: undefined,
        color: 'blue',
        source,
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
    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByText(author)).toBeVisible()
        await expect(canvasElement.querySelector('blockquote')).not.toBeNull()
    }
}

export const Card: Story = {
    args: { color: 'purple', variant: 'card' },

    async play({ canvasElement }) {
        await expect(canvasElement.querySelector('blockquote')).not.toBeNull()
    }
}

export const WithAvatar: Story = {
    args: { avatar, variant: 'card', color: 'indigo' },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const img = canvasElement.querySelector('img')
        await expect(img).not.toBeNull()
        await expect(canvas.getByText(author)).toBeVisible()
    }
}

export const NoAttribution: Story = {
    args: { author: undefined, source: undefined },

    async play({ canvasElement }) {
        const figcaption = canvasElement.querySelector('figcaption')
        await expect(figcaption).toBeNull()
    }
}
