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
                    'Give multiple `LightboxImage` components the same `lightbox-group` and they form a gallery — ' +
                    'clicking any one opens at that position with a thumbnail strip and arrow navigation. ' +
                    'Fully keyboard accessible: Tab to focus, Enter/Space to open, arrow keys to navigate, Escape to close.' + '\n\nDefault supplies only src and alt text. With Caption adds lightbox copy; Gallery joins images with the same lightboxGroup. Install the optional photoswipe peer dependency.'
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

    args: { alt: 'Mountain landscape', src: 'https://picsum.photos/seed/oui-lightbox/1200/800' },

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
        const canvas = within(canvasElement)
        const page = within(canvasElement.ownerDocument.body)
        const trigger = canvas.getByRole('button', { name: `Open ${args.alt} in lightbox` })
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

export const Gallery: Story = {
    parameters: {
        docs: {
            description: {
                story: 'Images sharing the same `lightbox-group` form a gallery. Click any thumbnail to open at that position — use arrows or keyboard to navigate, and click the thumbnail strip to jump to any slide.'
            }
        }
    },
    render: () => ({
        components: { LightboxImage },
        setup() {
            const images = Array.from({ length: 6 }, () => ({
                src: faker.image.url({ width: 1200, height: 800 }),
                alt: faker.lorem.words(3),
                caption: faker.lorem.sentence()
            }))
            return { images }
        },
        template: `
            <div class="grid grid-cols-3 gap-2 max-w-xl">
                <LightboxImage
                    v-for="(img, i) in images"
                    :key="i"
                    :alt="img.alt"
                    :lightbox-caption="img.caption"
                    :src="img.src"
                    aspect-ratio="4/3"
                    fit="cover"
                    lightbox-group="story-gallery"
                />
            </div>
        `
    })
}
