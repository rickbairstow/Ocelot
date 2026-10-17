import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import CallToAction from '@Components/CallToAction.vue'
import Button from '@Components/Button.vue'

const meta = {
    title: 'Components/CallToAction', component: CallToAction,
    args: { heading: 'Ready to get started?' },
    parameters: { docs: { description: { component: 'A compact section for a clear next step. Supply a heading, optional description or rich default-slot content, and an actions slot containing consumer-owned buttons or links. Defaults to a centered layout with an h2; inline places actions beside copy when space allows. Set headingLevel to match surrounding headings. No click handling or navigation is imposed.' } } },
    argTypes: { headingLevel: { control: 'select', options: [1, 2, 3, 4, 5, 6] } }
} satisfies Meta<typeof CallToAction>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: { description: 'Create your first project in minutes.' },
    render: args => ({
        components: { CallToAction, Button }, setup: () => ({ args }),
        template: '<CallToAction v-bind="args"><template #actions><Button href="#start-project" @click.prevent>Start a project</Button><Button href="#contact-sales" variant="secondary" @click.prevent>Contact sales</Button></template></CallToAction>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const location = canvasElement.ownerDocument.location
        const originalUrl = location.href
        await expect(canvas.getByRole('region', { name: 'Ready to get started?' })).toBeVisible()
        await expect(canvas.getByRole('heading', { level: 2 })).toBeVisible()
        canvas.getByRole('link', { name: 'Start a project' }).focus()
        await userEvent.tab()
        await expect(canvas.getByRole('link', { name: 'Contact sales' })).toHaveFocus()
        await expect(canvas.getByText('Create your first project in minutes.')).toBeVisible()
        await userEvent.keyboard('{Enter}')
        await userEvent.click(canvas.getByRole('link', { name: 'Start a project' }))
        await expect(location.href).toBe(originalUrl)
    }
}

export const Inline: Story = {
    args: { inline: true, headingLevel: 3 },
    render: args => ({
        components: { CallToAction, Button }, setup: () => ({ args }),
        template: '<CallToAction v-bind="args"><p>Find a plan that <strong>fits your team.</strong></p><template #actions><Button href="#plans" @click.prevent>Compare plans</Button></template></CallToAction>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).getByRole('heading', { level: 3 })).toBeVisible()
        await expect(within(canvasElement).getByRole('link', { name: 'Compare plans' })).toHaveAttribute('href', '#plans')
        const location = canvasElement.ownerDocument.location
        const originalUrl = location.href
        await userEvent.click(within(canvasElement).getByRole('link', { name: 'Compare plans' }))
        await expect(location.href).toBe(originalUrl)
    }
}
