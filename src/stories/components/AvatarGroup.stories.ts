import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import AvatarGroup from '@Components/AvatarGroup.vue'

const avatars = [
    { initials: 'JD', ariaLabel: 'Jane Doe' },
    { initials: 'AK', ariaLabel: 'Alex Kim' },
    { initials: 'MR', ariaLabel: 'Morgan Reed' }
]

const meta = {
    title: 'Components/AvatarGroup',
    component: AvatarGroup,
    args: { avatars },
    parameters: { docs: { description: { component: 'A stacked collection of avatars. Supply an avatars array; each item accepts src, alt, initials, ariaLabel, color and shape. Use full names through ariaLabel for initials and icon fallbacks. By default, up to five avatars are shown. The overflow badge displays a count with equivalent screen-reader text. It is informational, not a button to reveal hidden members. Size applies to the visible avatars and overflow badge.' } } }
} satisfies Meta<typeof AvatarGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('img')).toHaveLength(3)
        for (const avatar of avatars) {
            await expect(canvas.getByRole('img', { name: avatar.ariaLabel })).toBeVisible()
        }
        await expect(canvas.queryByText(/more$/)).not.toBeInTheDocument()
    }
}

export const Overflow: Story = {
    args: { max: 2 },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('img')).toHaveLength(2)
        await expect(canvas.queryByRole('img', { name: 'Morgan Reed' })).not.toBeInTheDocument()
        await expect(canvas.getByText('1 more')).toBeInTheDocument()
        await expect(canvas.getByText('+1')).toHaveAttribute('aria-hidden', 'true')
        await expect(canvasElement.querySelector('span[aria-label]:not([role])')).toBeNull()
    }
}

export const Large: Story = {
    args: { size: 'lg', max: 2 },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).getByRole('img', { name: 'Jane Doe' })).toHaveClass('size-12')
        await expect(within(canvasElement).getByText('1 more').parentElement).toHaveClass('size-12')
    }
}

export const Empty: Story = {
    args: { avatars: [] },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        await expect(within(canvasElement).queryByRole('img')).not.toBeInTheDocument()
        await expect(within(canvasElement).queryByText(/more$/)).not.toBeInTheDocument()
    }
}
