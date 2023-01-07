const path = require('path');
const nodeFile = require('../../../ci.script-remote/utils/nodeFile.js');

// 含有 typeScript 项目
const formatTS = (lintObj) => {
    lintObj.parser = '@typescript-eslint/parser';
    lintObj.extends.push('plugin:@typescript-eslint/recommended');
    lintObj.plugins.push('@typescript-eslint');
    lintObj.rules['@typescript-eslint/consistent-type-assertions'] = 0;
    lintObj.rules['@typescript-eslint/no-unused-expressions'] = 0;
    lintObj.rules['@typescript-eslint/naming-convention'] = [
        1,
        {
            'selector': [
                'classProperty',
                'objectLiteralProperty',
                'typeProperty',
                'classMethod',
                'objectLiteralMethod',
                'typeMethod',
                'accessor',
                'enumMember'
            ],
            'format': null,
            'modifiers': ['requiresQuotes']
        }
    ];
    lintObj.rules['@typescript-eslint/no-use-before-define'] = 1;
    lintObj.rules['@typescript-eslint/indent'] = ['off'];
};

// 含有 .prettierrc.js 规则
const formatPre = (lintObj) => {
    const prettierrc = nodeFile.readTextFile(`${process.cwd()}/.prettierrc.js`);
    let prettierrcObj = nodeFile.parserFile(prettierrc);
    const rules = {
        printWidth: 100, // 超过最大值换行
        semi: true, // 句尾添加分号
        singleQuote: true, // 使用单引号代替双引号
        tabWidth: 4, // 缩进字节数
        useTabs: false, // 缩进不使用tab，使用空格
        proseWrap: 'never', // 因为使用了一些折行敏感型的渲染器（如GitHub comment）而按照markdown文本样式进行折行，never 强制所有散文块在一行上并依赖编辑器/查看器软包装
        arrowParens: 'avoid', // (x) => {} 箭头函数参数只有一个时是否要有小括号。avoid：省略括号
        bracketSpacing: true, // 在对象，数组括号与文字之间加空格 "{ foo: bar }"
        endOfLine: 'auto', // 结尾是 \n \r \n\r auto
        eslintIntegration: false, // 不让prettier使用eslint的代码格式进行校验
        htmlWhitespaceSensitivity: 'ignore', // 指定 HTML、Vue、Angular 和 Handlebars 的全局空格敏感性(<css|strict(重要)|ignore(不重要)>)
        ignorePath: '.prettierignore', // 不使用prettier格式化的文件填写在项目的.prettierignore文件中
        bracketSameLine: false, // 在jsx中把'>' 是否单独放一行
        jsxSingleQuote: false, // 在jsx中使用单引号代替双引号
        requireConfig: false, // Require a 'prettierconfig' to format prettier
        stylelintIntegration: false, // 不让prettier使用stylelint的代码格式进行校验
        trailingComma: 'all', // 在对象或数组最后一个元素后面是否加逗号（在所有代码中加尾逗号）
        tslintIntegration: false // 不让prettier使用tslint的代码格式进行校验
    };

    prettierrcObj = { ...prettierrcObj, ...rules };
    lintObj.extends.push('plugin:prettier/recommended');
    lintObj.rules['prettier/prettier'] = [
        'error',
        rules
    ];
    nodeFile.writeFileSync(`${process.cwd()}/.prettierrc.js`, `module.exports = ${JSON.stringify(prettierrcObj, null, 4)}`);
};

// 设置eslint规则文件
const setEslintFile = (answers) => {
    const eslintGnore = nodeFile.readTextFile(`${path.join(__dirname, '../../../ci.script-remote/lintFile/.eslintignore')}`);
    const ruleJson = nodeFile.readTextFile(`${path.join(__dirname, `../../../ci.script-remote/lintFile/js/rule/index.js`)}`);
    let fileName = '';
    if (answers.type.includes('vue3')) {
        fileName = 'vue3';
    } else if (answers.type.includes('vue2')) {
        fileName = 'vue2';
    } else if (answers.type.includes('react')) {
        fileName = 'react';
    } else {
        console.log('\x1b[31m', '请选择技术栈');
        process.exit(1);
    }

    const lintJson = nodeFile.readTextFile(path.join(__dirname, `../../../ci.script-remote/lintFile/js/${fileName}/.eslintrc.js`));
    const ruleObj = nodeFile.parserFile(ruleJson);
    const lintObj = nodeFile.parserFile(lintJson);
    if (answers.type.includes('ts')) {
        formatTS(lintObj);
    }
    if (nodeFile.existsSync(`${process.cwd()}/.prettierrc.js`)) {
        formatPre(lintObj);
    } else {
        lintObj.rules = { ...lintObj.rules, ...ruleObj };
    }
    nodeFile.writeFileSync(`${process.cwd()}/.eslintrc.js`, `module.exports = ${JSON.stringify(lintObj, null, 4)}`);
    nodeFile.writeFileSync(`${process.cwd()}/.eslintignore`, eslintGnore);
};

module.exports = setEslintFile;
