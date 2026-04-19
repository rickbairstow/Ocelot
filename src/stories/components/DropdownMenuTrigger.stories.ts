import type { Meta, StoryObj } from '@storybook/vue3'
import DropdownMenu from '@Components/DropdownMenu.vue'
import DropdownMenuTrigger from '@Components/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@Components/DropdownMenuContent.vue'
import DropdownMenuItem from '@Components/DropdownMenuItem.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within, waitFor } from 'storybook/test'

const meta: Meta<typeof DropdownMenuTrigger> = {
    title: 'Components/DropdownMenu/DropdownMenuTrigger',
    component: DropdownMenuTrigger,

    parameters: {
        docs: {
            description: {
                component: 'Wraps the element that opens the dropdown. Forwards `aria-haspopup`, `aria-expanded`, and `aria-controls` to its focusable child. Handles click and ArrowDown/ArrowUp keyboard events to open the menu.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button },
        template: `
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="secondary">Open menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem label="Item one" />
                    <DropdownMenuItem label="Item two" />
                </DropdownMenuContent>
            </DropdownMenu>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: 'Open menu' })

        // ARIA attributes set on the child button
        await expect(trigger).toHaveAttribute('aria-haspopup', 'menu')
        await expect(trigger).toHaveAttribute('aria-expanded', 'false')
        await expect(trigger).not.toHaveAttribute('aria-controls')

        // Click opens menu and updates ARIA
        await userEvent.click(trigger)
        await canvas.findByRole('menu')
        await expect(trigger).toHaveAttribute('aria-expanded', 'true')
        await expect(trigger).toHaveAttribute('aria-controls')

        // ArrowDown on trigger opens menu from keyboard
        await userEvent.keyboard('{Escape}')
        await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument())
        trigger.focus()
        await userEvent.keyboard('{ArrowDown}')
        await canvas.findByRole('menu')
        await expect(trigger).toHaveAttribute('aria-expanded', 'true')
        await userEvent.keyboard('{Escape}')
    }
}
