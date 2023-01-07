const inquirer = require('inquirer');
const { mergePackage } = require('./MergePackage');
const { createRuleFile } = require('./CreateRule');
const simpleChoice = require('./simple-promptList');

const run = () => {
    inquirer
        .prompt(simpleChoice)
        .then(async(answers) => {
            // 开始进行代码检测
            await createRuleFile(answers);
            // 先进行package合并处理，并重新安装
            await mergePackage();
        })
        .catch(error => {
            console.error('\x1b[31m', error);
            process.exit(1);
        });
};
run();
