import type { Meta, StoryObj } from '@storybook/vue3'
import QrCode from '@Components/QrCode.vue'
import { faker } from '@faker-js/faker'
import { expect, within } from 'storybook/test'

const meta: Meta<typeof QrCode> = {
    title: 'Components/QrCode',
    component: QrCode,

    parameters: {
        docs: {
            description: {
                component: 'Generates and renders a QR code from any URL or string value. Supports configurable foreground and background colours, error correction levels, and size, with output as an SVG or canvas element.'
            }
        }
    },

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
            description: 'The string to encode as a QR code (e.g., URL, text)'
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
        template: '<QrCode v-bind="args" />'
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    play: async ({ canvasElement, args }) => {
        const canvas = within(canvasElement)

        const img = await canvas.findByRole('img') as HTMLImageElement
        expect(img).toBeVisible()

        // Check base64 QR output
        expect(img.src).toMatch(/^data:image\/png;base64,/)

        // Check alt text reflects the value
        if ((args.value as string).startsWith('http')) {
            expect(img.alt).toBe(`QR code linking to ${args.value}`)
        } else {
            expect(img.alt).toBe(`QR code containing: ${args.value}`)
        }
    }
}

export const CustomColoursAndSize: Story = {
    args: {
        background: '#dfe3ff',
        errorCorrectionLevel: 'H',
        foreground: '#1d4dbc',
        size: 300
    }
}

export const WithTextValue: Story = {
    args: {
        size: 200,
        value: faker.lorem.sentence()
    }
}
