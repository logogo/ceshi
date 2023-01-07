#!/usr/bin/env node
const semver = require('semver');
const program = require('commander');
const logs = require('../ci.script-remote/utils/logs');

const {
    engines: { node: requiredNodeVersion },
    name: pkgName,
    version: pkgVersion
} = require('../package.json');

// 1. 检测 node 版本
checkNodeVersion(requiredNodeVersion, pkgName);

// CI初始化
program
    .command('init')
    .description('CI初始化')
    .action((name, cmd) => {
        require('../ci.script-local/index');
    });

program.version(pkgVersion, '-v --version', '查看版本信息');
program.parse(process.argv);

function checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
        logs.error(`你正在使用的node版本是${process.version},但是${id}要求版本是${wanted}, 请升级你的node版本`);
        process.exit(1);
    }
}

