const sanitizeTrackType = (type) => {
    if (typeof type !== 'string') return '';
    // Remove quotes, lowercase, and trim spaces
    return type.replace(/^"|"$/g, '').toUpperCase().trim();
};

module.exports = sanitizeTrackType;
