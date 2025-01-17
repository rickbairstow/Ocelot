const { injectAxe, checkA11y } = require('axe-playwright')

let isAxeRunning = false;

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
module.exports = {
    async preVisit(page) {
        await injectAxe(page)
    },
    async postVisit(page) {
        while (isAxeRunning) {
            await new Promise((resolve) => setTimeout(resolve, 50)) // Wait until the previous Axe run finishes
        }
        isAxeRunning = true
        try {
            await checkA11y(
                page,
                '#storybook-root',
                {
                    detailedReport: true,
                    detailedReportOptions: {
                        html: true
                    },
                    includedImpacts: [
                        'minor',
                        'moderate',
                        'serious',
                        'critical'
                    ],
                    verbose: false
                },
                false,
                'v2'
            )
        } finally {
            isAxeRunning = false
        }
    }
}
