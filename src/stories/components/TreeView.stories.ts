import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import { ref, watch } from 'vue'
import TreeView from '@Components/TreeView.vue'
import type { TreeNode } from '@Components/TreeView.vue'
import Icon from '@Components/Icon.vue'
import { runInteractionTests } from '../interactionMode'

const items: TreeNode[] = [
    { id: 'documents', label: 'Documents', children: [
        { id: 'invoices', label: 'Invoices', children: [{ id: 'january', label: 'January.pdf' }] },
        { id: 'notes', label: 'Notes.txt' }
    ] },
    { id: 'photos', label: 'Photos', children: [{ id: 'holiday', label: 'Holiday.jpg' }] },
    { id: 'readme', label: 'Readme.txt' }
]
const meta: Meta<typeof TreeView> = {
    title: 'Components/TreeView',
    component: TreeView,
    parameters: { docs: { description: { component: 'Single-selection hierarchical data with roving keyboard focus. Pass items with unique string id, label, optional children and disabled. label names the tree for assistive technology. Optional v-model is a selected id or null; optional v-model:expanded is an array of open ids. Both work internally when omitted. select emits the selected node. Focus and selection are separate: Up/Down move focus, Home/End jump, Enter/Space select. Right opens or enters a branch; Left closes or moves to its parent (mirrored in RTL). Typing finds a visible label; * opens sibling branches. Clicking selects and toggles a branch. Disabled rows are visible but skipped by keyboard navigation and cannot be selected or toggled. Collapsed descendants are not rendered. No cascading checks, fetching or drag-and-drop. Replace items from the parent when data changes, keeping ids stable. The item slot receives { node, selected, expanded }; keep slot content non-interactive so tree keyboard navigation remains coherent. The empty slot overrides emptyText. Use Sidebar for ordinary site navigation.' } } },
    decorators: [() => ({ template: '<div class="max-w-sm"><story /></div>' })],
    args: { items, label: 'Files', modelValue: null, expanded: [], emptyText: 'No items' },
    render: args => ({
        components: { TreeView },
        setup() {
            const value = ref(args.modelValue)
            const expanded = ref(args.expanded)
            watch(() => args.modelValue, next => { value.value = next })
            watch(() => args.expanded, next => { expanded.value = next })
            return { args, value, expanded }
        },
        template: '<TreeView v-bind="args" v-model="value" v-model:expanded="expanded" />'
    })
}
export default meta
type Story = StoryObj<typeof meta>
export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('treeitem')).toHaveLength(3)
        await userEvent.tab()
        const documents = canvas.getByRole('treeitem', { name: 'Documents' })
        await expect(documents).toHaveFocus()
        await userEvent.keyboard('{ArrowRight}{ArrowRight}')
        await expect(canvas.getByRole('treeitem', { name: 'Invoices' })).toHaveFocus()
        await userEvent.keyboard('{ArrowRight}{ArrowRight}{Enter}')
        await expect(canvas.getByRole('treeitem', { name: 'January.pdf' })).toHaveAttribute('aria-selected', 'true')
        await expect(canvas.getByRole('treeitem', { name: 'January.pdf' })).toHaveAttribute('aria-level', '3')
        await userEvent.keyboard('{ArrowLeft}{ArrowLeft}')
        await expect(canvas.queryByRole('treeitem', { name: 'January.pdf' })).not.toBeInTheDocument()
        await userEvent.keyboard('{End}')
        await expect(canvas.getByRole('treeitem', { name: 'Readme.txt' })).toHaveFocus()
        await userEvent.keyboard('p')
        await expect(canvas.getByRole('treeitem', { name: 'Photos' })).toHaveFocus()
    }
}
export const Expanded: Story = {
    args: { expanded: ['documents', 'invoices', 'photos'], modelValue: 'january' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('treeitem')).toHaveLength(7)
        await userEvent.tab()
        await expect(canvas.getByRole('treeitem', { name: 'January.pdf' })).toHaveFocus()
        await userEvent.keyboard('{Home}*')
        await expect(canvas.getByRole('treeitem', { name: 'Photos' })).toHaveAttribute('aria-expanded', 'true')
    }
}
export const DisabledItems: Story = {
    args: { items: [{ id: 'active', label: 'Active project' }, { id: 'archived', label: 'Archived project', disabled: true }, { id: 'draft', label: 'Draft project' }] },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        const canvas = within(canvasElement)
        await userEvent.tab()
        await userEvent.keyboard('{ArrowDown}')
        await expect(canvas.getByRole('treeitem', { name: 'Draft project' })).toHaveFocus()
        await userEvent.click(canvas.getByRole('treeitem', { name: 'Archived project' }))
        await expect(canvas.getByRole('treeitem', { name: 'Archived project' })).toHaveAttribute('aria-selected', 'false')
    }
}
export const CustomContent: Story = {
    render: args => ({ components: { TreeView, Icon }, setup: () => ({ args }), template: '<TreeView :items="args.items" :label="args.label"><template #item="{ node }"><Icon :icon="node.children ? \'Folder\' : \'File\'" size="sm" /><span>{{ node.label }}</span></template></TreeView>' }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByRole('treeitem', { name: 'Documents' }).querySelector('svg')).toBeInTheDocument()
    }
}
export const Empty: Story = {
    args: { items: [] },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return
        await expect(within(canvasElement).getByText('No items')).toBeVisible()
        await expect(within(canvasElement).getByRole('group', { name: 'Files' })).toHaveAttribute('tabindex', '0')
    }
}
