#!/usr/bin/env node
import { execSync } from 'child_process'
import { createInterface } from 'readline'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const packageJson = resolve(__dirname, '../package.json')
const pkg = JSON.parse(readFileSync(packageJson, 'utf8'))

const PACKAGE_NAME = pkg.name
const LOCAL_VERSION = pkg.version

console.log(`Local version:  ${LOCAL_VERSION}`)

let npmVersion
try {
    npmVersion = execSync(`npm view ${PACKAGE_NAME} version`, { stdio: 'pipe' }).toString().trim()
} catch {
    npmVersion = 'not published'
}
console.log(`npm version:    ${npmVersion}`)

if (LOCAL_VERSION !== npmVersion) {
    console.log('\nWarning: local and npm versions differ.')
}

const rl = createInterface({ input: process.stdin, output: process.stdout })

rl.question('\nBump type? [patch / minor / major]: ', (bumpType) => {
    rl.close()

    if (!['patch', 'minor', 'major'].includes(bumpType)) {
        console.error(`Invalid bump type '${bumpType}'. Aborting.`)
        process.exit(1)
    }

    const run = (cmd) => execSync(cmd, { stdio: 'inherit' })

    const newVersion = execSync(`npm version ${bumpType} --no-git-tag-version`, { stdio: 'pipe' })
        .toString().trim().replace(/^v/, '')
    console.log(`\nBumped to ${newVersion}`)

    console.log('\nCommitting version bump...')
    run('git add package.json package-lock.json')
    run(`git commit -m "chore: release v${newVersion}"`)
    run(`git tag v${newVersion}`)

    console.log('\nPushing commit and tag...')
    run('git push')
    run(`git push origin v${newVersion}`)

    console.log('\nPublishing to npm...')
    run('npm publish --access public')

    console.log(`\nDone! Published ${PACKAGE_NAME}@${newVersion}`)
})
