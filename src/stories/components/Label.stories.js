import Label from '@Components/Label.vue'

export default {
    title: 'Components/Label',
    component: Label,

    argTypes: {
        default: {
            control: 'text',
            description: 'Label slot content',
            table: {
                type: { summary: 'any' }
            }
        }
    },

    args: {
        default: 'Label content'
    },

    render: (args) => ({
        components: { Label },

        setup() {
            return { args }
        },

        template: `
            <Label>
                {{ args.default }}
            </Label>
        `
    })
}

export const Default = {}
