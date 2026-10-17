import type { Component } from 'vue'
import * as TablerIcons from '@tabler/icons-vue'

type TablerExportName = Extract<keyof typeof TablerIcons, `Icon${string}`>
type ShortIconName<T> = T extends `Icon${infer Name}` ? Name : never

// Preserve OUI names that differ from Tabler's exports.
const aliases = {
    ChevronUpDown: TablerIcons.IconSelector,
    Collapse: TablerIcons.IconArrowsMinimize,
    Expand: TablerIcons.IconArrowsMaximize,
    MoreHorizontal: TablerIcons.IconDots,
    MoreVertical: TablerIcons.IconDotsVertical
}

// Only component exports belong in the registry, not Tabler's helpers/catalogues.
const registry: Record<string, Component> = Object.create(null)
for (const [name, component] of Object.entries(TablerIcons)) {
    if (name.startsWith('Icon') && typeof component === 'function') {
        registry[name.slice(4)] = component as Component
    }
}
Object.assign(registry, aliases)

/** Register custom icons or override a built-in name before rendering. */
export function registerIcons(icons: Record<string, Component>): void {
    Object.assign(registry, icons)
}

export type IconName = ShortIconName<TablerExportName> | keyof typeof aliases
export type IconSize = keyof typeof availableSizes
export type IconProp = IconName | Component | string

export const availableIcons = registry

export const availableSizes: Record<string, number> = {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 120
}
