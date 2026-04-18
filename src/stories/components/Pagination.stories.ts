import type { Meta, StoryObj } from '@storybook/vue3'
import Pagination from '@Components/Pagination.vue'
import { userEvent, expect, within } from 'storybook/test'
import { ref } from 'vue'

const meta: Meta<typeof Pagination> = {
    title: 'Components/Pagination',
    component: Pagination,

    argTypes: {
        modelValue: { control: 'number', description: 'Current page (1-based).' },
        siblings: { control: 'number', description: 'Page buttons shown either side of the current page.' },
        total: { control: 'number', description: 'Total number of pages.' }
    },

    args: {
        modelValue: 1,
        siblings: 1,
        total: 10
    }
}

meta.render = (args, { updateArgs }) => ({
    components: { Pagination },
    setup() {
        return { args, updateArgs }
    },
    template: '<Pagination v-bind="args" @update:modelValue="updateArgs({ modelValue: $event })" />'
})

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        const nav = canvas.getByRole('navigation', { name: 'Pagination' })
        await expect(nav).toBeVisible()

        const prevButton = canvas.getByRole('button', { name: 'Previous page' })
        const nextButton = canvas.getByRole('button', { name: 'Next page' })

        // First page: prev disabled
        await expect(prevButton).toBeDisabled()
        await expect(nextButton).not.toBeDisabled()

        // Page 1 is active
        const page1 = canvas.getByRole('button', { name: 'Page 1' })
        await expect(page1).toHaveAttribute('aria-current', 'page')
    }
}

export const MiddlePage: Story = {
    args: { modelValue: 5 },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await expect(canvas.getByRole('button', { name: 'Previous page' })).not.toBeDisabled()
        await expect(canvas.getByRole('button', { name: 'Next page' })).not.toBeDisabled()

        const page5 = canvas.getByRole('button', { name: 'Page 5' })
        await expect(page5).toHaveAttribute('aria-current', 'page')

        // Ellipsis on both sides
        const ellipses = canvasElement.querySelectorAll('[aria-hidden="true"]')
        const dots = Array.from(ellipses).filter(el => el.textContent?.includes('…'))
        await expect(dots.length).toBe(2)
    }
}

export const LastPage: Story = {
    args: { modelValue: 10 },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await expect(canvas.getByRole('button', { name: 'Next page' })).toBeDisabled()
        await expect(canvas.getByRole('button', { name: 'Previous page' })).not.toBeDisabled()

        const page10 = canvas.getByRole('button', { name: 'Page 10' })
        await expect(page10).toHaveAttribute('aria-current', 'page')
    }
}

export const FewPages: Story = {
    args: { modelValue: 1, total: 4 },

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        // All pages shown, no ellipsis
        for (let i = 1; i <= 4; i++) {
            await expect(canvas.getByRole('button', { name: `Page ${i}` })).toBeVisible()
        }
        const dots = Array.from(canvasElement.querySelectorAll('[aria-hidden="true"]')).filter(el => el.textContent?.includes('…'))
        await expect(dots.length).toBe(0)
    }
}

export const Controlled: Story = {
    render: () => ({
        components: { Pagination },
        setup() {
            const page = ref(1)
            return { page }
        },
        template: `
            <div class="flex flex-col items-center gap-4">
                <p class="text-sm text-gray-600 dark:text-gray-400">Current page: {{ page }}</p>
                <Pagination v-model="page" :total="10" />
            </div>
        `
    }),

    async play({ canvasElement }) {
        const canvas = within(canvasElement)

        await expect(canvas.getByText('Current page: 1')).toBeVisible()

        await userEvent.click(canvas.getByRole('button', { name: 'Next page' }))
        await expect(canvas.getByText('Current page: 2')).toBeVisible()

        await userEvent.click(canvas.getByRole('button', { name: 'Page 5' }))
        await expect(canvas.getByText('Current page: 5')).toBeVisible()

        await userEvent.click(canvas.getByRole('button', { name: 'Previous page' }))
        await expect(canvas.getByText('Current page: 4')).toBeVisible()
    }
}

