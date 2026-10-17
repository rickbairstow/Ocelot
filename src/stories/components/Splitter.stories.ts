import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref, watch } from 'vue'
import Splitter from '@Components/Splitter.vue'
import { runInteractionTests } from '../interactionMode'

const meta: Meta<typeof Splitter> = {
    title: 'Components/Splitter',
    component: Splitter,
    parameters: { docs: { description: { component: 'Two resizable panes using primary and secondary slots. Supply label naming the primary pane; the focusable separator exposes its size and controls relationship. Optional numeric v-model is the primary pane percentage (default 50). Horizontal arranges panes side by side; vertical stacks them. Set a height for vertical layouts and a useful width for horizontal layouts. Defaults limit the primary pane to 10–90%; min/max configure percentage limits. Pointer dragging supports mouse, touch and pen. Arrow keys resize along the active axis; Shift+Arrow uses ten steps, Home/End jump to limits. step defaults to 1 percentage point. Horizontal resizing follows RTL direction. update:modelValue emits during resizing; change emits on pointer release or a keyboard adjustment. disabled prevents resizing. Pane content scrolls independently. No persistence, collapse toggle or nested panel manager; the parent can store v-model if needed.' } } },
    args: { label: 'Contents', modelValue: 50, orientation: 'horizontal', min: 10, max: 90, step: 1, disabled: false },
    argTypes: { orientation: { control: 'select', options: ['horizontal', 'vertical'] } },
    render: args => ({
        components: { Splitter },
        setup() {
            const value = ref(args.modelValue)
            watch(() => args.modelValue, next => { value.value = next })
            return { args, value }
        },
        template: '<Splitter v-bind="args" v-model="value" class="h-64 rounded-xl border border-gray-300 dark:border-gray-700"><template #primary><div class="p-4"><h2 class="font-medium">Contents</h2><p class="mt-2 text-sm">Choose a section from this pane.</p></div></template><template #secondary><div class="p-4"><h2 class="font-medium">Preview</h2><p class="mt-2 text-sm">Drag the divider or focus it and use the arrow keys.</p></div></template></Splitter>'
    })
}
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const separator = within(canvasElement).getByRole('separator', { name: 'Contents' })
        await expect(separator).toHaveAttribute('aria-valuenow', '50')
        await expect(separator).toHaveAttribute('aria-orientation', 'vertical')
        await userEvent.tab()
        await expect(separator).toHaveFocus()
        await userEvent.keyboard('{ArrowRight}')
        await expect(separator).toHaveAttribute('aria-valuenow', '51')
        await userEvent.keyboard('{Shift>}{ArrowLeft}{/Shift}')
        await expect(separator).toHaveAttribute('aria-valuenow', '41')
        await userEvent.keyboard('{Home}')
        await expect(separator).toHaveAttribute('aria-valuenow', '10')
        await userEvent.keyboard('{End}')
        await expect(separator).toHaveAttribute('aria-valuenow', '90')
    }
}
export const Vertical: Story = {
    args: { orientation: 'vertical' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const separator = within(canvasElement).getByRole('separator')
        await expect(separator).toHaveAttribute('aria-orientation', 'horizontal')
        await userEvent.tab()
        await userEvent.keyboard('{ArrowDown}')
        await expect(separator).toHaveAttribute('aria-valuenow', '51')
        await userEvent.keyboard('{ArrowUp}')
        await expect(separator).toHaveAttribute('aria-valuenow', '50')
    }
}
export const SizeLimits: Story = {
    args: { modelValue: 30, min: 25, max: 60, step: 5 },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const separator = within(canvasElement).getByRole('separator')
        await userEvent.tab()
        await userEvent.keyboard('{Home}{ArrowLeft}')
        await expect(separator).toHaveAttribute('aria-valuenow', '25')
        await userEvent.keyboard('{End}{ArrowRight}')
        await expect(separator).toHaveAttribute('aria-valuenow', '60')
    }
}
export const Disabled: Story = {
    args: { disabled: true },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const separator = within(canvasElement).getByRole('separator')
        await expect(separator).toHaveAttribute('aria-disabled', 'true')
        await expect(separator).toHaveAttribute('tabindex', '-1')
    }
}
