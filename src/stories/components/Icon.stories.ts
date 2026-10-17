import { iconControl } from '../iconControl'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, fireEvent, userEvent, within } from 'storybook/test'
import { computed, ref, watch } from 'vue'
import { IconBrandGithub } from '@tabler/icons-vue'
import { availableIcons, availableSizes } from '@Composables/useIcons'
import Icon from '@Components/Icon.vue'
import Button from '@Components/Button.vue'

const meta: Meta<typeof Icon> = {
    title: 'Components/Icon',
    component: Icon,

    parameters: {
        docs: {
            description: {
                component: 'Every icon from the installed Tabler catalogue is available by name without imports or registration, including brands and filled variants. Use names without the Icon prefix, such as BrandGithub or StarFilled. registerIcons() remains available for custom icons and overrides. Supports xs through 9xl sizes.'
            }
        }
    },

    argTypes: {
        icon: iconControl,
        size: {
            control: 'select',
            options: [...Object.keys(availableSizes)]
        }
    },

    args: {
        icon: 'ArrowDown',
        size: '2xl'
    },

    render: (args) => ({
        components: { Icon },

        setup() {
            return { args }
        },

        template: `
            <Icon
                :icon="args.icon"
                :size="args.size"
            />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const svg = canvasElement.querySelector('svg')
        await expect(svg).toBeInTheDocument()
    }
}

export const IconGrid: Story = {
    render: () => ({
        components: { Icon },

        setup() {
            const icons = ['ArrowDown', 'BrandGithub', 'BrandLinkedin', 'Calendar', 'Check', 'HeartFilled', 'Mail', 'Search', 'Settings', 'StarFilled', 'World', 'ZoomIn']
            const sizes = ['sm', 'base', 'lg', 'xl', '2xl', '3xl'] as const
            return { icons, sizes }
        },

        template: `
            <div class="space-y-8 p-4">
                <div
                    v-for="size in sizes"
                    :key="size"
                >
                    <p class="mb-3 text-sm font-medium text-gray-500">{{ size }}</p>
                    <div class="flex flex-wrap gap-4">
                        <div
                            v-for="name in icons"
                            :key="name"
                            class="flex flex-col items-center gap-1"
                            :title="name"
                        >
                            <Icon
                                :icon="name"
                                :size="size"
                            />
                            <span class="text-xs text-gray-600 dark:text-gray-400 max-w-16 truncate">{{ name }}</span>
                        </div>
                    </div>
                </div>
            </div>
        `
    }),

    play: async ({ canvasElement }) => {
        const svgs = canvasElement.querySelectorAll('svg')
        await expect(svgs.length).toBeGreaterThan(0)
    }
}

export const CustomIcon: Story = {
    render: () => ({
        components: { Icon },

        setup() {
            return { IconBrandGithub }
        },

        template: `
            <div class="flex items-center gap-4">
                <Icon
                    :icon="IconBrandGithub"
                    size="xl"
                />
                <span class="text-sm text-gray-600">Passing a Tabler component directly — no registry lookup needed</span>
            </div>
        `
    }),

    play: async ({ canvasElement }) => {
        const svg = canvasElement.querySelector('svg')
        await expect(svg).toBeInTheDocument()
    }
}

export const NotInRegistry: Story = {
    args: {
        icon: 'NonExistentIcon' as never,
        size: '2xl'
    },

    play: async ({ canvasElement }) => {
        const svgs = canvasElement.querySelectorAll('svg')
        await expect(svgs).toHaveLength(0)
    }
}


export const FullTablerCatalogue: Story = {
    render: () => ({
        components: { Icon, Button },
        template: `
            <div class="flex items-center gap-4">
                <Icon icon="BrandGithub" />
                <Icon icon="StarFilled" />
                <Icon icon="World" />
                <Icon icon="123" />
                <Icon icon="Collapse" />
                <Button icon="BrandLinkedin">Visit LinkedIn</Button>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        for (const name of ['brand-github', 'star-filled', 'world', 'number-123', 'arrows-minimize', 'brand-linkedin']) {
            await expect(canvasElement.querySelector(`svg.tabler-icon-${name}`)).toBeInTheDocument()
        }
        await expect(within(canvasElement).getByRole('button', { name: 'Visit LinkedIn' })).toBeVisible()
    }
}

export const BrowseCatalogue: Story = {
    render: () => ({
        components: { Icon },
        setup() {
            const query = ref('')
            const selected = ref('BrandGithub')
            const names = Object.keys(availableIcons).sort()
            const page = ref(0)
            const matches = computed(() => names.filter(name => name.toLowerCase().includes(query.value.trim().toLowerCase())))
            const pageCount = computed(() => Math.max(1, Math.ceil(matches.value.length / 100)))
            const visibleNames = computed(() => matches.value.slice(page.value * 100, (page.value + 1) * 100))
            watch(query, () => { page.value = 0 })
            return { query, selected, names, matches, page, pageCount, visibleNames }
        },
        template: `
            <div class="grid max-w-xl gap-4 text-gray-900 dark:text-gray-100">
                <label class="grid gap-1">
                    Search icon names
                    <input v-model="query" class="rounded-lg border border-gray-500 bg-white p-2 dark:bg-gray-900" type="search" />
                </label>
                <p role="status">{{ matches.length }} of {{ names.length }} icon names · Page {{ page + 1 }} of {{ pageCount }}</p>
                <label class="grid gap-1">
                    All available icons
                    <select v-model="selected" class="rounded-lg border border-gray-500 bg-white p-2 dark:bg-gray-900" size="12">
                        <option v-for="name in visibleNames" :key="name" :value="name">{{ name }}</option>
                    </select>
                </label>
                <p v-if="!matches.length">No matching icons. Try a different name.</p>
                <div class="flex gap-4">
                    <button :disabled="page === 0" type="button" @click="page--">Previous page</button>
                    <button :disabled="page + 1 >= pageCount" type="button" @click="page++">Next page</button>
                </div>
                <div class="flex items-center gap-4">
                    <Icon :icon="selected" size="5xl" />
                    <code>{{ selected }}</code>
                </div>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const search = canvas.getByLabelText('Search icon names')
        const list = canvas.getByLabelText('All available icons')
        const names = Object.keys(availableIcons).sort()
        await expect(canvas.getByRole('status')).toHaveTextContent(`${names.length} of ${names.length} icon names`)
        await expect(list.querySelectorAll('option').length).toBe(100)
        await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
        await expect(list.querySelector('option')).toHaveTextContent(names[100])
        await fireEvent.input(search, { target: { value: 'StarFilled' } })
        await userEvent.selectOptions(list, 'StarFilled')
        await expect(canvasElement.querySelector('svg.tabler-icon-star-filled')).toBeInTheDocument()
        await fireEvent.input(search, { target: { value: 'NoSuchTablerIcon12345' } })
        await expect(canvas.getByText('No matching icons. Try a different name.')).toBeVisible()
        await fireEvent.input(search, { target: { value: '' } })
        await expect(canvas.getByRole('status')).toHaveTextContent(`${names.length} of ${names.length} icon names`)
        await expect(list.querySelectorAll('option').length).toBe(100)
        await expect(canvas.getByRole('button', { name: 'Previous page' })).toBeDisabled()
    }
}
