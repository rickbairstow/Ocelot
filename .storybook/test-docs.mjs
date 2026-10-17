import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chromium } from 'playwright'

// This expects an already running Storybook server.
const baseUrl = new URL(process.argv[2] ?? 'http://127.0.0.1:6006/')

test('Every component page has autodocs and starts with Default', async () => {
    const response = await fetch(new URL('index.json', baseUrl))
    assert.ok(response.ok, 'Storybook index must be available')
    const entries = Object.values((await response.json()).entries)
    const stories = entries.filter(entry => entry.type === 'story' && /^(Components|Templates)\//.test(entry.title))
    const titles = [...new Set(stories.map(entry => entry.title))]
    assert.ok(titles.length > 0, 'Component stories must be indexed')
    for (const title of titles) {
        const examples = stories.filter(entry => entry.title === title)
        assert.equal(examples[0].name, 'Default', `${title} must open on the base Default example`)
        assert.ok(entries.some(entry => entry.type === 'docs' && entry.title === title), `${title} must have autodocs`)
    }
})

test('Getting Started docs work after visiting a component story', async (t) => {
    const response = await fetch(new URL('index.json', baseUrl))
    assert.ok(response.ok, 'Storybook index must be available')
    const index = await response.json()
    const docs = Object.values(index.entries).filter(entry => entry.type === 'docs' && entry.title.startsWith('Getting Started/'))
    assert.ok(docs.length > 0, 'Getting Started pages must be indexed')

    const browser = await chromium.launch()
    try {
        for (const entry of docs) {
            await t.test(entry.title, async () => {
                const context = await browser.newContext()
                try {
                    const page = await context.newPage()
                    await page.goto(new URL('?path=/story/components-button--default', baseUrl).href)
                    const preview = page.frameLocator('#storybook-preview-iframe')
                    await preview.getByRole('button').first().waitFor()
                    await page.locator(`a[href$="path=/docs/${entry.id}"]`).click()
                    await preview.locator('.sbdocs-content h1').waitFor()
                    assert.doesNotMatch(await preview.locator('body').innerText(), /Illegal invocation/)

                    await page.goBack()
                    const button = preview.getByRole('button').first()
                    await button.waitFor()
                    await button.focus()
                    assert.ok(await button.evaluate(element => element === document.activeElement), 'Story focus must still work after docs navigation')
                } finally {
                    await context.close()
                }
            })
        }
    } finally {
        await browser.close()
    }
})

test('Browsing component stories preserves their initial state', async () => {
    const browser = await chromium.launch()
    try {
        const page = await browser.newPage()
        const open = async id => {
            await page.goto(new URL(`iframe.html?id=${id}&viewMode=story`, baseUrl).href)
            await page.locator('#storybook-root > *').first().waitFor({ state: 'attached' })
        }
        await open('components-inputs-input--email-input')
        const email = page.getByRole('textbox')
        await email.waitFor()
        assert.equal(await email.inputValue(), '', 'Email must start empty')
        assert.ok(await email.getAttribute('placeholder'))
        await open('components-inputs-switch--required-and-invalid')
        await page.getByRole('switch').waitFor()
        assert.equal(await page.getByRole('switch').isChecked(), false)
        for (const id of ['infinite-loading', 'retry-loading']) {
            await open(`components-inputs-combobox--${id}`)
            const input = page.getByRole('combobox')
            await input.waitFor()
            assert.equal(await input.getAttribute('aria-expanded'), 'false', `${id} must wait for the user`)
            assert.equal(await page.getByRole('alert').count(), 0)
        }
        await open('components-gallery--updated-collection')
        await page.getByRole('list', { name: 'Image gallery' }).waitFor()
        assert.equal(await page.getByRole('listitem').count(), 3)
        assert.equal(await page.getByRole('dialog').count(), 0)
    } finally {
        await browser.close()
    }
})
