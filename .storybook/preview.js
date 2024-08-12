/** @type { import('@storybook/vue3').Preview } */
import '@Css/core.scss'

const preview = {
    parameters: {
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i
            }
        }
    },
    tags: ['autodocs']
}

export default preview
