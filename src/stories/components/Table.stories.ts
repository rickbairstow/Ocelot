import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { faker } from '@faker-js/faker'
import { createColumnHelper } from '@tanstack/vue-table'
import Button from '@Components/Button.vue'
import EmptyState from '@Components/EmptyState.vue'
import Table from '@Components/Table.vue'

interface UserRecord {
    email: string
    id: string
    name: string
    orders: number
    role: string
    team: string
}

faker.seed(20260420)

const teams = ['Platform', 'Design', 'Operations', 'Marketing', 'Insights', 'Support'] as const
const roles = [
    'Engineering Manager',
    'Product Designer',
    'Frontend Engineer',
    'UX Researcher',
    'Support Lead',
    'Growth Marketer',
    'Data Analyst',
    'Content Strategist',
    'Customer Success Manager',
    'Solutions Engineer',
    'Brand Strategist',
    'QA Analyst'
] as const

const createUserRecord = (index: number, overrides: Partial<UserRecord> = {}): UserRecord => {
    const firstName = faker.person.firstName()
    const lastName = faker.person.lastName()

    return {
        email: faker.internet.email({ firstName, lastName, provider: 'ocelotui.dev' }).toLowerCase(),
        id: `u-${String(index + 101).padStart(3, '0')}`,
        name: `${firstName} ${lastName}`,
        orders: faker.number.int({ min: 4, max: 48 }),
        role: faker.helpers.arrayElement(roles),
        team: faker.helpers.arrayElement(teams),
        ...overrides
    }
}

const users: UserRecord[] = Array.from({ length: 50 }, (_, index) => createUserRecord(index))

const usersSortedByName = [...users].sort((left, right) => left.name.localeCompare(right.name))

const columnHelper = createColumnHelper<UserRecord>()

const columns = [
    columnHelper.accessor('name', {
        cell: info => info.getValue(),
        enableSorting: true,
        header: 'Name',
        meta: {
            cardLabel: 'Name',
            label: 'Name'
        }
    }),
    columnHelper.accessor('email', {
        cell: info => info.getValue(),
        enableSorting: true,
        header: 'Email',
        meta: {
            cardLabel: 'Email',
            label: 'Email'
        }
    }),
    columnHelper.accessor('role', {
        cell: info => info.getValue(),
        enableSorting: true,
        header: 'Role',
        meta: {
            cardLabel: 'Role',
            label: 'Role'
        }
    }),
    columnHelper.accessor('team', {
        cell: info => info.getValue(),
        enableSorting: true,
        header: 'Team',
        meta: {
            cardLabel: 'Team',
            label: 'Team'
        }
    }),
    columnHelper.accessor('orders', {
        cell: info => `${info.getValue()} orders`,
        enableSorting: true,
        header: 'Orders',
        meta: {
            cardLabel: 'Orders',
            label: 'Orders'
        }
    })
]

const meta: Meta<typeof Table> = {
    title: 'Components/Table',
    component: Table,
    argTypes: {
        mobileLayout: {
            control: 'inline-radio',
            description: 'Controls how the table behaves on small screens: keep horizontal scrolling or switch rows into stacked cards.',
            options: ['scroll', 'card']
        },
        size: {
            control: 'inline-radio',
            description: 'Adjusts table density for headers and body cells.',
            options: ['sm', 'md', 'lg']
        }
    },
    args: {
        caption: 'Customer success roster',
        columns,
        data: users,
        hoverable: true,
        pageSize: 10,
        pagination: true,
        striped: true
    },
    parameters: {
        docs: {
            description: {
                component: 'A TanStack-powered data table with optional search, sorting, pagination, row selection, column visibility, resizing, pinned columns, expandable rows, and an optional mobile card layout.'
            }
        }
    }
}

meta.render = (args) => ({
    components: { Table },
    setup() {
        return { args }
    },
    template: '<Table v-bind="args" />'
})

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    args: {
        columnVisibility: true,
        columnSizing: {
            email: 260,
            name: 220,
            orders: 140,
            role: 220
        },
        globalFilter: true,
        stickyHeader: true
    },
    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await waitFor(() => expect(canvas.getByRole('table')).toBeVisible())
        await userEvent.click(canvas.getByRole('button', { name: /settings/i }))
        await userEvent.click(canvas.getByRole('button', { name: 'Small' }))
        await waitFor(() => expect(canvas.getByRole('button', { name: 'Small' })).toHaveAttribute('aria-pressed', 'true'))
        await userEvent.click(canvas.getByRole('button', { name: /settings/i }))

        const nameHeader = canvas.getByRole('button', { name: /^name$/i })
        await userEvent.click(nameHeader)

        const nameColumnHeader = canvas.getByRole('columnheader', { name: /name/i })
        await waitFor(() => expect(nameColumnHeader).toHaveAttribute('aria-sort', 'ascending'))
        await waitFor(() => expect(canvas.getByText(usersSortedByName[0].name)).toBeVisible())

        await userEvent.clear(canvas.getByRole('searchbox', { name: /search rows/i }))
        await userEvent.type(canvas.getByRole('searchbox', { name: /search rows/i }), 'design')

        await waitFor(() => expect(canvas.getByText(users[1].name)).toBeVisible())
        await waitFor(() => expect(canvas.getByText(users[3].name)).toBeVisible())
        await waitFor(() => expect(canvas.queryByText(users[2].name)).not.toBeInTheDocument())

        await userEvent.clear(canvas.getByRole('searchbox', { name: /search rows/i }))
        await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
        await waitFor(() => expect(canvas.getByText(users[10].name)).toBeVisible())
    }
}

