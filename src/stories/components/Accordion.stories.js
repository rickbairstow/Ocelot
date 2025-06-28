import Accordion from '@Components/Accordion.vue'
import { faker } from '@faker-js/faker'
import { userEvent, expect, within } from 'storybook/test'

export default {
    title: 'Components/Accordion',
    component: Accordion,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content (accordion body)'
        },
        startOpen: {
            control: 'boolean',
            description: 'If true, accordion will start open.'
        },
        title: {
            control: 'text',
            description: 'Sets the title for the accordion.'
        }
    },

    args: {
        default: faker.lorem.paragraphs(2),
        startOpen: false,
        title: faker.lorem.sentence(4)
    },

    render: (args) => ({
        components: { Accordion },
        setup() {
            return { args }
        },
        template: `
            <Accordion
                :startOpen="args.startOpen"
                :title="args.title"
            >
                {{ args.default }}
            </Accordion>
        `
    })
}

export const Default = {
    async play({ canvasElement, args }) {
        const canvas = within(canvasElement)

        const summary = canvas.getByText(args.title, {
            selector: 'summary span'
        })
        const content = canvasElement.querySelector('.content')

        await expect(content).not.toBeNull()

        // Initial state check
        if (args.startOpen) {
            await expect(content).toBeVisible()
        } else {
            await expect(content).not.toBeVisible()
        }

        // Toggle closed or open
        await userEvent.click(summary)
        await new Promise((r) => setTimeout(r, 150))

        if (args.startOpen) {
            await expect(content).not.toBeVisible()
        } else {
            await expect(content).toBeVisible()
        }

        // Toggle again to restore original state
        await userEvent.click(summary)
        await new Promise((r) => setTimeout(r, 150))

        if (args.startOpen) {
            await expect(content).toBeVisible()
        } else {
            await expect(content).not.toBeVisible()
        }
    }
}

export const StartsOpen = {
    args: {
        startOpen: true
    }
}
