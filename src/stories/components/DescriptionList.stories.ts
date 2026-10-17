import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import DescriptionList from '@Components/DescriptionList.vue'
import Badge from '@Components/Badge.vue'
import { runInteractionTests } from '../interactionMode'

const meta: Meta<typeof DescriptionList> = {
    title: 'Components/DescriptionList',
    component: DescriptionList,
    parameters: { docs: { description: { component: 'Semantic term/value pairs using dl, dt and dd. Pass items with term and value, and optional unique id. Stacked by default; horizontal uses two columns from the small breakpoint and stacks on narrow screens. divided adds row separators. The term and value scoped slots receive { item, index } for rich content. Use a Table for tabular records rather than a DescriptionList.' } } },
    args: { items: [{ term: 'Name', value: 'Alex Morgan' }, { term: 'Email', value: 'alex@example.com' }, { term: 'Account', value: 'Personal' }], layout: 'stacked', divided: false },
    argTypes: { layout: { control: 'select', options: ['stacked', 'horizontal'] } },
    render: args => ({ components: { DescriptionList }, setup: () => ({ args }), template: '<DescriptionList v-bind="args" />' })
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('term')).toHaveLength(3)
        await expect(canvas.getAllByRole('definition')[0]).toHaveTextContent('Alex Morgan')
        await expect(canvas.getByText('Name').closest('dl')).toBeInTheDocument()
    }
}
export const Horizontal: Story = {
    args: { layout: 'horizontal' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByText('Name').parentElement).toHaveClass('sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]')
    }
}
export const Divided: Story = {
    args: { divided: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByText('Email').parentElement).toHaveClass('border-t')
    }
}
export const CustomContent: Story = {
    args: { items: [{ term: 'Status', value: 'Active' }, { term: 'Seats', value: 12 }] },
    render: args => ({
        components: { DescriptionList, Badge }, setup: () => ({ args }),
        template: '<DescriptionList v-bind="args"><template #value="{ item }"><Badge v-if="item.term === \'Status\'" color="green" size="sm">{{ item.value }}</Badge><span v-else>{{ item.value }}</span></template></DescriptionList>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByText('Active')).toBeVisible()
        await expect(within(canvasElement).getAllByRole('definition')[1]).toHaveTextContent('12')
    }
}
