import type { Meta, StoryObj } from '@storybook/vue3'
import DropdownMenu from '@Components/DropdownMenu.vue'
import DropdownMenuTrigger from '@Components/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@Components/DropdownMenuContent.vue'
import DropdownMenuItem from '@Components/DropdownMenuItem.vue'
import DropdownMenuSeparator from '@Components/DropdownMenuSeparator.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within, waitFor } from 'storybook/test'

const meta: Meta<typeof DropdownMenuItem> = {
    title: 'Components/DropdownMenu/DropdownMenuItem',
    component: DropdownMenuItem,

    parameters: {
        docs: {
            description: {
                component: 'A single action item in a dropdown menu. Supports icons, keyboard shortcut hints, `disabled`, and `destructive` (red) styling. Pass `href` to render as an `<a>` tag. Clicking a non-disabled item automatically closes the menu.'
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
                    <Button variant="secondary">Options</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem icon="Copy" label="Duplicate" shortcut="⌘D" />
                    <DropdownMenuItem icon="Share" label="Share" disabled />
                    <DropdownMenuItem icon="Download" label="Export" />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem icon="Trash" label="Delete" destructive />
                </DropdownMenuContent>
            </DropdownMenu>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: 'Options' }))
        await canvas.findByRole('menu')
        await waitFor(() => expect(canvas.getByRole('menuitem', { name: /Duplicate/ })).toBeVisible())

        // Disabled item has aria-disabled
        await expect(canvas.getByRole('menuitem', { name: 'Share' })).toHaveAttribute('aria-disabled', 'true')

        // Clicking a normal item closes the menu
        await userEvent.click(canvas.getByRole('menuitem', { name: /Duplicate/ }))
        await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument())

        // Clicking a disabled item keeps the menu open
        await userEvent.click(canvas.getByRole('button', { name: 'Options' }))
        await canvas.findByRole('menu')
        await userEvent.click(canvas.getByRole('menuitem', { name: 'Share' }))
        await expect(canvas.queryByRole('menu')).toBeInTheDocument()
        await userEvent.keyboard('{Escape}')
    }
}
