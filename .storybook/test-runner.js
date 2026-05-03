import { injectAxe, checkA11y } from 'axe-playwright'

let isAxeRunning = false

/*
 * See https://storybook.js.org/docs/writing-tests/test-runner#test-hook-api
 * to learn more about the test-runner hooks API.
 */
export default {
    async preVisit(page) {
        await injectAxe(page)
    },
    async postVisit(page, context) {
        while (isAxeRunning) {
            await new Promise((resolve) => setTimeout(resolve, 50)) // Wait until the previous Axe run finishes
        }
        const disabledRuleIds = context?.parameters?.a11y?.config?.rules
            ?.filter(rule => rule.enabled === false)
            .map(rule => rule.id) ?? []
        const storyId = context?.id ?? page.url()
        const effectiveDisabledRuleIds = storyId.includes('codeblock')
            ? [...new Set([...disabledRuleIds, 'color-contrast'])]
            : disabledRuleIds
        const disabledRules = Object.fromEntries(
            effectiveDisabledRuleIds.map(ruleId => [ruleId, { enabled: false }])
        )

        isAxeRunning = true
        try {
            await checkA11y(
                page,
                '#storybook-root',
                {
                    axeOptions: effectiveDisabledRuleIds.length > 0
                        ? { rules: disabledRules }
                        : undefined,
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
