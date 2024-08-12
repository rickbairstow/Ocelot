/* This exposes files and components for the build process and bundles them up to the /dist folder. */

/**
 * CSS Imports
 * Packages any provided CSS files to the dist style file.
 */
import '@Css/core.scss'

/**
 * Component Imports
 * Packages any provided components to the dist module file.
 */
import HelloWorld from '@Components/HelloWorld.vue'

export {
    HelloWorld
}