export const AllFunctionality: Story = {
    args: {
        columnSizing: {
            email: 260,
            name: 220,
            orders: 140,
            role: 220
        },
        columnVisibility: true,
        expandableRows: true,
        globalFilter: true,
        pinnedColumns: {
            left: [],
            right: []
        },
        resizableColumns: true,
        rowSelection: 'multi',
        stickyHeader: true
    },
    render: (args) => ({
        components: { Button, Table },
        setup() {
            return { args }
        },
        template: `
            <div class="rounded-2xl p-2 sm:p-3">
                <Table v-bind="args">
                    <template #row-actions="{ row }">
                        <Button
                            class="w-full"
                            size="small"
                            variant="secondary"
                        >
                            View {{ row.original.name }}
                        </Button>
                    </template>

                    <template #row-expanded="{ row }">
                        <div class="space-y-3">
                            <div>
                                <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {{ row.original.name }} is leading {{ row.original.team }}
                                </p>
                                <p class="text-sm text-gray-600 dark:text-gray-300">
                                    {{ row.original.name }} has processed {{ row.original.orders }} recent orders and is one of the main contacts for the {{ row.original.role }} track.
                                </p>
                            </div>

                            <div class="flex flex-wrap gap-2">
                                <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
                                    {{ row.original.team }}
                                </span>
                                <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                    {{ row.original.role }}
                                </span>
                            </div>
                        </div>
                    </template>
                </Table>
            </div>
        `
    }),
    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await waitFor(() => expect(canvas.getByRole('table')).toBeVisible())
        await userEvent.click(canvas.getByRole('button', { name: /settings/i }))
        await userEvent.click(canvas.getByRole('button', { name: 'Small' }))
        await waitFor(() => expect(canvas.getByRole('button', { name: 'Small' })).toHaveAttribute('aria-pressed', 'true'))
        await userEvent.click(canvas.getByRole('button', { name: /settings/i }))

        await expect(canvas.getByRole('button', { name: new RegExp(`view ${users[0].name}`, 'i') })).toBeVisible()

        const nameHeader = canvas.getByRole('button', { name: /^name$/i })
        await userEvent.click(nameHeader)

        const nameColumnHeader = canvas.getByRole('columnheader', { name: /name/i })
        await waitFor(() => expect(nameColumnHeader).toHaveAttribute('aria-sort', 'ascending'))
        await waitFor(() => expect(canvas.getByText(usersSortedByName[0].name)).toBeVisible())

        await userEvent.clear(canvas.getByRole('searchbox', { name: /search rows/i }))
        await userEvent.type(canvas.getByRole('searchbox', { name: /search rows/i }), 'design')

        await waitFor(() => expect(canvas.getByText(users[1].name)).toBeVisible())
        await waitFor(() => expect(canvas.getByText(users[3].name)).toBeVisible())
        await waitFor(() => expect(canvas.queryByText(users[2].name)).not.toBeInTheDocument())

        await userEvent.clear(canvas.getByRole('searchbox', { name: /search rows/i }))

        await waitFor(() => expect(canvas.getAllByRole('checkbox').length).toBeGreaterThan(1))
        const checkboxes = canvas.getAllByRole('checkbox')

        await userEvent.click(checkboxes[1])
        await expect(checkboxes[1]).toBeChecked()
    }
}

export const WithPagination: Story = {
    args: {
        pageSize: 5
    },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await waitFor(() => expect(canvas.getByRole('table')).toBeVisible())
        await expect(canvas.getByText(users[0].name)).toBeVisible()
        await expect(canvas.queryByText(users[5].name)).not.toBeInTheDocument()

        await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))

        await waitFor(() => expect(canvas.getByText(users[5].name)).toBeVisible())
        await waitFor(() => expect(canvas.getByText(users[9].name)).toBeVisible())
        await waitFor(() => expect(canvas.getByText(/Showing 6-10 of 50 rows/)).toBeVisible())
    }
}

