import type { Component } from 'vue'
import {
    // #
    Icon123,

    // A
    IconAlertCircle as AlertCircle,
    IconAlertTriangle as AlertTriangle,
    IconAnchor as Anchor,
    IconArrowDown as ArrowDown,
    IconArrowLeft as ArrowLeft,
    IconArrowRight as ArrowRight,
    IconArrowsMaximize as ArrowsMaximize,
    IconArrowsMinimize as ArrowsMinimize,
    IconArrowUp as ArrowUp,
    IconAt as At,

    // B
    IconBan as Ban,
    IconBell as Bell,
    IconBook as Book,
    IconBrandFacebook as BrandFacebook,
    IconBrandInstagram as BrandInstagram,
    IconBrandTiktok as BrandTiktok,
    IconBrandYoutube as BrandYoutube,
    IconBulb as Bulb,

    // C
    IconCalendar as Calendar,
    IconCalendarEvent as CalendarEvent,
    IconChartBar as ChartBar,
    IconCheck as Check,
    IconChecklist as Checklist,
    IconChevronDown as ChevronDown,
    IconChevronLeft as ChevronLeft,
    IconChevronRight as ChevronRight,
    IconChevronUp as ChevronUp,
    IconSelector as ChevronUpDown,
    IconChevronsLeft as ChevronsLeft,
    IconChevronsRight as ChevronsRight,
    IconCircle as Circle,
    IconCircleCheck as CircleCheck,
    IconCircleDashed as CircleDashed,
    IconCircleMinus as CircleMinus,
    IconCircleX as CircleX,
    IconClipboard as Clipboard,
    IconClipboardCheck as ClipboardCheck,
    IconClock as Clock,
    IconClockFilled as ClockFilled,
    IconColumns as Columns,
    IconCopy as Copy,
    IconCurrencyDollar as CurrencyDollar,
    IconCurrencyEuro as CurrencyEuro,
    IconCurrencyPound as CurrencyPound,

    // D
    IconDots as DotsHorizontal,
    IconDotsVertical as DotsVertical,
    IconDownload as Download,

    // E
    IconExternalLink as ExternalLink,
    IconEye as Eye,
    IconEyeOff as EyeOff,

    // F
    IconFile as File,
    IconFileTypePdf as FilePdf,
    IconFileText as FileText,
    IconFileZip as FileZip,
    IconFilter as Filter,
    IconFingerprint as Fingerprint,
    IconFolder as Folder,
    IconFolderOpen as FolderOpen,

    // G
    IconGlobe as Globe,
    IconGripHorizontal as GripHorizontal,
    IconGripVertical as GripVertical,

    // H
    IconHash as Hash,
    IconHeartCheck as HeartCheck,
    IconHelpCircle as HelpCircle,
    IconHome as Home,

    // I
    IconInfoCircle as InfoCircle,

    // K
    IconKarate as Karate,

    // L
    IconLanguage as Language,
    IconLayoutGrid as LayoutGrid,
    IconLayoutList as LayoutList,
    IconLink as Link,
    IconLoader as Loader,
    IconLoader2 as Loader2,
    IconLoader3 as Loader3,
    IconLock as Lock,
    IconLockOpen as LockOpen,

    // M
    IconMail as Mail,
    IconMailOpened as MailOpened,
    IconMenu2 as Menu,
    IconMessage as MessageSquare,
    IconMessageCircle as MessageCircle,
    IconMoon as Moon,

    // P
    IconPalette as Palette,
    IconPaperclip as Paperclip,
    IconPhone as Phone,
    IconPhoto as Photo,
    IconPhotoOff as PhotoOff,
    IconPin as Pin,
    IconPinFilled as PinFilled,
    IconPlayerPlay as PlayerPlay,
    IconPlus as Plus,

    // Q
    IconQrcode as QrCode,
    IconQuote as Quote,
    IconQuoteFilled as QuoteFilled,

    // R
    IconRefresh as Refresh,
    IconRss as Rss,

    // S
    IconSchool as School,
    IconSearch as Search,
    IconSend as Send,
    IconSettings as Settings,
    IconShare as Share,
    IconShare2 as ShareNetwork,
    IconShield as Shield,
    IconShieldCheck as ShieldCheck,
    IconShieldX as ShieldX,
    IconSortAscending as SortAscending,
    IconSortDescending as SortDescending,
    IconStars as Stars,
    IconSun as Sun,

    // T
    IconTable as Table,
    IconTerminal as Terminal,
    IconTrash as Trash,

    // U
    IconUnlink as Unlink,
    IconUpload as Upload,
    IconUser as User,

    // V
    IconVideoOff as VideoOff,

    // X
    IconX as X,

    // Z
    IconZoomIn as ZoomIn
} from '@tabler/icons-vue'

const builtInIcons = {
    // #
    '123': Icon123,

    // A
    AlertCircle,
    AlertTriangle,
    Anchor,
    ArrowDown,
    ArrowLeft,
    ArrowRight,
    ArrowUp,
    At,

    // B
    Ban,
    Bell,
    Book,
    BrandFacebook,
    BrandInstagram,
    BrandTiktok,
    BrandYoutube,
    Bulb,

    // C
    Calendar,
    CalendarEvent,
    ChartBar,
    Check,
    Checklist,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    ChevronUpDown,
    ChevronsLeft,
    ChevronsRight,
    Circle,
    CircleCheck,
    CircleDashed,
    CircleMinus,
    CircleX,
    Clipboard,
    ClipboardCheck,
    Clock,
    ClockFilled,
    Collapse: ArrowsMinimize,
    Columns,
    Copy,
    CurrencyDollar,
    CurrencyEuro,
    CurrencyPound,

    // D
    Download,

    // E
    Expand: ArrowsMaximize,
    ExternalLink,
    Eye,
    EyeOff,

    // F
    File,
    FilePdf,
    FileText,
    FileZip,
    Filter,
    Fingerprint,
    Folder,
    FolderOpen,

    // G
    Globe,
    GripHorizontal,
    GripVertical,

    // H
    Hash,
    HeartCheck,
    HelpCircle,
    Home,

    // I
    InfoCircle,

    // K
    Karate,

    // L
    Language,
    LayoutGrid,
    LayoutList,
    Link,
    Loader,
    Loader2,
    Loader3,
    Lock,
    LockOpen,

    // M
    Mail,
    MailOpened,
    Menu,
    MessageCircle,
    MessageSquare,
    Moon,
    MoreHorizontal: DotsHorizontal,
    MoreVertical: DotsVertical,

    // P
    Palette,
    Paperclip,
    Phone,
    Photo,
    PhotoOff,
    Pin,
    PinFilled,
    PlayerPlay,
    Plus,

    // Q
    QrCode,
    Quote,
    QuoteFilled,

    // R
    Refresh,
    Rss,

    // S
    School,
    Search,
    Send,
    Settings,
    Share,
    ShareNetwork,
    Shield,
    ShieldCheck,
    ShieldX,
    SortAscending,
    SortDescending,
    Stars,
    Sun,

    // T
    Table,
    Terminal,
    Trash,

    // U
    Unlink,
    Upload,
    User,

    // V
    VideoOff,

    // X
    X,

    // Z
    ZoomIn
}

const registry: Record<string, Component> = { ...builtInIcons }

export function registerIcons(icons: Record<string, Component>): void {
    Object.assign(registry, icons)
}

export type IconName = keyof typeof builtInIcons
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
