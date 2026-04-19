import type { Meta, StoryObj } from '@storybook/vue3'
import DropdownMenu from '@Components/DropdownMenu.vue'
import DropdownMenuTrigger from '@Components/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@Components/DropdownMenuContent.vue'
import DropdownMenuItem from '@Components/DropdownMenuItem.vue'
import DropdownMenuSeparator from '@Components/DropdownMenuSeparator.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within, waitFor } from 'storybook/test'

const meta: Meta<typeof DropdownMenuContent> = {
    title: 'Components/DropdownMenu/DropdownMenuContent',
    component: DropdownMenuContent,

    parameters: {
        docs: {
            description: {
                component: 'The floating panel that contains menu items. Positions itself relative to the trigger using Floating UI (`bottom-start` with flip/shift). Handles full keyboard navigation: ArrowDown/Up (wrapping), Home/End, Escape, Tab, and typeahead A–Z. Closes on outside click.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, Button },
        template: `
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="secondary">Actions</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem label="Copy" />
                    <DropdownMenuItem label="Paste" />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem label="Delete" destructive />
                </DropdownMenuContent>
            </DropdownMenu>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: 'Actions' })

        // ArrowDown on trigger opens menu and focuses first item
        trigger.focus()
        await userEvent.keyboard('{ArrowDown}')
        await canvas.findByRole('menu')
        await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Copy' })).toHaveFocus())

        // Home/End navigation
        await userEvent.keyboard('{End}')
        await expect(canvas.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()
        await userEvent.keyboard('{Home}')
        await expect(canvas.getByRole('menuitem', { name: 'Copy' })).toHaveFocus()

        // Escape closes and returns focus to trigger
        await userEvent.keyboard('{Escape}')
        await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument())
        await expect(trigger).toHaveFocus()
    }
}
