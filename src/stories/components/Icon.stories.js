import { availableIcons, availableSizes } from '@Composables/useIcons'
import Icon from '@Components/Icon.vue'

console.log({availableSizes})

export default {
    title: 'Components/Icon',
    component: Icon,

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
        components: { Icon },

        setup() {
            return { args }
        },

        template: `
            <Icon
                :icon="args.icon"
                :loading="args.loading"
                :size="args.size"
                :stroke-width="args.strokeWidth"
            />
        `
    })
}

export const IconSingle = {}
