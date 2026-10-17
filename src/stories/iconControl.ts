import { availableIcons } from '@Composables/useIcons'

/** Shared by stories with an icon prop so their options never drift. */
export const iconControl = {
    control: 'select' as const,
    options: ['', ...Object.keys(availableIcons).sort()],
    description: 'Any installed Tabler icon name, without the Icon prefix. An empty value hides the icon; Vue components can also be passed in application code.'
}
