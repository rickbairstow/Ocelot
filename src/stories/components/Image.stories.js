import Image from '@Components/Image.vue'
import { faker } from '@faker-js/faker'

export default {
    title: 'Components/Image',
    component: Image,

    argTypes: {
        alt: {
            control: 'text',
            description: 'Alt text for the image (required)'
        },
        src: {
            control: 'text',
            description: 'Source URL for the image (required)'
        },
        srcset: {
            control: 'text',
            description: 'Optional responsive image `srcset`'
        },
        sizes: {
            control: 'text',
            description: 'Optional image sizes attribute'
        },
        width: {
            control: 'number',
            description: 'Width of the image (in pixels)'
        },
        height: {
            control: 'number',
            description: 'Height of the image (in pixels)'
        }
    },

    args: {
        alt: faker.lorem.words(3),
        src: faker.image.url({ width: 300, height: 200 }),
        srcset: '',
        sizes: '',
        width: 300,
        height: 200
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

export const Default = {}

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
