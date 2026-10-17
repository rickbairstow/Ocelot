import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import Image from '@Components/Image.vue'
import { waitFor, expect } from 'storybook/test'

const PLACEHOLDER_SRC = '/media/image-placeholder.svg'
const BROKEN_SRC = '/media/missing-image.png'

const meta: Meta<typeof Image> = {
    title: 'Components/Image',
    component: Image,

    parameters: {
        docs: {
            description: {
                component: 'An enhanced image with LQIP blur-up loading, lazy loading, and configurable aspect ratio. Shows a skeleton placeholder while loading and gracefully handles load errors.\n\nWithout height or aspectRatio, the image keeps its natural proportions and fits within the available width. Width alone scales it proportionally. Supply height or aspectRatio for a cropped frame controlled by fit and position, and to reserve layout space before loading. Default uses a local illustration with src and meaningful alt text. Responsive documents srcset/sizes; Custom Dimensions demonstrates CSS units. Use empty alt text only for a decorative image. Error State documents the fallback when a source cannot load.'
            }
        }
    },

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
        alt: 'Layered mountain illustration',
        src: '/media/gallery-mountains.svg',
        width: null,
        height: null,
        aspectRatio: '',
        decoding: 'async',
        fetchpriority: 'auto',
        fit: 'cover',
        loading: 'lazy',
        placeholder: '',
        position: 'center',
        sizes: '',
        srcset: ''
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
            const img = canvasElement.querySelector('img:not([aria-hidden])') as HTMLImageElement | null
            if (!img?.complete || !img.naturalWidth) throw new Error('Image not loaded')
        },
        { timeout: 10000 }
    )
}

export const Default: Story = {
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const image = canvasElement.querySelector('img:not([aria-hidden])') as HTMLImageElement
        await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0))
        const bounds = image.getBoundingClientRect()
        await expect(bounds.height).toBeGreaterThan(64)
        await expect(Math.abs(bounds.width / bounds.height - image.naturalWidth / image.naturalHeight)).toBeLessThan(0.01)
        await expect(image.parentElement!.getBoundingClientRect().height).toBeCloseTo(bounds.height, 0)
    }
}

export const WidthOnly: Story = {
    args: { width: '50%' },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const image = canvasElement.querySelector('img:not([aria-hidden])') as HTMLImageElement
        await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0))
        const bounds = image.getBoundingClientRect()
        await expect(Math.abs(bounds.width / bounds.height - image.naturalWidth / image.naturalHeight)).toBeLessThan(0.01)
        await expect(image).not.toHaveAttribute('width')
        await expect(image.parentElement!.getBoundingClientRect().height).toBeCloseTo(bounds.height, 0)
    }
}

export const AspectRatio: Story = {
    args: {
        src: '/media/gallery-mountains.svg',
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
        src: '/media/gallery-mountains.svg',
        srcset: '/media/mountains-300.svg 300w, /media/mountains-600.svg 600w, /media/mountains-900.svg 900w',
        sizes: '(max-width: 900px) 100vw, 900px',
        width: '100%',
        height: null,
        aspectRatio: '4 / 3'
    },
    play: waitForImage
}

export const ObjectFitContain: Story = {
    args: {
        src: '/media/gallery-mountains.svg',
        fit: 'contain',
        width: '400',
        height: '300'
    },
    play: waitForImage
}

export const EagerHighPriority: Story = {
    name: 'Priority Loading',
    args: {
        loading: 'eager',
        fetchpriority: 'high'
    },
    parameters: {
        docs: {
            description: {
                story: 'For an important image visible when the page first opens, such as a hero image: loading="eager" starts loading without waiting for it to approach the viewport, and fetchpriority="high" asks the browser to prioritise its download. These are loading hints, not visual effects or image-quality settings. Keep normal lazy loading for images further down the page; do not give every image high priority.'
            }
        }
    },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const image = canvasElement.querySelector('img:not([aria-hidden])') as HTMLImageElement
        await expect(image).toHaveAttribute('loading', 'eager')
        await expect(image).toHaveAttribute('fetchpriority', 'high')
        await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0))
        const bounds = image.getBoundingClientRect()
        await expect(bounds.height).toBeGreaterThan(64)
        await expect(Math.abs(bounds.width / bounds.height - image.naturalWidth / image.naturalHeight)).toBeLessThan(0.01)
    }
}

// Covers the toCssSize branch where the value is a CSS unit string (not a bare
// number), e.g. "50%" and "20rem" pass through unchanged rather than getting "px" appended.
export const CustomDimensions: Story = {
    args: {
        src: '/media/gallery-mountains.svg',
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

export const WithPlaceholder: Story = {
    args: {
        placeholder: PLACEHOLDER_SRC,
        aspectRatio: '4 / 3'
    },
    parameters: {
        docs: { description: { story: 'A placeholder is a lightweight preview displayed with a blur while the full image loads, then faded out. The left preview keeps that appearance visible; the right uses Image with the real placeholder prop and shows the loaded result. Fast or cached loads may make the transition too brief to inspect. Supply a preview with the same proportions and reserve space with aspectRatio or dimensions.' } }
    },
    render: args => ({
        components: { Image },
        setup: () => ({ args }),
        template: '<div class="grid max-w-4xl gap-6 sm:grid-cols-2"><figure class="space-y-3"><div class="relative aspect-4/3 overflow-hidden"><img alt="Blurred mountain placeholder" class="h-full w-full scale-105 object-cover blur-sm" :src="args.placeholder" /></div><figcaption class="text-sm text-gray-600 dark:text-gray-300">Placeholder while loading</figcaption></figure><figure class="space-y-3"><Image :alt="args.alt" :aspect-ratio="args.aspectRatio" :placeholder="args.placeholder" :src="args.src" /><figcaption class="text-sm text-gray-600 dark:text-gray-300">Loaded image</figcaption></figure></div>'
    }),
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

        const preview = canvasElement.querySelector('img[alt="Blurred mountain placeholder"]') as HTMLImageElement
        const main = canvasElement.querySelector('img:not([aria-hidden]):not([alt="Blurred mountain placeholder"])') as HTMLImageElement
        await waitFor(() => expect(preview.naturalWidth).toBeGreaterThan(0))
        await expect(preview).toBeVisible()
        await waitFor(() => expect(main).toHaveClass('opacity-100'))
        const placeholder = canvasElement.querySelector('img[aria-hidden="true"]')
        await expect(placeholder).toHaveClass('opacity-0')
        await waitFor(() => expect(main).toBeVisible())
    }
}

export const ErrorState: Story = {
    args: {
        src: BROKEN_SRC,
        placeholder: PLACEHOLDER_SRC,
        width: '400',
        height: '300'
    },
    parameters: {
        docs: { description: { story: 'The source intentionally points to a missing local image. Image replaces both the source and any placeholder with a broken-image icon and an Image unavailable message. The accessible name includes the original alt text.' } }
    },
    play: async ({ canvasElement }) => {
        if (!runInteractionTests) return

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
        const fallback = canvasElement.querySelector('[role="img"]')!
        await expect(fallback).toHaveTextContent('Image unavailable')
        await expect(fallback.querySelector('svg')).toBeVisible()
        await expect(fallback.querySelector('svg')!.getBoundingClientRect().height).toBeGreaterThan(0)
        await expect(canvasElement.querySelector('img[aria-hidden="true"]')).toBeNull()
    }
}
