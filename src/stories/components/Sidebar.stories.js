import Sidebar from '@Components/Sidebar.vue'
import { ref } from 'vue'

export default {
    title: 'Components/Sidebar',
    component: Sidebar,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content',
        },

        title: {
            control: 'text',
            description: 'Title slot content',
        },

        footer: {
            control: 'text',
            description: 'Footer slot content',
        },

        showScrim: {
            control: 'boolean',
            description: 'Sets if the scrim should show when the menu is open.'
        },

        side: {
            control: 'select',
            options: ['left', 'right'],
            description: 'Sets what side the sidebar displays on.'
        }
    },

    args: {
        default: 'Sidebar content',
        footer: 'Sidebar footer',
        showScrim: true,
        side: 'left',
        title: 'Sidebar title'
    },

    render: (args) => ({
        components: { Sidebar },
        setup() {
            const sidebar = ref(null)
            const triggerRef = ref(null)

            const openSidebar = async () => {
                sidebar.value.open()
            }

            return {
                args,
                sidebar,
                triggerRef,
                openSidebar
            }
        },

        template: `
            <button
                ref="triggerRef"
                type="button"
                class="mb-4 border px-3 py-2 rounded bg-gray-100 hover:bg-gray-200"
                @click="openSidebar"
            >
                Open Sidebar
            </button>

            <Sidebar
                ref="sidebar"
                :side="args.side"
                :show-scrim="args.showScrim"
            >
                <template #title>{{ args.title }}</template>
                <template #default>{{ args.default }}</template>
                <template #footer>{{ args.footer }}</template>
            </Sidebar>
        `
    })
}

export const Left = {
    args: {
        side: 'left'
    }
}

export const Right = {
    args: {
        side: 'right'
    }
}
