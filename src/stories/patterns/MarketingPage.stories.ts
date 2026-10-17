import type { Meta, StoryObj } from '@storybook/vue3'
import { expect, within } from 'storybook/test'
import Hero from '@Components/Hero.vue'
import CallToAction from '@Components/CallToAction.vue'
import Footer from '@Components/Footer.vue'
import Gallery from '@Components/Gallery.vue'
import Button from '@Components/Button.vue'

const meta = {
    title: 'Patterns/Marketing Page',
    parameters: { docs: { description: { component: 'A page composed from Hero, Gallery, CallToAction and Footer. Keep one page h1, use h2 for subsequent sections, give each navigation landmark a distinct label, and place the page footer outside main. Content, destinations, branding and actions belong to the consuming application. No theme or routing setup is required by these layout components.' } } }
} satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    render: () => ({
        components: { Hero, CallToAction, Footer, Gallery, Button },
        setup: () => ({ images: [
            { id: 'mountains', src: '/media/gallery-mountains.svg', alt: 'Mountains beneath a golden sun', caption: 'Find a new perspective' },
            { id: 'coast', src: '/media/gallery-coast.svg', alt: 'Waves meeting a sandy shore', caption: 'Make space to explore' },
            { id: 'forest', src: '/media/gallery-forest.svg', alt: 'Evergreen trees in a forest', caption: 'Build something lasting' }
        ] }),
        template: '<div class="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100"><main><Hero heading="Ideas deserve room to grow" eyebrow="Acme Studio" description="A considered starting point for your next project."><template #actions><Button href="#collection">Explore our work</Button><Button href="#get-started" variant="secondary">Work with us</Button></template><template #media><img src="/media/gallery-mountains.svg" alt="Layered mountain illustration" class="w-full rounded-xl" /></template></Hero><section id="collection" class="mx-auto max-w-6xl space-y-6 px-6 py-10" aria-labelledby="collection-heading"><h2 id="collection-heading" class="text-3xl font-medium">A little inspiration</h2><Gallery :images="images" label="Studio collection" /></section><div id="get-started" class="mx-auto max-w-6xl px-6 py-10"><CallToAction heading="Have something in mind?" description="Tell us about the project you would like to create." inline><template #actions><Button href="mailto:hello@example.com">Get in touch</Button></template></CallToAction></div></main><Footer copyright="© 2026 Acme Studio"><template #brand><p class="text-xl font-semibold">Acme Studio</p></template><p>Thoughtful work, made together.</p><template #navigation><nav aria-label="Footer"><a href="#collection" class="underline">Our work</a></nav></template><template #bottom><a href="mailto:hello@example.com" class="underline">Contact us</a></template></Footer></div>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('heading', { level: 1 })).toHaveLength(1)
        await expect(canvas.getAllByRole('heading', { level: 2 })).toHaveLength(2)
        await expect(canvas.getByRole('main')).not.toContainElement(canvas.getByRole('contentinfo'))
        await expect(canvas.getByRole('navigation', { name: 'Footer' })).toBeVisible()
        await expect(canvas.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', 'mailto:hello@example.com')
    }
}
