module.exports = {
    extends: ['@passportship/eslint-config-passport-rules'],
    settings: {
        'import/ignore': ['utils/db.ts$'] // to support the wildcard export
    }
};
