import type { Meta, StoryObj } from '@storybook/vue3'
import SidebarNavGroup from '@Components/SidebarNavGroup.vue'
import SidebarNavItem from '@Components/SidebarNavItem.vue'
import { expect, userEvent, within } from 'storybook/test'

const meta: Meta<typeof SidebarNavGroup> = {
    title: 'Components/SidebarNavGroup',
    component: SidebarNavGroup,

    parameters: {
        docs: {
            description: {
                component: 'A labelled section of navigation items for use inside a Sidebar. Can optionally be collapsible.'
            }
        }
    },

    argTypes: {
        collapsible: { control: 'boolean' },
        label: { control: 'text' },
        startCollapsed: { control: 'boolean' }
    },

    args: {
        collapsible: false,
        label: 'Main',
        startCollapsed: false
    },

    render: (args) => ({
        components: { SidebarNavGroup, SidebarNavItem },
        setup: () => ({ args }),
        template: `
            <div class="w-56 border border-gray-200 dark:border-gray-700 rounded-xl p-2 bg-white dark:bg-gray-900">
                <SidebarNavGroup
                    :collapsible="args.collapsible"
                    :label="args.label"
                    :start-collapsed="args.startCollapsed"
                >
                    <SidebarNavItem icon="LayoutDashboard" href="#" active>Dashboard</SidebarNavItem>
                    <SidebarNavItem icon="Users" href="#" :badge="4">Team</SidebarNavItem>
                    <SidebarNavItem icon="FolderOpen" href="#">Projects</SidebarNavItem>
                </SidebarNavGroup>
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Main')).toBeVisible()
        await expect(canvas.getByRole('link', { name: /dashboard/i })).toBeVisible()
    }
}

export const NoLabel: Story = {
    args: { label: undefined }
}

export const Collapsible: Story = {
    args: { collapsible: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const toggle = canvas.getByRole('button', { name: /main/i })

        await expect(toggle).toHaveAttribute('aria-expanded', 'true')
        await expect(canvas.getByRole('link', { name: /dashboard/i })).toBeVisible()

        await userEvent.click(toggle)
        await expect(toggle).toHaveAttribute('aria-expanded', 'false')
        await expect(canvas.queryByRole('link', { name: /dashboard/i })).toBeNull()

        await userEvent.click(toggle)
        await expect(toggle).toHaveAttribute('aria-expanded', 'true')
    }
}

export const StartCollapsed: Story = {
    args: { collapsible: true, startCollapsed: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const toggle = canvas.getByRole('button', { name: /main/i })
        await expect(toggle).toHaveAttribute('aria-expanded', 'false')
        await expect(canvas.queryByRole('link', { name: /dashboard/i })).toBeNull()
    }
}
