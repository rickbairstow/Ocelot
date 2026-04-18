import type { Meta, StoryObj } from '@storybook/vue3'
import Banner from '@Components/Banner.vue'
import type { BannerType, BannerVariant } from '@Components/Banner.vue'
import { expect, userEvent, within } from 'storybook/test'

const types: BannerType[] = ['info', 'success', 'warning', 'error']
const variants: BannerVariant[] = ['subtle', 'solid', 'outline']

const meta: Meta<typeof Banner> = {
    title: 'Components/Banner',
    component: Banner,

    parameters: {
        docs: {
            description: {
                component: 'Inline feedback message for alerts, warnings, errors, and success states. Sits within page content rather than appearing as a floating notification. Supports subtle, solid, and outline variants with an optional dismiss button.'
            }
        }
    },

    argTypes: {
        dismissible: {
            control: 'boolean',
            description: 'Shows a dismiss button and emits @dismiss when clicked.'
        },
        title: {
            control: 'text',
            description: 'Optional heading above the body text.'
        },
        type: {
            control: 'select',
            options: types,
            description: 'Semantic type — sets icon and colour scheme.'
        },
        variant: {
            control: 'select',
            options: variants,
            description: 'Visual intensity: subtle (tinted bg), solid (filled), outline (border only).'
        }
    },

    args: {
        dismissible: false,
        title: '',
        type: 'info',
        variant: 'subtle'
    },

    render: (args) => ({
        components: { Banner },
        setup() { return { args } },
        template: `
            <Banner
                :dismissible="args.dismissible"
                :title="args.title || undefined"
                :type="args.type"
                :variant="args.variant"
            >
                <p>This is an inline status message providing contextual feedback.</p>
            </Banner>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithTitle: Story = {
    args: { title: 'Something to note' }
}

export const MultiLine: Story = {
    args: { title: 'Your session is expiring', type: 'warning' },
    render: (args) => ({
        components: { Banner },
        setup() { return { args } },
        template: `
            <Banner :type="args.type" :title="args.title" style="max-width: 28rem">
                <p>You have been inactive for a while. For your security, you will be automatically signed out in 5 minutes.</p>
            </Banner>
        `
    })
}

export const AllVariants: Story = {
    render: () => ({
        components: { Banner },
        setup: () => ({ types, variants }),
        template: `
            <div class="flex flex-col gap-6">
                <div v-for="variant in variants" :key="variant" class="flex flex-col gap-3">
                    <p class="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">{{ variant }}</p>
                    <Banner v-for="type in types" :key="type" :type="type" :variant="variant">
                        <p>{{ type }} · {{ variant }}</p>
                    </Banner>
                </div>
            </div>
        `
    })
}

export const Dismissible: Story = {
    args: { dismissible: true, title: 'Dismiss me', type: 'info' },
    render: (args) => ({
        components: { Banner },
        setup() { return { args } },
        template: `
            <Banner
                :dismissible="args.dismissible"
                :title="args.title"
                :type="args.type"
            >
                <p>Click the × button to dismiss this banner.</p>
            </Banner>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)

        const banner = canvasElement.querySelector('[role="status"], [role="alert"]') ?? canvasElement.querySelector('.rounded-xl')
        await expect(banner).not.toBeNull()

        const dismissBtn = canvas.getByRole('button', { name: /dismiss/i })
        await expect(dismissBtn).toBeVisible()

        await userEvent.click(dismissBtn)

        await expect(canvas.queryByRole('button', { name: /dismiss/i })).not.toBeInTheDocument()
    }
}

export const WithActions: Story = {
    render: () => ({
        components: { Banner },
        template: `
            <Banner type="warning" title="Your trial ends in 3 days">
                <p>Upgrade your plan to keep access to all features.</p>
                <template #actions>
                    <button class="text-sm font-semibold text-amber-900 dark:text-amber-100 underline hover:no-underline">
                        Upgrade now
                    </button>
                    <button class="text-sm text-amber-900 dark:text-amber-200 hover:underline">
                        Remind me later
                    </button>
                </template>
            </Banner>
        `
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const upgradeBtn = canvas.getByRole('button', { name: /upgrade now/i })
        await expect(upgradeBtn).toBeVisible()
    }
}

export const CustomIcon: Story = {
    render: () => ({
        components: { Banner },
        template: `
            <Banner type="info" title="Custom icon override">
                <template #icon>
                    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-indigo-600 dark:text-indigo-400">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1M4.22 4.22l.7.7m12.16 12.16.7.7M3 12h1m16 0h1M4.92 19.08l.7-.7M18.36 5.64l.7-.7" />
                    </svg>
                </template>
                <p>The icon slot overrides the default type icon entirely.</p>
            </Banner>
        `
    })
}

export const ErrorRole: Story = {
    args: { type: 'error', title: 'Submission failed' },
    render: (args) => ({
        components: { Banner },
        setup() { return { args } },
        template: `
            <Banner :type="args.type" :title="args.title">
                <p>Please correct the highlighted fields and try again.</p>
            </Banner>
        `
    }),
    play: async ({ canvasElement }) => {
        const alert = canvasElement.querySelector('[role="alert"]')
        await expect(alert).not.toBeNull()
    }
}

export const InsideForm: Story = {
    render: () => ({
        components: { Banner },
        template: `
            <div class="flex flex-col gap-4 max-w-md">
                <Banner type="error" title="Form has errors">
                    <p>Fix the 2 errors below before submitting.</p>
                </Banner>
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium text-gray-700 dark:text-gray-300" for="story-email">Email</label>
                    <input
                        id="story-email"
                        class="border border-red-400 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                        type="email"
                        value="not-an-email"
                    />
                    <p class="text-xs text-red-600 dark:text-red-400">Enter a valid email address.</p>
                </div>
            </div>
        `
    })
}
