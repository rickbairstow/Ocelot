/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly DEV: boolean
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

declare module '*.css' {
    const css: string
    export default css
}
