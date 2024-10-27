import '@Css/core.scss'
import { withThemeByClassName } from '@storybook/addon-themes'

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
        })
    ]
}
