import HelloWorld from '@Components/HelloWorld.vue'

export default {
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

export const Default = {}
