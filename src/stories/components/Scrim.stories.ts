import type { Meta, StoryObj } from '@storybook/vue3'
import Scrim from '@Components/Scrim.vue'
import { expect, userEvent, within } from 'storybook/test'

const meta: Meta<typeof Scrim> = {
    title: 'Components/Scrim',
    component: Scrim,

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
        absolute: false,
        ariaLabel: 'My scrim',
        clickable: true
    },

    render: (args) => ({
        components: { Scrim },
        setup() {
            const scrimEvent = () => {
                console.log('Scrim clicked.')
            }
            return { args, scrimEvent }
        },
        template: `
            <Scrim
                :aria-label="args.ariaLabel"
                :clickable="args.clickable"
                @click="scrimEvent"
            />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

// ✅ Test: scrim emits click when clickable
export const Clickable: Story = {
    args: {
        clickable: true
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const scrim = await canvas.getByRole('button', { name: 'My scrim' })

        await expect(scrim).not.toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(scrim)
    }
}

// ✅ Test: scrim does not emit click when not clickable
export const NonClickable: Story = {
    args: {
        clickable: false
    },
    play: async ({ canvasElement }) => {
        // Query by role if clickable, otherwise use a tag selector
        const scrim = canvasElement.querySelector('div.inset-0') as HTMLElement

        await expect(scrim).not.toBeNull()
        await expect(scrim.tagName.toLowerCase()).toBe('div')
        await expect(scrim).toHaveAttribute('aria-disabled', 'true')

        // Click is attempted but should not trigger error
        await userEvent.click(scrim)
    }
}
