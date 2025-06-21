import Dialog from '@Components/Dialog.vue'
import { ref } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'

export default {
    title: 'Components/Dialog',
    component: Dialog,

    argTypes: {
        default: { control: 'text', description: 'Body slot content' },
        defaultFooter: { control: 'text', description: 'Footer slot content' },
        defaultTitle: { control: 'text', description: 'Title slot content' },
        ariaLabel: {
            control: 'text',
            description: 'Aria label for the dialog.'
        },
        focusFrom: {
            control: 'text',
            description:
                'ID of the element to return focus to when dialog closes.'
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
                class="focus:outline-1"
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

export const Default = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const openButton = await canvas.findByRole('button', {
            name: /click to open the dialog/i
        })

        await userEvent.click(openButton)

        const dialog = await canvas.findByRole('dialog', { name: /my dialog/i })

        await waitFor(() => {
            expect(dialog).toBeVisible()
        })

        const title = await canvas.findByText(/dialog title/i)
        await expect(title).toHaveFocus()

        // Get all close buttons
        const closeButtons = await canvas.findAllByRole('button', {
            name: /close dialog/i
        })

        // Choose the visible one (exclude sr-only and scrim)
        const closeButton = closeButtons.find(
            (btn) =>
                getComputedStyle(btn).display !== 'none' &&
                !btn.classList.contains('sr-only')
        )

        await userEvent.click(closeButton)

        await waitFor(() => {
            expect(dialog).not.toBeVisible()
        })

        await expect(openButton).toHaveFocus()
    }
}
