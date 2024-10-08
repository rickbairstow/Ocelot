module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        'plugin:storybook/recommended',
        'plugin:vuejs-accessibility/recommended',
        'plugin:jsdoc/recommended',
        'plugin:prettier/recommended',
        '@vue/eslint-config-prettier'
    ],
    plugins: ['vuejs-accessibility', 'jsdoc', 'prettier'],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    env: {
        browser: true,
        amd: true,
        node: true
    },
    rules: {
        'vue/multi-word-component-names': 0,
        eqeqeq: ['error', 'always'],
        'vue/eqeqeq': ['error', 'always'],
        'no-unused-vars':
            process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'vue/no-unused-vars':
            process.env.NODE_ENV === 'production' ? 'error' : 'warn',
        'vue/attributes-order': [
            'warn',
            {
                order: [
                    'DEFINITION',
                    'LIST_RENDERING',
                    'CONDITIONALS',
                    'RENDER_MODIFIERS',
                    'GLOBAL',
                    ['UNIQUE', 'SLOT'],
                    'TWO_WAY_BINDING',
                    'OTHER_DIRECTIVES',
                    ['ATTR_STATIC', 'ATTR_SHORTHAND_BOOL'],
                    'ATTR_DYNAMIC',
                    'EVENTS',
                    'CONTENT'
                ],
                alphabetical: true
            }
        ],
        'vue/html-self-closing': [
            'warn',
            {
                html: { void: 'always', normal: 'always', component: 'always' },
                svg: 'always',
                math: 'always'
            }
        ],
        'vue/max-attributes-per-line': [
            'error',
            {
                singleline: {
                    max: 1
                },
                multiline: {
                    max: 1
                }
            }
        ],
        'vue/html-indent': ['error', 4],

        // Prettier configuration - identical to .prettierrc config file.
        'prettier/prettier': [
            process.env.NODE_ENV === 'production' ? 'error' : 'warn',
            {
                tabWidth: 4,
                singleAttributePerLine: true,
                htmlWhitespaceSensitivity: 'ignore',
                trailingComma: 'none',
                endOfLine: 'lf',
                semi: false,
                singleQuote: true,
                bracketSpacing: true,
                bracketSameLine: false,
                vueIndentScriptAndStyle: false
            }
        ]
    },

    overrides: [
        {
            files: ['*.stories.js', '*.config.js'],
            rules: {
                'jsdoc/require-jsdoc': 'off'
            }
        }
    ]
}
