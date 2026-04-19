import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref } from 'vue'
import Switch from '@Components/Switch.vue'
import FormField from '@Components/FormField.vue'

const meta: Meta<typeof Switch> = {
    title: 'Components/Form Fields/Switch',
    component: Switch,
    parameters: {
        docs: {
            description: {
                component: 'A toggle switch backed by a native checkbox with role="switch". The sr-only checkbox handles keyboard navigation and form serialisation; the visual track/thumb are styled via Tailwind peer utilities.'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof Switch>

export const Default: Story = {
    render: () => ({
        components: { Switch },
        setup() { return { enabled: ref(false) } },
        template: '<Switch v-model="enabled" label="Email notifications" name="notifications" />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const switchEl = canvas.getByRole('switch')
        await expect(switchEl).not.toBeChecked()
        // Click the visible label to toggle
        const label = canvas.getByText('Email notifications')
        await userEvent.click(label)
        await expect(switchEl).toBeChecked()
    }
}

export const Enabled: Story = {
    render: () => ({
        components: { Switch },
        setup() { return { enabled: ref(true) } },
        template: '<Switch v-model="enabled" label="Dark mode" name="dark-mode" />'
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('switch')).toBeChecked()
    }
}

export const Disabled: Story = {
    render: () => ({
        components: { Switch },
        setup() { return { enabled: ref(false) } },
        template: '<Switch v-model="enabled" disabled label="Unavailable option" name="unavailable" />'
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('switch')).toBeDisabled()
    }
}

export const NoLabel: Story = {
    render: () => ({
        components: { Switch },
        setup() { return { enabled: ref(false) } },
        template: '<Switch v-model="enabled" aria-label="Toggle dark mode" name="toggle" />'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const switchEl = canvas.getByRole('switch')
        await expect(switchEl).toHaveAttribute('aria-label', 'Toggle dark mode')
        const track = canvasElement.querySelector('div[aria-hidden="true"]') as HTMLElement
        await userEvent.click(track)
        await expect(switchEl).toBeChecked()
    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Switch, FormField },
        setup() { return { enabled: ref(false) } },
        template: `
            <FormField hint="You can change this at any time in settings.">
                <Switch v-model="enabled" label="Marketing emails" name="marketing" />
            </FormField>
        `
    }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('You can change this at any time in settings.')).toBeInTheDocument()
    }
}

export const SettingsPanel: Story = {
    render: () => ({
        components: { Switch },
        setup() {
            return {
                notifications: ref(true),
                marketing: ref(false),
                updates: ref(true)
            }
        },
        template: `
            <div class="flex flex-col gap-4 max-w-sm">
                <Switch v-model="notifications" label="Push notifications" name="push" />
                <Switch v-model="marketing" label="Marketing emails" name="marketing" />
                <Switch v-model="updates" label="Product updates" name="updates" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const switches = canvas.getAllByRole('switch')
        await expect(switches).toHaveLength(3)
        await expect(switches[0]).toBeChecked()
        await expect(switches[1]).not.toBeChecked()
        await expect(switches[2]).toBeChecked()
    }
}
