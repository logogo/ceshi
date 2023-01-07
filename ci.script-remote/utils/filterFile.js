const fs = require('fs');
const path = require('path');

// 读取纯文本文件
function readTextFile(url) {
    const json = fs.readFileSync(url, 'utf8');
    return json;
}

// 读取本地的忽略文件配置
// 此方法属于过渡使用
let ruleFile = [];
if (fs.existsSync('.eslintignore')) {
    const fileArr = readTextFile(path.resolve(process.cwd(), './.eslintignore')).replace(/\s/g, ',').split(',').filter(item => item);
    ruleFile = [...fileArr];
}

const filterNames = [
    'node_modules',
    '.git',
    'ci.script',
    'build',
    '.gitignore',
    'dist',
    'README.md',
    '.DS_Store',
    '.npmrc',
    '.env',
    'yarn-error',
    'deploy',
    'public',
    'ci.script-remote',
    'ci.script'
];

ruleFile.forEach(item => {
    if (!filterNames.includes(item)) {
        filterNames.push(item);
    }
});

module.exports = {
    filterNames
};
