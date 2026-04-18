import type { Meta, StoryObj } from '@storybook/vue3'
import Avatar from '@Components/Avatar.vue'
import AvatarGroup from '@Components/AvatarGroup.vue'
import type { AvatarColor, AvatarSize } from '@Components/Avatar.vue'
import { expect } from 'storybook/test'

const colors: AvatarColor[] = ['blue', 'green', 'red', 'orange', 'purple', 'indigo', 'teal', 'pink', 'gray']
const sizes: AvatarSize[] = ['xs', 'sm', 'base', 'lg', 'xl', '2xl']

const meta: Meta<typeof Avatar> = {
    title: 'Components/Avatar',
    component: Avatar,

    argTypes: {
        alt: {
            control: 'text',
            description: 'Alt text for the image. Empty string if decorative.'
        },
        color: {
            control: 'select',
            options: colors,
            description: 'Background colour used for the initials and icon fallbacks.'
        },
        initials: {
            control: 'text',
            description: 'Up to 2 characters shown when no image is available.'
        },
        shape: {
            control: 'select',
            options: ['circle', 'square'],
            description: 'Circle or rounded-square.'
        },
        size: {
            control: 'select',
            options: sizes,
            description: 'Avatar dimensions.'
        },
        src: {
            control: 'text',
            description: 'Image URL. Falls back to initials then icon on error.'
        }
    },

    args: {
        alt: 'Jane Doe',
        color: 'blue',
        initials: 'JD',
        shape: 'circle',
        size: 'base',
        src: null
    },

    render: (args) => ({
        components: { Avatar },
        setup() { return { args } },
        template: `
            <Avatar
                :alt="args.alt"
                :color="args.color"
                :initials="args.initials"
                :shape="args.shape"
                :size="args.size"
                :src="args.src"
            />
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const WithInitials: Story = {
    args: { initials: 'JD', src: null },
    play: async ({ canvasElement }) => {
        const avatar = canvasElement.querySelector('span')
        await expect(avatar).not.toBeNull()
    }
}

export const WithImage: Story = {
    args: {
        src: 'https://i.pravatar.cc/150?img=3',
        alt: 'Jane Doe',
        initials: undefined
    }
}

export const IconFallback: Story = {
    args: { src: null, initials: undefined },
    play: async ({ canvasElement }) => {
        const svg = canvasElement.querySelector('svg')
        await expect(svg).not.toBeNull()
    }
}

export const AllColors: Story = {
    render: () => ({
        components: { Avatar },
        setup: () => ({ colors }),
        template: `
            <div class="flex flex-wrap gap-3">
                <Avatar
                    v-for="color in colors"
                    :key="color"
                    :color="color"
                    :initials="color.slice(0, 2).toUpperCase()"
                />
            </div>
        `
    })
}

export const AllSizes: Story = {
    render: () => ({
        components: { Avatar },
        setup: () => ({ sizes }),
        template: `
            <div class="flex flex-wrap items-end gap-3">
                <Avatar
                    v-for="size in sizes"
                    :key="size"
                    :size="size"
                    initials="JD"
                />
            </div>
        `
    })
}

export const Square: Story = {
    args: { shape: 'square', initials: 'JD' }
}

export const FallbackStates: Story = {
    render: () => ({
        components: { Avatar },
        template: `
            <div class="flex flex-wrap items-center gap-4">
                <Avatar src="https://i.pravatar.cc/150?img=3" alt="With image" initials="JD" />
                <Avatar initials="JD" color="blue" />
                <Avatar color="purple" />
            </div>
        `
    }),
    play: async ({ canvasElement }) => {
        const avatars = canvasElement.querySelectorAll('span, a')
        await expect(avatars.length).toBeGreaterThan(0)
    }
}

export const Group: Story = {
    render: () => ({
        components: { AvatarGroup },
        setup: () => ({
            avatars: [
                { initials: 'JD', color: 'blue' },
                { initials: 'AK', color: 'green' },
                { initials: 'MR', color: 'purple' },
                { initials: 'TS', color: 'orange' },
                { initials: 'LP', color: 'pink' },
                { initials: 'CH', color: 'teal' },
                { initials: 'BW', color: 'red' }
            ]
        }),
        template: `
            <AvatarGroup :avatars="avatars" :max="5" />
        `
    }),
    play: async ({ canvasElement }) => {
        const overflow = canvasElement.querySelector('[aria-label="2 more"]')
        await expect(overflow).not.toBeNull()
    }
}

export const GroupAllSizes: Story = {
    render: () => ({
        components: { AvatarGroup },
        setup: () => ({
            sizes,
            avatars: [
                { initials: 'JD', color: 'blue' },
                { initials: 'AK', color: 'green' },
                { initials: 'MR', color: 'purple' },
                { initials: 'TS', color: 'orange' }
            ]
        }),
        template: `
            <div class="flex flex-col gap-4">
                <AvatarGroup
                    v-for="size in sizes"
                    :key="size"
                    :avatars="avatars"
                    :size="size"
                />
            </div>
        `
    })
}
