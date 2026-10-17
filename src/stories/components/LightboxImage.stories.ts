import { runInteractionTests } from '../interactionMode'
import type { Meta, StoryObj } from '@storybook/vue3'
import LightboxImage from '@Components/LightboxImage.vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

faker.seed(99)

const meta: Meta<typeof LightboxImage> = {
    title: 'Components/LightboxImage',
    component: LightboxImage,

    parameters: {
        docs: {
            description: {
                component:
                    'An image that opens full-screen in a [PhotoSwipe](https://photoswipe.com) lightbox on click. ' +
                    'Use Gallery for collections; it composes LightboxImage and manages the shared viewer. ' +
                    'Fully keyboard accessible: Tab to focus, Enter/Space to open, arrow keys to navigate, Escape to close.' + '\n\nDefault supplies only src and alt text. With Caption adds lightbox copy. Use the Gallery component for thumbnail collections; it reuses this viewer. Install the optional photoswipe peer dependency.'
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
            options: ['auto', 'async', 'sync']
        },
        fetchpriority: {
            control: 'select',
            options: ['auto', 'high', 'low']
        },
        fit: {
            control: 'select',
            options: ['cover', 'contain', 'fill', 'none', 'scale-down']
        },
        height: { control: 'text' },
        lightboxCaption: {
            control: 'text',
            description: 'Caption shown beneath the image in the lightbox'
        },
        lightboxGroup: {
            control: 'text',
            description: 'Group name — LightboxImages sharing the same group form a gallery'
        },
        loading: {
            control: 'select',
            options: ['lazy', 'eager']
        },
        placeholder: { control: 'text' },
        position: { control: 'text' },
        sizes: { control: 'text' },
        src: { control: 'text' },
        srcset: { control: 'text' },
        width: { control: 'text' }
    },

    args: { alt: 'Mountain landscape', src: '/media/gallery-mountains.svg' },

    render: (args) => ({
        components: { LightboxImage },
        setup() { return { args } },
        template: `
            <LightboxImage
                :alt="args.alt"
                :aspect-ratio="args.aspectRatio"
                :decoding="args.decoding"
                :fetchpriority="args.fetchpriority"
                :fit="args.fit"
                :height="args.height"
                :lightbox-caption="args.lightboxCaption"
                :lightbox-group="args.lightboxGroup"
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

export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        if (!runInteractionTests) return

        const canvas = within(canvasElement)
        const page = within(canvasElement.ownerDocument.body)
        const trigger = canvas.getByRole('button', { name: `Open ${args.alt} in lightbox` })
        const image = canvasElement.querySelector('img') as HTMLImageElement
        await waitFor(() => expect(image.naturalWidth).toBeGreaterThan(0))
        const bounds = trigger.getBoundingClientRect()
        await expect(bounds.height).toBeGreaterThan(64)
        await expect(Math.abs(bounds.width / bounds.height - image.naturalWidth / image.naturalHeight)).toBeLessThan(0.01)
        await userEvent.click(trigger)
        const close = await page.findByRole('button', { name: /close/i }, { timeout: 5000 })
        await expect(close).toBeVisible()
        // PhotoSwipe enables its controls when the opening transition finishes.
        await waitFor(() => expect(page.getByRole('dialog', { name: 'Image viewer' })).toHaveFocus())
        await userEvent.click(close)
        await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
    }
}

export const WithCaption: Story = {
    args: {
        lightboxCaption: faker.lorem.sentence()
    }
}
