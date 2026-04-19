import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import DropdownMenu from '@Components/DropdownMenu.vue'
import DropdownMenuTrigger from '@Components/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@Components/DropdownMenuContent.vue'
import DropdownMenuItem from '@Components/DropdownMenuItem.vue'
import DropdownMenuCheckboxItem from '@Components/DropdownMenuCheckboxItem.vue'
import DropdownMenuSeparator from '@Components/DropdownMenuSeparator.vue'
import DropdownMenuLabel from '@Components/DropdownMenuLabel.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within, waitFor } from 'storybook/test'

const meta: Meta<typeof DropdownMenu> = {
    title: 'Components/DropdownMenu',
    component: DropdownMenu,

    parameters: {
        docs: {
            description: {
                component: 'A fully accessible dropdown menu with keyboard navigation, typeahead, and ARIA semantics. Compose with DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator, and DropdownMenuLabel.'
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
                    <DropdownMenuItem label="Edit" />
                    <DropdownMenuItem label="Duplicate" />
                    <DropdownMenuItem label="Archive" />
                    <DropdownMenuSeparator />
                    <DropdownMenuItem label="Delete" destructive />
                </DropdownMenuContent>
            </DropdownMenu>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // Menu is closed initially
        await expect(canvas.queryByRole('menu')).not.toBeInTheDocument()

        // Open via click
        await userEvent.click(canvas.getByRole('button', { name: 'Options' }))
        await canvas.findByRole('menu')

        // All items present and visible (waits for enter transition to complete)
        await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Edit' })).toBeVisible())
        await expect(canvas.getByRole('menuitem', { name: 'Delete' })).toBeVisible()

        // Click item closes menu
        await userEvent.click(canvas.getByRole('menuitem', { name: 'Edit' }))
        await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument())
    }
}

export const AllVariations: Story = {
    render: () => ({
        components: {
            DropdownMenu,
            DropdownMenuTrigger,
            DropdownMenuContent,
            DropdownMenuItem,
            DropdownMenuCheckboxItem,
            DropdownMenuSeparator,
            DropdownMenuLabel,
            Button
        },
        setup() {
            const showGrid = ref(true)
            const showSidebar = ref(false)
            const notifications = ref(true)
            return { showGrid, showSidebar, notifications }
        },
        template: `
            <div class="flex flex-wrap gap-4">

                <div class="flex flex-col gap-1">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">With icons</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button icon="Settings" variant="secondary">Settings</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem icon="User" label="Profile" />
                            <DropdownMenuItem icon="Bell" label="Notifications" />
                            <DropdownMenuItem icon="Lock" label="Security" />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem icon="X" label="Sign out" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div class="flex flex-col gap-1">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">With shortcuts</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="secondary">Edit</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem label="Undo" shortcut="⌘Z" />
                            <DropdownMenuItem label="Redo" shortcut="⌘⇧Z" />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem label="Cut" shortcut="⌘X" />
                            <DropdownMenuItem label="Copy" shortcut="⌘C" />
                            <DropdownMenuItem label="Paste" shortcut="⌘V" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div class="flex flex-col gap-1">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">With checkboxes</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant="secondary">View</Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Layout</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem v-model:checked="showGrid" label="Show grid" />
                            <DropdownMenuCheckboxItem v-model:checked="showSidebar" label="Show sidebar" />
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Alerts</DropdownMenuLabel>
                            <DropdownMenuCheckboxItem v-model:checked="notifications" label="Notifications" />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <div class="flex flex-col gap-1">
                    <p class="text-xs font-medium text-gray-500 dark:text-gray-400">With disabled &amp; destructive</p>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button icon="MoreHorizontal" icon-only variant="secondary" aria-label="More options" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem icon="Copy" label="Duplicate" />
                            <DropdownMenuItem icon="Share" label="Share" disabled />
                            <DropdownMenuItem icon="Download" label="Export" />
                            <DropdownMenuSeparator />
                            <DropdownMenuItem icon="Trash" label="Delete" destructive />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        // Open the shortcuts menu and test keyboard navigation
        const editButton = canvas.getByRole('button', { name: 'Edit' })
        editButton.focus()
        await userEvent.keyboard('{ArrowDown}')
        await canvas.findByRole('menu')

        // ArrowDown moves focus through items (waits for enter transition)
        const firstItem = await waitFor(() => {
            const item = canvas.getByRole('menuitem', { name: /Undo/ })
            expect(item).toBeVisible()
            return item
        })
        await expect(firstItem).toHaveFocus()
        await userEvent.keyboard('{ArrowDown}')
        await expect(canvas.getByRole('menuitem', { name: /Redo/ })).toHaveFocus()

        // Escape closes menu and returns focus to trigger
        await userEvent.keyboard('{Escape}')
        await waitFor(() => expect(canvas.queryByRole('menu')).not.toBeInTheDocument())
        await expect(editButton).toHaveFocus()

        // Open checkboxes menu and toggle an item
        await userEvent.click(canvas.getByRole('button', { name: 'View' }))
        const checkbox = await canvas.findByRole('menuitemcheckbox', { name: 'Show grid' })
        await expect(checkbox).toHaveAttribute('aria-checked', 'true')
        await userEvent.click(checkbox)
        await expect(canvas.getByRole('menuitemcheckbox', { name: 'Show grid' })).toHaveAttribute('aria-checked', 'false')

        // Verify disabled item has aria-disabled
        await userEvent.keyboard('{Escape}')
        await userEvent.click(canvas.getByRole('button', { name: 'More options' }))
        await canvas.findByRole('menu')
        await expect(canvas.getByRole('menuitem', { name: 'Share' })).toHaveAttribute('aria-disabled', 'true')

        // Close
        await userEvent.keyboard('{Escape}')
    }
}
