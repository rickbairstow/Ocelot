import type { Meta, StoryObj } from '@storybook/vue3'
import FloatingPanel from '@Components/FloatingPanel.vue'
import { faker } from '@faker-js/faker'
import { expect, userEvent, waitFor, within } from 'storybook/test'

const meta: Meta<typeof FloatingPanel> = {
    title: 'Components/FloatingPanel',
    component: FloatingPanel,

    parameters: {
        docs: {
            description: {
                component:
                    'A flexible floating panel component for tooltips, dropdowns, and lightweight popovers. Uses FloatingUi for adaptive, viewport-aware positioning. Supports hover, click, and keyboard interactions with full ARIA support.'
            }
        }
    },

    argTypes: {
        content: {
            control: 'text',
            description: 'Slot content rendered inside the panel body.'
        },
        disabled: {
            control: 'boolean',
            description: 'Disables all interactions.'
        },
        flush: {
            control: 'boolean',
            description: 'Removes default padding from the panel inner area.'
        },
        interaction: {
            control: 'select',
            options: ['all', 'click', 'hover'],
            description:
                '"click" toggles on click only. "hover" opens on hover and focus. "all" enables both.'
        },
        maxWidth: {
            control: 'text',
            description: 'Maximum width of the panel. Accepts any CSS value or a plain number (treated as px).'
        },
        placement: {
            control: 'select',
            options: [
                'top', 'top-start', 'top-end',
                'right', 'right-start', 'right-end',
                'bottom', 'bottom-start', 'bottom-end',
                'left', 'left-start', 'left-end'
            ],
            description: 'Preferred placement relative to the trigger. FloatingUi will flip or shift if there is insufficient space.'
        },
        role: {
            control: 'select',
            options: ['tooltip', 'menu', 'listbox', null],
            description:
                'ARIA role for the panel. Enables appropriate accessibility behaviour for tooltips, menus, or listboxes. Null for generic popovers.'
        },
        trigger: {
            control: 'text',
            description: 'Slot content rendered inside the trigger.'
        }
    },

    args: {
        ariaLabel: undefined,
        content: faker.lorem.sentence(),
        disabled: false,
        flush: false,
        interaction: 'all',
        maxWidth: '260px',
        placement: 'bottom',
        role: null,
        trigger: faker.lorem.words(2)
    },

    render: (args) => ({
        components: { FloatingPanel },
        setup() {
            return { args }
        },
        template: `
            <div style="display:flex; align-items:center; justify-content:center; height:100vh; width:100%;">
                <FloatingPanel
                    :aria-label="args.ariaLabel"
                    :disabled="args.disabled"
                    :flush="args.flush"
                    :interaction="args.interaction"
                    :max-width="args.maxWidth"
                    :placement="args.placement"
                    :role="args.role"
                >
                    <template #trigger>
                        <button type="button">{{ args.trigger }}</button>
                    </template>
                    <template #content>
                        <span>{{ args.content }}</span>
                    </template>
                </FloatingPanel>
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    name: 'All interactions (default)',
    args: {
        interaction: 'all',
        trigger: 'Hover, click, or focus me',
        content: faker.lorem.sentence()
    }
}

export const ClickOnly: Story = {
    name: 'Click only',
    args: {
        interaction: 'click',
        trigger: 'Click me',
        content: 'This panel only opens on click. Hovering or focusing will not open it.'
    },

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: /click me/i })

        // Hover should NOT open the panel
        await userEvent.hover(trigger)
        await new Promise((r) => setTimeout(r, 250))
        expect(canvasElement.querySelector('[id^="floating-panel_"]')).toBeNull()

        // Click opens the panel
        await userEvent.click(trigger)
        const panel = await canvas.findByText(/this panel only opens on click/i)
        await waitFor(() => {
            expect(panel).toBeVisible()
        })

        // Click again closes
        await userEvent.click(trigger)
        await waitFor(() => {
            expect(canvasElement.querySelector('[id^="floating-panel_"]')).toBeNull()
        })
    }
}

export const LabelledPopover: Story = {
    args: {
        ariaLabel: 'Formatting options',
        interaction: 'click',
        role: null,
        trigger: 'Open formatting options'
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: /open formatting options/i }))
        const panel = await canvas.findByLabelText(/formatting options/i)
        await waitFor(() => expect(panel).toBeVisible())
    }
}

export const HoverOnly: Story = {
    name: 'Hover and focus',
    args: {
        interaction: 'hover',
        trigger: 'Hover or focus me',
        content: 'This panel opens on hover or keyboard focus, but not on click.'
    },

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: /hover or focus me/i })

        // Hover opens the panel
        await userEvent.hover(trigger)
        const panel = await canvas.findByText(/this panel opens on hover/i)
        await waitFor(() => {
            expect(panel).toBeVisible()
        })

        // Moving mouse away closes (after delay)
        await userEvent.unhover(trigger)
        await waitFor(
            () => {
                expect(canvasElement.querySelector('[id^="floating-panel_"]')).toBeNull()
            },
            { timeout: 500 }
        )

        // Focus opens the panel
        trigger.focus()
        await waitFor(() => {
            expect(canvas.queryByText(/this panel opens on hover/i)).not.toBeNull()
        })
    }
}

export const Tooltip: Story = {
    args: {
        content: 'This is a helpful tooltip.',
        interaction: 'hover',
        placement: 'top',
        role: 'tooltip',
        trigger: 'Hover for tooltip'
    },

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: /hover for tooltip/i })

        // Open tooltip via focus
        trigger.focus()

        await waitFor(() => {
            expect(canvasElement.querySelector('[id^="floating-panel_"]')).not.toBeNull()
        })

        // aria-describedby must be on the trigger button itself, not a wrapper div
        const panelId = canvasElement.querySelector('[id^="floating-panel_"]')?.id
        await waitFor(() => {
            expect(trigger.getAttribute('aria-describedby')).toBe(panelId)
        })

        // Panel carries role="tooltip"
        expect(canvasElement.querySelector('[role="tooltip"]')).not.toBeNull()
    }
}

export const Menu: Story = {
    args: {
        flush: true,
        interaction: 'click',
        placement: 'bottom-start',
        role: 'menu',
        trigger: 'Open menu'
    },

    render: (args) => ({
        components: { FloatingPanel },
        setup() {
            return { args }
        },
        template: `
            <div style="display:flex; align-items:center; justify-content:center; height:100vh; width:100%;">
                <FloatingPanel
                    :disabled="args.disabled"
                    :flush="args.flush"
                    :interaction="args.interaction"
                    :max-width="args.maxWidth"
                    :placement="args.placement"
                    :role="args.role"
                >
                    <template #trigger>
                        <button type="button">{{ args.trigger }}</button>
                    </template>
                    <template #content>
                        <div class="py-1">
                            <button
                                class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                                type="button"
                            >
                                Action 1
                            </button>
                            <button
                                class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                                type="button"
                            >
                                Action 2
                            </button>
                            <button
                                class="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                                role="menuitem"
                                type="button"
                            >
                                Action 3
                            </button>
                        </div>
                    </template>
                </FloatingPanel>
            </div>
        `
    }),

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: /open menu/i })

        // Before open: aria-expanded should be false
        expect(trigger.getAttribute('aria-expanded')).toBe('false')
        expect(trigger.getAttribute('aria-haspopup')).toBe('menu')

        // Click opens the menu
        await userEvent.click(trigger)
        const menu = await canvas.findByRole('menu')
        await waitFor(() => {
            expect(menu).toBeVisible()
            expect(trigger.getAttribute('aria-expanded')).toBe('true')
        })

        // Menu items are present
        const menuItems = canvas.getAllByRole('menuitem')
        expect(menuItems).toHaveLength(3)
    }
}

export const Listbox: Story = {
    args: {
        flush: true,
        interaction: 'click',
        placement: 'bottom-start',
        role: 'listbox',
        trigger: 'Choose an option'
    },

    render: (args) => ({
        components: { FloatingPanel },
        setup() {
            return { args }
        },
        template: `
            <div style="display:flex; align-items:center; justify-content:center; height:100vh; width:100%;">
                <FloatingPanel
                    :disabled="args.disabled"
                    :flush="args.flush"
                    :interaction="args.interaction"
                    :max-width="args.maxWidth"
                    :placement="args.placement"
                    :role="args.role"
                >
                    <template #trigger>
                        <button type="button">{{ args.trigger }}</button>
                    </template>
                    <template #content>
                        <div
                            aria-selected="true"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            role="option"
                        >
                            Option A
                        </div>
                        <div
                            aria-selected="false"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            role="option"
                        >
                            Option B
                        </div>
                        <div
                            aria-selected="false"
                            class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                            role="option"
                        >
                            Option C
                        </div>
                    </template>
                </FloatingPanel>
            </div>
        `
    })
}

export const Flush: Story = {
    name: 'Flush content',
    args: {
        flush: true,
        trigger: 'Open flush panel',
        content: 'Padding is removed so content can define its own layout.'
    }
}

export const Disabled: Story = {
    args: {
        disabled: true,
        trigger: 'I am disabled',
        content: 'You should not see this.'
    },

    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const trigger = canvas.getByRole('button', { name: /i am disabled/i })

        // Click should not open the panel
        await userEvent.click(trigger)
        await new Promise((r) => setTimeout(r, 100))
        expect(canvasElement.querySelector('[id^="floating-panel_"]')).toBeNull()

        // Hover should not open the panel
        await userEvent.hover(trigger)
        await new Promise((r) => setTimeout(r, 250))
        expect(canvasElement.querySelector('[id^="floating-panel_"]')).toBeNull()
    }
}
