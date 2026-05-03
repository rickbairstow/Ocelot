import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import Badge from '@Components/Badge.vue'
import Banner from '@Components/Banner.vue'
import Button from '@Components/Button.vue'
import Card from '@Components/Card.vue'
import NavigationBar from '@Components/NavigationBar.vue'
import Progress from '@Components/Progress.vue'
import StatCard from '@Components/StatCard.vue'
import Stepper from '@Components/Stepper.vue'

const meta: Meta = {
    title: 'Patterns/Product Screens',
    parameters: {
        docs: {
            description: {
                component: 'Realistic OUI compositions for common product surfaces. These examples demonstrate how primitives combine into app screens without requiring extra one-off components.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {
    render: () => ({
        components: { Badge, Banner, Button, Card, NavigationBar, Progress, StatCard },
        template: `
            <div class="min-h-screen bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-50">
                <NavigationBar show-menu-toggle>
                    <template #brand>
                        <p class="text-sm font-semibold">Ocelot Ops</p>
                    </template>

                    <template #nav>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" aria-current="page">Dashboard</a>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Reports</a>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Automations</a>
                    </template>

                    <template #mobile-menu>
                        <nav aria-label="Mobile dashboard navigation" class="grid gap-1">
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800" aria-current="page">Dashboard</a>
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Reports</a>
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-800">Automations</a>
                        </nav>
                    </template>

                    <template #actions>
                        <Button color="blue" icon="Plus" variant="primary">New report</Button>
                    </template>
                </NavigationBar>

                <main class="mx-auto grid max-w-6xl gap-6 px-4 py-6 sm:px-6">
                    <Banner title="Pipeline health" type="success">
                        All critical jobs completed in the last hour. Two low-priority exports are queued.
                    </Banner>

                    <section aria-label="Key metrics" class="grid gap-4 md:grid-cols-3">
                        <StatCard color="blue" description="vs last week" icon="ChartBar" label="Revenue" :trend="8" value="$128.4k" />
                        <StatCard color="teal" description="active this hour" icon="User" label="Operators" :trend="3" value="42" />
                        <StatCard color="orange" description="needs review" icon="AlertTriangle" label="Exceptions" :trend="-12" value="7" />
                    </section>

                    <section class="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
                        <Card class="w-full" title="Deployment readiness" variant="bordered" vertical>
                            <template #content>
                                <div class="grid gap-4">
                                    <Progress label="Checklist complete" show-value :value="78" />
                                    <div class="flex flex-wrap gap-2">
                                        <Badge color="green" size="sm">Tests passing</Badge>
                                        <Badge color="orange" size="sm">Audit pending</Badge>
                                        <Badge color="blue" size="sm">Release notes drafted</Badge>
                                    </div>
                                </div>
                            </template>
                            <template #actions>
                                <Button color="gray" variant="secondary">Review release</Button>
                            </template>
                        </Card>

                        <Card class="w-full" title="Today" variant="bordered" vertical>
                            <template #content>
                                <ul class="grid gap-3 text-sm">
                                    <li class="flex items-center justify-between gap-3">
                                        <span>Incident review</span>
                                        <Badge color="red" size="sm">15:00</Badge>
                                    </li>
                                    <li class="flex items-center justify-between gap-3">
                                        <span>Design QA</span>
                                        <Badge color="purple" size="sm">16:30</Badge>
                                    </li>
                                </ul>
                            </template>
                        </Card>
                    </section>
                </main>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await expect(canvas.getByRole('navigation', { name: /primary navigation/i })).toBeVisible()
        await expect(canvas.getByText('Pipeline health')).toBeVisible()
        await expect(canvas.getByRole('progressbar', { name: /checklist complete/i })).toHaveAttribute('aria-valuenow', '78')
    }
}

export const Settings: Story = {
    render: () => ({
        components: { Banner, Button, Card },
        template: `
            <main class="mx-auto grid max-w-4xl gap-6 bg-white p-6 text-gray-950 dark:bg-gray-950 dark:text-gray-50">
                <header>
                    <h1 class="text-2xl font-semibold">Workspace settings</h1>
                    <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Manage access, billing, and release controls for the operations workspace.</p>
                </header>

                <Banner title="Two-factor authentication recommended" type="warning">
                    Require 2FA before inviting additional administrators.
                </Banner>

                <section class="grid gap-4">
                    <Card class="w-full" title="Team access" variant="bordered" vertical>
                        <template #content>
                            <div class="grid gap-4 md:grid-cols-2">
                                <label class="grid gap-1 text-sm font-medium">
                                    Workspace name
                                    <input class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900" value="Ocelot Ops" />
                                </label>
                                <label class="grid gap-1 text-sm font-medium">
                                    Default role
                                    <select class="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">
                                        <option>Editor</option>
                                        <option>Viewer</option>
                                    </select>
                                </label>
                            </div>
                        </template>
                        <template #actions>
                            <Button color="blue" variant="primary">Save settings</Button>
                        </template>
                    </Card>
                </section>
            </main>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await expect(canvas.getByRole('heading', { name: /workspace settings/i })).toBeVisible()
        await expect(canvas.getByRole('button', { name: /save settings/i })).toBeVisible()
    }
}

export const DataList: Story = {
    render: () => ({
        components: { Badge, Button },
        template: `
            <main class="mx-auto max-w-5xl bg-white p-6 text-gray-950 dark:bg-gray-950 dark:text-gray-50">
                <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                        <h1 class="text-xl font-semibold">Deployments</h1>
                        <p class="text-sm text-gray-500 dark:text-gray-400">Recent release activity across production services.</p>
                    </div>
                    <Button color="blue" icon="Refresh" variant="secondary">Refresh</Button>
                </div>

                <div class="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
                    <table class="w-full text-left text-sm">
                        <thead class="bg-gray-50 text-xs uppercase text-gray-500 dark:bg-gray-900 dark:text-gray-400">
                            <tr>
                                <th class="px-4 py-3">Service</th>
                                <th class="px-4 py-3">Status</th>
                                <th class="px-4 py-3">Owner</th>
                                <th class="px-4 py-3">Updated</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                            <tr>
                                <td class="px-4 py-3 font-medium">Checkout</td>
                                <td class="px-4 py-3"><Badge color="green" size="sm">Live</Badge></td>
                                <td class="px-4 py-3">Payments</td>
                                <td class="px-4 py-3">4 minutes ago</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">Search</td>
                                <td class="px-4 py-3"><Badge color="orange" size="sm">Review</Badge></td>
                                <td class="px-4 py-3">Platform</td>
                                <td class="px-4 py-3">21 minutes ago</td>
                            </tr>
                            <tr>
                                <td class="px-4 py-3 font-medium">Billing</td>
                                <td class="px-4 py-3"><Badge color="blue" size="sm">Queued</Badge></td>
                                <td class="px-4 py-3">Finance</td>
                                <td class="px-4 py-3">1 hour ago</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </main>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await expect(canvas.getByRole('table')).toBeVisible()
        await expect(canvas.getByText('Checkout')).toBeVisible()
    }
}

export const Onboarding: Story = {
    render: () => ({
        components: { Banner, Button, Card, Stepper },
        setup() {
            const steps = [
                { title: 'Create workspace', description: 'Name and region' },
                { title: 'Invite team', description: 'Admins and editors' },
                { title: 'Connect data', description: 'Warehouse and events' },
                { title: 'Launch', description: 'Review and publish' }
            ]

            return { steps }
        },
        template: `
            <main class="mx-auto grid max-w-4xl gap-6 bg-gray-50 p-6 text-gray-950 dark:bg-gray-950 dark:text-gray-50">
                <Stepper aria-label="Onboarding steps" :model-value="2" :steps="steps" />

                <Card class="w-full" title="Invite your team" variant="bordered" vertical>
                    <template #content>
                        <div class="grid gap-4">
                            <Banner title="Recommended" type="note">
                                Add at least one backup administrator before connecting production data.
                            </Banner>
                            <label class="grid gap-1 text-sm font-medium">
                                Email addresses
                                <textarea class="min-h-28 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900">ava@example.com
noah@example.com</textarea>
                            </label>
                        </div>
                    </template>
                    <template #actions>
                        <Button color="gray" variant="secondary">Back</Button>
                        <Button color="blue" variant="primary">Continue</Button>
                    </template>
                </Card>
            </main>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await expect(canvas.getByRole('list', { name: /onboarding steps/i })).toBeVisible()
        await expect(canvas.getByText('Invite your team')).toBeVisible()
    }
}

export const Marketing: Story = {
    render: () => ({
        components: { Badge, Button, Card },
        template: `
            <main class="bg-white text-gray-950 dark:bg-gray-950 dark:text-gray-50">
                <section class="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
                    <div>
                        <Badge color="teal" size="sm">Ocelot UI patterns</Badge>
                        <h1 class="mt-4 max-w-2xl text-4xl font-semibold tracking-normal">Build operational interfaces with fewer bespoke decisions.</h1>
                        <p class="mt-4 max-w-xl text-base text-gray-600 dark:text-gray-300">
                            Compose dashboards, alerts, onboarding flows, and data reviews from the same accessible primitives.
                        </p>
                        <div class="mt-6 flex flex-wrap gap-3">
                            <Button color="blue" variant="primary">View components</Button>
                            <Button color="gray" variant="secondary">Read docs</Button>
                        </div>
                    </div>

                    <Card class="w-full" title="Release readiness" variant="bordered" vertical>
                        <template #content>
                            <div class="grid gap-3 text-sm">
                                <div class="flex items-center justify-between gap-3">
                                    <span>Accessibility checks</span>
                                    <Badge color="green" size="sm">Passed</Badge>
                                </div>
                                <div class="flex items-center justify-between gap-3">
                                    <span>Bundle audit</span>
                                    <Badge color="blue" size="sm">Ready</Badge>
                                </div>
                                <div class="flex items-center justify-between gap-3">
                                    <span>Story coverage</span>
                                    <Badge color="orange" size="sm">Reviewing</Badge>
                                </div>
                            </div>
                        </template>
                    </Card>
                </section>
            </main>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await expect(canvas.getByRole('heading', { name: /build operational interfaces/i })).toBeVisible()
        await expect(canvas.getByRole('button', { name: /view components/i })).toBeVisible()
    }
}
