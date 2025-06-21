import Image from '@Components/Image.vue'
import { expect, waitFor, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

export default {
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

export const Default = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        // Check for placeholder
        const loadingIcon = canvasElement.querySelector('div.animate-pulse')
        await expect(loadingIcon).toBeVisible()

        // Wait for image with matching alt text to appear
        const img = await canvas.findByAltText(args.alt)
        await expect(img).toBeVisible()

        // Ensure the placeholder is no longer present
        await waitFor(() => {
            expect(
                canvasElement.querySelector('div.animate-pulse')
            ).not.toBeInTheDocument()
        })
    }
}

export const WithSrcset = {
    args: {
        src: faker.image.url({ width: 900, height: 600 }),
        srcset: `
            ${faker.image.url({ width: 300, height: 200 })} 300w,
            ${faker.image.url({ width: 600, height: 400 })} 600w,
            ${faker.image.url({ width: 900, height: 600 })} 900w
        `,
        sizes: '(max-width: 600px) 300px, (max-width: 900px) 600px, 900px',
        width: 900,
        height: 600
    }
}
