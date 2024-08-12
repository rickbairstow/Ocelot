/* This exposes files and components for the build process and bundles them up to the /dist folder. */

/**
 * CSS Imports
 * Packages any provided CSS files to the dist style file.
 */
import '@Css/core.scss'

/**
 * Component Imports
 * Automatically imports all .vue components in the @Components directory, and
 * then compiles them into an export list for use.
 */
const components = import.meta.glob('@Components/**/*.vue', { eager: true })
const componentsExport = Object.entries(components).reduce((acc, [path, module]) => {
    const componentName = path.split('/').pop().replace('.vue', '');
    acc[componentName] = module.default;
    return acc;
}, {});

export default { ...componentsExport }
