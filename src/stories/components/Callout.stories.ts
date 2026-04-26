import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import Callout from '@Components/Callout.vue'

const meta: Meta<typeof Callout> = {
    title: 'Components/Callout',
    component: Callout,
    parameters: {
        docs: {
            description: {
                component: 'Editorial callout for documentation, guidance, and contextual notes. Use Banner for dismissible page notices or dynamic alerts; use Callout for static content that should read as part of the page.'
            }
        }
    },
    argTypes: {
        role: {
            control: 'select',
            options: ['note', 'status']
        },
        type: {
            control: 'select',
            options: ['info', 'success', 'warning', 'danger', 'tip', 'note']
        }
    },
    args: {
        role: 'note',
        title: 'Heads up',
        type: 'info'
    },
    render: (args) => ({
        components: { Callout },
        setup() {
            return { args }
        },
        template: `
            <Callout v-bind="args">
                This guidance is part of the surrounding content, not a transient system alert.
            </Callout>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByRole('note')).toBeVisible()
        await expect(canvas.getByText('Heads up')).toBeVisible()
    }
}

export const AllTypes: Story = {
    render: () => ({
        components: { Callout },
        template: `
            <div class="grid gap-3">
                <Callout title="Info" type="info">Neutral information for the current section.</Callout>
                <Callout title="Tip" type="tip">Helpful guidance without alert urgency.</Callout>
                <Callout title="Success" type="success">A positive contextual note.</Callout>
                <Callout title="Warning" type="warning">Something worth checking before continuing.</Callout>
                <Callout title="Danger" type="danger" role="status">High-risk static guidance.</Callout>
                <Callout title="Note" type="note">General editorial context.</Callout>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Tip')).toBeVisible()
        await expect(canvas.getByRole('status')).toBeVisible()
    }
}
