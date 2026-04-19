import type { Meta, StoryObj } from '@storybook/vue3'
import DropdownMenu from '@Components/DropdownMenu.vue'
import DropdownMenuTrigger from '@Components/DropdownMenuTrigger.vue'
import DropdownMenuContent from '@Components/DropdownMenuContent.vue'
import DropdownMenuItem from '@Components/DropdownMenuItem.vue'
import DropdownMenuCheckboxItem from '@Components/DropdownMenuCheckboxItem.vue'
import DropdownMenuSeparator from '@Components/DropdownMenuSeparator.vue'
import DropdownMenuLabel from '@Components/DropdownMenuLabel.vue'
import { ref } from 'vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within, waitFor } from 'storybook/test'

const meta: Meta<typeof DropdownMenuLabel> = {
    title: 'Components/DropdownMenu/DropdownMenuLabel',
    component: DropdownMenuLabel,

    parameters: {
        docs: {
            description: {
                component: 'A non-interactive section heading inside a dropdown menu. Rendered with `aria-hidden` so screen readers skip it — the items themselves carry sufficient context. Use to visually chunk long menus into named groups.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuSeparator, DropdownMenuLabel, Button },
        setup() {
            const grid = ref(true)
            const sidebar = ref(false)
            return { grid, sidebar }
        },
        template: `
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Button variant="secondary">View</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem label="Rename" />
                    <DropdownMenuItem label="Move" />
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Layout</DropdownMenuLabel>
                    <DropdownMenuCheckboxItem v-model:checked="grid" label="Show grid" />
                    <DropdownMenuCheckboxItem v-model:checked="sidebar" label="Show sidebar" />
                </DropdownMenuContent>
            </DropdownMenu>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: 'View' }))
        await canvas.findByRole('menu')
        await waitFor(() => expect(canvas.getByRole('menuitem', { name: 'Rename' })).toBeVisible())

        // Labels are aria-hidden and not interactive — not exposed as a role
        const labels = canvasElement.querySelectorAll('[aria-hidden="true"]')
        const labelTexts = Array.from(labels).map((el) => el.textContent?.trim())
        await expect(labelTexts).toContain('Actions')
        await expect(labelTexts).toContain('Layout')

        // ArrowDown skips labels — navigates only through interactive items
        const rename = canvas.getByRole('menuitem', { name: 'Rename' })
        rename.focus()
        await userEvent.keyboard('{ArrowDown}')
        await expect(canvas.getByRole('menuitem', { name: 'Move' })).toHaveFocus()

        await userEvent.keyboard('{Escape}')
    }
}
