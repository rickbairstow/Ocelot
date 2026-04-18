import type { Meta, StoryObj } from '@storybook/vue3'
import Tabs from '@Components/Tabs.vue'
import TabList from '@Components/TabList.vue'
import Tab from '@Components/Tab.vue'
import TabPanel from '@Components/TabPanel.vue'
import { userEvent, expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof Tabs> = {
    title: 'Components/Tabs',
    component: Tabs,

    argTypes: {
        defaultValue: {
            control: 'text',
            description: 'Value of the tab open on initial render (uncontrolled).'
        },
        variant: {
            control: 'select',
            options: ['line', 'pill', 'contained'],
            description: 'Visual style of the tab list.'
        }
    },

    args: {
        defaultValue: 'account',
        variant: 'line'
    },

    render: (args) => ({
        components: { Tabs, TabList, Tab, TabPanel },
        setup() {
            return { args }
        },
        template: `
            <Tabs :default-value="args.defaultValue" :variant="args.variant">
                <TabList label="Settings">
                    <Tab value="account">Account</Tab>
                    <Tab value="password">Password</Tab>
                    <Tab value="notifications">Notifications</Tab>
                </TabList>
                <TabPanel value="account"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Manage your account details and preferences.</p></TabPanel>
                <TabPanel value="password"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Update your password and security settings.</p></TabPanel>
                <TabPanel value="notifications"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Configure how and when you receive notifications.</p></TabPanel>
            </Tabs>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        const tabAccount = canvas.getByRole('tab', { name: 'Account' })
        const tabPassword = canvas.getByRole('tab', { name: 'Password' })
        const tabNotifications = canvas.getByRole('tab', { name: 'Notifications' })

        // Initial state: first tab active
        await expect(tabAccount).toHaveAttribute('aria-selected', 'true')
        await expect(tabPassword).toHaveAttribute('aria-selected', 'false')
        await expect(tabNotifications).toHaveAttribute('aria-selected', 'false')

        // Active tab in tab order; others removed
        await expect(tabAccount).toHaveAttribute('tabindex', '0')
        await expect(tabPassword).toHaveAttribute('tabindex', '-1')

        // First panel visible
        const panels = canvasElement.querySelectorAll('[role="tabpanel"]')
        await expect(panels[0]).toBeVisible()
        await expect(panels[1]).not.toBeVisible()
        await expect(panels[2]).not.toBeVisible()

        // ARIA linkage
        const panelId = panels[0].getAttribute('id')
        await expect(tabAccount).toHaveAttribute('aria-controls', panelId)

        // Click second tab
        await userEvent.click(tabPassword)
        await expect(tabPassword).toHaveAttribute('aria-selected', 'true')
        await expect(tabAccount).toHaveAttribute('aria-selected', 'false')
        await expect(panels[0]).not.toBeVisible()
        await expect(panels[1]).toBeVisible()
    }
}

export const Pill: Story = {
    args: { variant: 'pill' },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        const tabAccount = canvas.getByRole('tab', { name: 'Account' })
        const tabPassword = canvas.getByRole('tab', { name: 'Password' })

        await expect(tabAccount).toHaveAttribute('aria-selected', 'true')

        await userEvent.click(tabPassword)
        await expect(tabPassword).toHaveAttribute('aria-selected', 'true')
        await expect(tabAccount).toHaveAttribute('aria-selected', 'false')
    }
}

export const Contained: Story = {
    args: { variant: 'contained' },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        const tabAccount = canvas.getByRole('tab', { name: 'Account' })
        const tabPassword = canvas.getByRole('tab', { name: 'Password' })

        await expect(tabAccount).toHaveAttribute('aria-selected', 'true')

        await userEvent.click(tabPassword)
        await expect(tabPassword).toHaveAttribute('aria-selected', 'true')
    }
}

export const WithIcons: Story = {
    render: (args) => ({
        components: { Tabs, TabList, Tab, TabPanel },
        setup() {
            return { args }
        },
        template: `
            <Tabs default-value="account" :variant="args.variant">
                <TabList label="Settings">
                    <Tab value="account" icon="User">Account</Tab>
                    <Tab value="password" icon="Lock">Password</Tab>
                    <Tab value="notifications" icon="Bell">Notifications</Tab>
                </TabList>
                <TabPanel value="account"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Account settings content.</p></TabPanel>
                <TabPanel value="password"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Password settings content.</p></TabPanel>
                <TabPanel value="notifications"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Notifications settings content.</p></TabPanel>
            </Tabs>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        const tabAccount = canvas.getByRole('tab', { name: 'Account' })
        await expect(tabAccount).toHaveAttribute('aria-selected', 'true')

        const icon = tabAccount.querySelector('[aria-hidden="true"]')
        await expect(icon).not.toBeNull()
    }
}

export const WithDisabledTab: Story = {
    render: (args) => ({
        components: { Tabs, TabList, Tab, TabPanel },
        setup() {
            return { args }
        },
        template: `
            <Tabs default-value="account" :variant="args.variant">
                <TabList label="Settings">
                    <Tab value="account">Account</Tab>
                    <Tab value="password" disabled>Password</Tab>
                    <Tab value="notifications">Notifications</Tab>
                </TabList>
                <TabPanel value="account"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Account settings content.</p></TabPanel>
                <TabPanel value="password"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Password settings content.</p></TabPanel>
                <TabPanel value="notifications"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Notifications settings content.</p></TabPanel>
            </Tabs>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        const tabAccount = canvas.getByRole('tab', { name: 'Account' })
        const tabPassword = canvas.getByRole('tab', { name: 'Password' })

        await expect(tabPassword).toHaveAttribute('aria-disabled', 'true')

        // Clicking a disabled tab should not activate it
        await userEvent.click(tabPassword)
        await expect(tabAccount).toHaveAttribute('aria-selected', 'true')
        await expect(tabPassword).toHaveAttribute('aria-selected', 'false')
    }
}

export const KeyboardNavigation: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        const tabAccount = canvas.getByRole('tab', { name: 'Account' })
        const tabPassword = canvas.getByRole('tab', { name: 'Password' })
        const tabNotifications = canvas.getByRole('tab', { name: 'Notifications' })

        // Focus first tab and navigate right
        await userEvent.click(tabAccount)
        await userEvent.keyboard('{ArrowRight}')
        await expect(tabPassword).toHaveFocus()

        // Navigate right again
        await userEvent.keyboard('{ArrowRight}')
        await expect(tabNotifications).toHaveFocus()

        // Wraps around to first
        await userEvent.keyboard('{ArrowRight}')
        await expect(tabAccount).toHaveFocus()

        // Home key goes to first
        await userEvent.click(tabNotifications)
        await userEvent.keyboard('{Home}')
        await expect(tabAccount).toHaveFocus()

        // End key goes to last
        await userEvent.keyboard('{End}')
        await expect(tabNotifications).toHaveFocus()

        // ArrowLeft wraps to last from first
        await userEvent.click(tabAccount)
        await userEvent.keyboard('{ArrowLeft}')
        await expect(tabNotifications).toHaveFocus()
    }
}

export const LongContent: Story = {
    render: () => ({
        components: { Tabs, TabList, Tab, TabPanel },
        setup() {
            return {
                paragraphs: faker.lorem.paragraphs(3)
            }
        },
        template: `
            <Tabs default-value="overview">
                <TabList label="Article sections">
                    <Tab value="overview">Overview</Tab>
                    <Tab value="details">Details</Tab>
                    <Tab value="references">References</Tab>
                </TabList>
                <TabPanel value="overview">
                    <div class="pt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <p v-for="(p, i) in paragraphs.split('\\n\\n')" :key="i">{{ p }}</p>
                    </div>
                </TabPanel>
                <TabPanel value="details">
                    <p class="pt-4 text-sm text-gray-700 dark:text-gray-300">Detailed information goes here.</p>
                </TabPanel>
                <TabPanel value="references">
                    <p class="pt-4 text-sm text-gray-700 dark:text-gray-300">References and citations go here.</p>
                </TabPanel>
            </Tabs>
        `
    })
}
