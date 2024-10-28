import vuejsAccessibility from "eslint-plugin-vuejs-accessibility";
import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import prettier from "eslint-plugin-prettier"; // Import prettier plugin

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [...compat.extends(
    "plugin:vue/vue3-recommended",
    "eslint:recommended",
    "plugin:storybook/recommended",
    "plugin:vuejs-accessibility/recommended"
), {
    files: ["**/*.vue", "**/*.js", "**/*.ts", "**/*.tsx"],

    ignores: ["**/node_modules/", ".git/", '.github/', 'public/', 'docs/'],

    plugins: {
        "vuejs-accessibility": vuejsAccessibility,
        prettier: prettier // Use the imported prettier plugin
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.amd,
            ...globals.node,
        },

        ecmaVersion: "latest"
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

        "prettier/prettier": ["warn", {
            tabWidth: 4,
            singleAttributePerLine: true,
            htmlWhitespaceSensitivity: "ignore",
            trailingComma: "none",
            endOfLine: "lf",
            semi: false,
            singleQuote: true,
            bracketSpacing: true,
            bracketSameLine: false,
            vueIndentScriptAndStyle: false,
        }],

        "vue/multi-word-component-names": 0,

        'vuejs-accessibility/label-has-for': 'off' // Doesn't seem to like binded for's.
    },
}];
