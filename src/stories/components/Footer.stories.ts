import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import Footer from '@Components/Footer.vue'

const meta = {
    title: 'Components/Footer', component: Footer,
    parameters: { docs: { description: { component: 'A page footer with brand, default content, navigation and bottom slots, plus optional copyright text. Default renders the empty footer shell with no required props. Use a labeled nav in the navigation slot and ordinary links or router links. Place Footer outside main for the page contentinfo landmark; the consumer owns navigation, dates, branding and theme.' } } }
} satisfies Meta<typeof Footer>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('contentinfo')).toBeVisible()
        await expect(within(canvasElement).queryByRole('navigation')).not.toBeInTheDocument()
    }
}

export const Copyright: Story = {
    args: { copyright: '© 2026 Acme. All rights reserved.' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('© 2026 Acme. All rights reserved.')).toBeVisible()
    }
}

export const WithNavigation: Story = {
    args: { copyright: '© 2026 Acme' },
    render: args => ({
        components: { Footer }, setup: () => ({ args }),
        template: '<Footer v-bind="args"><template #brand><a href="#home" class="text-xl font-semibold underline">Acme</a></template><p>Tools for thoughtful teams.</p><template #navigation><nav aria-label="Footer" class="flex flex-wrap gap-8"><div><h2 class="font-semibold">Product</h2><ul class="space-y-2"><li><a class="underline" href="#features">Features</a></li><li><a class="underline" href="#pricing">Pricing</a></li></ul></div><div><h2 class="font-semibold">Company</h2><ul class="space-y-2"><li><a class="underline" href="#about">About</a></li><li><a class="underline" href="#contact">Contact</a></li></ul></div></nav></template><template #bottom><a class="underline" href="#privacy">Privacy policy</a></template></Footer>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const navigation = within(canvas.getByRole('navigation', { name: 'Footer' }))
        await expect(navigation.getAllByRole('link')).toHaveLength(4)
        canvas.getByRole('link', { name: 'Acme' }).focus()
        await userEvent.tab()
        await expect(navigation.getByRole('link', { name: 'Features' })).toHaveFocus()
        await expect(canvas.getByRole('link', { name: 'Privacy policy' })).toBeVisible()
    }
}
