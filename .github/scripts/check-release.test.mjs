import { test } from 'node:test'
import assert from 'node:assert/strict'
import { checkRelease } from './check-release.mjs'

const commit = 'a'.repeat(40)
const otherCommit = 'b'.repeat(40)
const release = { name: 'ocelot-ui', version: '0.1.0', commit }
const absent = async () => ({ status: 404, ok: false })
const present = async () => ({ status: 200, ok: true, json: async () => ({ name: release.name, version: release.version, gitHead: commit }) })

test('an unpublished version without a tag needs publishing', async () => {
    const state = await checkRelease(release, absent)
    assert.equal(state.published, false)
    assert.equal(state.tagExists, false)
    assert.equal(state.releaseCommit, commit)
})

test('an existing matching tag does not imply npm publication', async () => {
    const state = await checkRelease({ ...release, tagCommit: commit }, absent)
    assert.equal(state.published, false)
    assert.equal(state.tagExists, true)
})

test('an older conflicting tag fails instead of silently skipping npm', async () => {
    await assert.rejects(checkRelease({ ...release, tagCommit: otherCommit }, absent), /tag collision/)
})

test('an already published version skips npm and keeps its original source commit', async () => {
    const state = await checkRelease({ ...release, commit: otherCommit }, present)
    assert.equal(state.published, true)
    assert.equal(state.releaseCommit, commit)
})

test('a GitHub release can be completed after npm succeeded', async () => {
    const state = await checkRelease({ ...release, commit: otherCommit, tagCommit: commit }, present)
    assert.equal(state.published, true)
    assert.equal(state.tagExists, true)
    assert.equal(state.releaseCommit, commit)
})

test('a published package with a conflicting tag fails', async () => {
    await assert.rejects(checkRelease({ ...release, tagCommit: otherCommit }, present), /does not match/)
})

test('registry outages and connection failures never count as unpublished', async () => {
    await assert.rejects(checkRelease(release, async () => ({ status: 503, ok: false })), /HTTP 503/)
    await assert.rejects(checkRelease(release, async () => { throw new Error('connection failed') }), /connection failed/)
})

test('unexpected registry data cannot skip or redirect a release', async () => {
    await assert.rejects(checkRelease(release, async () => ({ status: 200, ok: true, json: async () => ({ name: 'different-package', version: '0.1.0' }) })), /Unexpected/)
    await assert.rejects(checkRelease(release, async () => ({ status: 200, ok: true, json: async () => ({ name: release.name, version: release.version }) })), /Cannot determine/)
})
