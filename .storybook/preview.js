import '@Css/storybook.css'
import '@Css/core.scss'
import { withThemeByClassName } from '@storybook/addon-themes'
import { useArgs } from 'storybook/preview-api'

export default {
    parameters: {
        options: {
            storySort: {
                order: ['Getting Started', ['Introduction', 'Installation'], '*']
            }
        },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        },

        a11y: {
            test: 'error'
        }
    },
    tags: ['autodocs'],
    decorators: [
        withThemeByClassName({
            themes: {
                Light: '',
                Dark: 'dark bg-gray-950'
            },
            defaultTheme: 'Light'
        }),

        // Enable use of updateArgs
        (story, context) => {
            const [_args, updateArgs] = useArgs()
            return story({ ...context, updateArgs })
        }
    ]
}
