import HelloWorld from '@/components/HelloWorld.vue'

export default {
  title: 'Components/HelloWorld',
  component: HelloWorld,

  argTypes: {},
  args: {},

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

// Default Template
export const Default = {}
