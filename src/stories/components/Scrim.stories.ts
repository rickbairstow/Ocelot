import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import Scrim from '@Components/Scrim.vue'
import Button from '@Components/Button.vue'
import { ref } from 'vue'
import { expect, userEvent, within } from 'storybook/test'

const meta: Meta<typeof Scrim> = {
    title: 'Components/Scrim',
    component: Scrim,

    parameters: {
        docs: {
            description: {
                component: 'A semi-transparent overlay that visually blocks content beneath it. Supports absolute (fills a container) and fixed (full-screen) positioning. Can be made clickable to emit a dismiss event for closing panels or modals.'
            }
        }
    },

    argTypes: {
        absolute: {
            control: 'boolean',
            description: 'If true, scrim is positioned absolutely.'
        },
        ariaLabel: {
            control: 'text',
            description: 'Aria label to apply to the scrim.'
        },
        clickable: {
            control: 'boolean',
            description:
                'If true, scrim is interactive and emits a click event.'
        }
    },

    args: {
        absolute: true,
        ariaLabel: 'Dismiss overlay',
        clickable: true
    },

    render: (args) => ({
        components: { Scrim, Button },
        setup() {
            return { args, visible: ref(true) }
        },
        template: `
            <div class="grid max-w-lg gap-4">
                <div class="relative grid h-48 place-items-center overflow-hidden rounded-xl bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                    <p>Page content beneath the overlay</p>
                    <Scrim v-if="visible" v-bind="args" @click="visible = false" />
                </div>
                <div v-if="!visible"><Button @click="visible = true">Show overlay</Button></div>
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

// ✅ Test: scrim emits click when clickable
export const Default: Story = {
    args: {
        clickable: true
    },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const scrim = await canvas.getByRole('button', { name: 'Dismiss overlay' })

        await expect(scrim).not.toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(scrim)
        await expect(canvas.queryByRole('button', { name: 'Dismiss overlay' })).not.toBeInTheDocument()
        await userEvent.click(canvas.getByRole('button', { name: 'Show overlay' }))
        await expect(canvas.getByRole('button', { name: 'Dismiss overlay' })).toBeVisible()
    }
}

// ✅ Test: scrim does not emit click when not clickable
export const NonClickable: Story = {
    args: {
        clickable: false
    },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        // Query by role if clickable, otherwise use a tag selector
        const scrim = canvasElement.querySelector('div.inset-0') as HTMLElement

        await expect(scrim).not.toBeNull()
        await expect(scrim.tagName.toLowerCase()).toBe('div')
        await expect(scrim).toHaveAttribute('aria-hidden', 'true')

        // Click is attempted but should not trigger error
        await userEvent.click(scrim)
    }
}
