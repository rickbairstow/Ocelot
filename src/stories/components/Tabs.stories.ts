import type { Meta, StoryObj } from '@storybook/vue3'
import Tabs from '@Components/Tabs.vue'
import TabList from '@Components/TabList.vue'
import Tab from '@Components/Tab.vue'
import TabPanel from '@Components/TabPanel.vue'
import { userEvent, expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

const makeTabs = (count = 3) =>
    Array.from({ length: count }, (_, i) => ({
        value: `tab${i + 1}`,
        label: faker.lorem.words(2),
        content: faker.lorem.paragraph()
    }))

const meta: Meta<typeof Tabs> = {
    title: 'Components/Tabs',
    component: Tabs,

    parameters: {
        docs: {
            description: {
                component: 'A tabbed interface for organising content into switchable panels. Supports line, pill, and contained variants with full keyboard navigation (arrow keys, Home, End). Built from composable Tabs, TabList, Tab, and TabPanel components.'
            }
        }
    },

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
        defaultValue: 'tab1',
        variant: 'line'
    },

    render: (args) => ({
        components: { Tabs, TabList, Tab, TabPanel },
        setup() {
            return { args, tabs: makeTabs(), listLabel: faker.lorem.words(2) }
        },
        template: `
            <Tabs :default-value="args.defaultValue" :variant="args.variant">
                <TabList :label="listLabel">
                    <Tab
                        v-for="tab in tabs"
                        :key="tab.value"
                        :value="tab.value"
                    >{{ tab.label }}</Tab>
                </TabList>
                <TabPanel
                    v-for="tab in tabs"
                    :key="tab.value"
                    :value="tab.value"
                >
                    <p class="pt-4 text-sm text-gray-700 dark:text-gray-300">{{ tab.content }}</p>
                </TabPanel>
            </Tabs>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const [tab1, tab2, tab3] = canvas.getAllByRole('tab')

        // Initial state: first tab active
        await expect(tab1).toHaveAttribute('aria-selected', 'true')
        await expect(tab2).toHaveAttribute('aria-selected', 'false')
        await expect(tab3).toHaveAttribute('aria-selected', 'false')

        // Roving tabindex
        await expect(tab1).toHaveAttribute('tabindex', '0')
        await expect(tab2).toHaveAttribute('tabindex', '-1')

        // First panel visible, others hidden
        const panels = canvasElement.querySelectorAll('[role="tabpanel"]')
        await expect(panels[0]).toBeVisible()
        await expect(panels[1]).not.toBeVisible()
        await expect(panels[2]).not.toBeVisible()

        // ARIA linkage
        await expect(tab1).toHaveAttribute('aria-controls', panels[0].getAttribute('id'))

        // Click second tab — panel switches
        await userEvent.click(tab2)
        await expect(tab2).toHaveAttribute('aria-selected', 'true')
        await expect(tab1).toHaveAttribute('aria-selected', 'false')
        await expect(panels[0]).not.toBeVisible()
        await expect(panels[1]).toBeVisible()
    }
}

export const Pill: Story = {
    args: { variant: 'pill' },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const [tab1, tab2] = canvas.getAllByRole('tab')

        await expect(tab1).toHaveAttribute('aria-selected', 'true')

        await userEvent.click(tab2)
        await expect(tab2).toHaveAttribute('aria-selected', 'true')
        await expect(tab1).toHaveAttribute('aria-selected', 'false')
    }
}

export const Contained: Story = {
    args: { variant: 'contained' },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const [tab1, tab2] = canvas.getAllByRole('tab')

        await expect(tab1).toHaveAttribute('aria-selected', 'true')

        await userEvent.click(tab2)
        await expect(tab2).toHaveAttribute('aria-selected', 'true')
        await expect(tab1).toHaveAttribute('aria-selected', 'false')
    }
}

export const WithIcons: Story = {
    render: (args) => ({
        components: { Tabs, TabList, Tab, TabPanel },
        setup() {
            return { args, tabs: makeTabs() }
        },
        template: `
            <Tabs default-value="tab1" :variant="args.variant">
                <TabList label="${faker.lorem.words(2)}">
                    <Tab value="tab1" icon="User">{{ tabs[0].label }}</Tab>
                    <Tab value="tab2" icon="Lock">{{ tabs[1].label }}</Tab>
                    <Tab value="tab3" icon="Bell">{{ tabs[2].label }}</Tab>
                </TabList>
                <TabPanel value="tab1"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">{{ tabs[0].content }}</p></TabPanel>
                <TabPanel value="tab2"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">{{ tabs[1].content }}</p></TabPanel>
                <TabPanel value="tab3"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">{{ tabs[2].content }}</p></TabPanel>
            </Tabs>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const [tab1] = canvas.getAllByRole('tab')

        await expect(tab1).toHaveAttribute('aria-selected', 'true')

        const icon = tab1.querySelector('[aria-hidden="true"]')
        await expect(icon).not.toBeNull()
    }
}

export const WithDisabledTab: Story = {
    render: (args) => ({
        components: { Tabs, TabList, Tab, TabPanel },
        setup() {
            return { args, tabs: makeTabs() }
        },
        template: `
            <Tabs default-value="tab1" :variant="args.variant">
                <TabList label="${faker.lorem.words(2)}">
                    <Tab value="tab1">{{ tabs[0].label }}</Tab>
                    <Tab value="tab2" disabled>{{ tabs[1].label }}</Tab>
                    <Tab value="tab3">{{ tabs[2].label }}</Tab>
                </TabList>
                <TabPanel value="tab1"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">{{ tabs[0].content }}</p></TabPanel>
                <TabPanel value="tab2"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">{{ tabs[1].content }}</p></TabPanel>
                <TabPanel value="tab3"><p class="pt-4 text-sm text-gray-700 dark:text-gray-300">{{ tabs[2].content }}</p></TabPanel>
            </Tabs>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const [tab1, tab2] = canvas.getAllByRole('tab')

        await expect(tab2).toHaveAttribute('aria-disabled', 'true')

        // Clicking a disabled tab should not activate it
        await userEvent.click(tab2)
        await expect(tab1).toHaveAttribute('aria-selected', 'true')
        await expect(tab2).toHaveAttribute('aria-selected', 'false')
    }
}

export const KeyboardNavigation: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        const [tab1, tab2, tab3] = canvas.getAllByRole('tab')

        // Focus first tab and navigate right
        await userEvent.click(tab1)
        await userEvent.keyboard('{ArrowRight}')
        await expect(tab2).toHaveFocus()

        // Navigate right again
        await userEvent.keyboard('{ArrowRight}')
        await expect(tab3).toHaveFocus()

        // Wraps around to first
        await userEvent.keyboard('{ArrowRight}')
        await expect(tab1).toHaveFocus()

        // Home goes to first
        await userEvent.click(tab3)
        await userEvent.keyboard('{Home}')
        await expect(tab1).toHaveFocus()

        // End goes to last
        await userEvent.keyboard('{End}')
        await expect(tab3).toHaveFocus()

        // ArrowLeft wraps to last from first
        await userEvent.click(tab1)
        await userEvent.keyboard('{ArrowLeft}')
        await expect(tab3).toHaveFocus()
    }
}

export const LongContent: Story = {
    render: () => ({
        components: { Tabs, TabList, Tab, TabPanel },
        setup() {
            const tabs = makeTabs(3)
            tabs[0].content = faker.lorem.paragraphs(3)
            return { tabs }
        },
        template: `
            <Tabs default-value="tab1">
                <TabList label="${faker.lorem.words(2)}">
                    <Tab
                        v-for="tab in tabs"
                        :key="tab.value"
                        :value="tab.value"
                    >{{ tab.label }}</Tab>
                </TabList>
                <TabPanel value="tab1">
                    <div class="pt-4 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <p v-for="(p, i) in tabs[0].content.split('\\n\\n')" :key="i">{{ p }}</p>
                    </div>
                </TabPanel>
                <TabPanel
                    v-for="tab in tabs.slice(1)"
                    :key="tab.value"
                    :value="tab.value"
                >
                    <p class="pt-4 text-sm text-gray-700 dark:text-gray-300">{{ tab.content }}</p>
                </TabPanel>
            </Tabs>
        `
    })
}
