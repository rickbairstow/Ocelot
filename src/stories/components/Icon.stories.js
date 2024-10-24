import { availableIcons, availableSizes } from '@Composables/useIcons'
import AtomIcon from '@Components/Icon.vue'

console.log({availableSizes})

export default {
    title: 'Atoms/Icon',
    component: AtomIcon,

    argTypes: {
        icon: {
            control: 'select',
            options: [...Object.keys(availableIcons).sort()]
        },
        size: {
            control: 'select',
            options: [...Object.keys(availableSizes)]
        }
    },

    args: {
        icon: 'ArrowDown',
        size: '2xl'
    },

    render: (args) => ({
        components: { AtomIcon },

        setup() {
            return { args }
        },

        template: `
            <AtomIcon
                :icon="args.icon"
                :loading="args.loading"
                :size="args.size"
                :stroke-width="args.strokeWidth"
            />
        `
    })
}

export const Icon = {}
