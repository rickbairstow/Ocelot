/* This exposes files and components for the build process and bundles them up to the /dist folder. */

/**
 * CSS Imports
 */
import '@Css/core.scss'

/**
 * Component Imports
 * Automatically imports all .vue components in the @Components directory.
 */
const components = import.meta.glob<{ default: object }>('@Components/**/*.vue', { eager: true })
const componentsExport = Object.entries(components).reduce<Record<string, object>>(
    (acc, [path, module]) => {
        const componentName = path.split('/').pop()!.replace('.vue', '')
        acc[componentName] = module.default
        return acc
    },
    {}
)

export default { ...componentsExport }
