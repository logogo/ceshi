const path = require('path');
const { jsonFile, readTextFile, writeFileSync } = require('../../../ci.script-remote/utils/nodeFile');

// 部分升级styleLint 14
const updateLint = (styleLintObj, answers) => {
    if (answers.type.includes('vue3') || answers.type.includes('vue2')) {
        styleLintObj.extends = ['stylelint-config-standard', 'stylelint-config-recommended-vue'];
        styleLintObj.plugins = ['stylelint-order'];
    }
    if (answers.type.includes('scss')) {
        styleLintObj.extends = [
            'stylelint-config-standard',
            'stylelint-config-html/vue',
            'stylelint-config-standard-scss',
            'stylelint-config-recommended-vue/scss'
        ];
    }
};

// 设置style规则文件
const setStyleFile = (answers) => {
    const stylelintignore = readTextFile(path.join(__dirname, '../../../ci.script-remote/lintFile/.stylelintignore'));
    let fileName = '';
    if (answers.type.includes('scss')) {
        fileName = 'scss';
    } else if (answers.type.includes('less')) {
        fileName = 'less';
    } else if (answers.type.includes('stylus')) {
        fileName = 'stylus';
    } else {
        console.log('\x1b[31m', '请选择预处理器');
        process.exit(1);
    }
    const srcStr = '../../../ci.script-remote/lintFile/css';
    const stylelintrc = jsonFile(path.join(__dirname, `${srcStr}/${fileName}/.stylelintrc`));
    const styleRule = jsonFile(path.join(__dirname, `${srcStr}/rule/rule.json`));

    stylelintrc.rules = { ...stylelintrc.rules, ...styleRule };

    updateLint(stylelintrc, answers);

    writeFileSync(`${process.cwd()}/.stylelintrc`, JSON.stringify(stylelintrc, null, 4));
    writeFileSync(`${process.cwd()}/.stylelintignore`, stylelintignore);
};

module.exports = setStyleFile;
