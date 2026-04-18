import type { Meta, StoryObj } from '@storybook/vue3'
import Breadcrumb from '@Components/Breadcrumb.vue'
import type { BreadcrumbItem } from '@Components/Breadcrumb.vue'
import { expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const makeItems = (count = 3): BreadcrumbItem[] =>
    Array.from({ length: count }, (_, i) => ({
        label: faker.lorem.words(2),
        href: i < count - 1 ? `#${i}` : undefined
    }))

const meta: Meta<typeof Breadcrumb> = {
    title: 'Components/Breadcrumb',
    component: Breadcrumb,

    argTypes: {
        separator: {
            control: 'select',
            options: ['chevron', 'slash'],
            description: 'Visual separator between items.'
        }
    },

    args: {
        items: makeItems(),
        separator: 'chevron'
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement, args }) {
        const canvas = within(canvasElement)
        const nav = canvas.getByRole('navigation', { name: 'Breadcrumb' })
        await expect(nav).toBeVisible()

        const links = canvas.getAllByRole('link')
        await expect(links).toHaveLength(args.items.length - 1)

        const items = args.items as BreadcrumbItem[]
        const lastLabel = items[items.length - 1].label
        const current = canvasElement.querySelector('[aria-current="page"]')
        await expect(current).not.toBeNull()
        await expect(current!.textContent!.trim()).toBe(lastLabel)
    }
}

export const SlashSeparator: Story = {
    args: { separator: 'slash' },

    async play({ canvasElement, args }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('navigation')).toBeVisible()

        const items = args.items as BreadcrumbItem[]
        const current = canvasElement.querySelector('[aria-current="page"]')
        await expect(current!.textContent!.trim()).toBe(items[items.length - 1].label)
    }
}

export const WithIcons: Story = {
    args: {
        items: [
            { label: 'Home', href: '#', icon: 'Home' },
            { label: faker.lorem.words(2), href: '#1' },
            { label: faker.lorem.words(2) }
        ]
    },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('navigation')).toBeVisible()

        const links = canvas.getAllByRole('link')
        await expect(links).toHaveLength(2)

        const firstLink = links[0]
        const icon = firstLink.querySelector('[aria-hidden="true"]')
        await expect(icon).not.toBeNull()
    }
}

export const LongPath: Story = {
    args: { items: makeItems(5) },

    async play({ canvasElement, args }) {
        const canvas = within(canvasElement)
        const links = canvas.getAllByRole('link')
        await expect(links).toHaveLength((args.items as BreadcrumbItem[]).length - 1)
    }
}

export const SingleItem: Story = {
    args: {
        items: [{ label: faker.lorem.words(2) }]
    },

    async play({ canvasElement }) {
        const current = canvasElement.querySelector('[aria-current="page"]')
        await expect(current).not.toBeNull()

        const links = within(canvasElement).queryAllByRole('link')
        await expect(links).toHaveLength(0)
    }
}
