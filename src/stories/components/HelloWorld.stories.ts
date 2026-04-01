import type { Meta, StoryObj } from '@storybook/vue3'
import HelloWorld from '@Components/HelloWorld.vue'

const meta: Meta<typeof HelloWorld> = {
    title: 'Components/HelloWorld',
    component: HelloWorld,

    argTypes: {},
    args: {
        msg: 'Hello there!'
    },

    render: (args) => ({
        components: { HelloWorld },

        setup() {
            return { args }
        },

        template: `
            <HelloWorld :msg="args.msg" />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
