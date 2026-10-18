import { execFileSync } from 'node:child_process'
import { appendFileSync, readFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

export async function checkRelease({ name, version, commit, tagCommit }, fetchRegistry = fetch) {
    const response = await fetchRegistry(`https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`, {
        signal: AbortSignal.timeout(15000)
    })
    // Only a missing version means unpublished. Registry/network failures must stop the job.
    if (!response.ok && response.status !== 404) throw new Error(`Cannot check npm: registry returned HTTP ${response.status}. No publish attempted.`)
    const published = response.status !== 404
    const metadata = published ? await response.json() : null
    if (published && (metadata.name !== name || metadata.version !== version)) throw new Error('Unexpected npm registry response. No publish attempted.')

    const tag = `v${version}`
    if (!published && tagCommit && tagCommit !== commit) {
        throw new Error(`${tag} already points to ${tagCommit}, but ${name}@${version} is NOT published on npm. This is a tag collision, not a completed release. Prepare a fresh patch release, or resolve the stale tag explicitly before retrying. No publish attempted.`)
    }
    if (published && tagCommit && metadata.gitHead && tagCommit !== metadata.gitHead) {
        throw new Error(`${tag} does not match the published package's gitHead. Resolve the conflicting tag before creating the GitHub release.`)
    }
    const releaseCommit = published ? (metadata.gitHead || tagCommit) : commit
    if (!releaseCommit || !/^[a-f\d]{40}$/i.test(releaseCommit)) {
        throw new Error('Cannot determine the release commit. No Git tag will be created from an unrelated checkout.')
    }
    return { published, tag, version, releaseCommit, tagExists: !!tagCommit }
}

async function main() {
    const { name, version } = JSON.parse(readFileSync('package.json', 'utf8'))
    const tag = `v${version}`
    let tagCommit
    try {
        tagCommit = execFileSync('git', ['rev-parse', '--verify', '--quiet', `refs/tags/${tag}^{commit}`], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim()
    } catch (error) {
        if (error.status !== 1) throw error
    }
    const state = await checkRelease({ name, version, commit: process.env.GITHUB_SHA, tagCommit })
    const outputs = `published=${state.published}\ntag_exists=${state.tagExists}\nversion=${version}\ntag=${tag}\ncommit=${state.releaseCommit}\n`
    appendFileSync(process.env.GITHUB_OUTPUT, outputs)
    const message = state.published
        ? `${name}@${version} already exists on npm; publishing will be skipped and the GitHub release checked.`
        : `${name}@${version} is absent from npm; validation, build and publishing are required.`
    console.log(message)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Release status\n\n${message}\n\n`)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    main().catch(error => {
        console.error(`::error::${error.message}`)
        if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Release blocked\n\n${error.message}\n`)
        process.exitCode = 1
    })
}
