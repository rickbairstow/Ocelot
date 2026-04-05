import type { Meta, StoryObj } from '@storybook/vue3'
import Image from '@Components/Image.vue'
import { waitFor, expect } from 'storybook/test'
import { faker } from '@faker-js/faker'

// Smallest valid 1×1 GIF — used as a placeholder data URI in tests
const PLACEHOLDER_URI = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='

// Immediately-invalid data URI: browser rejects it with no network request,
// so the error state test fires onerror synchronously rather than timing out.
const BROKEN_URI = 'data:image/png;base64,'

const meta: Meta<typeof Image> = {
    title: 'Components/Image',
    component: Image,

    argTypes: {
        alt: {
            control: 'text',
            description: 'Alt text — required for accessibility'
        },
        aspectRatio: {
            control: 'text',
            description: 'CSS aspect-ratio value, e.g. "16/9" or "4/3"'
        },
        decoding: {
            control: 'select',
            options: ['auto', 'async', 'sync'],
            description: 'Image decoding hint'
        },
        fetchpriority: {
            control: 'select',
            options: ['auto', 'high', 'low'],
            description: 'Fetch priority hint — use "high" for LCP images above the fold'
        },
        fit: {
            control: 'select',
            options: ['cover', 'contain', 'fill', 'none', 'scale-down'],
            description: 'CSS object-fit value'
        },
        height: {
            control: 'text',
            description: 'Fixed height (number = px, or any CSS unit string)'
        },
        loading: {
            control: 'select',
            options: ['lazy', 'eager'],
            description: 'Native loading strategy — use "eager" for above-the-fold images'
        },
        placeholder: {
            control: 'text',
            description: 'Low-quality placeholder URL or data URI for blur-up effect'
        },
        position: {
            control: 'text',
            description: 'CSS object-position value, e.g. "center", "top left"'
        },
        sizes: {
            control: 'text',
            description: 'Responsive sizes attribute'
        },
        src: {
            control: 'text',
            description: 'Image source URL (required)'
        },
        srcset: {
            control: 'text',
            description: 'Responsive srcset attribute'
        },
        width: {
            control: 'text',
            description: 'Fixed width (number = px, or any CSS unit string)'
        }
    },

    args: {
        alt: faker.lorem.words(3),
        src: faker.image.url({ width: 400, height: 300 }),
        width: '400',
        height: '300',
        fit: 'cover',
        position: 'center',
        loading: 'lazy',
        decoding: 'async',
        fetchpriority: 'auto'
    },

    render: (args) => ({
        components: { Image },
        setup() {
            return { args }
        },
        template: `
            <Image
                :alt="args.alt"
                :aspect-ratio="args.aspectRatio"
                :decoding="args.decoding"
                :fetchpriority="args.fetchpriority"
                :fit="args.fit"
                :height="args.height"
                :loading="args.loading"
                :placeholder="args.placeholder"
                :position="args.position"
                :sizes="args.sizes"
                :src="args.src"
                :srcset="args.srcset"
                :width="args.width"
            />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

const waitForImage = async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await waitFor(
        () => {
            const img = canvasElement.querySelector('img:not([aria-hidden])')
            const error = canvasElement.querySelector('[role="img"]')
            if (!img && !error) throw new Error('Image not yet resolved')
        },
        { timeout: 10000 }
    )
}

export const Default: Story = {
    play: waitForImage
}

export const AspectRatio: Story = {
    args: {
        src: faker.image.url({ width: 800, height: 450 }),
        width: '100%',
        height: undefined,
        aspectRatio: '16/9'
    },
    render: (args) => ({
        components: { Image },
        setup() {
            return { args }
        },
        template: `
            <div class="w-96">
                <Image
                    :alt="args.alt"
                    :aspect-ratio="args.aspectRatio"
                    :fit="args.fit"
                    :src="args.src"
                    :width="args.width"
                />
            </div>
        `
    }),
    play: waitForImage
}

export const Responsive: Story = {
    args: {
        src: faker.image.url({ width: 900, height: 600 }),
        srcset: `
            ${faker.image.url({ width: 300, height: 200 })} 300w,
            ${faker.image.url({ width: 600, height: 400 })} 600w,
            ${faker.image.url({ width: 900, height: 600 })} 900w
        `,
        sizes: '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px',
        width: '900',
        height: '600'
    },
    play: waitForImage
}

export const ObjectFitContain: Story = {
    args: {
        src: faker.image.url({ width: 600, height: 200 }),
        fit: 'contain',
        width: '400',
        height: '300'
    },
    play: waitForImage
}

export const EagerHighPriority: Story = {
    args: {
        src: faker.image.url({ width: 400, height: 300 }),
        loading: 'eager',
        fetchpriority: 'high'
    },
    play: waitForImage
}

// Covers the toCssSize branch where the value is a CSS unit string (not a bare
// number), e.g. "50%" and "20rem" pass through unchanged rather than getting "px" appended.
export const CssUnitDimensions: Story = {
    args: {
        src: faker.image.url({ width: 400, height: 300 }),
        width: '50%',
        height: '20rem'
    },
    render: (args) => ({
        components: { Image },
        setup() {
            return { args }
        },
        template: `
            <div style="width: 400px; height: 400px">
                <Image
                    :alt="args.alt"
                    :height="args.height"
                    :src="args.src"
                    :width="args.width"
                />
            </div>
        `
    }),
    play: waitForImage
}

// Covers the placeholder <img> conditional and its blur-up class bindings.
// Uses a data URI so the placeholder is available instantly without any network request.
export const WithPlaceholder: Story = {
    args: {
        src: faker.image.url({ width: 400, height: 300 }),
        placeholder: PLACEHOLDER_URI,
        width: '400',
        height: '300'
    },
    play: async ({ canvasElement }) => {
        // Placeholder img renders immediately (data URI — no network needed)
        await waitFor(() => {
            const placeholder = canvasElement.querySelector('img[aria-hidden="true"]')
            if (!placeholder) throw new Error('Placeholder image not rendered')
        }, { timeout: 2000 })

        // Main image should also eventually resolve
        await waitForImage({ canvasElement })

        // After load the placeholder should still be in the DOM (just faded out via opacity)
        const placeholder = canvasElement.querySelector('img[aria-hidden="true"]')
        await expect(placeholder).not.toBeNull()
    }
}

// Uses a malformed data URI so the browser fires onerror immediately —
// no DNS lookup or network timeout involved.
export const ErrorState: Story = {
    args: {
        src: BROKEN_URI,
        width: '400',
        height: '300'
    },
    play: async ({ canvasElement }) => {
        await waitFor(
            () => {
                const error = canvasElement.querySelector('[role="img"]')
                if (!error) throw new Error('Error state not shown')
            },
            { timeout: 3000 }
        )

        // Main img is removed from the DOM in error state (v-if="state !== 'error'")
        const mainImg = canvasElement.querySelector('img:not([aria-hidden])')
        await expect(mainImg).toBeNull()
    }
}
