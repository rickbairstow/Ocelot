module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        'plugin:storybook/recommended',
        '@vue/eslint-config-prettier'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    env: {
        browser: true,
        amd: true,
        node: true
    },
    rules: {
        'vue/html-indent': ['error', 4],
        eqeqeq: ['error', 'always'],
        'vue/eqeqeq': ['error', 'always'],
        'prettier/prettier':
            process.env.NODE_ENV === 'production' ? 'error' : 'warn',
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
        ]
    }
}
