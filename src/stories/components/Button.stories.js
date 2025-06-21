import Button from '@Components/Button.vue'
import { userEvent, expect, within } from 'storybook/test'
import { faker } from '@faker-js/faker'

export default {
    title: 'Components/Button',
    component: Button,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content',
        },
        disabled: {
            control: 'boolean',
            description:
                'Marks the button as disabled and prevents interaction.'
        },
        href: {
            control: 'text',
            description: 'Sets the link href for anchor rendering.'
        },
        size: {
            control: 'select',
            options: ['small', 'base', 'large'],
            description: 'Sets the size of the button.'
        },
        type: {
            control: 'select',
            options: ['primary', 'secondary', 'tertiary', 'text', 'none'],
            description: 'Sets the style of the button.'
        }
    },

    args: {
        default: faker.lorem.word(),
        disabled: false,
        size: 'base',
        type: 'primary',
        href: null
    },

    render: (args) => ({
        components: { Button },
        setup() {
            return { args }
        },
        template: `
            <Button
                :disabled="args.disabled"
                :href="args.href"
                :size="args.size"
                :type="args.type"
                @click="() => console.log('Button clicked')"
            >
                {{ args.default }}
            </Button>
        `
    })
}

// Generic play function for active buttons
const clickPlay = async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = await canvas.getByRole('button')
    await userEvent.click(button)
}

export const Primary = {
    args: { type: 'primary' },
    play: clickPlay
}

export const Secondary = {
    args: { type: 'secondary' },
    play: clickPlay
}

export const Tertiary = {
    args: { type: 'tertiary' },
    play: clickPlay
}

export const Text = {
    args: { type: 'text' },
    play: clickPlay
}

export const None = {
    args: { type: 'none' },
    play: clickPlay
}

export const DisabledClick = {
    args: {
        type: 'primary',
        disabled: true
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const button = await canvas.getByRole('button')
        await expect(button).toHaveAttribute('aria-disabled', 'true')
    }
}

export const AsLink = {
    args: {
        href: 'https://example.com'
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const link = await canvas.getByRole('link')

        // Attach a one-time native listener to block navigation
        link.addEventListener('click', (e) => e.preventDefault(), {
            once: true
        })

        await expect(link).toHaveAttribute('href', 'https://example.com')
        await userEvent.click(link)
    }
}
