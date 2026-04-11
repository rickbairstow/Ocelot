import type { Component } from 'vue'
import {
    // #
    Icon123,

    // A
    IconAlertTriangle as AlertTriangle,
    IconArrowDown as ArrowDown,
    IconArrowLeft as ArrowLeft,
    IconArrowRight as ArrowRight,
    IconArrowUp as ArrowUp,

    // B
    IconBell as Bell,
    IconBook as Book,
    IconBrandYoutube as BrandYoutube,
    IconBulb as Bulb,

    // C
    IconChartBar as ChartBar,
    IconChecklist as Checklist,
    IconChevronDown as ChevronDown,
    IconChevronLeft as ChevronLeft,
    IconChevronRight as ChevronRight,
    IconChevronUp as ChevronUp,
    IconChevronsLeft as ChevronsLeft,
    IconChevronsRight as ChevronsRight,
    IconCircleCheck as CircleCheck,
    IconCircleX as CircleX,

    // H
    IconHeartCheck as HeartCheck,
    IconHelpCircle as HelpCircle,
    IconHome as Home,

    // I
    IconInfoCircle as InfoCircle,

    // K
    IconKarate as Karate,

    // L
    IconLanguage as Language,
    IconLoader as Loader,
    IconLoader2 as Loader2,
    IconLoader3 as Loader3,

    // M
    IconMail as Mail,
    IconMailOpened as MailOpened,
    IconMenu2 as Menu,

    // P
    IconPhone as Phone,
    IconPhoto as Photo,
    IconPhotoOff as PhotoOff,
    IconPlayerPlay as PlayerPlay,
    IconPlus as Plus,

    // S
    IconSchool as School,
    IconSearch as Search,
    IconSettings as Settings,
    IconStars as Stars,

    // T
    IconTrash as Trash,

    // V
    IconVideoOff as VideoOff,

    // U
    IconUser as User,

    // X
    IconX as X,

    // Z
    IconZoomIn as ZoomIn
} from '@tabler/icons-vue'

const availableIcons: Record<string, Component> = {
    // #
    '123': Icon123,

    // A
    AlertTriangle,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,

    // B
    Bell,
    Book,
    BrandYoutube,
    Bulb,

    // C
    ChartBar,
    Checklist,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronsLeft,
    ChevronsRight,
    CircleCheck,
    CircleX,

    // H
    HeartCheck,
    HelpCircle,
    Home,

    // I
    InfoCircle,

    // K
    Karate,

    // L
    Language,
    Loader,
    Loader2,
    Loader3,

    // M
    Mail,
    MailOpened,
    Menu,

    // P
    Phone,
    Photo,
    PhotoOff,
    PlayerPlay,
    Plus,

    // S
    School,
    Search,
    Settings,
    Stars,

    // T
    Trash,

    // V
    VideoOff,

    // U
    User,

    // X
    X,

    // Z
    ZoomIn
}

const availableSizes: Record<string, number> = {
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

export type IconName = keyof typeof availableIcons
export type IconSize = keyof typeof availableSizes
export { availableIcons, availableSizes }
