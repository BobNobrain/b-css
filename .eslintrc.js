module.exports = {
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        "plugin:@typescript-eslint/recommended-requiring-type-checking"
    ],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint'
    ],
    env: {
        browser: false,
        node: true
    },
    settings: {
        'import/resolver': {
            alias: {
                map: [],
                extensions: ['.ts', '.js']
            }
        },
        'import/extensions': ['.js', '.ts']
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',

        'class-methods-use-this': 'warn',
        'guard-for-in': 'off',
        'import/extensions': [
            'error',
            'always',
            {
                js: 'never',
                ts: 'never',
            }
        ],
        'indent': ['error', 4],
        'lines-between-class-members': 'off',
        'max-len': ['error', 120],
        'no-unused-expressions': 'off',
        'quote-props': 'off'
    }
}
