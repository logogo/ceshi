const path = require('path');
const ora = require('ora');
const { shellWhich, nodeExecSync } = require('../../ci.script-remote/utils/templateShell');
const updatePackage = require('../../ci.script-remote/utils/updatePackageJson');
const fileCheckList = require('./fileCheckList');
const {
    getDirInfo,
    jsonFile,
    existsSync,
    writeFileSync,
    rmFile,
    copyFileSync
} = require('../../ci.script-remote/utils/nodeFile.js');
const { infos } = getDirInfo('.');
const pathParser = require('../../ci.script-remote/utils/pathParser');

// 文件合并之前校验处理
const checkPackage = () => {
    const mvInfo = {}; // 需要移动的信息
    const packageObj = jsonFile(`${process.cwd()}/package.json`);
    // console.log(`${process.cwd()}/package.json`);
    // console.log(packageObj);
    const dependencies = { ...packageObj.dependencies };
    Object.entries(dependencies).forEach(([key, item]) => {
        if (fileCheckList.indexOf(key) > -1) {
            mvInfo[key] = item;
            delete packageObj.dependencies[key];
        }
    });

    packageObj.devDependencies = { ...packageObj.devDependencies, ...mvInfo };
    if (packageObj.scripts.prepare) {
        delete packageObj.scripts.prepare;
    }
    if (existsSync(`${process.cwd()}/.prettierrc.js`)) {
        packageObj.devDependencies['prettier'] = '^2.6.2';
    }
    writeFileSync(`${process.cwd()}/package.json`, JSON.stringify(packageObj, null, 2));
};

// package 合并
const mergePackage = () => {
    // 进行 package.json 合并
    const ORA_INSTANCE = ora('安装中....');

    if (!shellWhich('husky')) {
        try {
            console.log('\x1b[32m', 'husky 命令不存在，正在手动安装');
            nodeExecSync('npx husky-init');
            rmFile(`${process.cwd()}/.husky`);
        } catch (e) {
            console.log('\x1b[31m', e);
            process.exit(1);
        }
    }

    checkPackage();

    if (existsSync(`${process.cwd()}/package-lock.json`) && existsSync(`${process.cwd()}/yarn.lock`)) {
        rmFile(`${process.cwd()}/package-lock.json`);
    }

    if (!infos.includes('package.json')) {
        copyFileSync(path.join(__dirname, '../packageMr.json'), process.cwd() + '/package.json');
        rmFile(path.join(__dirname, '../packageMr.json'));
    } else {
        ORA_INSTANCE.start();
        updatePackage(pathParser(path.join(__dirname, '../packageMr.json')), 'CI 校验工具安装成功');

        console.log('\x1b[32m', 'package合并完成，移除node_nodules并重新install');
        if (existsSync(`${process.cwd()}/node_modules`) && existsSync(`${process.cwd()}/yarn.lock`)) {
            rmFile(`${process.cwd()}/node_modules`);
        }
        try {
            nodeExecSync('yarn install');
        } catch (e) {
            console.log('\x1b[31m', e);
            process.exit(1);
        }

        rmFile(path.join(__dirname, '../packageMr.json'));

        console.log('\x1b[32m', 'CI 工具初始化完成，可以运行 yarn run eslint-fix 代码格式化');
        ORA_INSTANCE.stop();
    }
};

module.exports = {
    mergePackage
};
