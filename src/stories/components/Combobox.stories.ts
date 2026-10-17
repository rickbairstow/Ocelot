import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, fireEvent, fn, userEvent, waitFor, within } from 'storybook/test'
import { computed, ref } from 'vue'
import Combobox from '@Components/Combobox.vue'
import type { ComboboxOption } from '@Components/Combobox.vue'
import FormField from '@Components/FormField.vue'
import Button from '@Components/Button.vue'

const options: ComboboxOption[] = [
    { value: 'gb', label: 'United Kingdom' },
    { value: 'us', label: 'United States' },
    { value: 'de', label: 'Germany' },
    { value: 'fr', label: 'France' }
]
const pageFor = (page: number) => Array.from({ length: 20 }, (_, index) => ({
    value: `project-${page * 20 + index + 1}`,
    label: `Project ${page * 20 + index + 1}`
}))
const pause = () => new Promise(resolve => setTimeout(resolve, 80))
const getPopup = (input: HTMLElement) => document.getElementById(input.getAttribute('aria-controls')!)!

const meta: Meta<typeof Combobox> = {
    title: 'Components/Inputs/Combobox',
    component: Combobox,
    parameters: {
        docs: {
            description: {
                component: `A searchable selection control with a Floating UI listbox. Default uses local, case-insensitive label filtering. The component never fetches data. Use mode="remote" when the parent supplies filtered results in response to search events. Both modes can request additional pages through load-more when hasMore is true.

Use a string or null model for single selection and string[] with multiple. Options require unique, non-empty string values and labels. Disabled options remain readable and cannot be selected. The tick represents actual selection; keyboard navigation does not commit a value until Enter. Escape and Tab discard the search text and preserve the selection. Clear selection is keyboard accessible.

Supply label, a FormField label, or aria-label. FormField provides linked hint/error text and invalid styling. A hidden native select submits the selected value under name (repeated values for multiple), supports form="id" and native required validation. Search text is never submitted. Exposes element, focus(), open(), close(), isOpen and retryLoadMore(). Validation rules remain with the parent.

The popup is created only while open. It flips, shifts, resizes and follows the trigger as the page moves. maxHeight defaults to 400 pixels; use 'viewport' for all available space, not a modal full-screen takeover. The popup inherits the trigger's dark theme. Every supplied matching option renders; this is incremental data loading, not virtual scrolling.

Remote contract: search emits the query after searchDelay (250ms by default), including an empty query on open. Replace options when results arrive and control loading and hasMore. Debouncing does not cancel requests: the parent must cancel or ignore stale responses. selectedOptions can hydrate labels for initially selected values absent from the current page; selected labels are retained when result pages change.

load-more emits { search } within loadMoreThreshold menu-heights of the bottom (default 1 = 100%). Short lists can request the next page immediately. Each request is locked until options are replaced/appended or the query changes; loading=false alone does not unlock it. Stop with hasMore=false. After a failed page request, keep existing options and call retryLoadMore() when the user elects to retry. Parent code owns page numbers, caching, networking and error messages.`
            }
        }
    },
    decorators: [() => ({ template: '<div class="max-w-md"><story /></div>' })]
}
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { Combobox },
        setup: () => ({ value: ref(null), options }),
        template: '<Combobox v-model="value" label="Country" name="country" :options="options" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const input = canvas.getByRole('combobox', { name: 'Country' })
        await expect(input).toHaveAttribute('placeholder', 'Select an option…')
        await expect(input).toHaveAttribute('aria-expanded', 'false')
        await userEvent.click(input)
        await expect(input).toHaveFocus()
        await userEvent.type(input, 'united')
        await waitFor(() => expect(within(getPopup(input)).getAllByRole('option')).toHaveLength(2))
        await userEvent.keyboard('{ArrowDown}{Enter}')
        await expect(input).toHaveValue('United Kingdom')
        await expect(input).toHaveAttribute('aria-expanded', 'false')
        await userEvent.click(input)
        await expect(within(getPopup(input)).getByRole('option', { name: 'United Kingdom' })).toHaveAttribute('aria-selected', 'true')
        await userEvent.type(input, 'nothing')
        await expect(await within(document.body).findByText('No results found')).toBeVisible()
        await userEvent.keyboard('{Escape}')
        await expect(input).toHaveValue('United Kingdom')
        await expect(input).toHaveFocus()
        await userEvent.tab()
        const clear = canvas.getByRole('button', { name: 'Clear selection' })
        await expect(clear).toHaveFocus()
        await userEvent.keyboard('{Enter}')
        await expect(input).toHaveValue('')
        // A trigger near the viewport bottom must place its menu above the field.
        const root = input.parentElement!.parentElement!
        const originalStyle = root.style.cssText
        try {
            Object.assign(root.style, { position: 'fixed', bottom: '8px', width: '320px' })
            await userEvent.click(input)
            const panel = getPopup(input).parentElement!
            await waitFor(() => expect(panel.getBoundingClientRect().height).toBeGreaterThan(0))
            await waitFor(() => expect(panel.getBoundingClientRect().bottom).toBeLessThanOrEqual(input.getBoundingClientRect().top))
            await expect(panel.getBoundingClientRect().height).toBeLessThanOrEqual(400)
            await userEvent.keyboard('{Escape}')
        } finally {
            root.style.cssText = originalStyle
        }
    }
}

