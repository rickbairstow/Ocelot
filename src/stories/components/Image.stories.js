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
    play: async ({ canvasElement }) => {
        // Fake image load — ensure onload fires
        window.Image = class {
            constructor() {
                setTimeout(() => {
                    this.onload?.(new Event('load'))
                }, 20)
            }
            set src(_) {}
            set srcset(_) {}
            set sizes(_) {}
        }

        const canvas = within(canvasElement)

        // Confirm initial state (loading)
        const loadingIcon = canvasElement.querySelector('div.animate-pulse')
        await expect(loadingIcon).toBeVisible()

        // Wait until the <img> appears in the DOM and is visible
        await waitFor(async () => {
            const img = canvasElement.querySelector('img')
            if (!img) throw new Error('Image not yet in DOM')

            // Wait for Vue to render it visibly
            await new Promise(requestAnimationFrame)
            expect(img).toBeVisible()
        })

        // Wait until loading spinner is removed
        await waitFor(() => {
            const placeholder = canvasElement.querySelector('div.animate-pulse')
            expect(placeholder).not.toBeInTheDocument()
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
        width: '900px',
        height: '600px'
    }
}
