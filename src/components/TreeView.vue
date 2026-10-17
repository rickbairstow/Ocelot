<template>
    <div
        ref="tree"
        class="text-sm text-gray-900 dark:text-gray-100"
        :aria-label="label"
        :role="rows.length ? 'tree' : 'group'"
        :tabindex="navigable.length ? -1 : 0"
    >
        <!-- Each row participates in roving focus: one tabindex=0, all others -1. -->
        <!-- eslint-disable-next-line vuejs-accessibility/interactive-supports-focus -->
        <div
            v-for="row in rows"
            :id="`${treeId}-${encodeURIComponent(row.node.id)}`"
            :key="row.node.id"
            class="flex min-h-9 items-center gap-2 rounded-lg py-2 pe-3 outline-offset-[-2px] focus-visible:outline-2 focus-visible:outline-blue-500"
            role="treeitem"
            :aria-disabled="row.node.disabled || undefined"
            :aria-expanded="row.node.children?.length ? expanded.includes(row.node.id) : undefined"
            :aria-label="row.node.label"
            :aria-level="row.level"
            :aria-posinset="row.position"
            :aria-selected="selected === row.node.id"
            :aria-setsize="row.size"
            :class="row.node.disabled ? 'cursor-not-allowed bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' : selected === row.node.id ? 'cursor-pointer bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-200' : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'"
            :style="{ paddingInlineStart: `${(row.level - 1) * 20 + 8}px` }"
            :tabindex="!row.node.disabled && tabId === row.node.id ? 0 : -1"
            @click="activate(row.node)"
            @focus="focused = row.node.id"
            @keydown="onKeydown"
        >
            <Icon
                v-if="row.node.children?.length"
                class="shrink-0"
                size="sm"
                :icon="expanded.includes(row.node.id) ? 'ChevronDown' : 'ChevronRight'"
            />
            <span
                v-else
                aria-hidden="true"
                class="size-4 shrink-0"
            />
            <slot
                name="item"
                :expanded="expanded.includes(row.node.id)"
                :node="row.node"
                :selected="selected === row.node.id"
            >
                {{ row.node.label }}
            </slot>
        </div>
        <div
            v-if="!rows.length"
            class="p-3 text-gray-600 dark:text-gray-300"
        >
            <slot name="empty">
                {{ emptyText }}
            </slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import Icon from '@Components/Icon.vue'
import { generateUuid } from '@Utils/uuid'

export interface TreeNode {
    id: string
    label: string
    disabled?: boolean
    children?: TreeNode[]
}
interface Row {
    node: TreeNode
    parent?: string
    level: number
    position: number
    size: number
}
const props = withDefaults(defineProps<{ items: TreeNode[]; label: string; emptyText?: string }>(), { emptyText: 'No items' })
const selected = defineModel<string | null>({ default: null })
const expanded = defineModel<string[]>('expanded', { default: () => [] })
const emit = defineEmits<{ select: [node: TreeNode] }>()
const treeId = generateUuid('tree')
const tree = ref<HTMLElement | null>(null)
const focused = ref<string | null>(null)
const rows = computed(() => {
    const result: Row[] = []
    const visit = (items: TreeNode[], level: number, parent?: string) => {
        items.forEach((node, index) => {
            result.push({ node, level, parent, position: index + 1, size: items.length })
            if (node.children && expanded.value.includes(node.id)) visit(node.children, level + 1, node.id)
        })
    }
    visit(props.items, 1)
    return result
})
const navigable = computed(() => rows.value.filter(row => !row.node.disabled))
const tabId = computed(() => [focused.value, selected.value].find(id => navigable.value.some(row => row.node.id === id)) ?? navigable.value[0]?.node.id)
const focusNode = async (id?: string) => {
    if (!id) return
    focused.value = id
    await nextTick()
    document.getElementById(`${treeId}-${encodeURIComponent(id)}`)?.focus()
}
const toggle = (node: TreeNode, open = !expanded.value.includes(node.id)) => {
    if (node.disabled || !node.children?.length) return
    expanded.value = open ? [...new Set([...expanded.value, node.id])] : expanded.value.filter(id => id !== node.id)
}
const select = (node: TreeNode) => {
    if (node.disabled) return
    selected.value = node.id
    emit('select', node)
}
const activate = (node: TreeNode) => {
    if (node.disabled) return
    select(node)
    toggle(node)
    void focusNode(node.id)
}
let search = ''
let searchTimer: ReturnType<typeof setTimeout> | undefined
const onKeydown = (event: KeyboardEvent) => {
    if (event.isComposing) return
    const index = navigable.value.findIndex(row => row.node.id === tabId.value)
    const row = navigable.value[index]
    if (!row) return
    const rtl = tree.value && getComputedStyle(tree.value).direction === 'rtl'
    const openKey = rtl ? 'ArrowLeft' : 'ArrowRight'
    const closeKey = rtl ? 'ArrowRight' : 'ArrowLeft'
    const key = event.key
    if (['ArrowDown', 'ArrowUp', openKey, closeKey, 'Home', 'End', 'Enter', ' ', '*'].includes(key)) event.preventDefault()
    if (key === 'ArrowDown') void focusNode(navigable.value[Math.min(index + 1, navigable.value.length - 1)]?.node.id)
    else if (key === 'ArrowUp') void focusNode(navigable.value[Math.max(index - 1, 0)]?.node.id)
    else if (key === 'Home') void focusNode(navigable.value[0]?.node.id)
    else if (key === 'End') void focusNode(navigable.value.at(-1)?.node.id)
    else if (key === openKey) {
        if (!expanded.value.includes(row.node.id)) toggle(row.node, true)
        else void focusNode(navigable.value.find(item => item.parent === row.node.id)?.node.id)
    } else if (key === closeKey) {
        if (expanded.value.includes(row.node.id) && row.node.children?.length) toggle(row.node, false)
        else if (row.parent) void focusNode(navigable.value.find(item => item.node.id === row.parent)?.node.id)
    } else if (key === 'Enter' || key === ' ') select(row.node)
    else if (key === '*') {
        expanded.value = [...new Set([...expanded.value, ...rows.value.filter(item => item.parent === row.parent && !item.node.disabled && item.node.children?.length).map(item => item.node.id)])]
    } else if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        search += key.toLocaleLowerCase()
        clearTimeout(searchTimer)
        searchTimer = setTimeout(() => { search = '' }, 500)
        const ordered = [...navigable.value.slice(index + 1), ...navigable.value.slice(0, index + 1)]
        const query = [...search].every(character => character === search[0]) ? search[0] : search
        const match = ordered.find(item => item.node.label.toLocaleLowerCase().startsWith(query))
        if (match) void focusNode(match.node.id)
    }
}
watch(rows, (value, previous) => {
    if (!focused.value || navigable.value.some(row => row.node.id === focused.value)) return
    let ancestor = previous.find(row => row.node.id === focused.value)?.parent
    while (ancestor && !navigable.value.some(row => row.node.id === ancestor)) ancestor = previous.find(row => row.node.id === ancestor)?.parent
    const hadFocus = tree.value?.contains(document.activeElement)
    focused.value = ancestor ?? navigable.value[0]?.node.id ?? null
    if (hadFocus) {
        if (focused.value) void focusNode(focused.value)
        else void nextTick(() => tree.value?.focus())
    }
})
onBeforeUnmount(() => clearTimeout(searchTimer))
</script>
