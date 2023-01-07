const shell = require('shelljs');
const execSync = require('child_process').execSync;
const fs = require('fs');

// shell 封装
function shellExec(command) {
    return shell.exec(command, { silent: true }).stdout;
}

// node 原生组件封装
function nodeExecSync(command) {
    return execSync(command, { stdio: 'inherit' });
}

// 命令检测
const shellWhich = (command) => {
    return shell.which(command);
};

module.exports = {
    shellExec,
    nodeExecSync,
    shellWhich,
    existsSync: fs.existsSync
};
