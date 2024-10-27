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
        },
        ariaLabel: {
            control: 'text',
            description: 'Aria label for the dialog.',
        },
        focusFrom: {
            control: 'text',
            description: 'The ID of the element that triggered the dialog. This allows the dialog to focus back to the element when closing.',
        },
        focusTo: {
            control: 'text',
            description: 'The ID of the element that should be focused when the dialog is open. This is handy for focusing on inputs when it opens, else by default this will focus on the dialog title.',
        },
        small: {
            control: 'boolean',
            description: 'Sets if the dialog should be smaller width for larger devices.',
        }
    },

    args: {
        default: 'Dialog content',
        defaultFooter: 'Dialog footer',
        defaultTitle: 'Dialog title',
        ariaLabel: 'My dialog',
        focusFrom: 'dialogueTrigger',
        focusTo: '',
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
