import pluginVue from "eslint-plugin-vue";
import pluginVueA11y from "eslint-plugin-vuejs-accessibility";
import pluginStorybook from "eslint-plugin-storybook";
import stylistic from "@stylistic/eslint-plugin";
import js from "@eslint/js";
import globals from "globals";

export default [
    js.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
    ...pluginVueA11y.configs["flat/recommended"],
    ...pluginStorybook.configs["flat/recommended"],
    {
        files: ["**/*.vue", "**/*.js", "**/*.ts", "**/*.tsx"],

        ignores: ["**/node_modules/", ".git/", ".github/", "public/", "docs/"],

        plugins: {
            "@stylistic": stylistic,
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.amd,
                ...globals.node,
            },

            ecmaVersion: "latest",
        },

        rules: {
            eqeqeq: ["error", "always"],
            "vue/eqeqeq": ["error", "always"],
            "no-unused-vars": "warn",
            "vue/no-unused-vars": "warn",

            "vue/attributes-order": ["warn", {
                order: [
                    "DEFINITION",
                    "LIST_RENDERING",
                    "CONDITIONALS",
                    "RENDER_MODIFIERS",
                    "GLOBAL",
                    ["UNIQUE", "SLOT"],
                    "TWO_WAY_BINDING",
                    "OTHER_DIRECTIVES",
                    ["ATTR_STATIC", "ATTR_SHORTHAND_BOOL"],
                    "ATTR_DYNAMIC",
                    "EVENTS",
                    "CONTENT",
                ],

                alphabetical: true,
            }],

            "vue/html-self-closing": ["warn", {
                html: {
                    void: "always",
                    normal: "always",
                    component: "always",
                },

                svg: "always",
                math: "always",
            }],

            "vue/max-attributes-per-line": ["error", {
                singleline: {
                    max: 1,
                },

                multiline: {
                    max: 1,
                },
            }],

            "vue/html-indent": ["error", 4],

            "@stylistic/indent": ["error", 4],
            "@stylistic/quotes": ["error", "single"],
            "@stylistic/semi": ["error", "never"],
            "@stylistic/comma-dangle": ["error", "never"],
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/eol-last": ["error", "always"],

            "vue/multi-word-component-names": 0,

            "no-useless-assignment": "off", // False positives in <script setup> — template usage is invisible to ESLint
            "vuejs-accessibility/label-has-for": "off", // Doesn't seem to like binded for's.
        },
    },
];
