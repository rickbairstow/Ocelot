import type { Meta, StoryObj } from '@storybook/vue3'
import ButtonGroup from '@Components/ButtonGroup.vue'
import Button from '@Components/Button.vue'
import { userEvent, expect, within } from 'storybook/test'

const variants = ['primary', 'secondary', 'tertiary'] as const
const sizes = ['small', 'base', 'large'] as const

const meta: Meta<typeof ButtonGroup> = {
    title: 'Components/ButtonGroup',
    component: ButtonGroup,

    parameters: {
        docs: {
            description: {
                component: 'Groups related buttons into a cohesive control. Collapses borders between buttons and removes inner border radii. Cascades size, variant, and color to child buttons.'
            }
        }
    },

    argTypes: {
        ariaLabel: {
            control: 'text',
            description: 'Accessible label for the group. Required for screen readers.'
        },
        color: {
            control: 'select',
            options: ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink'],
            description: 'Cascades to all child buttons that do not specify their own color.'
        },
        orientation: {
            control: 'radio',
            options: ['horizontal', 'vertical'],
            description: 'Layout direction.'
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Cascades to all child buttons that do not specify their own size.'
        },
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'text', 'none'],
            description: 'Cascades to all child buttons that do not specify their own variant.'
        }
    },

    args: {
        ariaLabel: 'View options',
        orientation: 'horizontal'
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: (args) => ({
        components: { ButtonGroup, Button },
        setup() { return { args } },
        template: `
            <ButtonGroup :aria-label="args.ariaLabel" :orientation="args.orientation">
                <Button>Day</Button>
                <Button>Week</Button>
                <Button>Month</Button>
            </ButtonGroup>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const buttons = canvas.getAllByRole('button')
        await expect(buttons).toHaveLength(3)
        await expect(canvas.getByRole('group')).toHaveAttribute('aria-label', 'View options')
        await userEvent.click(buttons[0])
        await userEvent.click(buttons[1])
        await userEvent.click(buttons[2])
    }
}

export const AllVariations: Story = {
    render: () => ({
        components: { ButtonGroup, Button },
        setup: () => ({ variants, sizes }),
        template: `
            <div class="flex flex-col gap-10">
                <div>
                    <p class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Variants</p>
                    <div class="flex flex-col gap-3">
                        <ButtonGroup v-for="variant in variants" :key="variant" :aria-label="variant" :variant="variant">
                            <Button>Option A</Button>
                            <Button>Option B</Button>
                            <Button>Option C</Button>
                        </ButtonGroup>
                    </div>
                </div>

                <div>
                    <p class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Sizes</p>
                    <div class="flex flex-col gap-3">
                        <ButtonGroup v-for="size in sizes" :key="size" :aria-label="size" :size="size" variant="secondary">
                            <Button>Small</Button>
                            <Button>Medium</Button>
                            <Button>Large</Button>
                        </ButtonGroup>
                    </div>
                </div>

                <div>
                    <p class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Vertical orientation</p>
                    <ButtonGroup aria-label="Vertical example" orientation="vertical" variant="secondary">
                        <Button>Top</Button>
                        <Button>Middle</Button>
                        <Button>Bottom</Button>
                    </ButtonGroup>
                </div>

                <div>
                    <p class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Icon-only groups</p>
                    <div class="flex flex-wrap gap-4">
                        <ButtonGroup aria-label="View toggle" variant="secondary">
                            <Button icon="LayoutGrid" icon-only aria-label="Grid view" />
                            <Button icon="LayoutList" icon-only aria-label="List view" />
                        </ButtonGroup>
                        <ButtonGroup aria-label="Sort order" variant="secondary">
                            <Button icon="SortAscending" icon-only aria-label="Sort ascending" />
                            <Button icon="SortDescending" icon-only aria-label="Sort descending" />
                        </ButtonGroup>
                        <ButtonGroup aria-label="Navigate pages" variant="secondary">
                            <Button icon="ChevronLeft" icon-only aria-label="Previous" />
                            <Button icon="ChevronRight" icon-only aria-label="Next" />
                        </ButtonGroup>
                    </div>
                </div>

                <div>
                    <p class="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Individual override — last button overrides cascade</p>
                    <ButtonGroup aria-label="Actions" variant="secondary" color="blue">
                        <Button>Save</Button>
                        <Button>Save &amp; Close</Button>
                        <Button variant="primary" color="red">Delete</Button>
                    </ButtonGroup>
                </div>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const groups = canvas.getAllByRole('group')
        await expect(groups.length).toBeGreaterThan(0)
        for (const button of canvas.getAllByRole('button')) {
            await expect(button).toBeVisible()
        }
    }
}
