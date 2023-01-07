module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        "ecmaVersion": 2022,
        sourceType: 'module',
        'requireConfigFile': false,
        "ecmaFeatures": {
            "jsx": true
        },
        "vueFeatures": {
          "filter": true,
          "interpolationAsNonHTML": false,
        }
    },
    env: {
        browser: true,
        node: true,
        es6: true
    },
    plugins: [
        'html',
        'vue',
        'jsx'
    ],
    extends: [
      'plugin:vue/recommended',
      'plugin:vue/strongly-recommended',
      'plugin:vue/essential'
    ],
    rules: {
      'vue/singleline-html-element-content-newline': 0,
      'vue/no-unused-vars': 0,
      'vue/multiline-html-element-content-newline': 0,
      'vue/name-property-casing': [2, 'PascalCase'],
      'vue/no-v-html': 0,
      'vue/no-multi-spaces': 0,
      'vue/no-custom-modifiers-on-v-model': 2,
      'vue/no-multiple-template-root': 2,
      'vue/no-use-v-if-with-v-for': 2,
      'vue/multi-word-component-names': 0, // 组件name可以不填写
      'vue/no-mutating-props': 1,
      'vue/no-template-key': 2,
      'vue/no-useless-template-attributes': 2,
      'vue/no-v-for-template-key-on-child': 2
    }
};
