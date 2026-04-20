import { warnOptionalDependency } from '@Utils/optionalDependency'

export interface LightboxSlide {
    src: string
    alt: string
    width?: number
    height?: number
    caption?: string
}

export interface LightboxEntry {
    getSlide: () => LightboxSlide
}

const registry = new Map<string, LightboxEntry[]>()
let lightbox: PhotoSwipeLightboxInstance | null = null
let lightboxPromise: Promise<PhotoSwipeLightboxInstance | null> | null = null

interface PswpUiController {
    registerElement: (config: {
        name: string
        order: number
        isButton: boolean
        appendTo: string
        onInit: (element: HTMLElement, pswp: PhotoSwipeInstance) => void
    }) => void
}

interface PhotoSwipeInstance {
    currIndex: number
    currSlide?: {
        data?: unknown
    }
    options: {
        dataSource?: unknown
    }
    ui?: PswpUiController
    on: (event: string, callback: () => void) => void
    goTo: (index: number) => void
}

interface PhotoSwipeLightboxInstance {
    pswp?: PhotoSwipeInstance
    init: () => void
    loadAndOpen: (index: number, slides: LightboxSlide[]) => void
    on: (event: string, callback: () => void) => void
}

type PhotoSwipeLightboxConstructor = new (options: {
    pswpModule: () => Promise<unknown>
    arrowPrevTitle: string
    arrowNextTitle: string
    closeTitle: string
    zoomTitle: string
    bgOpacity: number
}) => PhotoSwipeLightboxInstance

async function initLightbox(): Promise<PhotoSwipeLightboxInstance | null> {
    if (lightbox) return lightbox
    if (lightboxPromise) return lightboxPromise

    lightboxPromise = Promise.all([
        import('photoswipe/lightbox'),
        import('photoswipe/style.css')
    ])
        .then(([module]) => {
            const PhotoSwipeLightbox = module.default as PhotoSwipeLightboxConstructor

            lightbox = new PhotoSwipeLightbox({
                pswpModule: () => import('photoswipe'),
                arrowPrevTitle: 'Previous image',
                arrowNextTitle: 'Next image',
                closeTitle: 'Close lightbox',
                zoomTitle: 'Toggle zoom',
                bgOpacity: 0.9
            })

            lightbox.on('uiRegister', () => {
                const pswp = lightbox!.pswp!
                const slides = (pswp.options.dataSource as LightboxSlide[]) ?? []
                const isGallery = slides.length > 1

                // Caption gradient overlay - sits above thumbnail strip when gallery
                pswp.ui!.registerElement({
                    name: 'caption',
                    order: 9,
                    isButton: false,
                    appendTo: 'root',
                    onInit: (el: HTMLElement, p) => {
                        Object.assign(el.style, {
                            position: 'absolute',
                            bottom: isGallery ? '68px' : '0',
                            left: '0',
                            right: '0',
                            padding: '8px 16px',
                            color: '#fff',
                            background: 'rgba(0,0,0,0.75)',
                            textAlign: 'center',
                            fontSize: '14px',
                            lineHeight: '1.4',
                            pointerEvents: 'none',
                            zIndex: '1'
                        })

                        const update = () => {
                            const data = p.currSlide?.data as LightboxSlide | undefined
                            const caption = data?.caption ?? ''
                            el.textContent = caption
                            el.style.display = caption ? '' : 'none'
                        }

                        update()
                        p.on('change', update)
                    }
                })

                // Thumbnail strip - gallery only
                if (isGallery) {
                    pswp.ui!.registerElement({
                        name: 'thumbnails',
                        order: 10,
                        isButton: false,
                        appendTo: 'root',
                        onInit: (el: HTMLElement, p) => {
                            Object.assign(el.style, {
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                right: '0',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '8px',
                                background: 'rgba(0,0,0,0.5)',
                                overflowX: 'auto',
                                zIndex: '1'
                            })

                            const buttons = slides.map((slide, i) => {
                                const btn = document.createElement('button')
                                btn.type = 'button'
                                btn.setAttribute('aria-label', `View image ${i + 1}: ${slide.alt}`)
                                btn.setAttribute('aria-current', 'false')
                                Object.assign(btn.style, {
                                    width: '52px',
                                    height: '52px',
                                    padding: '0',
                                    overflow: 'hidden',
                                    borderRadius: '4px',
                                    border: 'none',
                                    flexShrink: '0',
                                    cursor: 'pointer',
                                    opacity: '0.5',
                                    transition: 'opacity 0.15s'
                                })
                                btn.onclick = () => p.goTo(i)

                                const img = document.createElement('img')
                                img.src = slide.src
                                img.alt = ''
                                img.setAttribute('aria-hidden', 'true')
                                Object.assign(img.style, {
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                })
                                btn.appendChild(img)
                                el.appendChild(btn)
                                return btn
                            })

                            const updateActive = () => {
                                buttons.forEach((btn, i) => {
                                    const active = i === p.currIndex
                                    btn.style.opacity = active ? '1' : '0.5'
                                    btn.setAttribute('aria-current', String(active))
                                    if (active) {
                                        btn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' })
                                    }
                                })
                            }

                            updateActive()
                            p.on('change', updateActive)
                        }
                    })
                }
            })

            lightbox.init()
            return lightbox
        })
        .catch(() => {
            warnOptionalDependency('OuiLightboxImage', 'photoswipe')
            return null
        })

    return lightboxPromise
}

export function registerInGroup(group: string, entry: LightboxEntry): void {
    if (!registry.has(group)) registry.set(group, [])
    registry.get(group)!.push(entry)
}

export function unregisterFromGroup(group: string, entry: LightboxEntry): void {
    const arr = registry.get(group)
    if (!arr) return
    const idx = arr.indexOf(entry)
    if (idx !== -1) arr.splice(idx, 1)
    if (arr.length === 0) registry.delete(group)
}

export async function openGroup(group: string, clickedEntry: LightboxEntry): Promise<void> {
    const entries = registry.get(group) ?? []
    const index = entries.indexOf(clickedEntry)
    const slides = entries.map(e => e.getSlide())
    const instance = await initLightbox()
    instance?.loadAndOpen(Math.max(0, index), slides)
}

export async function openSingle(slide: LightboxSlide): Promise<void> {
    const instance = await initLightbox()
    instance?.loadAndOpen(0, [slide])
}
