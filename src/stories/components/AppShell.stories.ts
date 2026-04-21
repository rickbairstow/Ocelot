import type { Meta, StoryObj } from '@storybook/vue3'
import { faker } from '@faker-js/faker'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import AppShell from '@Components/AppShell.vue'
import Avatar from '@Components/Avatar.vue'
import Banner from '@Components/Banner.vue'
import Button from '@Components/Button.vue'
import Card from '@Components/Card.vue'
import Heading from '@Components/Heading.vue'
import NavigationBar from '@Components/NavigationBar.vue'
import SidebarNavGroup from '@Components/SidebarNavGroup.vue'
import SidebarNavItem from '@Components/SidebarNavItem.vue'
import { ref } from 'vue'

faker.seed(20260421)

const sidebarItems = [
    { icon: 'Home', key: 'home', label: 'Overview' },
    { icon: 'FolderOpen', key: 'projects', label: 'Projects' },
    { icon: 'Settings', key: 'settings', label: 'Settings' }
] as const

const detailCards = Array.from({ length: 3 }, () => ({
    description: faker.lorem.sentences(2),
    title: faker.company.buzzPhrase()
}))
const lastSynced = faker.date.recent().toLocaleDateString('en-GB')

const meta: Meta<typeof AppShell> = {
    title: 'Templates/AppShell',
    component: AppShell,
    parameters: {
        docs: {
            description: {
                component: 'An application layout wrapper that coordinates a responsive sidebar with header, main content, and footer slots. Exposes sidebar state and controls through slot props for use with NavigationBar.'
            }
        }
    },
    argTypes: {
        fixedHeader: {
            control: 'boolean',
            description: 'Keeps the header slot pinned to the top of the shell.'
        },
        hasSidebar: {
            control: 'boolean',
            description: 'Renders the responsive sidebar region.'
        },
        mainId: {
            control: 'text',
            description: 'ID applied to the main landmark.'
        },
        sidebarBreakpoint: {
            control: 'select',
            description: 'Breakpoint where the sidebar becomes a static desktop column.',
            options: ['md', 'lg']
        },
        sidebarLabel: {
            control: 'text',
            description: 'Accessible label for the sidebar landmark.'
        },
        sidebarPosition: {
            control: 'select',
            description: 'Controls whether the desktop sidebar sits on the left or right.',
            options: ['left', 'right']
        },
        sidebarWidth: {
            control: 'text',
            description: 'Width applied to the sidebar column.'
        }
    },
    args: {
        fixedHeader: true,
        hasSidebar: true,
        mainId: 'main',
        sidebarBreakpoint: 'lg',
        sidebarLabel: 'Workspace navigation',
        sidebarPosition: 'left',
        sidebarWidth: '18rem'
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    parameters: {
        viewport: {
            defaultViewport: 'desktop'
        }
    },
    render: (args) => ({
        components: {
            AppShell,
            Avatar,
            Banner,
            Button,
            Card,
            Heading,
            NavigationBar,
            SidebarNavGroup,
            SidebarNavItem
        },
        setup() {
            const activeItem = ref('home')

            return {
                activeItem,
                args,
                detailCards,
                lastSynced,
                sidebarItems
            }
        },
        template: `
            <AppShell v-bind="args">
                <template #header="{ toggleSidebar }">
                    <NavigationBar
                        show-menu-toggle
                        @menu-toggle="toggleSidebar"
                    >
                        <template #brand>
                            <div class="flex items-center gap-3">
                                <div class="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white">
                                    OU
                                </div>
                                <div class="min-w-0">
                                    <p class="truncate text-sm font-semibold text-gray-950 dark:text-gray-50">Ocelot Workspace</p>
                                    <p class="truncate text-xs text-gray-500 dark:text-gray-400">Project hub</p>
                                </div>
                            </div>
                        </template>

                        <template #nav>
                            <a
                                v-for="item in sidebarItems"
                                :key="item.key"
                                href="#"
                                class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                                :aria-current="activeItem === item.key ? 'page' : undefined"
                                @click.prevent="activeItem = item.key"
                            >
                                {{ item.label }}
                            </a>
                        </template>

                        <template #actions>
                            <Button
                                aria-label="Search workspace"
                                color="gray"
                                icon="Search"
                                variant="tertiary"
                            />
                            <Avatar
                                initials="OU"
                                label="Workspace owner"
                                size="sm"
                            />
                        </template>
                    </NavigationBar>
                </template>

                <template #sidebar="{ closeSidebar }">
                    <div class="flex h-full flex-col">
                        <div class="border-b border-gray-200 px-4 py-4 dark:border-gray-800">
                            <p class="text-sm font-semibold text-gray-950 dark:text-gray-50">Workspace navigation</p>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Switch sections or jump back into your queue.</p>
                        </div>

                        <nav aria-label="Sidebar navigation" class="flex-1 p-3">
                            <SidebarNavGroup label="Main">
                                <SidebarNavItem
                                    v-for="item in sidebarItems"
                                    :key="item.key"
                                    :active="activeItem === item.key"
                                    href="#"
                                    :icon="item.icon"
                                    @click.prevent="activeItem = item.key; closeSidebar()"
                                >
                                    {{ item.label }}
                                </SidebarNavItem>
                            </SidebarNavGroup>

                            <SidebarNavGroup label="Support">
                                <SidebarNavItem href="#" icon="Bell">Notifications</SidebarNavItem>
                                <SidebarNavItem href="#" icon="User">Team</SidebarNavItem>
                            </SidebarNavGroup>
                        </nav>
                    </div>
                </template>

                <template #default>
                    <div class="space-y-6 p-4 sm:p-6">
                        <Banner
                            description="This shell keeps navigation reachable on mobile without forcing consumers to wire the responsive sidebar logic themselves."
                            title="Application layout"
                        />

                        <div class="space-y-2">
                            <Heading :level="1">Workspace overview</Heading>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                {{ detailCards[0].description }}
                            </p>
                        </div>

                        <Heading :level="2">Delivery highlights</Heading>

                        <div class="grid gap-4 xl:grid-cols-3">
                            <Card
                                v-for="card in detailCards"
                                :key="card.title"
                                class="p-5"
                            >
                                <div class="space-y-2">
                                    <Heading :level="2">{{ card.title }}</Heading>
                                    <p class="text-sm text-gray-600 dark:text-gray-300">
                                        {{ card.description }}
                                    </p>
                                </div>
                            </Card>
                        </div>
                    </div>
                </template>

                <template #footer>
                    <div class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400 sm:px-6">
                        Last synced {{ lastSynced }}
                    </div>
                </template>
            </AppShell>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('banner')).toBeVisible()
        await expect(canvas.getByRole('main')).toBeVisible()
        const currentLinks = canvas.getAllByRole('link', { current: 'page' })
        await expect(currentLinks[0]).toHaveTextContent('Overview')
    }
}

export const MobileSidebar: Story = {
    args: {
        sidebarBreakpoint: 'lg'
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    render: Default.render,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const openButton = canvas.getByRole('button', { name: /open navigation/i })
        await userEvent.click(openButton)

        const closeButtons = await canvas.findAllByRole('button', { name: /close navigation/i })
        const closeButton = closeButtons.find(button => button.offsetParent !== null)
        await waitFor(() => expect(closeButton).toBeVisible())

        await userEvent.click(closeButton!)
        await waitFor(() => expect(openButton).toHaveFocus())
    }
}

export const WithoutSidebar: Story = {
    args: {
        hasSidebar: false
    },
    render: (args) => ({
        components: { AppShell, Avatar, Heading, NavigationBar },
        setup() {
            return { args }
        },
        template: `
            <AppShell v-bind="args">
                <template #header>
                    <NavigationBar>
                        <template #brand>
                            <p class="text-sm font-semibold">Standalone workspace</p>
                        </template>

                        <template #actions>
                            <Avatar
                                initials="OU"
                                label="Workspace owner"
                                size="sm"
                            />
                        </template>
                    </NavigationBar>
                </template>

                <template #default>
                    <div class="p-4 sm:p-6">
                        <Heading :level="1">Full-width content</Heading>
                    </div>
                </template>
            </AppShell>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.queryByRole('complementary')).not.toBeInTheDocument()
        await expect(canvas.getByRole('main')).toBeVisible()
    }
}
