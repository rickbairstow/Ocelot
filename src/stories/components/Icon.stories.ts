import type { Meta, StoryObj } from '@storybook/vue3'
import { availableIcons, availableSizes } from '@Composables/useIcons'
import Icon from '@Components/Icon.vue'

const meta: Meta<typeof Icon> = {
    title: 'Components/Icon',
    component: Icon,

    argTypes: {
        icon: {
            control: 'select',
            options: [...Object.keys(availableIcons).sort()],
            description:
                'Sets the icon to render, this should match an imported Tabler icon (see useIcons).'
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

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
