import type { Meta, StoryObj } from '@storybook/vue3'
import { ref } from 'vue'
import { expect, userEvent, waitFor, within } from 'storybook/test'
import Gallery from '@Components/Gallery.vue'
import type { GalleryImage } from '@Components/Gallery.vue'
import Button from '@Components/Button.vue'

const images: GalleryImage[] = [
    { id: 'mountains', src: '/media/gallery-mountains.svg', alt: 'Layered mountains beneath a golden sun' },
    { id: 'coast', src: '/media/gallery-coast.svg', alt: 'Blue waves meeting a sandy shore' },
    { id: 'forest', src: '/media/gallery-forest.svg', alt: 'Three evergreen trees in a forest' }
]
const captions = images.map((image, index) => ({ ...image, caption: ['Mountain trails', 'Coastal walks', 'Forest paths'][index] }))

const meta = {
    title: 'Components/Gallery', component: Gallery,
    args: { images },
    parameters: { docs: { description: { component: 'A responsive thumbnail list built from Image and LightboxImage. Supply images with stable unique id, src and meaningful alt text; caption is optional. Each Gallery has an isolated lightbox group. The default square thumbnails auto-fit using minThumbnailWidth (160px); change aspectRatio for other crops. Captions appear below thumbnails and in the viewer; showCaptions=false only hides the inline captions. Set lightbox=false for a passive image list without the optional photoswipe peer dependency. Images use native lazy loading; the component does not fetch pages, upload files, or optimise source images. Empty arrays show an empty message, replaceable through the empty slot. Install photoswipe to use the viewer. Arrow keys navigate the viewer and Escape closes it.' } } }
} satisfies Meta<typeof Gallery>
export default meta
type Story = StoryObj<typeof meta>

async function closeViewer(canvasElement: HTMLElement) {
    const page = within(canvasElement.ownerDocument.body)
    await waitFor(() => expect(page.getByRole('dialog', { name: 'Image viewer' })).toHaveFocus(), { timeout: 5000 })
    await userEvent.keyboard('{Escape}')
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument())
}

export const Default: Story = {
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const page = within(canvasElement.ownerDocument.body)
        await expect(within(canvas.getByRole('list', { name: 'Image gallery' })).getAllByRole('listitem')).toHaveLength(3)
        const trigger = canvas.getByRole('button', { name: `Open ${images[1].alt} in lightbox` })
        trigger.focus()
        await userEvent.keyboard('{Enter}')
        await waitFor(() => expect(page.getByRole('dialog', { name: 'Image viewer' })).toHaveFocus(), { timeout: 5000 })
        await expect(page.getByRole('button', { name: `View image 2: ${images[1].alt}` })).toHaveAttribute('aria-current', 'true')
        await userEvent.keyboard('{ArrowRight}')
        await waitFor(() => expect(page.getByRole('button', { name: `View image 3: ${images[2].alt}` })).toHaveAttribute('aria-current', 'true'))
        await closeViewer(canvasElement)
        await expect(trigger).toHaveFocus()
    }
}

export const WithCaptions: Story = {
    args: { images: captions },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getByText('Mountain trails', { selector: 'figcaption' })).toBeVisible()
        await userEvent.click(canvas.getByRole('button', { name: `Open ${images[0].alt} in lightbox` }))
        await waitFor(() => expect(within(canvasElement.ownerDocument.body).getByText('Mountain trails', { selector: '.pswp__caption' })).toBeVisible())
        await closeViewer(canvasElement)
    }
}

export const ViewerCaptionsOnly: Story = {
    args: { images: captions, showCaptions: false },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.queryByText('Mountain trails')).not.toBeInTheDocument()
        await userEvent.click(canvas.getByRole('button', { name: `Open ${images[0].alt} in lightbox` }))
        await waitFor(() => expect(within(canvasElement.ownerDocument.body).getByText('Mountain trails', { selector: '.pswp__caption' })).toBeVisible())
        await closeViewer(canvasElement)
    }
}

export const LandscapeThumbnails: Story = {
    args: { aspectRatio: '4 / 3', minThumbnailWidth: 240, lightbox: false },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        await expect(canvas.getAllByRole('img')).toHaveLength(3)
        await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
        await expect(canvas.getAllByRole('img')[0].parentElement).toHaveStyle({ aspectRatio: '4 / 3' })
    }
}

export const Empty: Story = {
    args: { images: [] },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('No images to display.')).toBeVisible()
        await expect(within(canvasElement).queryByRole('list')).not.toBeInTheDocument()
    }
}

export const CustomEmpty: Story = {
    args: { images: [] },
    render: args => ({ components: { Gallery }, setup: () => ({ args }), template: '<Gallery v-bind="args"><template #empty><p>Your collection has no photos yet.</p></template></Gallery>' }),
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Your collection has no photos yet.')).toBeVisible()
    }
}

export const SeparateCollections: Story = {
    render: () => ({
        components: { Gallery }, setup: () => ({ images }),
        template: '<div class="space-y-8"><Gallery :images="images.slice(0, 2)" label="Landscapes" /><Gallery :images="images.slice(2)" label="Woodland" /></div>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const page = within(canvasElement.ownerDocument.body)
        await userEvent.click(within(canvas.getByRole('list', { name: 'Landscapes' })).getAllByRole('button')[0])
        await waitFor(() => expect(page.getByRole('button', { name: `View image 2: ${images[1].alt}` })).toBeVisible())
        await expect(page.queryByRole('button', { name: new RegExp(`View image .*${images[2].alt}`) })).not.toBeInTheDocument()
        await closeViewer(canvasElement)
        await userEvent.click(within(canvas.getByRole('list', { name: 'Woodland' })).getByRole('button'))
        await waitFor(() => expect(page.getByRole('dialog', { name: 'Image viewer' })).toBeVisible())
        await expect(page.queryByRole('button', { name: /View image/ })).not.toBeInTheDocument()
        await closeViewer(canvasElement)
    }
}

export const UpdatedCollection: Story = {
    render: () => ({
        components: { Gallery, Button },
        setup() {
            const collection = ref([...images])
            return { collection, reverse: () => { collection.value = [...collection.value].reverse() }, remove: () => { collection.value = collection.value.slice(1) } }
        },
        template: '<div class="space-y-4"><div class="flex gap-2"><Button @click="reverse">Reverse order</Button><Button @click="remove">Remove first photo</Button></div><Gallery :images="collection" /></div>'
    }),
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        const page = within(canvasElement.ownerDocument.body)
        await userEvent.click(canvas.getByRole('button', { name: 'Reverse order' }))
        await userEvent.click(canvas.getByRole('button', { name: `Open ${images[2].alt} in lightbox` }))
        await waitFor(() => expect(page.getByRole('button', { name: `View image 1: ${images[2].alt}` })).toHaveAttribute('aria-current', 'true'))
        await closeViewer(canvasElement)
        await userEvent.click(canvas.getByRole('button', { name: 'Remove first photo' }))
        await expect(canvas.queryByRole('button', { name: `Open ${images[2].alt} in lightbox` })).not.toBeInTheDocument()
        await userEvent.click(canvas.getByRole('button', { name: `Open ${images[1].alt} in lightbox` }))
        await waitFor(() => expect(page.getByRole('button', { name: `View image 1: ${images[1].alt}` })).toHaveAttribute('aria-current', 'true'))
        await expect(page.queryByRole('button', { name: /View image 3:/ })).not.toBeInTheDocument()
        await closeViewer(canvasElement)
    }
}
