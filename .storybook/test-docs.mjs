import assert from 'node:assert/strict'
import { test } from 'node:test'
import { chromium } from 'playwright'

// This expects an already running Storybook server.
const baseUrl = new URL(process.argv[2] ?? 'http://127.0.0.1:6006/')

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
