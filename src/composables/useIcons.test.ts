import { describe, expect, it, vi } from 'vitest'
import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import Icon from '@Components/Icon.vue'
import * as TablerIcons from '@tabler/icons-vue'
import { availableIcons, registerIcons } from './useIcons'

describe('Tabler icon registry', () => {
    it('renders nothing for an unknown icon without breaking the surrounding page', async () => {
        const warning = vi.spyOn(console, 'warn').mockImplementation(() => {})
        try {
            const html = await renderToString(createSSRApp(Icon, { icon: 'NonExistentIcon' as never }))
            expect(html).not.toContain('<svg')
        } finally {
            warning.mockRestore()
        }
    })

    it('provides every installed Tabler component by its short name', () => {
        const icons = Object.entries(TablerIcons).filter(([name, component]) => name.startsWith('Icon') && typeof component === 'function')
        expect(icons.length).toBeGreaterThan(5000)
        for (const [name, component] of icons) {
            expect(availableIcons[name.slice(4)], name).toBe(component)
        }
        expect(availableIcons.icons).toBeUndefined()
        expect(availableIcons.iconsList).toBeUndefined()
        expect(availableIcons.toString).toBeUndefined()
    })

    it('preserves the existing aliases and numeric icon name', () => {
        expect(availableIcons['123']).toBe(TablerIcons.Icon123)
        expect(availableIcons.ChevronUpDown).toBe(TablerIcons.IconSelector)
        expect(availableIcons.Collapse).toBe(TablerIcons.IconArrowsMinimize)
        expect(availableIcons.Expand).toBe(TablerIcons.IconArrowsMaximize)
        expect(availableIcons.MoreHorizontal).toBe(TablerIcons.IconDots)
        expect(availableIcons.MoreVertical).toBe(TablerIcons.IconDotsVertical)
    })

    it('still supports custom names and overriding built-in icons', () => {
        const original = availableIcons.World
        try {
            registerIcons({ CustomTestIcon: TablerIcons.IconCheck, World: TablerIcons.IconStarFilled })
            expect(availableIcons.CustomTestIcon).toBe(TablerIcons.IconCheck)
            expect(availableIcons.World).toBe(TablerIcons.IconStarFilled)
        } finally {
            availableIcons.World = original
            delete availableIcons.CustomTestIcon
        }
    })
})
