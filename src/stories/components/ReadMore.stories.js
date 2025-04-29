import ReadMore from '@Components/ReadMore.vue'

export default {
    title: 'Components/ReadMore',
    component: ReadMore,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content'
        },

        lines: {
            control: {
                type: 'number',
                min: 0,
                max: 6
            }
        }
    },

    args: {
        default:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam ipsum erat, pretium sit amet bibendum sed, blandit a felis. Suspendisse ornare risus vitae imperdiet vehicula. Morbi non nibh tempus, cursus turpis vitae, semper lacus. Ut in lobortis dui. Duis vitae lacus non orci ultrices interdum. Nunc porttitor eget neque sit amet maximus. Nulla facilisi. Pellentesque venenatis ac urna eget blandit. Nunc cursus est ac eros gravida, in cursus leo tristique. In tristique tellus id mollis iaculis.',
        lines: 4
    }
}

export const Default = {
    render: (args) => ({
        components: { ReadMore },

        setup() {
            return { args }
        },

        template: `
            <ReadMore
                class="w-96"
                :lines="args.lines"
            >
                {{ args.default }}
            </ReadMore>
        `
    })
}
