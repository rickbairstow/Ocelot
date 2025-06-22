import '@Css/core.scss'
import { withThemeByClassName } from '@storybook/addon-themes'
import { useArgs } from 'storybook/preview-api'

export default {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },

        a11y: {
            // 'todo' - show a11y violations in the test UI only
            // 'error' - fail CI on a11y violations
            // 'off' - skip a11y checks entirely
            test: 'error'
        }
    },
    tags: ['autodocs'],
    decorators: [
        withThemeByClassName({
            themes: {
                Light: '',
                Dark: 'dark'
            },
            defaultTheme: 'Light'
        }),

        // Enable use of updateArgs
        (story, context) => {
            // eslint-disable-next-line no-unused-vars
            const [_, updateArgs] = useArgs()
            return story({ ...context, updateArgs })
        }
    ]
}
