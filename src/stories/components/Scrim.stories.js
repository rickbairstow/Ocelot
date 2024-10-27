import Scrim from '@Components/Scrim.vue'

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

export const Default = {}

export const Disabled = {
    args: {
        disabled: true
    }
}
