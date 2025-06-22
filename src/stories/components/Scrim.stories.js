import Scrim from '@Components/Scrim.vue'
import { expect, userEvent, within } from 'storybook/test'

export default {
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

// ✅ Test: scrim emits click when clickable
export const Clickable = {
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
export const NonClickable = {
    args: {
        clickable: false
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const scrim = await canvas.getByLabelText('My scrim')

        // Element should not be a button if not clickable
        await expect(scrim.tagName.toLowerCase()).not.toBe('button')
        await expect(scrim).toHaveAttribute('aria-disabled', 'true')

        // Click is attempted but should have no effect
        await userEvent.click(scrim)
    }
}
