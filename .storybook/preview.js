import '@Css/core.scss'
import { withThemeByClassName } from '@storybook/addon-themes'
import { useArgs } from '@storybook/preview-api'

export default {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
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
