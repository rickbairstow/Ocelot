import '@Css/storybook.css'
import { withThemeByClassName } from '@storybook/addon-themes'
import { useArgs } from 'storybook/preview-api'

export default {
    parameters: {
        options: {
            storySort: (a, b) => {
                const gettingStarted = title => title.startsWith('Getting Started/')
                if (gettingStarted(a.title) !== gettingStarted(b.title)) return gettingStarted(a.title) ? -1 : 1
                if (gettingStarted(a.title) && gettingStarted(b.title)) {
                    const priority = title => title.endsWith('/Introduction') ? 0 : title.endsWith('/Installation') ? 1 : 2
                    if (priority(a.title) !== priority(b.title)) return priority(a.title) - priority(b.title)
                }
                if (a.title.startsWith('Components/Inputs/') && b.title.startsWith('Components/Inputs/')) {
                    const overview = title => title === 'Components/Inputs/Overview'
                    if (overview(a.title) !== overview(b.title)) return overview(a.title) ? -1 : 1
                }
                return a.title.localeCompare(b.title, 'en', { numeric: true })
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
