import type { Meta, StoryObj } from '@storybook/vue3'
import Video from '@Components/Video.vue'

const meta: Meta<typeof Video> = {
    title: 'Components/Video',
    component: Video,

    argTypes: {
        autoplay: {
            control: 'boolean',
            description: 'Start playback automatically (implies muted)'
        },
        captions: {
            control: 'object',
            description: 'Caption tracks — [{ src, srclang, label, default? }] (native video only)'
        },
        controls: {
            control: 'boolean',
            description: 'Show player controls'
        },
        loop: {
            control: 'boolean',
            description: 'Loop playback when the video ends'
        },
        muted: {
            control: 'boolean',
            description: 'Start with audio muted'
        },
        playsinline: {
            control: 'boolean',
            description: 'Prevent full-screen-on-play on iOS WebViews'
        },
        poster: {
            control: 'text',
            description: 'Poster image URL (native video only)'
        },
        ratio: {
            control: 'select',
            options: ['16:9', '4:3', '1:1', '21:9'],
            description: 'Aspect ratio passed to Plyr'
        },
        src: {
            control: 'text',
            description: 'YouTube URL, Vimeo URL, or a direct video file URL'
        },
        title: {
            control: 'text',
            description: 'Accessible title passed to the Plyr player'
        },
        width: {
            control: 'text',
            description: 'Fixed width (number = px, or any CSS unit string). Defaults to 100%'
        }
    },

    args: {
        src: 'https://www.youtube.com/watch?v=vHcAPrKwhVI',
        title: 'Me at the zoo',
        ratio: '16:9',
        poster: '',
        autoplay: false,
        muted: false,
        loop: false,
        controls: true,
        playsinline: true,
        captions: [],
        width: ''
    },

    render: (args) => ({
        components: { Video },
        setup() { return { args } },
        template: `
            <div class="w-full max-w-2xl">
                <Video
                    :autoplay="args.autoplay"
                    :captions="args.captions"
                    :controls="args.controls"
                    :loop="args.loop"
                    :muted="args.muted"
                    :playsinline="args.playsinline"
                    :poster="args.poster"
                    :ratio="args.ratio"
                    :src="args.src"
                    :title="args.title"
                    :width="args.width"
                />
            </div>
        `
    })
}

export default meta
type Story = StoryObj<typeof meta>

export const Youtube: Story = {}

export const Vimeo: Story = {
    args: {
        src: 'https://vimeo.com/347119375',
        title: 'Vimeo demo'
    }
}

// Requires public/sample.mp4 — drop any short MP4 into the public/ folder.
export const NativeVideo: Story = {
    name: 'Native MP4',
    args: {
        src: '/sample.mp4',
        title: 'Sample video'
    }
}

export const WithPoster: Story = {
    args: {
        src: '/sample.mp4',
        title: 'Sample video with poster',
        poster: '/favicon.ico'
    }
}

// autoplay implies muted — typical ambient/hero video pattern.
export const MutedAutoplay: Story = {
    args: {
        src: '/sample.mp4',
        title: 'Sample video — autoplay',
        autoplay: true,
        loop: true
    }
}
