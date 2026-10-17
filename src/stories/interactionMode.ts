/** Mutating interaction tests run in Vitest, not while consumers browse the documentation. */
export const runInteractionTests = import.meta.env.MODE === 'test'
