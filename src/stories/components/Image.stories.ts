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
            description: 'Alt text for the image (required)'
        },
        height: {
            control: 'String',
            description: 'Height of the image with sizing qualifier, ie px or %'
        },
        sizes: {
            control: 'text',
            description: 'Optional image sizes attribute'
        },
        src: {
            control: 'text',
            description: 'Source URL for the image (required)'
        },
        srcset: {
            control: 'text',
            description: 'Optional responsive image `srcset`'
        },
        width: {
            control: 'number',
            description: 'Width of the image with sizing qualifier, ie px or %'
        }
    },

    args: {
        alt: faker.lorem.words(3),
        src: faker.image.url({ width: 300, height: 200 }),
        srcset: '',
        sizes: '',
        width: '300px',
        height: '200px'
    },

    render: (args) => ({
        components: { Image },
        setup() {
            return { args }
        },
        template: `
            <div class="max-w-full">
                <Image
                    :alt="args.alt"
                    :src="args.src"
                    :srcset="args.srcset"
                    :sizes="args.sizes"
                    :width="args.width"
                    :height="args.height"
                />
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement }) => {
        // The component calls loadImage() in onMounted before the play function runs,
        // so we just wait for it to resolve (load or error) rather than mocking Image.
        await waitFor(
            () => {
                // Either an <img> (loaded) or a non-pulsing placeholder (error state) should appear
                const img = canvasElement.querySelector('img')
                const failed = canvasElement.querySelector('div:not(.animate-pulse) svg')
                if (!img && !failed) throw new Error('Image not yet resolved')
            },
            { timeout: 10000 }
        )
    }
}

export const WithSrcset: Story = {
    args: {
        src: faker.image.url({ width: 900, height: 600 }),
        srcset: `
            ${faker.image.url({ width: 300, height: 200 })} 300w,
            ${faker.image.url({ width: 600, height: 400 })} 600w,
            ${faker.image.url({ width: 900, height: 600 })} 900w
        `,
        sizes: '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px',
        width: '900px',
        height: '600px'
    }
}
