import Sidebar from '@Components/Sidebar.vue'
import { ref } from 'vue'

export default {
    title: 'Components/Sidebar',
    component: Sidebar,

    argTypes: {
        default: {
            control: 'text',
            description: 'Slot content',
            table: {
                type: { summary: 'any' }
            }
        },

        title: {
            control: 'text',
            description: 'Title slot content',
            table: {
                type: { summary: 'any' }
            }
        },

        footer: {
            control: 'text',
            description: 'Footer slot content',
            table: {
                type: { summary: 'any' }
            }
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
        title: 'Sidebar title',
        footer: 'Sidebar footer',
        showScrim: true,
        side: 'left'
    },

    render: (args) => ({
        components: { Sidebar },
        setup() {
            const sidebar = ref(null)

            const openSidebar = () => {
                sidebar.value.open()
            }

            return { args, openSidebar, sidebar }
        },
        template: `
            <button @click="openSidebar">Click to open the Sidebar</button>
            <Sidebar
                ref="sidebar"
                :side="args.side"
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
