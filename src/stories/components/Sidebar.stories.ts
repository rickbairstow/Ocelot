import type { Meta, StoryObj } from '@storybook/vue3'
import Sidebar from '@Components/Sidebar.vue'
import SidebarNavGroup from '@Components/SidebarNavGroup.vue'
import SidebarNavItem from '@Components/SidebarNavItem.vue'
import { ref } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta: Meta<typeof Sidebar> = {
    title: 'Components/Sidebar',
    component: Sidebar,

    parameters: {
        docs: {
            description: {
                component: 'A collapsible side navigation panel. Slides in from the left and pairs with a Scrim overlay for mobile viewports. Provides default and footer slots for flexible content layout.'
            }
        }
    },

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content'
        },
        footer: {
            control: 'text',
            description: 'Footer slot content'
        },
        showScrim: {
            control: 'boolean',
            description: 'Sets if the scrim should show when the menu is open.'
        },
        side: {
            control: 'select',
            options: ['left', 'right'],
            description: 'Sets what side the sidebar displays on.'
        },
        title: {
            control: 'text',
            description: 'Title slot content'
        }
    },

    args: {
        default: 'Sidebar content',
        footer: 'Sidebar footer',
        showScrim: true,
        side: 'left',
        title: 'Sidebar title'
    },

    render: (args) => ({
        components: { Sidebar },
        setup() {
            const sidebar = ref<{ open(): void } | null>(null)
            const triggerRef = ref<HTMLElement | null>(null)

            const openSidebar = () => {
                sidebar.value?.open()
            }

            return {
                args,
                sidebar,
                triggerRef,
                openSidebar
            }
        },

        template: `
            <button
                ref="triggerRef"
                type="button"
                class="mb-4 border px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                @click="openSidebar"
            >
                Open Sidebar
            </button>

            <Sidebar
                ref="sidebar"
                :side="args.side"
                :show-scrim="args.showScrim"
            >
                <template #title>{{ args.title }}</template>
                <template #default>{{ args.default }}</template>
                <template #footer>{{ args.footer }}</template>
            </Sidebar>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

// ✅ Interaction test for focus behavior
export const Left: Story = {
    args: { side: 'left' },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const openButton = await canvas.getByRole('button', {
            name: 'Open Sidebar'
        })
        await userEvent.click(openButton)

        const closeButtons = await canvas.findAllByRole('button', {
            name: 'Close sidebar'
        })
        const visibleCloseButton = closeButtons.find(
            (btn) => btn.offsetParent !== null
        )!

        await waitFor(() => {
            expect(visibleCloseButton).toBeVisible()
        })

        visibleCloseButton.focus()
        await expect(visibleCloseButton).toHaveFocus()

        // Click the close button instead of Escape
        await userEvent.click(visibleCloseButton)

        // Assert focus returns to the original trigger
        await waitFor(() => {
            expect(openButton).toHaveFocus()
        })
    }
}

export const Right: Story = {
    args: { side: 'right' },
    play: Left.play // same test logic
}

export const WithNav: Story = {
    render: () => ({
        components: { Sidebar, SidebarNavGroup, SidebarNavItem },
        setup() {
            const sidebar = ref<InstanceType<typeof Sidebar> | null>(null)
            const active = ref('dashboard')
            return { sidebar, active }
        },
        template: `
            <button
                class="mb-4 border px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                type="button"
                @click="sidebar.open()"
            >
                Open Sidebar
            </button>

            <Sidebar ref="sidebar">
                <template #title>My App</template>

                <nav aria-label="Navigation" class="flex flex-col gap-1 p-2">
                    <SidebarNavGroup label="Main">
                        <SidebarNavItem icon="LayoutDashboard" href="#" :active="active === 'dashboard'" @click.prevent="active = 'dashboard'">Dashboard</SidebarNavItem>
                        <SidebarNavItem icon="Users" href="#" :active="active === 'team'" @click.prevent="active = 'team'" :badge="4">Team</SidebarNavItem>
                        <SidebarNavItem icon="FolderOpen" href="#" :active="active === 'projects'" @click.prevent="active = 'projects'">Projects</SidebarNavItem>
                    </SidebarNavGroup>

                    <SidebarNavGroup label="Settings">
                        <SidebarNavItem icon="Settings" href="#" :active="active === 'settings'" @click.prevent="active = 'settings'">Settings</SidebarNavItem>
                        <SidebarNavItem icon="Lock" disabled>Admin only</SidebarNavItem>
                    </SidebarNavGroup>
                </nav>
            </Sidebar>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /open sidebar/i }))

        const nav = await canvas.findByRole('navigation', { name: /navigation/i })
        await waitFor(() => expect(nav).toBeVisible())

        const dashboardLink = canvas.getByRole('link', { name: /dashboard/i })
        await expect(dashboardLink).toHaveAttribute('aria-current', 'page')

        await userEvent.click(canvas.getByRole('link', { name: /team/i }))
        await expect(canvas.getByRole('link', { name: /team/i })).toHaveAttribute('aria-current', 'page')
        await expect(dashboardLink).not.toHaveAttribute('aria-current')

        await expect(canvas.getByRole('button', { name: /admin only/i })).toBeDisabled()
    }
}
