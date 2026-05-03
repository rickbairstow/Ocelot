import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('warnOptionalDependency', () => {
    let warnSpy: ReturnType<typeof vi.spyOn>

    beforeEach(() => {
        vi.resetModules()
        warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    })

    afterEach(() => {
        warnSpy.mockRestore()
        vi.unstubAllEnvs()
    })

    it('warns once for each component and dependency pair in development', async () => {
        const { warnOptionalDependency } = await import('./optionalDependency')

        warnOptionalDependency('OuiVideo', 'plyr')
        warnOptionalDependency('OuiVideo', 'plyr')
        warnOptionalDependency('OuiQrCode', 'qrcode')

        expect(warnSpy).toHaveBeenCalledTimes(2)
        expect(warnSpy).toHaveBeenNthCalledWith(
            1,
            '[OuiVideo] Optional dependency "plyr" is not installed. Install it with "npm install plyr" to use this component.'
        )
        expect(warnSpy).toHaveBeenNthCalledWith(
            2,
            '[OuiQrCode] Optional dependency "qrcode" is not installed. Install it with "npm install qrcode" to use this component.'
        )
    })

    it('does not warn outside development', async () => {
        vi.stubEnv('DEV', false)
        const { warnOptionalDependency } = await import('./optionalDependency')

        warnOptionalDependency('OuiVideo', 'plyr')

        expect(warnSpy).not.toHaveBeenCalled()
    })
})
