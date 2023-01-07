const path = require('path');
const ora = require('ora');
const fs = require('fs');
const { existsSync, shellWhich } = require('../../ci.script-remote/utils/templateShell');
const nodeFile = require('../../ci.script-remote/utils/nodeFile.js');
const { infos } = nodeFile.getDirInfo('.');
const setEslintFile = require('./dealFile/eslintFile');
const setStyleFile = require('./dealFile/styleLintFile');
const dealPackage = require('./dealFile/packageFile/index');

// 设置忽略文件
const setGitignore = async() => {
    // 忽略文件
    if (!existsSync('.gitignore')) {
        nodeFile.copyFileSync(path.join(__dirname, '../../ci.script-remote/lintFile/.gitignore'), process.cwd() + '/.gitignore');
    }
};

// 自定义规则文件生成
const createRuleConfig = (answers) => {
    // 忽略文件
    if (!existsSync('./ci.config.js')) {
        const str = nodeFile.readTextFile(path.join(__dirname, '../../ci.script-remote/lintFile/config/ci.config.js'));
        const config = nodeFile.parserFile(str);
        config.selectList = answers.type;
        fs.writeFileSync('./ci.config.js', `module.exports = ${JSON.stringify(config, null, 2)}`, { encoding: 'utf8', mode: 0o765 });
    } else {
        const str = nodeFile.readTextFile('./ci.config.js');
        const config = nodeFile.parserFile(str);
        config.selectList = answers.type;
        fs.writeFileSync('./ci.config.js', `module.exports = ${JSON.stringify(config, null, 2)}`, { encoding: 'utf8', mode: 0o765 });
    }
};

// 规则文件生成
const createRuleFile = async(answers) => {
    const ORA_INSTANCE = ora('脚本检验中....');
    ORA_INSTANCE.start();

    if (!shellWhich('yarn')) {
        console.log('\x1b[31m', '请先安装yarn命令');
        process.exit(1);
    }

    // 自定义配置
    createRuleConfig(answers);
    // 根据参数修改package
    dealPackage(answers);
    // 根据参数选择不同的lint
    setEslintFile(answers);
    setStyleFile(answers);

    setGitignore();

    if (existsSync('.husky')) {
        nodeFile.rmFile(`${process.cwd()}/.husky`);
    }

    // 本地需要执行的脚本
    if (existsSync('ci.script-remote')) {
        nodeFile.rmFile(process.cwd() + '/ci.script-remote');
    }

    nodeFile.cpFile(path.join(__dirname, '../../ci.script-remote'), process.cwd() + '/ci.script-remote');
    // 执行合规脚本校验
    if (infos.includes('ci.script.js')) {
        nodeFile.rmFile(process.cwd() + '/ci.script.js');
    }

    // 复制规则脚本
    nodeFile.copyFileSync(path.join(__dirname, '../ci.script.js'), process.cwd() + '/ci.script.js');
    ORA_INSTANCE.stop();
};
module.exports = { createRuleFile };
