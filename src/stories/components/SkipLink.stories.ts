import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, userEvent, within } from 'storybook/test'
import SkipLink from '@Components/SkipLink.vue'

const meta: Meta<typeof SkipLink> = {
    title: 'Components/SkipLink',
    component: SkipLink,
    parameters: {
        docs: {
            description: {
                component: 'A visually hidden link that becomes visible on keyboard focus. Place it as the very first element in the page `<body>` so keyboard users can skip past repeated navigation to the main content. Required by WCAG 2.4.1 Bypass Blocks (Level A).'
            }
        }
    }
}

export default meta
type Story = StoryObj<typeof SkipLink>

export const Default: Story = {
    render: () => ({
        components: { SkipLink },
        template: `
            <div>
                <SkipLink />
                <p class="mt-16 text-sm text-gray-500">Tab into this story to reveal the skip link.</p>
                <main id="main" class="mt-4 rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-600">
                    Main content area
                </main>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const link = canvas.getByRole('link', { name: 'Skip to main content' })

        await expect(link).toBeInTheDocument()
        await expect(link).toHaveAttribute('href', '#main')

        await userEvent.tab()
        await expect(link).toHaveFocus()
    }
}

export const CustomTarget: Story = {
    render: () => ({
        components: { SkipLink },
        template: `
            <div>
                <SkipLink target="content" label="Skip to content" />
                <section id="content" class="mt-16 rounded-xl border border-dashed border-gray-300 p-6 text-sm text-gray-600">
                    Content section
                </section>
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const link = within(canvasElement).getByRole('link', { name: 'Skip to content' })
        await expect(link).toHaveAttribute('href', '#content')
    }
}
