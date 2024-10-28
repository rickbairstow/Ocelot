const generateUuid = (prefix = '', postfix = '') => {
    return `${prefix}_${crypto.randomUUID()}_${postfix}`
}

export { generateUuid }
