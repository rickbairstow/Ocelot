import Dialog from '@Components/Dialog.vue'
import { ref } from "vue";

export default {
    title: 'Components/Dialog',
    component: Dialog,

    argTypes: {
        default: {
            control: 'text',
            description: 'Body slot content',
            table: {
                type: { summary: 'any' }
            }
        },
        defaultFooter: {
            control: 'text',
            description: 'Footer slot content',
            table: {
                type: { summary: 'any' }
            }
        },
        defaultTitle: {
            control: 'text',
            description: 'Title slot content',
            table: {
                type: { summary: 'any' }
            }
        }
    },

    args: {
        // slot content
        default: 'Dialog content',
        defaultFooter: 'Dialog footer',
        defaultTitle: 'Dialog title',

        // props
        ariaLabel: 'My dialog',
        focusFrom: 'dialogueTrigger',
        focusTo: '',
        isOpen: false,
        small: true
    },

    render: (args) => ({
        components: { Dialog },

        setup() {
            const dialog = ref(null)

            const openDialog = () => {
                dialog.value.open()
            }

            return { args, dialog, openDialog }
        },

        template: `
            <div id="portal-target"></div>

            <button
                id="dialogueTrigger"
                @click="openDialog()"
            >
                Click to open the Dialog
            </button>

            <Dialog
                ref="dialog"
                :aria-label="args.ariaLabel"
                :focus-from="args.focusFrom"
                :focus-to="args.focusTo"
                :is-open="args.isOpen"
                :portal-target="args.portalTarget"
                :small="args.small"
                @close="close()"
            >
                <template #title>
                    {{ args.defaultTitle }}
                </template>

                {{ args.default }}

                <template #footer>
                    {{ args.defaultFooter }}
                </template>
            </Dialog>
        `
    })
}

export const Default = {}
