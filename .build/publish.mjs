#!/usr/bin/env node
import { execSync } from 'child_process'
import { createInterface } from 'readline'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJson = resolve(__dirname, '../package.json')
const packageLockJson = resolve(__dirname, '../package-lock.json')
const pkg = JSON.parse(readFileSync(packageJson, 'utf8'))

const PACKAGE_NAME = pkg.name
const LOCAL_VERSION = pkg.version

const run = (cmd, options = {}) => execSync(cmd, { stdio: 'inherit', ...options })
const runQuiet = (cmd, options = {}) => execSync(cmd, { stdio: 'pipe', ...options }).toString().trim()

// Ensure we're on main
const currentBranch = runQuiet('git rev-parse --abbrev-ref HEAD')
if (currentBranch !== 'main') {
    console.error(`Must be on main branch (currently on '${currentBranch}'). Aborting.`)
    process.exit(1)
}

// Ensure local is up to date with remote
runQuiet('git fetch origin main')
const localHash = runQuiet('git rev-parse HEAD')
const remoteHash = runQuiet('git rev-parse origin/main')
if (localHash !== remoteHash) {
    console.error('Local branch is not up to date with origin/main. Run `git pull` first. Aborting.')
    process.exit(1)
}

// Ensure no uncommitted changes
const dirty = runQuiet('git status --porcelain')
if (dirty) {
    console.error('You have uncommitted changes. Commit or stash them first. Aborting.')
    process.exit(1)
}

// Ensure logged in to npm
try {
    runQuiet('npm whoami')
} catch {
    console.log('Not logged in to npm. Please log in...')
    run('npm login')
}

console.log(`Local version:  ${LOCAL_VERSION}`)

let npmVersion
try {
    npmVersion = runQuiet(`npm view ${PACKAGE_NAME} version`)
} catch {
    npmVersion = 'not published'
}
console.log(`npm version:    ${npmVersion}`)

if (LOCAL_VERSION !== npmVersion) {
    console.log('\nWarning: local and npm versions differ.')
}

// Install dependencies first
console.log('\nInstalling dependencies...')
if (existsSync(packageLockJson)) {
    run('npm ci')
} else {
    run('npm install')
}

// Build before release
console.log('\nRunning build...')
run('npm run build')

const rl = createInterface({ input: process.stdin, output: process.stdout })

rl.question('\nBump type? [patch / minor / major]: ', (bumpType) => {
    rl.close()

    if (!['patch', 'minor', 'major'].includes(bumpType)) {
        console.error(`Invalid bump type '${bumpType}'. Aborting.`)
        process.exit(1)
    }

    const newVersion = runQuiet(`npm version ${bumpType} --no-git-tag-version`).replace(/^v/, '')
    console.log(`\nBumped to ${newVersion}`)

    console.log('\nPublishing to npm...')
    try {
        run('npm publish --access public')
    } catch (err) {
        console.error('\nPublish failed. Reverting version bump...', err)
        run(`npm version ${LOCAL_VERSION} --no-git-tag-version --allow-same-version`)
        process.exit(1)
    }

    console.log('\nCommitting version bump...')
    const filesToAdd = ['package.json']
    if (existsSync(packageLockJson)) filesToAdd.push('package-lock.json')
    run(`git add ${filesToAdd.join(' ')}`)
    run(`git commit -m "chore: release v${newVersion}"`)
    run(`git tag v${newVersion}`)

    console.log('\nPushing commit and tag...')
    run('git push')
    run(`git push origin v${newVersion}`)

    console.log(`\nDone! Published ${PACKAGE_NAME}@${newVersion}`)
})
