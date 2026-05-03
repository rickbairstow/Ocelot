import type { Meta, StoryObj } from '@storybook/vue3'
import SidebarNavItem from '@Components/SidebarNavItem.vue'
import { expect, within } from 'storybook/test'

const meta: Meta<typeof SidebarNavItem> = {
    title: 'Components/Sidebar/SidebarNavItem',
    component: SidebarNavItem,

    parameters: {
        docs: {
            description: {
                component: 'An individual navigation link or button for use inside a Sidebar. Supports an icon, active state (`aria-current="page"`), badge count, and disabled state.'
            }
        }
    },

    argTypes: {
        active: { control: 'boolean' },
        badge: { control: 'text' },
        disabled: { control: 'boolean' },
        href: { control: 'text' },
        icon: { control: 'text' }
    },

    args: {
        active: false,
        badge: undefined,
        disabled: false,
        href: undefined,
        icon: undefined
    },

    render: (args) => ({
        components: { SidebarNavItem },
        setup: () => ({ args }),
        template: `
            <div class="w-56">
                <SidebarNavItem
                    :active="args.active"
                    :badge="args.badge"
                    :disabled="args.disabled"
                    :href="args.href"
                    :icon="args.icon"
                >
                    Dashboard
                </SidebarNavItem>
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const item = canvas.getByRole('button', { name: /dashboard/i })
        await expect(item).toBeVisible()
        await expect(item).not.toHaveAttribute('aria-current')
    }
}

export const AsLink: Story = {
    args: { href: '#' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const item = canvas.getByRole('link', { name: /dashboard/i })
        await expect(item).toBeVisible()
        await expect(item).toHaveAttribute('href', '#')
    }
}

export const Active: Story = {
    args: { href: '#', active: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const item = canvas.getByRole('link', { name: /dashboard/i })
        await expect(item).toHaveAttribute('aria-current', 'page')
    }
}

export const WithIcon: Story = {
    args: { href: '#', icon: 'LayoutGrid' }
}

export const WithBadge: Story = {
    args: { href: '#', icon: 'Bell', badge: 9 }
}

export const ActiveWithBadge: Story = {
    args: { href: '#', icon: 'Bell', badge: 9, active: true }
}

export const Disabled: Story = {
    args: { icon: 'Lock', disabled: true },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const item = canvas.getByRole('button', { name: /dashboard/i })
        await expect(item).toBeDisabled()
        await expect(item).toHaveAttribute('aria-disabled', 'true')
    }
}
