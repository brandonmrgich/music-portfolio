const sanitizeTrackType = (type) => {
    if (typeof type !== 'string') return '';
    // Remove quotes, lowercase, and trim spaces
    return type.replace(/^"|"$/g, '').toUpperCase().trim();
};

const sanitizeQuotes = (someString) => {
    if (typeof someString !== 'string') return '';
    // Remove quotes

    return someString ? someString.trim().replace(/^"(.*)"$/, '$1') : someString;
};

module.exports = { sanitizeTrackType, sanitizeQuotes };
