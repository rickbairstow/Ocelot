import Combobox from '@Components/Combobox.vue'

// Storybook settings and dummy data
const disabledModifier = 0.8
const moreOptionsDelay = 2000

const flatOptions = Array.from({ length: 5 }, (_, i) => ({
    value: i + 1,
    text: `Option ${i + 1}`,
    disabled: Math.random() > disabledModifier
}))

const groupedOptions = [
    {
        group: 'Group 1',
        options: Array.from({ length: 5 }, (_, i) => ({
            value: `group_1_option_${i + 1}`,
            text: `Option ${i + 1}`,
            disabled: Math.random() > disabledModifier
        }))
    },
    {
        group: 'Group 2',
        options: Array.from({ length: 5 }, (_, i) => ({
            value: `group_2_option_${i + 1}`,
            text: `Option ${i + 6}`,
            disabled: Math.random() > disabledModifier
        }))
    }
]

export default {
    title: 'Components/Combobox',
    component: Combobox,

    argTypes: {
        clearable: {
            description: 'Allows clearing of the selected value(s).',
            control: { type: 'boolean' }
        },
        disabled: {
            description:
                'Disables the component, including the search input if enabled.',
            control: { type: 'boolean' }
        },
        hasMoreOptions: {
            description:
                'Shows a "Load more" button and emits a `loadMoreOptions` event when clicked.',
            control: { type: 'boolean' }
        },
        loading: {
            description: "Sets the component's loading state.",
            control: { type: 'boolean' }
        },
        multiple: {
            description: 'Allows multiple selections.',
            control: { type: 'boolean' }
        },
        options: {
            description: 'List of options to display in the combobox.',
            control: { type: 'object' }
        },
        placeholder: {
            description: 'Placeholder text for the input field.',
            control: { type: 'text' }
        },
        searchable: {
            description: 'Enables the search input.',
            control: { type: 'boolean' }
        },
        wide: {
            description: 'Sets the combobox to 100% width.',
            control: { type: 'boolean' }
        },
        value: {
            control: { type: 'object' },
            description:
                'Initial value for the combobox. Note: Storybook v6 does not sync updates to `v-model` values.'
        },
        loadMoreOptions: {
            description:
                'Event triggered when more options are requested. Should be handled by the parent.',
            control: { type: 'disabled' }
        }
    },

    args: {
        clearable: false,
        disabled: false,
        id: 'combobox',
        hasMoreOptions: false,
        loading: false,
        multiple: false,
        placeholder: 'Select an option',
        options: flatOptions,
        searchable: true,
        wide: false,
        value: 1
    }
}

// Template setup
const Template = (args, { argTypes }) => ({
    components: { Combobox },
    props: Object.keys(argTypes),

    data() {
        return {
            localValue: args.value,
            localOptions: args.options,
            localLoading: args.loading
        }
    },

    watch: {
        localValue(newValue) {
            this.$emit('update:value', newValue)
        }
    },

    methods: {
        updateValue(newValue) {
            this.localValue = newValue
        },
        async addMoreOptions() {
            this.localLoading = true

            // Simulate loading more options
            await new Promise((resolve) =>
                setTimeout(resolve, moreOptionsDelay)
            )

            if (args.options?.[0]?.group) {
                // Add grouped options
                this.localOptions.push({
                    group: `Group ${Math.floor(Math.random() * 1000)}`,
                    options: Array.from({ length: 5 }, (_, i) => ({
                        value: `group_option_${Math.floor(Math.random() * 1000)}`,
                        text: `Option ${i + 1}`,
                        disabled: Math.random() > disabledModifier
                    }))
                })
            } else {
                // Add flat options
                for (let i = 0; i < 5; i++) {
                    this.localOptions.push({
                        value: Math.floor(Math.random() * 1000),
                        text: `New Option ${Math.floor(Math.random() * 1000)}`,
                        disabled: Math.random() > 0.8
                    })
                }
            }

            this.localLoading = false
        }
    },

    template: `
    <div>
      <Combobox
        :clearable="clearable"
        :disabled="disabled"
        :id="id"
        :has-more-options="hasMoreOptions"
        :loading="localLoading"
        :multiple="multiple"
        :placeholder="placeholder"
        :searchable="searchable"
        :wide="wide"
        :value="localValue"
        :options="localOptions"
        @input="updateValue"
        @load-more-options="addMoreOptions"
      />
      <p>Selected Value: {{ localValue }}</p>
    </div>
  `
})

// Stories
export const DefaultCombobox = Template.bind({})

export const GroupedCombobox = Template.bind({})
GroupedCombobox.args = {
    ...DefaultCombobox.args,
    options: groupedOptions,
    value: 'group_1_option_1'
}

export const MultipleCombobox = Template.bind({})
MultipleCombobox.args = {
    ...DefaultCombobox.args,
    multiple: true,
    placeholder: 'Select multiple options',
    value: [1, 2]
}

export const MultipleGroupedCombobox = Template.bind({})
MultipleGroupedCombobox.args = {
    ...GroupedCombobox.args,
    multiple: true,
    placeholder: 'Select multiple options',
    value: ['group_1_option_1', 'group_2_option_2']
}

export const MoreOptionsCombobox = Template.bind({})
MoreOptionsCombobox.args = {
    ...DefaultCombobox.args,
    hasMoreOptions: true
}

export const MoreOptionsGroupedCombobox = Template.bind({})
MoreOptionsGroupedCombobox.args = {
    ...GroupedCombobox.args,
    hasMoreOptions: true
}
