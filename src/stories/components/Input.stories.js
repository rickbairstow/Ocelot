import { ref } from 'vue'
import Input from '@Components/Input.vue'

export default {
    title: 'Components/Input',
    component: Input,

    argTypes: {
        autoComplete: {
            control: 'boolean',
            description: 'Whether the input should allow browser autocomplete.'
        },

        disabled: {
            control: 'boolean',
            description: 'Whether the input is disabled.'
        },

        label: {
            control: 'text',
            description: 'The label text for the input.'
        },

        maxlength: {
            control: 'number',
            description: 'Maximum number of characters - defaults to 255.'
        },

        minlength: {
            control: 'number',
            description: 'Minimum number of characters.'
        },

        modelValue: {
            control: 'disabled',
            description:
                'Exposes modelValue for use, however the preference is to use v-model instead. Note that for Storybook setting this will only set the initial value, thus it has been disabled to prevent any confusion.'
        },

        name: {
            control: 'text',
            description: 'The name attribute for the input.'
        },

        placeholder: {
            control: 'text',
            description: 'Placeholder text for the input'
        },

        readonly: {
            control: 'boolean',
            description: 'Whether the input is read-only.'
        },

        type: {
            control: 'select',
            options: ['text', 'email', 'number', 'password', 'tel', 'url'],
            description:
                'The type of the input - current values are restricted to text related inputs.'
        },

        // Slots
        prefix: {
            control: 'text',
            description: 'Slot content for prefix.'
        },

        suffix: {
            control: 'text',
            description: 'Slot content for suffix.'
        },

        // Events
        'update:modelValue': {
            description:
                'Emitted when the input value changes. Used for v-model binding.'
        },
        input: {
            description:
                'Emitted on every input event, passing the current input value.'
        },
        change: {
            description: 'Emitted when the input loses focus after a change.'
        }
    },

    args: {
        autoComplete: true,
        disabled: false,
        label: 'First name',
        maxlength: 255,
        minLength: 0,
        modelValue: null,
        name: 'input_firstname',
        placeholder: 'Please enter your name...',
        readonly: false,
        type: 'text'
    },

    render: (args, { updateArgs }) => ({
        components: { Input },

        setup() {
            const modelValue = ref(args.modelValue)

            /**
             * Special function that updates the args when the modelValue emit event runs.
             * @param newValue
             */
            const handleEvent = (newValue) => {
                updateArgs({ ...args, modelValue: newValue || null })
            }

            return { args, modelValue, handleEvent }
        },

        template: `
            <Input
                v-bind="args"
                @update:modelValue="handleEvent"
            >
                <template v-if="args?.prefix" #prefix>{{ args.prefix }}</template>
                <template v-if="args?.suffix" #suffix>{{ args.suffix }}</template>
            </Input>
        `
    })
}

export const TextInput = {}
