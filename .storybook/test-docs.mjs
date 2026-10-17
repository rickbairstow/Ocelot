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

test('Splitter resizes with pointer input in both orientations and RTL', async () => {
    const browser = await chromium.launch()
    try {
        const page = await browser.newPage({ viewport: { width: 1000, height: 800 } })
        for (const [story, vertical, rtl] of [['default', false, false], ['vertical', true, false], ['default', false, true], ['disabled', false, false]]) {
            await page.goto(new URL(`iframe.html?id=components-splitter--${story}&viewMode=story`, baseUrl).href)
            const separator = page.getByRole('separator', { name: 'Contents' })
            await separator.waitFor()
            if (rtl) await page.locator('#storybook-root').evaluate(root => { root.dir = 'rtl' })
            const bounds = await separator.boundingBox()
            assert.ok(bounds)
            const start = Number(await separator.getAttribute('aria-valuenow'))
            const x = bounds.x + bounds.width / 2
            const y = bounds.y + bounds.height / 2
            await page.mouse.move(x, y)
            await page.mouse.down()
            await page.mouse.move(x + (vertical ? 0 : 70), y + (vertical ? 30 : 0), { steps: 8 })
            await page.mouse.up()
            const end = Number(await separator.getAttribute('aria-valuenow'))
            if (story === 'disabled') assert.equal(end, start)
            else if (rtl) assert.ok(end < start, 'Dragging right in RTL shrinks the primary pane')
            else assert.ok(end > start, 'Dragging advances the primary pane size')
        }
    } finally {
        await browser.close()
    }
})

test('New inputs submit committed values with native form semantics', async () => {
    const browser = await chromium.launch()
    try {
        const page = await browser.newPage()
        const values = async name => page.locator('#storybook-root').evaluate((root, fieldName) => {
            const form = document.createElement('form')
            root.before(form)
            form.append(root)
            return new FormData(form).getAll(fieldName)
        }, name)
        for (const [story, name, expected] of [
            ['tagsinput--populated', 'tags', ['Design', 'Vue', 'Accessibility']],
            ['tagsinput--readonly', 'tags', ['Design', 'Vue']],
            ['tagsinput--disabled', 'tags', []],
            ['rating--readonly', 'rating', ['4']],
            ['rating--disabled', 'rating', []],
            ['numberinput--readonly', 'quantity', ['5']],
            ['numberinput--disabled', 'quantity', []]
        ]) {
            await page.goto(new URL(`iframe.html?id=components-inputs-${story}&viewMode=story`, baseUrl).href)
            await page.locator('#storybook-root input').first().waitFor({ state: 'attached' })
            assert.deepEqual(await values(name), expected, story)
        }
    } finally {
        await browser.close()
    }
})