export const WithColumnVisibility: Story = {
    args: {
        columnVisibility: true,
        columnVisibilityState: {
            team: true
        }
    },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await waitFor(() => expect(canvas.getByRole('button', { name: /settings/i })).toBeVisible())
        await userEvent.click(canvas.getByRole('button', { name: /settings/i }))
        await userEvent.click(canvas.getByRole('checkbox', { name: 'Email' }))

        await waitFor(() => expect(canvas.queryByRole('columnheader', { name: /email/i })).not.toBeInTheDocument())

        await userEvent.click(canvas.getByRole('checkbox', { name: 'Email' }))
        await waitFor(() => expect(canvas.getByRole('columnheader', { name: /email/i })).toBeVisible())
    }
}

export const WithColumnPinningControls: Story = {
    args: {
        columnVisibility: true
    },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await waitFor(() => expect(canvas.getByRole('button', { name: /settings/i })).toBeVisible())
        await userEvent.click(canvas.getByRole('button', { name: /settings/i }))
        await userEvent.click(canvas.getByRole('button', { name: 'Pin Email left' }))

        await waitFor(() => expect(canvas.getByRole('button', { name: 'Pin Email left' })).toHaveAttribute('aria-pressed', 'true'))
        await waitFor(() => {
            const columnHeaders = canvas.getAllByRole('columnheader')
            expect(within(columnHeaders[0]).getByRole('button', { name: /email/i })).toBeVisible()
        })

        await userEvent.click(canvas.getByRole('button', { name: 'Unpin Email' }))
        await waitFor(() => expect(canvas.getByRole('button', { name: 'Unpin Email' })).toHaveAttribute('aria-pressed', 'true'))
    }
}

export const StickyPinnedAndResizable: Story = {
    args: {
        columnSizing: {
            email: 260,
            name: 220,
            orders: 140,
            role: 220
        },
        columnVisibility: true,
        pinnedColumns: {
            left: ['name'],
            right: ['orders']
        },
        resizableColumns: true,
        stickyHeader: true
    },
    render: (args) => ({
        components: { Table },
        setup() {
            return { args }
        },
        template: `
            <div class="rounded-2xl p-2 sm:p-3">
                <Table v-bind="args" />
            </div>
        `
    })
}

export const ExpandableRows: Story = {
    args: {
        expandableRows: true,
        pinnedColumns: {
            left: ['__expander', 'name']
        }
    },
    render: (args) => ({
        components: { Table },
        setup() {
            return { args }
        },
        template: `
            <Table v-bind="args">
                <template #row-expanded="{ row }">
                    <div class="space-y-3">
                        <div>
                            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                ${'{{ row.original.name }}'} is leading ${'{{ row.original.team }}'}
                            </p>
                            <p class="text-sm text-gray-600 dark:text-gray-300">
                                ${'{{ row.original.name }}'} has processed ${'{{ row.original.orders }}'} recent orders and is one of the main contacts for the ${'{{ row.original.role }}'} track.
                            </p>
                        </div>

                        <div class="flex flex-wrap gap-2">
                            <span class="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/50 dark:text-blue-200">
                                ${'{{ row.original.team }}'}
                            </span>
                            <span class="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-200">
                                ${'{{ row.original.role }}'}
                            </span>
                        </div>
                    </div>
                </template>
            </Table>
        `
    }),
    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await waitFor(() => expect(canvas.getByRole('table')).toBeVisible())
        await userEvent.click(canvas.getAllByRole('button', { name: /expand row/i })[0])

        await waitFor(() => expect(canvas.getByText(new RegExp(`is leading ${users[0].team}`, 'i'))).toBeVisible())
    }
}

export const HiddenColumnsPreset: Story = {
    args: {
        columnVisibility: true,
        columnVisibilityState: {
            email: false,
            team: false
        }
    },
    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await waitFor(() => expect(canvas.getByRole('table')).toBeVisible())
        await expect(canvas.queryByRole('columnheader', { name: /email/i })).not.toBeInTheDocument()
        await expect(canvas.queryByRole('columnheader', { name: /team/i })).not.toBeInTheDocument()
    }
}

export const LoadingState: Story = {
    args: {
        loading: true
    }
}

export const EmptyStateSlot: Story = {
    args: {
        data: []
    },
    render: (args) => ({
        components: { EmptyState, Table },
        setup() {
            return { args }
        },
        template: `
            <Table v-bind="args">
                <template #empty>
                    <EmptyState
                        description="Create a customer profile to start tracking activity."
                        icon="Table"
                        title="No customers yet"
                        title-tag="h2"
                    />
                </template>
            </Table>
        `
    })
}

export const ResponsiveCardsMobile: Story = {
    args: {
        globalFilter: true,
        mobileLayout: 'card'
    },
    parameters: {
        docs: {
            story: {
                name: 'Responsive Cards (Mobile)'
            }
        },
        viewport: {
            defaultViewport: 'mobile1'
        }
    }
}
