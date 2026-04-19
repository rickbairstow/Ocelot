import type { Meta, StoryObj } from '@storybook/vue3'
import StatCard from '@Components/StatCard.vue'
import { expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof StatCard> = {
    title: 'Components/StatCard',
    component: StatCard,

    parameters: {
        docs: {
            description: {
                component: 'A metric display card for dashboards. Shows a value and label with an optional icon, trend indicator (positive/negative percentage), and supporting description text.'
            }
        }
    },

    argTypes: {
        color: {
            control: 'select',
            options: ['blue', 'green', 'indigo', 'orange', 'pink', 'purple', 'red', 'teal'],
            description: 'Colour theme for the icon background.'
        },
        description: { control: 'text', description: 'Supporting text shown below the value.' },
        icon: { control: 'text', description: 'Icon name or Vue component.' },
        label: { control: 'text', description: 'Metric label.' },
        trend: { control: 'number', description: 'Trend percentage. Positive = green, negative = red.' },
        value: { control: 'text', description: 'Metric value.' }
    },

    args: {
        color: 'blue',
        description: faker.lorem.words(4),
        icon: 'User',
        label: 'Total Users',
        trend: 12,
        value: '24,521'
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await expect(canvas.getByText('Total Users')).toBeVisible()
        await expect(canvas.getByText('24,521')).toBeVisible()
    }
}

export const PositiveTrend: Story = {
    args: {
        description: 'vs last month',
        icon: 'CurrencyDollar',
        label: 'Orders',
        trend: 8,
        value: '1,284'
    },

    async play({ canvasElement }) {
        const trend = canvasElement.querySelector('[aria-label="Trend"]')
        await expect(trend).not.toBeNull()
        await expect(trend!.textContent).toContain('8%')
    }
}

export const NegativeTrend: Story = {
    args: {
        color: 'red',
        description: 'vs last month',
        icon: 'ChartBar',
        label: 'Churn Rate',
        trend: -3,
        value: '2.4%'
    },

    async play({ canvasElement }) {
        const trend = canvasElement.querySelector('[aria-label="Trend"]')
        await expect(trend).not.toBeNull()
        await expect(trend!.textContent).toContain('3%')
    }
}

export const NoIcon: Story = {
    args: {
        description: 'across all regions',
        icon: undefined,
        label: 'Revenue',
        trend: 5,
        value: '$92,400'
    },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('$92,400')).toBeVisible()
    }
}

export const NoTrend: Story = {
    args: {
        description: undefined,
        icon: 'ChartBar',
        label: 'Uptime',
        trend: undefined,
        value: '99.9%'
    },

    async play({ canvasElement }) {
        const trend = canvasElement.querySelector('[aria-label="Trend"]')
        await expect(trend).toBeNull()
    }
}

export const Grid: Story = {
    render: () => ({
        components: { StatCard },
        setup() {
            const cards = [
                { color: 'blue',   icon: 'User',          label: faker.lorem.words(2), value: faker.number.int({ min: 1000, max: 99999 }).toLocaleString(), trend: 12,  description: 'vs last month' },
                { color: 'green',  icon: 'CurrencyDollar', label: faker.lorem.words(2), value: `$${faker.number.int({ min: 10000, max: 999999 }).toLocaleString()}`, trend: 4, description: 'vs last month' },
                { color: 'purple', icon: 'ChartBar',     label: faker.lorem.words(2), value: faker.number.int({ min: 100, max: 9999 }).toLocaleString(), trend: -2, description: 'vs last month' },
                { color: 'orange', icon: 'Clock',        label: faker.lorem.words(2), value: '99.9%', trend: undefined, description: 'all time' }
            ] as const
            return { cards }
        },
        template: `
            <div class="grid grid-cols-2 gap-4 p-4">
                <StatCard
                    v-for="(card, i) in cards"
                    :key="i"
                    v-bind="card"
                />
            </div>
        `
    }),

    async play({ canvasElement }) {
        const cards = canvasElement.querySelectorAll('.rounded-xl')
        await expect(cards.length).toBe(4)
    }
}
