import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import Badge from '@Components/Badge.vue'
import Banner from '@Components/Banner.vue'
import Button from '@Components/Button.vue'
import Card from '@Components/Card.vue'
import Checkbox from '@Components/Checkbox.vue'
import FormField from '@Components/FormField.vue'
import Input from '@Components/Input.vue'
import NavigationBar from '@Components/NavigationBar.vue'
import Progress from '@Components/Progress.vue'
import Select from '@Components/Select.vue'
import StatCard from '@Components/StatCard.vue'
import Switch from '@Components/Switch.vue'
import Textarea from '@Components/Textarea.vue'

const meta: Meta = {
    title: 'Patterns/Dark Mode Coverage',
    parameters: {
        docs: {
            description: {
                component: 'Forced-dark smoke test for common surfaces, form fields, status colours, and navigation. This catches obvious dark-mode contrast regressions in automated Storybook tests.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const CommonSurfaces: Story = {
    render: () => ({
        components: {
            Badge,
            Banner,
            Button,
            Card,
            Checkbox,
            FormField,
            Input,
            NavigationBar,
            Progress,
            Select,
            StatCard,
            Switch,
            Textarea
        },
        setup() {
            const selectOptions = [
                { label: 'Weekly', value: 'weekly' },
                { label: 'Monthly', value: 'monthly' }
            ]

            return { selectOptions }
        },
        template: `
            <div class="dark min-h-screen bg-gray-950 p-6 text-gray-50">
                <NavigationBar show-menu-toggle>
                    <template #brand>
                        <p class="text-sm font-semibold text-gray-50">Ocelot Dark QA</p>
                    </template>

                    <template #nav>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-800" aria-current="page">Overview</a>
                        <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-800">Reports</a>
                    </template>

                    <template #mobile-menu>
                        <nav aria-label="Dark mobile navigation" class="grid gap-1">
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-800">Overview</a>
                            <a href="#" class="rounded-lg px-3 py-2 text-sm font-medium hover:bg-gray-800">Reports</a>
                        </nav>
                    </template>
                </NavigationBar>

                <main class="mx-auto mt-6 grid max-w-5xl gap-6">
                    <Banner title="Dark mode check" type="info">
                        This story renders inside a forced <code class="rounded bg-gray-800 px-1 py-0.5 text-xs text-gray-100">dark</code> container.
                    </Banner>

                    <section aria-label="Dark metrics" class="grid gap-4 md:grid-cols-3">
                        <StatCard color="blue" description="passing today" icon="ChartBar" label="Stories" :trend="4" value="291" />
                        <StatCard color="green" description="current branch" icon="ShieldCheck" label="A11y" :trend="1" value="Clean" />
                        <StatCard color="pink" description="documented" icon="Palette" label="Themes" :trend="2" value="Dark" />
                    </section>

                    <Card class="w-full" title="Form controls" variant="bordered" vertical>
                        <template #content>
                            <div class="grid gap-4 md:grid-cols-2">
                                <FormField hint="Linked hint remains readable." label="Email">
                                    <Input model-value="" name="dark-email" placeholder="person@example.com" type="email" />
                                </FormField>

                                <FormField label="Cadence">
                                    <Select model-value="weekly" name="dark-cadence" :options="selectOptions" />
                                </FormField>

                                <FormField error="This message has enough contrast." label="Notes">
                                    <Textarea model-value="" name="dark-notes" placeholder="Add context..." />
                                </FormField>

                                <div class="grid content-start gap-3">
                                    <Checkbox label="Receive release notes" name="dark-checkbox" />
                                    <Switch label="Enable dark theme" name="dark-switch" model-value />
                                    <Progress label="Coverage" show-value :value="86" />
                                </div>
                            </div>
                        </template>

                        <template #actions>
                            <div class="flex flex-wrap gap-2">
                                <Badge color="green" size="sm">Accessible</Badge>
                                <Badge color="purple" size="sm">Dark</Badge>
                                <Button color="blue" variant="primary">Save</Button>
                            </div>
                        </template>
                    </Card>
                </main>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        await expect(canvasElement.querySelector('.dark')).not.toBeNull()
        await expect(canvas.getByText('Dark mode check')).toBeVisible()
        await expect(canvas.getByRole('textbox', { name: /email/i })).toBeVisible()
        await expect(canvas.getByRole('progressbar', { name: /coverage/i })).toHaveAttribute('aria-valuenow', '86')
    }
}
