import type { Meta, StoryObj } from '@storybook/vue3'
import EmptyState from '@Components/EmptyState.vue'
import Button from '@Components/Button.vue'
import { expect, userEvent, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof EmptyState> = {
    title: 'Components/EmptyState',
    component: EmptyState,

    parameters: {
        docs: {
            description: {
                component: 'A placeholder for screens or sections with no content. Supports an optional icon, title, description, and a flexible action slot for CTAs.'
            }
        }
    },

    argTypes: {
        description: { control: 'text', description: 'Supporting description text.' },
        icon: { control: 'text', description: 'Icon name or Vue component.' },
        title: { control: 'text', description: 'Primary empty state message.' }
    },

    args: {
        description: faker.lorem.sentence(10),
        icon: 'FolderOpen',
        title: 'No results found'
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('No results found')).toBeVisible()
    }
}

export const WithCTA: Story = {
    render: (args) => ({
        components: { EmptyState, Button },
        setup() {
            return { args }
        },
        template: `
            <EmptyState v-bind="args">
                <template #action>
                    <Button>Create your first item</Button>
                </template>
            </EmptyState>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('No results found')).toBeVisible()
        const cta = canvas.getByRole('button', { name: 'Create your first item' })
        await expect(cta).toBeVisible()
        await userEvent.click(cta)
    }
}

export const WithMultipleCTAs: Story = {
    render: (args) => ({
        components: { EmptyState, Button },
        setup() {
            return { args }
        },
        template: `
            <EmptyState v-bind="args">
                <template #action>
                    <div class="flex gap-3">
                        <Button>Get started</Button>
                        <Button variant="secondary">Learn more</Button>
                    </div>
                </template>
            </EmptyState>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('button', { name: 'Get started' })).toBeVisible()
        await expect(canvas.getByRole('button', { name: 'Learn more' })).toBeVisible()
    }
}

export const NoIcon: Story = {
    args: {
        icon: undefined,
        title: 'Nothing here yet',
        description: faker.lorem.sentence(8)
    },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Nothing here yet')).toBeVisible()
        const icon = canvasElement.querySelector('[aria-hidden="true"]')
        await expect(icon).toBeNull()
    }
}

export const NoDescription: Story = {
    args: {
        description: undefined,
        icon: 'Search',
        title: 'No results for your search'
    },

    render: (args) => ({
        components: { EmptyState, Button },
        setup() {
            return { args }
        },
        template: `
            <EmptyState v-bind="args">
                <template #action>
                    <Button variant="secondary">Clear filters</Button>
                </template>
            </EmptyState>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('No results for your search')).toBeVisible()
        await expect(canvas.getByRole('button', { name: 'Clear filters' })).toBeVisible()
    }
}

export const WithHeadingTag: Story = {
    args: {
        title: 'Section empty',
        titleTag: 'h2'
    },
    play: async ({ canvasElement }) => {
        const heading = canvasElement.querySelector('h2')
        await expect(heading).not.toBeNull()
        await expect(heading).toHaveTextContent('Section empty')
    }
}
