import type { Meta, StoryObj } from '@storybook/vue3'
import CodeBlock from '@Components/CodeBlock.vue'
import { expect, waitFor, within } from 'storybook/test'

const lightThemes = [
    'catppuccin-latte',
    'github-light',
    'material-theme-lighter',
    'min-light',
    'one-light',
    'rose-pine-dawn',
    'slack-ochin',
    'snazzy-light',
    'solarized-light',
    'vitesse-light'
] as const

const darkThemes = [
    'catppuccin-mocha',
    'dracula',
    'github-dark',
    'material-theme-ocean',
    'night-owl',
    'nord',
    'one-dark-pro',
    'poimandres',
    'rose-pine-moon',
    'synthwave-84',
    'tokyo-night',
    'vitesse-dark'
] as const

const languages = [
    'css',
    'javascript',
    'json',
    'markdown',
    'typescript',
    'vue'
] as const

const codeExamples: Record<string, string> = {
    typescript: `function greet(name: string): string {
    return \`Hello, \${name}!\`
}

console.log(greet('World'))`,

    javascript: `function greet(name) {
    return \`Hello, \${name}!\`
}

console.log(greet('World'))`,

    vue: `<template>
    <p>{{ message }}</p>
</template>`,

    css: `.card {
    border-radius: 0.75rem;
    background: white;
    padding: 1.25rem;
    box-shadow: 0 1px 3px rgb(0 0 0 / 0.1);
}`,

    json: `{
    "name": "my-app",
    "version": "1.0.0",
    "scripts": {
        "dev": "vite",
        "build": "vite build"
    }
}`,

    markdown: `# Hello, World!

This is a simple paragraph with **bold** and _italic_ text.

- Item one
- Item two
- Item three`
}

const meta: Meta<typeof CodeBlock> = {
    title: 'Components/CodeBlock',
    component: CodeBlock,

    parameters: {
        docs: {
            description: {
                component: 'A syntax-highlighted code block powered by Shiki. Supports all major languages and themes, with a language label and one-click copy button. Automatically adapts between light and dark themes.'
            }
        }
    },

    argTypes: {
        code: {
            control: 'text',
            description: 'The code string to display.'
        },
        darkTheme: {
            control: 'select',
            options: darkThemes,
            description: 'Shiki theme for dark mode.'
        },
        language: {
            control: 'select',
            options: languages,
            description: 'Language for syntax highlighting.'
        },
        theme: {
            control: 'select',
            options: lightThemes,
            description: 'Shiki theme for light mode.'
        }
    },

    args: {
        code: codeExamples.typescript,
        darkTheme: 'github-dark',
        language: 'typescript',
        theme: 'github-light'
    }
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
    async play({ canvasElement }) {
        const canvas = within(canvasElement)
        await waitFor(() => {
            expect(canvasElement.querySelector('pre')).not.toBeNull()
        })
        await expect(canvas.getByRole('button', { name: /copy/i })).toBeVisible()
    }
}

export const JavaScript: Story = {
    args: {
        code: codeExamples.javascript,
        language: 'javascript'
    },

    async play({ canvasElement }) {
        await waitFor(() => {
            expect(canvasElement.querySelector('pre')).not.toBeNull()
        })
    }
}

export const Vue: Story = {
    args: {
        code: codeExamples.vue,
        language: 'vue'
    },

    async play({ canvasElement }) {
        await waitFor(() => {
            expect(canvasElement.querySelector('pre')).not.toBeNull()
        })
    }
}

export const JSON: Story = {
    args: {
        code: codeExamples.json,
        language: 'json'
    },

    async play({ canvasElement }) {
        await waitFor(() => {
            expect(canvasElement.querySelector('pre')).not.toBeNull()
        })
    }
}

export const Markdown: Story = {
    args: {
        code: codeExamples.markdown,
        language: 'markdown'
    },

    async play({ canvasElement }) {
        await waitFor(() => {
            expect(canvasElement.querySelector('pre')).not.toBeNull()
        })
    }
}

