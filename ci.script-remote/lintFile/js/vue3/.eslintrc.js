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
      'plugin:vue/vue3-recommended',
      'plugin:vue/vue3-strongly-recommended',
      'plugin:vue/vue3-essential',
      'eslint:recommended'
    ],
    rules: {
      "vue/comment-directive": [2, { // 支持评论指令
        "reportUnusedDisableDirectives": false
      }],
      'vue/max-attributes-per-line': [ // 强制每行的最大属性数
        2,
        {
          singleline: 10,
          multiline: 1
        }
      ],
      'vue/multi-word-component-names': 0, // 组件name可以不填写
      'vue/require-explicit-emits': 1, // 要求emits名称触发的选项$emit()
      'vue/no-use-v-if-with-v-for': 2, // 禁止在同一个模块上使用v-if和v-for
      'vue/no-lone-template': 2,
      'vue/this-in-template': 2,
      'vue/no-useless-template-attributes': 2,
      'vue/no-v-for-template-key-on-child': 2
    }
};
