const generateUuid = (prefix = '', postfix = ''): string => {
    return `${prefix}_${crypto.randomUUID()}_${postfix}`
}

export { generateUuid }
