import QrCode from '@Components/QrCode.vue'
import { faker } from '@faker-js/faker'
import { expect, within } from 'storybook/test'

export default {
    title: 'Components/QrCode',
    component: QrCode,

    argTypes: {
        background: {
            control: 'color',
            description: 'Background color of the QR code'
        },
        errorCorrectionLevel: {
            control: { type: 'select' },
            description: 'QR error correction level',
            options: ['L', 'M', 'Q', 'H']
        },
        foreground: {
            control: 'color',
            description: 'Foreground color of the QR code'
        },
        margin: {
            control: 'number',
            description: 'Padding around the QR code'
        },
        size: {
            control: 'number',
            description: 'Size of the QR code in pixels'
        },
        value: {
            control: 'text',
            description: 'The string to encode as a QR code (e.g., URL, text)',
            type: { required: true }
        }
    },

    args: {
        background: '#ffffff',
        errorCorrectionLevel: 'M',
        foreground: '#000000',
        margin: 4,
        size: 256,
        value: faker.internet.url()
    },

    render: (args) => ({
        components: { QrCode },
        setup() {
            return { args }
        },
        template: `<QrCode v-bind="args" />`
    })
}

export const Default = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        const img = await canvas.findByRole('img')
        expect(img).toBeVisible()

        // Check base64 QR output
        expect(img.src).toMatch(/^data:image\/png;base64,/)

        // Check alt text reflects the value
        if (args.value.startsWith('http')) {
            expect(img.alt).toBe(`QR code linking to ${args.value}`)
        } else {
            expect(img.alt).toBe(`QR code containing: ${args.value}`)
        }
    }
}

export const CustomColoursAndSize = {
    args: {
        background: '#dfe3ff',
        errorCorrectionLevel: 'H',
        foreground: '#1d4dbc',
        size: 300
    }
}

export const WithTextValue = {
    args: {
        size: 200,
        value: faker.lorem.sentence()
    }
}
