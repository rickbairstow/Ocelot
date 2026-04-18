/* This exposes files and components for the build process and bundles them up to the /dist folder. */

/**
 * Component Exports
 * Enables: import { Sidebar } from 'ocelot-ui'
 */
export { default as Accordion } from '@Components/Accordion.vue'
export { default as AccordionGroup } from '@Components/AccordionGroup.vue'
export type { AccordionGroupContext } from '@Components/AccordionGroup.vue'
export { default as Avatar } from '@Components/Avatar.vue'
export type { AvatarSize, AvatarColor, AvatarShape } from '@Components/Avatar.vue'
export { default as AvatarGroup } from '@Components/AvatarGroup.vue'
export { default as Banner } from '@Components/Banner.vue'
export type { BannerType, BannerVariant } from '@Components/Banner.vue'
export { default as Badge } from '@Components/Badge.vue'
export { default as Breadcrumb } from '@Components/Breadcrumb.vue'
export type { BreadcrumbItem } from '@Components/Breadcrumb.vue'
export { default as Button } from '@Components/Button.vue'
export { default as Card } from '@Components/Card.vue'
export { default as Dialog } from '@Components/Dialog.vue'
export { default as Divider } from '@Components/Divider.vue'
export { default as FloatingPanel } from '@Components/FloatingPanel.vue'
export { default as Heading } from '@Components/Heading.vue'
export { default as HelloWorld } from '@Components/HelloWorld.vue'
export { default as Icon } from '@Components/Icon.vue'
export { default as Image } from '@Components/Image.vue'
export { default as Input } from '@Components/Input.vue'
export { default as Label } from '@Components/Label.vue'
export { default as LightboxImage } from '@Components/LightboxImage.vue'
export { default as Loader } from '@Components/Loader.vue'
export { default as Pagination } from '@Components/Pagination.vue'
export { default as Placeholder } from '@Components/Placeholder.vue'
export { default as Progress } from '@Components/Progress.vue'
export { default as QrCode } from '@Components/QrCode.vue'
export { default as ReadMore } from '@Components/ReadMore.vue'
export { default as Scrim } from '@Components/Scrim.vue'
export { default as Sidebar } from '@Components/Sidebar.vue'
export { default as Tab } from '@Components/Tab.vue'
export { default as TabList } from '@Components/TabList.vue'
export { default as TabPanel } from '@Components/TabPanel.vue'
export { default as Tabs } from '@Components/Tabs.vue'
export type { TabsContext } from '@Components/Tabs.vue'
export { default as Toast } from '@Components/Toast.vue'
export { default as Video } from '@Components/Video.vue'

/**
 * Composable exports
 */
export { useToast } from '@Composables/useToast'
export type { ToastOptions, ToastItem, ToastType, ToastAction } from '@Composables/useToast'

/**
 * Icon utilities
 */
export { registerIcons } from '@Composables/useIcons'
export type { IconName, IconProp, IconSize } from '@Composables/useIcons'
