module.exports = {
    root: true,
    parser: 'babel-eslint',
    env: {
        browser: true,
        node: true,
        es6: true
    },
    extends: ['react-app', 'eslint:recommended', 'plugin:react/recommended'],
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    plugins: ['react'],
    rules: {
        'react/prop-types': 0,
        'react/react-in-jsx-scope': 2,
        'react-hooks/exhaustive-deps': 0
    },
    globals: {
        TcPlayer: 'writable'
    }
};
