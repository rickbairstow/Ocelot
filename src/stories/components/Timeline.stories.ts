import type { Meta, StoryObj } from '@storybook/vue3'
import Timeline from '@Components/Timeline.vue'
import type { TimelineItem } from '@Components/Timeline.vue'
import { expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const makeItems = (count = 4): TimelineItem[] => {
    const items: TimelineItem[] = [
        { color: 'green', icon: 'Check', title: faker.lorem.words(3), description: faker.lorem.sentence(8), time: '2 min ago' },
        { color: 'blue', icon: 'Bell', title: faker.lorem.words(3), description: faker.lorem.sentence(6), time: '1 hr ago' },
        { color: 'purple', icon: 'User', title: faker.lorem.words(3), description: faker.lorem.sentence(7), time: 'Yesterday' },
        { color: 'orange', icon: 'AlertCircle', title: faker.lorem.words(3), description: faker.lorem.sentence(5), time: '3 days ago' }
    ]
    return items.slice(0, count)
}

const meta: Meta<typeof Timeline> = {
    title: 'Components/Timeline',
    component: Timeline,

    parameters: {
        docs: {
            description: {
                component: 'A vertical timeline for activity feeds, changelogs, and event histories. Each item supports a title, optional description, timestamp, icon, and colour.'
            }
        }
    },

    argTypes: {
        items: { control: 'object', description: 'Array of timeline items.' }
    },

    args: {
        items: makeItems()
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement, args }) {
        const canvas = within(canvasElement)
        const items = args.items as TimelineItem[]
        const timeline = canvas.getByRole('list', { name: /timeline/i })

        await expect(canvas.getByText(items[0].title)).toBeVisible()
        await expect(timeline).toBeVisible()
        await expect(canvasElement.querySelectorAll('li').length).toBe(items.length)
    }
}

export const WithoutIcons: Story = {
    args: {
        items: Array.from({ length: 4 }, () => ({
            color: 'gray' as const,
            description: faker.lorem.sentence(6),
            time: faker.date.recent().toLocaleDateString(),
            title: faker.lorem.words(3)
        }))
    },

    async play({ canvasElement }) {
        const icons = canvasElement.querySelectorAll('[aria-hidden="true"]')
        await expect(icons.length).toBe(0)
    }
}

export const WithoutTimestamps: Story = {
    args: {
        items: makeItems().map(({ time: _time, ...item }) => item)
    },

    async play({ canvasElement }) {
        const times = canvasElement.querySelectorAll('time')
        await expect(times.length).toBe(0)
    }
}

export const Minimal: Story = {
    args: {
        items: Array.from({ length: 3 }, () => ({
            title: faker.lorem.words(4)
        }))
    },

    async play({ canvasElement }) {
        await expect(canvasElement.querySelectorAll('li').length).toBe(3)
    }
}
