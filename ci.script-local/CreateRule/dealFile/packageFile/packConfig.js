// 根据不同的技术栈生成不同依赖信息
module.exports = {
    vue: {
        scripts: {
            'lint': 'eslint --fix --ext .js,.vue src'
        },
        'lint-staged': {
            'src/**/*.{js,vue,jsx,tsx}': ['eslint --fix', 'git add']
        },
        devDependencies: {
            '@vue/cli-plugin-eslint': '^3.3.0',
            '@vue/eslint-config-standard': '^4.0.0',
            'eslint': '^8.13.0',
            'eslint-plugin-vue': '^8.6.0',
            'postcss-html': '^1.3.1',
            'stylelint-config-recommended-vue': '^1.4.0'
        }
    },
    react: {
        scripts: {
            'lint': 'eslint --fix --ext .js,.jsx src'
        },
        'lint-staged': {
            'src/**/*.{js,jsx,tsx,ts}': ['eslint --fix', 'git add']
        },
        devDependencies: {
            eslint: '^7.16.0'
        }
    },
    ts: {
        scripts: {
            'lint': 'eslint --fix --ext .js,.ts,.jsx,.tsx,.vue src'
        },
        'lint-staged': {
            'src/**/*.{ts,js,jsx,tsx,vue}': ['eslint --fix', 'git add']
        },
        devDependencies: {
            '@typescript-eslint/eslint-plugin': '5.20.0',
            '@typescript-eslint/parser': '5.20.0'
        }
    },
    scss: {
        scripts: {
            'lint-style': 'stylelint --fix src/**/*.{css,scss}'
        },
        devDependencies: {
            'stylelint-config-recommended-scss': '^5.0.2',
            'stylelint-config-standard-scss': '^3.0.0',
            'postcss': '^8.4.12',
            'postcss-scss': '^4.0.3',
            'stylelint-scss': '4.2.0'
        },
        'lint-staged': {
            'src/**/*.{css,scss}': ['stylelint --fix', 'git add']
        }
    },
    less: {
        scripts: {
            'lint-style': 'stylelint --fix src/**/*.{css,less}'
        },
        'lint-staged': {
            'src/**/,*.{css,less}': ['stylelint --fix', 'git add']
        },
        devDependencies: {
            'postcss': '^8.4.12',
            'postcss-less': '^6.0.0',
            'stylelint-less': '^1.0.5',
            'stylelint-config-recommended-less': '^1.0.4'
        }
    },
    stylus: {
        scripts: {
            'lint-style': 'stylelint --fix src/**/*.css'
        }
    }
};
