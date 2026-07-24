#!/usr/bin/env node
import { execSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
const packageName = packageJson.name
const changesetDirectory = '.changeset'
const allowedBumps = new Set(['patch', 'minor', 'major', 'none'])
const packageImpactPatterns = [
    /^\.build\//,
    /^src\//,
    /^tailwind\.css$/,
    /^package\.json$/,
    /^package-lock\.json$/,
    /^vite\.config\.ts$/,
    /^vitest\.config\.ts$/,
    /^tsconfig\.json$/
]
const ignoredChangedFilePatterns = [
    /^\.changeset\//,
    /^\.github\//,
    /^AGENTS\.md$/,
    /^CHANGELOG\.md$/,
    /^README\.md$/,
    /^planning\//,
    /^docs\//
]

const runQuiet = (command) => {
    try {
        return execSync(command, { stdio: 'pipe' }).toString().trim()
    } catch {
        return ''
    }
}

const getChangesetFiles = () => {
    if (!existsSync(changesetDirectory)) return []

    return readdirSync(changesetDirectory)
        .filter((file) => extname(file) === '.md' && file !== 'README.md')
        .map((file) => join(changesetDirectory, file))
}

const parseChangesetPackages = (filePath) => {
    const content = readFileSync(filePath, 'utf8')
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)

    if (!match) {
        throw new Error(`${filePath} is missing Changesets frontmatter.`)
    }

    return match[1]
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
            const packageMatch = line.match(/^['"]?([^'":]+)['"]?:\s*(patch|minor|major|none)$/)

            if (!packageMatch) {
                throw new Error(`${filePath} has invalid frontmatter line: ${line}`)
            }

            return {
                name: packageMatch[1],
                bump: packageMatch[2]
            }
        })
}

const hasPackageImpact = (filePath) => {
    const normalizedPath = filePath.replaceAll('\\', '/')

    if (ignoredChangedFilePatterns.some((pattern) => pattern.test(normalizedPath))) {
        return false
    }

    return packageImpactPatterns.some((pattern) => pattern.test(normalizedPath))
}

const validateChangesetFiles = (changesetFiles) => {
    for (const filePath of changesetFiles) {
        const filename = basename(filePath, '.md')

        if (!/^[a-z]+(?:-[a-z]+)+$/.test(filename)) {
            throw new Error(`${filePath} should use a random-words filename, for example quiet-dots-dance.md.`)
        }

        const packages = parseChangesetPackages(filePath)

        if (packages.length === 0) {
            throw new Error(`${filePath} must declare a package bump.`)
        }

        for (const entry of packages) {
            if (entry.name !== packageName) {
                throw new Error(`${filePath} references "${entry.name}", but package.json is "${packageName}".`)
            }

            if (!allowedBumps.has(entry.bump)) {
                throw new Error(`${filePath} uses unsupported bump "${entry.bump}".`)
            }
        }
    }
}

const validateMissingChangeset = (changesetFiles) => {
    const baseRef = process.env.CHANGESET_BASE_REF ?? 'origin/main'
    const changedFiles = runQuiet(`git diff --name-only ${baseRef}...HEAD`)
        .split(/\r?\n/)
        .filter(Boolean)

    if (changedFiles.length === 0) return

    const requiresChangeset = changedFiles.some(hasPackageImpact)

    if (requiresChangeset && changesetFiles.length === 0) {
        throw new Error(`Package-impacting changes need a changeset. Run npm run changeset and choose the bump for ${packageName}.`)
    }
}

try {
    const changesetFiles = getChangesetFiles()

    validateChangesetFiles(changesetFiles)
    validateMissingChangeset(changesetFiles)

    console.log('Changeset check passed.')
} catch (error) {
    console.error(error.message)
    process.exit(1)
}
