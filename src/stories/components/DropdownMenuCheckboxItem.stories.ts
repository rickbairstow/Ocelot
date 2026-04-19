import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DropdownMenu from '@Components/DropdownMenu.vue'
import DropdownMenuTrigger from '@Components/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@Components/DropdownMenuContent.vue'
import DropdownMenuCheckboxItem from '@Components/DropdownMenuCheckboxItem.vue'
import DropdownMenuLabel from '@Components/DropdownMenuLabel.vue'
import DropdownMenuSeparator from '@Components/DropdownMenuSeparator.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within, waitFor } from 'storybook/test'

const meta: Meta<typeof DropdownMenuCheckboxItem> = {
    title: 'Components/DropdownMenu/DropdownMenuCheckboxItem',
    component: DropdownMenuCheckboxItem,

    parameters: {
        docs: {
            description: {
                component: 'A toggleable menu item with `role="menuitemcheckbox"`. Bind with `v-model:checked`. Shows a checkmark icon when checked. Does not close the menu on click, allowing multiple toggles in one interaction.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator, Button },
        setup() {
            const grid = ref(true)
            const sidebar = ref(false)
            const notifications = ref(true)
            return { grid, sidebar, notifications }
        },
        template: `
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="secondary">View</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Layout</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem v-model:checked="grid" label="Show grid" />
                    <DropdownMenuCheckboxItem v-model:checked="sidebar" label="Show sidebar" />
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Alerts</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem v-model:checked="notifications" label="Notifications" />
                </DropdownMenuContent>
            </DropdownMenu>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: 'View' }))
        await canvas.findByRole('menu')
        await waitFor(() => expect(canvas.getByRole('menuitemcheckbox', { name: 'Show grid' })).toBeVisible())

        // Initial checked states
        await expect(canvas.getByRole('menuitemcheckbox', { name: 'Show grid' })).toHaveAttribute('aria-checked', 'true')
        await expect(canvas.getByRole('menuitemcheckbox', { name: 'Show sidebar' })).toHaveAttribute('aria-checked', 'false')

        // Toggle unchecked → checked
        await userEvent.click(canvas.getByRole('menuitemcheckbox', { name: 'Show sidebar' }))
        await expect(canvas.getByRole('menuitemcheckbox', { name: 'Show sidebar' })).toHaveAttribute('aria-checked', 'true')

        // Toggle checked → unchecked
        await userEvent.click(canvas.getByRole('menuitemcheckbox', { name: 'Show grid' }))
        await expect(canvas.getByRole('menuitemcheckbox', { name: 'Show grid' })).toHaveAttribute('aria-checked', 'false')

        // Menu stays open after toggling
        await expect(canvas.queryByRole('menu')).toBeInTheDocument()
        await userEvent.keyboard('{Escape}')
    }
}
