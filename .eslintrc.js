module.exports = {
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/typescript'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: './tsconfig.json',
    },
    plugins: [
        '@typescript-eslint'
    ],
    env: {
        browser: false,
        node: true
    },
    settings: {
        'import/extensions': ['.js', '.ts']
    },
    rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',

        'class-methods-use-this': 'warn',
        'consistent-return': 'off',
        'default-case': 'off',
        'guard-for-in': 'off',
        'import/extensions': [
            'error',
            'always',
            {
                js: 'never',
                ts: 'never',
            }
        ],
        'import/prefer-default-export': 'off',
        'indent': ['error', 4, {
            SwitchCase: 1,
        }],
        'lines-between-class-members': 'off',
        'max-len': ['error', 120],
        'no-continue': 'off',
        'no-mixed-operators': 'off',
        'no-plusplus': 'off',
        'no-unused-expressions': 'off',
        'prefer-template': 'off',
        'quote-props': 'off',
        'semi-style': 'off'
    }
}
