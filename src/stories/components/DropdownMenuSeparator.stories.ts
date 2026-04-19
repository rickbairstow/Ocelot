import type { Meta, StoryObj } from '@storybook/vue3'
import DropdownMenu from '@Components/DropdownMenu.vue'
import DropdownMenuTrigger from '@Components/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@Components/DropdownMenuContent.vue'
import DropdownMenuItem from '@Components/DropdownMenuItem.vue'
import DropdownMenuSeparator from '@Components/DropdownMenuSeparator.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within, waitFor } from 'storybook/test'

const meta: Meta<typeof DropdownMenuSeparator> = {
    title: 'Components/DropdownMenu/DropdownMenuSeparator',
    component: DropdownMenuSeparator,

    parameters: {
        docs: {
            description: {
                component: 'A visual and semantic divider between groups of menu items. Renders a `<div role="separator">` with a border. Excluded from keyboard navigation.'
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
                    <Button variant="secondary">Menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem label="Edit" />
                    <DropdownMenuItem label="Duplicate" />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem label="Delete" destructive />
                </DropdownMenuContent>
            </DropdownMenu>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: 'Menu' }))
        await canvas.findByRole('menu')
        await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Edit' })).toBeVisible())

        // Separator is present with correct role
        await expect(canvas.getByRole('separator')).toBeInTheDocument()

        // ArrowDown skips separator — navigates directly from Duplicate to Delete
        const duplicate = canvas.getByRole('menuitem', { name: 'Duplicate' })
        duplicate.focus()
        await userEvent.keyboard('{ArrowDown}')
        await expect(canvas.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()

        await userEvent.keyboard('{Escape}')
    }
}
