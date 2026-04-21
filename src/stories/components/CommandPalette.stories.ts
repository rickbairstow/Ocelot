import type { Meta, StoryObj } from '@storybook/vue3'
import { faker } from '@faker-js/faker'
import { onUnmounted, ref } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import Button from '@Components/Button.vue'
import CommandPalette from '@Components/CommandPalette.vue'
import { useCommandPalette } from '@Composables/useCommandPalette'
import type { CommandPaletteItem } from '@Composables/useCommandPalette'

faker.seed(20260421)

const buildCommands = (result: { value: string }): CommandPaletteItem[] => [
    {
        description: 'Review project health, delivery metrics, and recent activity.',
        group: 'Navigate',
        icon: 'Home',
        id: 'overview',
        keywords: ['dashboard', 'home'],
        onSelect: () => {
            result.value = 'Opened Overview'
        },
        shortcut: 'G O',
        title: 'Overview'
    },
    {
        description: 'Jump into active delivery work and outstanding issues.',
        group: 'Navigate',
        icon: 'FolderOpen',
        id: 'projects',
        keywords: ['work', 'delivery'],
        onSelect: () => {
            result.value = 'Opened Projects'
        },
        shortcut: 'G P',
        title: 'Projects'
    },
    {
        description: 'Adjust workspace permissions, alerts, and defaults.',
        group: 'Navigate',
        icon: 'Settings',
        id: 'settings',
        keywords: ['preferences', 'config'],
        onSelect: () => {
            result.value = 'Opened Settings'
        },
        shortcut: 'G S',
        title: 'Settings'
    },
    {
        description: 'Create a new workspace and invite collaborators.',
        group: 'Actions',
        icon: 'Plus',
        id: 'new-workspace',
        keywords: ['create', 'workspace'],
        onSelect: () => {
            result.value = 'Created a new workspace'
        },
        shortcut: 'N W',
        title: 'New workspace'
    },
    {
        description: 'Search every task, file, and comment in one place.',
        group: 'Actions',
        icon: 'Search',
        id: 'search-everything',
        keywords: ['find', 'tasks', 'files'],
        onSelect: () => {
            result.value = 'Opened global search'
        },
        shortcut: '/',
        title: 'Search everything'
    },
    {
        description: 'Billing details are controlled by your organization owner.',
        disabled: true,
        group: 'Actions',
        id: 'billing',
        keywords: ['payments', 'subscription'],
        shortcut: 'B I',
        title: 'Open billing'
    }
]

const meta: Meta<typeof CommandPalette> = {
    title: 'Components/CommandPalette',
    component: CommandPalette,
    parameters: {
        docs: {
            description: {
                component: 'A global search overlay for navigating actions and destinations. Use the `useCommandPalette()` composable to register commands from routes or views, and mount a single `CommandPalette` instance near the app root.'
            }
        }
    },
    argTypes: {
        emptyText: {
            control: 'text',
            description: 'Message shown when no command matches the current search.'
        },
        listenForShortcut: {
            control: 'boolean',
            description: 'Enables the built-in Ctrl/Cmd+K keyboard shortcut listener.'
        },
        placeholder: {
            control: 'text',
            description: 'Search input placeholder text.'
        }
    },
    args: {
        emptyText: 'No commands found.',
        listenForShortcut: true,
        placeholder: 'Search commands…'
    }
}

export default meta
type Story = StoryObj<typeof meta>

const createRender = (itemsFactory?: (result: { value: string }) => CommandPaletteItem[]) => (args: Story['args']) => ({
    components: { Button, CommandPalette },
    setup() {
        const commandPalette = useCommandPalette()
        const result = ref('Nothing selected yet')

        commandPalette.clearRegistry()

        const unregister = commandPalette.register(
            itemsFactory ? itemsFactory(result) : buildCommands(result),
            'storybook-command-palette'
        )

        const openPalette = () => commandPalette.open()

        onUnmounted(() => {
            unregister()
            commandPalette.close()
            commandPalette.clearRegistry()
        })

        return {
            args,
            openPalette,
            result
        }
    },
    template: `
        <div id="portal-target"></div>

        <div class="space-y-4 p-4 sm:p-6">
            <Button id="commandPaletteTrigger" @click="openPalette">
                Open command palette
            </Button>

            <p class="text-sm text-gray-600 dark:text-gray-300" data-testid="result">
                {{ result }}
            </p>
        </div>

        <CommandPalette v-bind="args" />
    `
})

export const Default: Story = {
    render: createRender(),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: /open command palette/i }))

        const dialog = await canvas.findByRole('dialog', { name: /command palette/i })
        await waitFor(() => expect(dialog).toBeVisible())

        await expect(canvas.getByRole('option', { name: /overview/i })).toBeVisible()
        await expect(canvas.getByText('Navigate')).toBeVisible()
        await expect(canvas.getByText('Actions')).toBeVisible()

        await userEvent.keyboard('{Escape}')
        await waitFor(() => expect(canvas.queryByRole('dialog', { name: /command palette/i })).not.toBeInTheDocument())
    }
}

export const WithIconsAndShortcuts: Story = {
    name: 'With Icons and Shortcuts',
    render: createRender(),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: /open command palette/i }))

        const dialog = await canvas.findByRole('dialog', { name: /command palette/i })
        const palette = within(dialog)
        const overviewOption = palette.getByRole('option', { name: /overview/i })
        const searchOption = palette.getByRole('option', { name: /search everything/i })

        await expect(within(overviewOption).getByText('G O')).toBeInTheDocument()
        await expect(within(searchOption).getByText('/')).toBeInTheDocument()
        await expect(searchOption).toBeInTheDocument()
    }
}

export const EmptyState: Story = {
    render: createRender(),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: /open command palette/i }))

        const dialog = await canvas.findByRole('dialog', { name: /command palette/i })
        const palette = within(dialog)
        const search = await palette.findByRole('combobox')
        await userEvent.type(search, 'zzzz')

        await expect(palette.getByText(/no commands found/i)).toBeInTheDocument()
    }
}

export const KeyboardNavigation: Story = {
    render: createRender(),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await userEvent.click(canvas.getByRole('button', { name: /open command palette/i }))

        await canvas.findByRole('combobox')
        await userEvent.keyboard('{ArrowDown}{Enter}')

        await waitFor(() => expect(canvas.queryByRole('dialog', { name: /command palette/i })).not.toBeInTheDocument())
        await expect(canvas.getByTestId('result')).toHaveTextContent('Opened Projects')
    }
}
