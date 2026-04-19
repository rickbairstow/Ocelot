import type { Meta, StoryObj } from '@storybook/vue3'
import Accordion from '@Components/Accordion.vue'
import AccordionGroup from '@Components/AccordionGroup.vue'
import { faker } from '@faker-js/faker'
import { userEvent, expect, within } from 'storybook/test'

const meta: Meta<typeof Accordion> = {
    title: 'Components/Accordion',
    component: Accordion,

    parameters: {
        docs: {
            description: {
                component: 'Collapsible content panel with a toggle. Use for FAQs, settings panels, or any content that benefits from progressive disclosure. Multiple accordions can be grouped with AccordionGroup to enforce single-open behaviour.'
            }
        }
    },

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content (accordion body).'
        },
        startOpen: {
            control: 'boolean',
            description: 'If true, accordion starts expanded.'
        },
        title: {
            control: 'text',
            description: 'Summary title text.'
        },
        variant: {
            control: 'select',
            options: ['default', 'flush', 'contained'],
            description: 'Visual style of the accordion.'
        }
    },

    args: {
        default: faker.lorem.paragraphs(2),
        startOpen: false,
        title: faker.lorem.sentence(4),
        variant: 'default'
    },

    render: (args) => ({
        components: { Accordion },
        setup() {
            return { args }
        },
        template: `
            <Accordion
                :start-open="args.startOpen"
                :title="args.title"
                :variant="args.variant"
            >
                {{ args.default }}
            </Accordion>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement, args }) {
        const canvas = within(canvasElement)

        const summary = canvas.getByText(args.title as string, { selector: 'summary span' })
        const content = canvasElement.querySelector('.content')

        await expect(content).not.toBeNull()

        if (args.startOpen) {
            await expect(content).toBeVisible()
        } else {
            await expect(content).not.toBeVisible()
        }

        await userEvent.click(summary)
        await new Promise((r) => setTimeout(r, 150))

        if (args.startOpen) {
            await expect(content).not.toBeVisible()
        } else {
            await expect(content).toBeVisible()
        }

        await userEvent.click(summary)
        await new Promise((r) => setTimeout(r, 150))

        if (args.startOpen) {
            await expect(content).toBeVisible()
        } else {
            await expect(content).not.toBeVisible()
        }
    }
}

export const StartsOpen: Story = {
    args: { startOpen: true }
}

export const Flush: Story = {
    args: { variant: 'flush' }
}

export const CustomExpandIcon: Story = {
    render: (args) => ({
        components: { Accordion },
        setup() { return { args } },
        template: `
            <Accordion :title="args.title">
                <template #expandIcon>
                    <span class="text-xs text-gray-500">▾</span>
                </template>
                {{ args.default }}
            </Accordion>
        `
    })
}

export const Group: Story = {
    render: () => ({
        components: { Accordion, AccordionGroup },
        setup: () => ({
            items: [
                { id: 'a1', title: 'First item', body: faker.lorem.paragraph() },
                { id: 'a2', title: 'Second item', body: faker.lorem.paragraph() },
                { id: 'a3', title: 'Third item', body: faker.lorem.paragraph() }
            ]
        }),
        template: `
            <AccordionGroup default-open="a1">
                <Accordion
                    v-for="item in items"
                    :key="item.id"
                    :id="item.id"
                    :title="item.title"
                >
                    {{ item.body }}
                </Accordion>
            </AccordionGroup>
        `
    }),
    play: async ({ canvasElement }) => {
        const summaries = canvasElement.querySelectorAll('summary span')
        await expect(summaries.length).toBe(3)

        // First should be open (defaultOpen="a1")
        const firstDetails = canvasElement.querySelectorAll('details')[0]
        await expect(firstDetails.open).toBe(true)

        // Open second — first should close
        await userEvent.click(summaries[1])
        await new Promise((r) => setTimeout(r, 150))

        const secondDetails = canvasElement.querySelectorAll('details')[1]
        await expect(secondDetails.open).toBe(true)
        await expect(firstDetails.open).toBe(false)
    }
}

export const GroupFlush: Story = {
    render: () => ({
        components: { Accordion, AccordionGroup },
        setup: () => ({
            items: [
                { id: 'b1', title: 'Question one', body: faker.lorem.paragraph() },
                { id: 'b2', title: 'Question two', body: faker.lorem.paragraph() },
                { id: 'b3', title: 'Question three', body: faker.lorem.paragraph() }
            ]
        }),
        template: `
            <AccordionGroup variant="flush">
                <Accordion
                    v-for="item in items"
                    :key="item.id"
                    :id="item.id"
                    :title="item.title"
                >
                    {{ item.body }}
                </Accordion>
            </AccordionGroup>
        `
    })
}

export const GroupContained: Story = {
    render: () => ({
        components: { Accordion, AccordionGroup },
        setup: () => ({
            items: [
                { id: 'c1', title: 'First item', body: faker.lorem.paragraph() },
                { id: 'c2', title: 'Second item', body: faker.lorem.paragraph() },
                { id: 'c3', title: 'Third item', body: faker.lorem.paragraph() }
            ]
        }),
        template: `
            <AccordionGroup variant="contained" default-open="c1">
                <Accordion
                    v-for="item in items"
                    :key="item.id"
                    :id="item.id"
                    :title="item.title"
                >
                    {{ item.body }}
                </Accordion>
            </AccordionGroup>
        `
    }),
    async play({ canvasElement }) {
        const firstDetails = canvasElement.querySelectorAll('details')[0]
        await expect(firstDetails.open).toBe(true)
    }
}

export const GroupNonExclusive: Story = {
    render: () => ({
        components: { Accordion, AccordionGroup },
        setup: () => ({
            items: [
                { id: 'd1', title: 'First item', body: faker.lorem.paragraph() },
                { id: 'd2', title: 'Second item', body: faker.lorem.paragraph() },
                { id: 'd3', title: 'Third item', body: faker.lorem.paragraph() }
            ]
        }),
        template: `
            <AccordionGroup :exclusive="false">
                <Accordion
                    v-for="item in items"
                    :key="item.id"
                    :id="item.id"
                    :title="item.title"
                >
                    {{ item.body }}
                </Accordion>
            </AccordionGroup>
        `
    }),
    async play({ canvasElement }) {
        const summaries = canvasElement.querySelectorAll('summary span')
        const details = canvasElement.querySelectorAll('details')

        await userEvent.click(summaries[0])
        await new Promise((r) => setTimeout(r, 150))
        await expect(details[0].open).toBe(true)

        // Open second — first must stay open (non-exclusive)
        await userEvent.click(summaries[1])
        await new Promise((r) => setTimeout(r, 150))
        await expect(details[1].open).toBe(true)
        await expect(details[0].open).toBe(true)
    }
}
