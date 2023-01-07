// 输出log颜色控制：http://noyobo.com/2015/11/13/ANSI-escape-code.html

// const exec = require('child_process').execSync;
const shell = require('shelljs');

// 开始执行脚本
// exec('if test -d ci.script-remote; then rm -rf ci.script-remote; fi')
// exec('if test -d erwan-ci; then rm -rf erwan-ci; fi')
// 下载 front-base-ci 工程
// exec('git clone http://zhupenghui:hui11111.hui@git.lanjinrong.com/material-platform/erwan-ci.git');
// exec('cp -r erwan-ci/ci.script-remote ci.script-remote')
// exec('rm -r erwan-ci')
shell.exec('node ci.script-remote/gitDiff/index "NoSend"');
