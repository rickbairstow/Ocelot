const warnedDependencies = new Set<string>()

export function warnOptionalDependency(component: string, dependency: string): void {
    if (!import.meta.env.DEV) return

    const key = `${component}:${dependency}`
    if (warnedDependencies.has(key)) return

    warnedDependencies.add(key)
    console.warn(
        `[${component}] Optional dependency "${dependency}" is not installed. Install it with "npm install ${dependency}" to use this component.`
    )
}
