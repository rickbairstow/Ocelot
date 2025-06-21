import Dialog from '@Components/Dialog.vue'
import { ref } from 'vue'

export default {
    title: 'Components/Dialog',
    component: Dialog,

    argTypes: {
        default: { control: 'text', description: 'Body slot content' },
        defaultFooter: { control: 'text', description: 'Footer slot content' },
        defaultTitle: { control: 'text', description: 'Title slot content' },
        ariaLabel: { control: 'text', description: 'Aria label for the dialog.' },
        focusFrom: {
            control: 'text',
            description: 'ID of the element to return focus to when dialog closes.'
        },
        focusTo: {
            control: 'text',
            description: 'ID of the element to focus when dialog opens.'
        },
        small: {
            control: 'boolean',
            description: 'Use small dialog width on larger screens.'
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
                dialog.value?.open()
            }

            return { args, dialog, openDialog }
        },
        template: `
            <div id="portal-target"></div>

            <button
                id="dialogueTrigger"
                class="focus:outline-1 mb-4 px-3 py-2 bg-gray-100 rounded hover:bg-gray-200"
                @click="openDialog"
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
            >
                <template #title>{{ args.defaultTitle }}</template>
                {{ args.default }}
                <template #footer>{{ args.defaultFooter }}</template>
            </Dialog>
        `
    })
}

export const Default = {}
