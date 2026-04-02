import type { Meta, StoryObj } from '@storybook/vue3'
import Image from '@Components/Image.vue'
import { waitFor } from 'storybook/test'
import { faker } from '@faker-js/faker'

const meta: Meta<typeof Image> = {
    title: 'Components/Image',
    component: Image,

    argTypes: {
        alt: {
            control: 'text',
            description: 'Alt text for the image (required for accessibility)'
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

export const ErrorState: Story = {
    args: {
        src: 'https://example.invalid/broken-image.jpg',
        width: '400',
        height: '300'
    },
    play: async ({ canvasElement }) => {
        await waitFor(
            () => {
                const error = canvasElement.querySelector('[role="img"]')
                if (!error) throw new Error('Error state not shown')
            },
            { timeout: 10000 }
        )
    }
}
