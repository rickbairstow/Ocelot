import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import Hero from '@Components/Hero.vue'
import Button from '@Components/Button.vue'

const meta = {
    title: 'Components/Hero',
    component: Hero,
    args: { heading: 'Make room for your next idea' },
    parameters: { docs: { description: { component: 'A page introduction with a required heading. Defaults to an h1; set headingLevel to match the document hierarchy. Add description or rich default-slot copy, an eyebrow, actions, and optional media. Text-only content can be centered; media stacks on small screens and sits alongside copy on wider screens. The actions slot accepts your Buttons or links; Hero does not navigate, fetch media, or set page metadata.' } } },
    argTypes: { headingLevel: { control: 'select', options: [1, 2, 3, 4, 5, 6] } }
} satisfies Meta<typeof Hero>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const heading = canvas.getByRole('heading', { level: 1 })
        await expect(canvas.getByRole('region', { name: heading.textContent! })).toBeVisible()
        await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
    }
}

export const WithActions: Story = {
    args: { eyebrow: 'Made for your ideas', description: 'A simple place to start building.', centered: true },
    render: args => ({
        components: { Hero, Button }, setup: () => ({ args }),
        template: '<Hero v-bind="args"><template #actions><Button href="#hero-details">Explore features</Button><Button href="#hero-pricing" variant="secondary">View pricing</Button></template></Hero><p id="hero-details">Features for your next project.</p><p id="hero-pricing">Plans for every team.</p>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const link = canvas.getByRole('link', { name: 'Explore features' })
        link.focus()
        await userEvent.tab()
        await expect(canvas.getByRole('link', { name: 'View pricing' })).toHaveFocus()
        await expect(canvas.getByText('Made for your ideas')).toBeVisible()
    }
}

export const WithMedia: Story = {
    args: { headingLevel: 2 },
    render: args => ({
        components: { Hero }, setup: () => ({ args }),
        template: '<Hero v-bind="args"><p>Build something <strong>worth sharing.</strong></p><template #media><img alt="Layered mountain illustration" class="w-full rounded-xl" src="/media/gallery-mountains.svg" /></template></Hero>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('heading', { level: 2 })).toBeVisible()
        await expect(canvas.getByRole('img', { name: 'Layered mountain illustration' })).toBeVisible()
        await expect(canvas.getByText('worth sharing.')).toBeVisible()
    }
}
