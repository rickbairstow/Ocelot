import fs from 'node:fs'
import ts from 'typescript'
const root = 'src/stories/components/'
const read = name => fs.readFileSync(`${root}${name}.stories.ts`, 'utf8')
const write = (name, text) => fs.writeFileSync(`${root}${name}.stories.ts`, text)
const parse = text => ts.createSourceFile('story.ts', text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
function declaration(text, name) {
    const sf = parse(text)
    for (const statement of sf.statements) {
        if (ts.isVariableStatement(statement)) {
            const decl = statement.declarationList.declarations.find(d => d.name.getText(sf) === name)
            if (decl) return { sf, statement, decl }
        }
    }
    throw new Error(`Missing ${name}`)
}
function transform(name, fn) { write(name, fn(read(name))) }
function story(name, key, value) {
    transform(name, text => {
        const { statement } = declaration(text, key)
        return text.slice(0, statement.getStart()) + value + text.slice(statement.end)
    })
}
function drop(name, key) { story(name, key, '') }
function rename(name, key, next) { transform(name, text => text.replace(`export const ${key}: Story`, `export const ${next}: Story`)) }
function add(name, text) { transform(name, source => { const first = source.indexOf('export const '); return source.slice(0, first) + text + '\n\n' + source.slice(first) }) }
function args(name, value) {
    transform(name, text => {
        const { decl } = declaration(text, 'meta')
        const property = decl.initializer.properties.find(p => p.name?.getText() === 'args')
        if (!property) throw new Error(`Missing args in ${name}`)
        return text.slice(0, property.initializer.getStart()) + value + text.slice(property.initializer.end)
    })
}

args('Progress', "{ value: 65, label: 'Progress' }")
transform('Progress', s => s.replace('args: { value: undefined, showValue: false, label: undefined }', "args: { value: undefined, label: 'Progress' }"))
transform('Sidebar', s => s.replace('play: Left.play', 'play: Default.play'))
transform('AppShell', s => s.replace('render: Default.render', 'render: WorkspaceLayout.render'))
transform('Table', s => s.replace("await expect(canvas.getByRole('table')).toBeVisible()", "await waitFor(() => expect(canvas.getByRole('table')).toBeVisible())"))
transform('Range', s => s.replace("        slider.focus()\n        await userEvent.keyboard('{ArrowRight}')\n        await expect(slider).toHaveValue('51')", "        await expect(slider).toHaveAttribute('min', '0')\n        await expect(slider).toHaveAttribute('max', '100')\n        await expect(slider).toHaveAttribute('step', '1')"))
// Additive features stay separate from minimal defaults.
add('Card', `export const WithBadges: Story = {
    args: { title: 'Weekend escape', badges: [{ text: 'Available', type: 'success' }] },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByText('Available')).toBeVisible()
    }
}`)
add('Loader', `export const WithText: Story = {
    args: { text: 'Loading your workspace…' },
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('status')).toHaveTextContent('Loading your workspace…')
    }
}`)
transform('StatCard', s => s.replace("        trend: 5,\n", ''))
// Avoid a blank invalid-icon page: the fallback case belongs in a unit test.
// Keep the searchable icon catalogue requested by consumers.
transform('Icon', s => s.replace('<span class="text-sm text-gray-600">Passing a Tabler component directly — no registry lookup needed</span>', ''))
// Keyboard behaviour is exercised alongside the default, not on a duplicate canvas.
for (const name of ['Tabs', 'CommandPalette']) {
    transform(name, text => {
        const defaultDecl = declaration(text, 'Default').decl
        const keyboardDecl = declaration(text, 'KeyboardNavigation').decl
        const getPlay = decl => decl.initializer.properties.find(p => p.name?.getText() === 'play')
        const getFunction = prop => ts.isMethodDeclaration(prop)
            ? `async (${prop.parameters.map(p => p.getText()).join(', ')}) ${prop.body.getText()}`
            : prop.initializer.getText()
        const defaultPlay = getPlay(defaultDecl)
        const keyboardPlay = getPlay(keyboardDecl)
        const helper = `const checkDefault: NonNullable<Story['play']> = ${getFunction(defaultPlay)}\n\nconst checkKeyboard: NonNullable<Story['play']> = ${getFunction(keyboardPlay)}\n\n`
        text = text.slice(0, defaultPlay.getStart()) + 'play: async (context) => {\n        await checkDefault(context)\n        await checkKeyboard(context)\n    }' + text.slice(defaultPlay.end)
        const { statement } = declaration(text, 'KeyboardNavigation')
        text = text.slice(0, statement.getStart()) + text.slice(statement.end)
        const first = text.indexOf('export const ')
        return text.slice(0, first) + helper + text.slice(first)
    })
}
// The no-prop h1 and a single comparison document the full level range.
args('Heading', "{ default: 'Heading title' }")
story('Heading', 'Default', `export const Default: Story = {
    play: async ({ canvasElement }) => {
        await expect(within(canvasElement).getByRole('heading', { level: 1 })).toBeVisible()
    }
}`)
for (const level of [2, 3, 4, 5, 6]) drop('Heading', `Heading${level}`)
add('Heading', `export const Levels: Story = {
    render: () => ({
        components: { Heading },
        template: '<div class="grid gap-4"><Heading v-for="level in 6" :key="level" :level="level">Heading {{ level }}</Heading></div>'
    }),
    play: async ({ canvasElement }) => {
        for (const level of [1, 2, 3, 4, 5, 6]) {
            await expect(within(canvasElement).getByRole('heading', { level })).toBeVisible()
        }
    }
}`)
// Keep default input state plain and put placeholder guidance on the docs page.
transform('Select', s => s.replace("value: ref(''), options: COUNTRIES } },\n        template: '<Select v-model=\"value\" label=\"Country\" name=\"country\" :options=\"options\" placeholder=\"Select a country...\" />'", "value: ref('gb'), options: COUNTRIES } },\n        template: '<Select v-model=\"value\" label=\"Country\" name=\"country\" :options=\"options\" />'"))
transform('Textarea', s => s.replace(' name="message" placeholder="Write something..."', ' name="message"'))
// Each feature owns only the optional settings it needs.
for (const name of ['Button', 'Loader']) transform(name, s => s.replace("import { faker } from '@faker-js/faker'\n", ''))

