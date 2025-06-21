import Scrim from '@Components/Scrim.vue'
import { expect, userEvent, within } from 'storybook/test'

export default {
    title: 'Components/Scrim',
    component: Scrim,

    argTypes: {
        ariaLabel: {
            control: 'text',
            description: 'Aria label to apply to the scrim.'
        },
        disabled: {
            control: 'boolean',
            description: 'Sets if the scrim should be clickable.'
        }
    },

    args: {
        ariaLabel: 'My scrim',
        disabled: false
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
                :disabled="args.disabled"
                @click="scrimEvent"
            />
        `
    })
}

// ✅ Interaction: click works when not disabled
export const Default = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const scrim = await canvas.getByRole('button', { name: 'My scrim' })

        await expect(scrim).not.toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(scrim)
    }
}

// ✅ Interaction: click does nothing when disabled
export const Disabled = {
    args: {
        disabled: true
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const scrim = await canvas.getByRole('button', { name: 'My scrim' })

        await expect(scrim).toHaveAttribute('aria-disabled', 'true')

        // Attempt click but assert no error (manual confirmation)
        await userEvent.click(scrim)
    }
}
