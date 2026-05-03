import type { Meta, StoryObj } from '@storybook/vue3'
import { faker } from '@faker-js/faker'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import Avatar from '@Components/Avatar.vue'
import Button from '@Components/Button.vue'
import NavigationBar from '@Components/NavigationBar.vue'
import NavigationBarSubmenu from '@Components/NavigationBarSubmenu.vue'
import { ref } from 'vue'

faker.seed(20260421)

const navLinks = [
    faker.company.name(),
    faker.company.name(),
    faker.company.name()
]

const meta: Meta<typeof NavigationBar> = {
    title: 'Components/NavigationBar',
    component: NavigationBar,
    parameters: {
        docs: {
            description: {
                component: 'A layout-focused top navigation wrapper with brand, nav, actions, and mobile-menu slots. Supports sticky positioning and an optional first-class mobile menu path below the configured breakpoint.'
            }
        }
    },
    argTypes: {
        bordered: {
            control: 'boolean',
            description: 'Adds a bottom border to the bar.'
        },
        menuToggleBreakpoint: {
            control: 'select',
            description: 'Controls when the inline nav hides and the menu toggle remains visible.',
            options: ['sm', 'md', 'lg']
        },
        menuToggleLabel: {
            control: 'text',
            description: 'Accessible label for the mobile menu toggle.'
        },
        navLabel: {
            control: 'text',
            description: 'Accessible label for the primary nav landmark.'
        },
        showMenuToggle: {
            control: 'boolean',
            description: 'Displays a menu toggle button for mobile shells.'
        },
        sticky: {
            control: 'boolean',
            description: 'Makes the navigation bar sticky to the top of the viewport.'
        }
    },
    args: {
        bordered: true,
        menuToggleBreakpoint: 'lg',
        menuToggleLabel: 'Open navigation',
        navLabel: 'Primary navigation',
        showMenuToggle: false,
        sticky: false
    }
}

type Story = StoryObj<typeof meta>

export const WithSubmenu: Story = {
    render: (args) => ({
        components: { NavigationBar, NavigationBarSubmenu },
        setup() {
            const productItems = [
                { href: '#overview', label: 'Overview', icon: 'Home' },
                {
                    href: '#solutions',
                    label: 'Solutions',
                    children: [
                        { href: '#analytics', label: 'Analytics', icon: 'ChartBar' },
                        { href: '#automation', label: 'Automation', icon: 'Settings' }
                    ]
                },
                { href: '#integrations', label: 'Integrations', icon: 'Link' }
            ]

            return { args, productItems }
        },
        template: `
            <NavigationBar v-bind="args">
                <template #brand>
                    <p class="text-sm font-semibold">Ocelot Workspace</p>
                </template>

                <template #nav>
                    <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">Home</a>
                    <NavigationBarSubmenu
                        label="Product"
                        :items="productItems"
                    />
                    <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">Pricing</a>
                </template>
            </NavigationBar>
        `
    }),
    parameters: {
        docs: {
            description: {
                story: 'Navigation submenus intentionally cover only two levels: a top-level trigger and one grouped submenu layer. Deeper child arrays are ignored by the item type and should be promoted to a page or mega-menu pattern.'
            }
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: /product/i })

        await userEvent.click(trigger)
        await waitFor(() => expect(canvas.getByRole('menuitem', { name: /analytics/i })).toBeVisible())

        trigger.focus()
        await userEvent.keyboard('{ArrowDown}')
        await expect(canvas.getByRole('menuitem', { name: /overview/i })).toHaveFocus()
    }
}

export default meta

export const Default: Story = {
    render: (args) => ({
        components: { Avatar, Button, NavigationBar },
        setup() {
            return { args, navLinks }
        },
        template: `
            <NavigationBar v-bind="args">
                <template #brand>
                    <div class="flex items-center gap-3">
                        <div class="flex size-10 items-center justify-center rounded-xl bg-blue-600 text-sm font-semibold text-white">
                            OUI
                        </div>
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold text-gray-950 dark:text-gray-50">Ocelot Workspace</p>
                            <p class="truncate text-xs text-gray-500 dark:text-gray-400">Operations</p>
                        </div>
                    </div>
                </template>

                <template #nav>
                    <a
                        v-for="(item, index) in navLinks"
                        :key="item"
                        href="#"
                        class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        :aria-current="index === 0 ? 'page' : undefined"
                    >
                        {{ item }}
                    </a>
                </template>

                <template #actions>
                    <Button
                        aria-label="Open notifications"
                        color="gray"
                        icon="Bell"
                        variant="tertiary"
                    />
                    <Avatar
                        initials="OU"
                        label="Ocelot user"
                        size="sm"
                    />
                </template>
            </NavigationBar>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('navigation', { name: /primary navigation/i })).toBeVisible()
        await expect(canvas.getByRole('link', { name: navLinks[0] })).toHaveAttribute('aria-current', 'page')
        await expect(canvas.getByText('OU')).toBeVisible()
    }
}

export const WithMenuToggle: Story = {
    name: 'Mobile Menu Toggle',
    args: {
        showMenuToggle: true
    },
    render: (args) => ({
        components: { NavigationBar },
        setup() {
            const toggleCount = ref(0)
            const handleToggle = () => {
                toggleCount.value += 1
            }

            return { args, handleToggle, toggleCount }
        },
        template: `
            <div class="space-y-3">
                <NavigationBar
                    v-bind="args"
                    @menu-toggle="handleToggle"
                >
                    <template #brand>
                        <p class="text-sm font-semibold">Mobile workspace</p>
                    </template>

                    <template #nav>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">Overview</a>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">Projects</a>
                    </template>

                    <template #mobile-menu>
                        <nav
                            aria-label="Mobile navigation"
                            class="grid gap-1"
                        >
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">Overview</a>
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800">Projects</a>
                        </nav>
                    </template>
                </NavigationBar>

                <p class="text-sm text-gray-600 dark:text-gray-300">Toggle count: {{ toggleCount }}</p>
            </div>
        `
    }),
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        }
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const toggleElement = canvasElement.querySelector('[aria-label="Open navigation"]') as HTMLElement | null

        toggleElement?.classList.remove('lg:hidden', 'md:hidden', 'sm:hidden')

        const toggle = canvas.getByRole('button', { name: /open navigation/i })

        await expect(toggle).toHaveAttribute('aria-expanded', 'false')
        await userEvent.click(toggle)

        const mobileMenu = document.getElementById(toggle.getAttribute('aria-controls') ?? '')
        mobileMenu?.classList.remove('lg:hidden', 'md:hidden', 'sm:hidden')

        await expect(canvas.getByText(/toggle count: 1/i)).toBeVisible()
        await expect(toggle).toHaveAttribute('aria-expanded', 'true')
        await expect(canvas.getByRole('navigation', { name: /mobile navigation/i })).toBeVisible()
    }
}