export const Multiple: Story = {
    render: () => ({
        components: { Combobox },
        setup: () => ({ values: ref<string[]>([]), options }),
        template: '<Combobox v-model="values" label="Countries" multiple name="countries" :options="options" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('combobox')
        await userEvent.click(input)
        await expect(getPopup(input)).toHaveAttribute('aria-multiselectable', 'true')
        await userEvent.keyboard('{ArrowDown}{Enter}{ArrowDown}{Enter}')
        const list = within(getPopup(input))
        await expect(list.getByRole('option', { name: 'United Kingdom' })).toHaveAttribute('aria-selected', 'true')
        await expect(list.getByRole('option', { name: 'United States' })).toHaveAttribute('aria-selected', 'true')
        await expect(input).toHaveFocus()
        await userEvent.keyboard('{Enter}')
        await expect(list.getByRole('option', { name: 'United States' })).toHaveAttribute('aria-selected', 'false')
        await userEvent.keyboard('{Escape}')
        await expect(input).toHaveValue('United Kingdom')
    }
}

export const DisabledOptions: Story = {
    render: () => ({
        components: { Combobox },
        setup: () => ({ value: ref(null), saved: ref('old'), options: [{ value: 'old', label: 'Archived project', disabled: true }, ...options] }),
        template: '<div class="grid gap-4"><Combobox v-model="value" label="Destination" :options="options" /><Combobox v-model="saved" label="Saved project" :options="options" /></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('combobox', { name: 'Destination' })
        await userEvent.click(input)
        const disabled = within(getPopup(input)).getByRole('option', { name: 'Archived project' })
        await expect(disabled).toHaveAttribute('aria-disabled', 'true')
        await userEvent.click(disabled)
        await expect(input).toHaveAttribute('aria-expanded', 'true')
        await userEvent.keyboard('{ArrowDown}')
        await expect(document.getElementById(input.getAttribute('aria-activedescendant')!)).toHaveTextContent('United Kingdom')
        await userEvent.keyboard('{End}{Enter}')
        await expect(input).toHaveValue('France')
        const darkInput = within(canvasElement).getByRole('combobox', { name: 'Saved project' })
        await userEvent.click(darkInput)
        const saved = within(getPopup(darkInput)).getByRole('option', { name: 'Archived project' })
        await expect(saved).toHaveAttribute('aria-selected', 'true')
        await expect(getComputedStyle(saved).opacity).toBe('1')

    }
}

export const Disabled: Story = {
    render: () => ({
        components: { Combobox },
        setup: () => ({ options }),
        template: '<Combobox disabled label="Country" :options="options" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        await expect(canvas.getByRole('combobox')).toBeDisabled()
        await expect(canvas.getByRole('button', { name: 'Open options' })).toBeDisabled()
    }
}

export const Empty: Story = {
    render: () => ({
        components: { Combobox },
        template: '<Combobox label="Project" :options="[]" placeholder="Choose a project…" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('combobox')
        await userEvent.click(input)
        await expect(await within(document.body).findByText('No results found')).toBeVisible()
        await expect(within(getPopup(input)).queryAllByRole('option')).toHaveLength(0)
        await userEvent.keyboard('{ArrowDown}{ArrowUp}{Enter}')
        await expect(input).toHaveValue('')
    }
}

export const Loading: Story = {
    render: () => ({
        components: { Combobox },
        template: '<Combobox label="Project" loading :options="[]" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('combobox')
        await userEvent.click(input)
        await expect(getPopup(input)).toHaveAttribute('aria-busy', 'true')
        await expect(within(document.body).queryByText('No results found')).not.toBeInTheDocument()

    }
}

export const LazyOptions: Story = {
    render: () => ({
        components: { Combobox },
        setup() {
            const items = ref<ComboboxOption[]>([])
            const loading = ref(false)
            const load = async () => {
                if (items.value.length || loading.value) return
                loading.value = true
                await pause()
                items.value = options
                loading.value = false
            }
            return { items, loading, load, value: ref(null) }
        },
        template: '<Combobox v-model="value" label="Country" :loading="loading" :options="items" @open="load" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('combobox')
        await userEvent.click(input)
        await waitFor(() => expect(within(getPopup(input)).getAllByRole('option')).toHaveLength(4))
        await userEvent.type(input, 'germany')
        await waitFor(() => expect(within(getPopup(input)).getAllByRole('option')).toHaveLength(1))
        await userEvent.keyboard('{ArrowDown}{Enter}')
        await expect(input).toHaveValue('Germany')
    }
}

const searched = fn()
export const RemoteSearch: Story = {
    render: () => ({
        components: { Combobox },
        setup() {
            const items = ref<ComboboxOption[]>([])
            const loading = ref(false)
            let latestRequest = 0
            const search = async (query: string) => {
                searched(query)
                const request = ++latestRequest
                loading.value = true
                await pause()
                if (request !== latestRequest) return
                // Server aliases demonstrate that remote results are not filtered again locally.
                items.value = query.toLowerCase() === 'uk' ? [options[0]] : options.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
                loading.value = false
            }
            return { value: ref(null), items, loading, search }
        },
        template: '<Combobox v-model="value" label="Country" :loading="loading" mode="remote" :options="items" :search-delay="40" @search="search" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        searched.mockClear()
        const input = within(canvasElement).getByRole('combobox')
        await userEvent.click(input)
        await waitFor(() => expect(searched).toHaveBeenCalledWith(''))
        await fireEvent.compositionStart(input)
        await fireEvent.input(input, { target: { value: 'de' } })
        await fireEvent.keyDown(input, { key: 'Enter', isComposing: true })
        await pause()
        await expect(searched).not.toHaveBeenCalledWith('de')
        await expect(input).toHaveAttribute('aria-expanded', 'true')
        await fireEvent.compositionEnd(input)
        await waitFor(() => expect(within(getPopup(input)).getByRole('option', { name: 'Germany' })).toBeVisible())
        await userEvent.clear(input)
        await userEvent.type(input, 'uk')
        await waitFor(() => expect(searched).toHaveBeenCalledWith('uk'))
        await waitFor(() => expect(within(getPopup(input)).getByRole('option', { name: 'United Kingdom' })).toBeVisible())
        await expect(searched.mock.calls.some(([query]) => query === 'u')).toBe(false)
        await userEvent.keyboard('{ArrowDown}{Enter}')
        await expect(input).toHaveValue('United Kingdom')
        await userEvent.click(input)
        await fireEvent.input(input, { target: { value: 'cancelled' } })
        await userEvent.keyboard('{Escape}')
        await pause()
        await expect(searched).not.toHaveBeenCalledWith('cancelled')
    }
}

const loaded = fn()
export const InfiniteLoading: Story = {
    render: () => ({
        components: { Combobox },
        setup() {
            const items = ref(pageFor(0))
            const loading = ref(false)
            const page = ref(0)
            const loadMore = async () => {
                loaded()
                loading.value = true
                await pause()
                items.value = [...items.value, ...pageFor(++page.value)]
                loading.value = false
            }
            return { items, loading, page, loadMore, value: ref(null) }
        },
        template: '<Combobox v-model="value" :has-more="page < 2" label="Project" :loading="loading" :max-height="180" :options="items" @load-more="loadMore" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        loaded.mockClear()
        const input = within(canvasElement).getByRole('combobox')
        await userEvent.click(input)
        const list = getPopup(input)
        await waitFor(() => expect(list.clientHeight).toBeGreaterThan(0))
        await expect(loaded).not.toHaveBeenCalled()
        await userEvent.keyboard('{ArrowDown}')
        const activeId = input.getAttribute('aria-activedescendant')
        list.scrollTop = list.scrollHeight - list.clientHeight * 1.8
        await fireEvent.scroll(list)
        await fireEvent.scroll(list)
        await waitFor(() => expect(loaded).toHaveBeenCalledTimes(1))
        await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(40))
        await expect(input).toHaveAttribute('aria-activedescendant', activeId)
        list.scrollTop = list.scrollHeight
        await fireEvent.scroll(list)
        await waitFor(() => expect(loaded).toHaveBeenCalledTimes(2))
        await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(60))
        list.scrollTop = list.scrollHeight
        await fireEvent.scroll(list)
        await expect(loaded).toHaveBeenCalledTimes(2)

    }
}

export const WithFormField: Story = {
    render: () => ({
        components: { Combobox, FormField, Button },
        setup() {
            const value = ref<string | null>(null)
            const submitted = ref(false)
            const error = computed(() => submitted.value && !value.value ? 'Choose a country.' : '')
            return { value, error, options, submit: () => { submitted.value = true } }
        },
        template: '<form novalidate @submit.prevent="submit"><FormField :error="error" hint="Choose your delivery country." label="Country" required><Combobox v-model="value" name="country" :options="options" /></FormField><div class="mt-4"><Button type="submit">Continue</Button></div></form>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const input = canvas.getByRole('combobox', { name: /country/i })
        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(input).toHaveAttribute('aria-invalid', 'true')
        await expect(input).toHaveAttribute('aria-required', 'true')
        await expect(input).toHaveAccessibleDescription('Choose your delivery country. Choose a country.')
        await userEvent.click(input)
        await userEvent.keyboard('{ArrowDown}{Enter}')
        await expect(canvas.queryByRole('alert')).not.toBeInTheDocument()
        await expect(new FormData(canvasElement.querySelector('form')!).get('country')).toBe('gb')
    }
}

export const ViewportHeight: Story = {
    render: () => ({
        components: { Combobox },
        setup: () => ({ value: ref(null), options: [...pageFor(0), ...pageFor(1)] }),
        template: '<Combobox v-model="value" label="Project" max-height="viewport" :options="options" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('combobox')
        await userEvent.click(input)
        const panel = getPopup(input).parentElement!
        await waitFor(() => expect(panel.getBoundingClientRect().height).toBeGreaterThan(0))
        await expect(panel.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight)
        await expect(panel.getBoundingClientRect().top).toBeGreaterThanOrEqual(0)

    }
}

export const SelectedRemoteValue: Story = {
    render: () => ({
        components: { Combobox },
        setup: () => ({ value: ref('gb'), selected: [options[0]], items: [options[2]] }),
        template: '<Combobox v-model="value" label="Country" mode="remote" :options="items" :selected-options="selected" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('combobox')
        await expect(input).toHaveValue('United Kingdom')
        await userEvent.click(input)
        await userEvent.keyboard('{Escape}')
        await expect(input).toHaveValue('United Kingdom')
    }
}

const retried = fn()
export const RetryLoading: Story = {
    render: () => ({
        components: { Combobox, Button },
        setup() {
            const items = ref(pageFor(0))
            const loading = ref(false)
            const error = ref('')
            const combo = ref<InstanceType<typeof Combobox> | null>(null)
            let attempts = 0
            const loadMore = async () => {
                retried()
                loading.value = true
                await pause()
                if (++attempts === 1) error.value = 'More projects could not be loaded.'
                else items.value = [...items.value, ...pageFor(1)]
                loading.value = false
            }
            const retry = () => {
                error.value = ''
                combo.value?.open()
                combo.value?.retryLoadMore()
            }
            return { items, loading, error, combo, loadMore, retry, value: ref(null) }
        },
        template: '<div class="grid gap-3"><Combobox ref="combo" v-model="value" :has-more="items.length < 40" label="Project" :loading="loading" :max-height="180" :options="items" @load-more="loadMore" /><div v-if="error"><p class="mb-2 text-sm text-red-600 dark:text-red-400" role="alert">{{ error }}</p><Button variant="secondary" @click="retry">Retry loading projects</Button></div></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        retried.mockClear()
        const canvas = within(canvasElement)
        const input = canvas.getByRole('combobox')
        await userEvent.click(input)
        const list = getPopup(input)
        await waitFor(() => expect(list.clientHeight).toBeGreaterThan(0))
        list.scrollTop = list.scrollHeight
        await fireEvent.scroll(list)
        await expect(await canvas.findByRole('alert')).toHaveTextContent('More projects could not be loaded.')
        await fireEvent.scroll(list)
        await expect(retried).toHaveBeenCalledTimes(1)
        await userEvent.keyboard('{Escape}')
        await userEvent.click(input)
        await fireEvent.scroll(getPopup(input))
        await expect(retried).toHaveBeenCalledTimes(1)
        await userEvent.click(canvas.getByRole('button', { name: 'Retry loading projects' }))
        await waitFor(() => expect(retried).toHaveBeenCalledTimes(2))
        await waitFor(() => expect(within(getPopup(input)).getAllByRole('option')).toHaveLength(40))
        await userEvent.keyboard('{Escape}')
    }
}

export const RemotePages: Story = {
    render: () => ({
        components: { Combobox },
        setup() {
            const projects = [...pageFor(0), ...pageFor(1), ...pageFor(2)]
            const items = ref<ComboboxOption[]>([])
            const loading = ref(false)
            const hasMore = ref(false)
            let page = 0
            let requestVersion = 0
            const load = async (query: string, reset: boolean) => {
                if (reset) page = 0
                const request = ++requestVersion
                const requestedPage = page
                loading.value = true
                await pause()
                if (request !== requestVersion) return
                const matches = projects.filter(option => option.label.toLowerCase().includes(query.toLowerCase()))
                const result = matches.slice(requestedPage * 20, (requestedPage + 1) * 20)
                items.value = reset ? result : [...items.value, ...result]
                hasMore.value = (requestedPage + 1) * 20 < matches.length
                page = requestedPage + 1
                loading.value = false
            }
            return { items, loading, hasMore, value: ref(null), search: (query: string) => load(query, true), nextPage: ({ search }: { search: string }) => load(search, false) }
        },
        template: '<Combobox v-model="value" :has-more="hasMore" label="Project" :loading="loading" :max-height="180" mode="remote" :options="items" :search-delay="30" @load-more="nextPage" @search="search" />'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const input = within(canvasElement).getByRole('combobox')
        await userEvent.click(input)
        await waitFor(() => expect(within(getPopup(input)).getAllByRole('option')).toHaveLength(20))
        const list = getPopup(input)
        list.scrollTop = list.scrollHeight
        await fireEvent.scroll(list)
        await waitFor(() => expect(within(list).getAllByRole('option')).toHaveLength(40))
        await userEvent.type(input, 'Project 60')
        await waitFor(() => expect(within(getPopup(input)).getAllByRole('option')).toHaveLength(1))
        await userEvent.keyboard('{ArrowDown}{Enter}')
        await expect(input).toHaveValue('Project 60')
    }
}

export const NativeForm: Story = {
    render: () => ({
        components: { Combobox, Button },
        setup: () => ({ values: ref<string[]>([]), options }),
        template: '<form><Combobox v-model="values" :clearable="false" label="Countries" multiple name="countries" :options="options" required /><div class="mt-3"><Button type="submit">Continue</Button></div></form>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const form = canvasElement.querySelector('form')!
        const input = canvas.getByRole('combobox')
        const native = canvasElement.querySelector('select')!
        await expect(native.validity.valueMissing).toBe(true)
        await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
        await expect(input).toHaveFocus()
        await userEvent.keyboard('{ArrowDown}{Enter}{ArrowDown}{Enter}')
        await expect(native.validity.valid).toBe(true)
        await expect(new FormData(form).getAll('countries')).toEqual(['gb', 'us'])
        await expect(canvas.queryByRole('button', { name: 'Clear selection' })).not.toBeInTheDocument()
        await userEvent.keyboard('{Escape}')
    }
}


