// const shelljs = require('shelljs');
const exec = require('child_process').exec;
const path = require('path');
const nodeFile = require('../utils/nodeFile.js');
const updatePackage = require('../utils/updatePackageJson');
const { infos } = nodeFile.getDirInfo('.');

// 校验当前的目录工程
if (!infos.includes('.git')) {
    console.log('\x1B[31m', '请在工程根目录执行命令');
} else {
    // 进行 package.json 合并
    if (!infos.includes('package.json')) {
        // shelljs.cp('-rf', path.join(__dirname, '../package.json'), process.cwd());
        const sh = `cp -rf ${path.join(__dirname, '../package.json')} ${process.cwd()}`;
        exec(sh);
    } else {
        updatePackage(path.join(__dirname, '../package.json'), 'CI 校验工具安装成功，请删除 node_modules，重新安装依赖包');
    }
}
