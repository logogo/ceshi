const path = require('path');
const packageConfig = require('./packConfig');
const nodeFile = require('../../../../ci.script-remote/utils/nodeFile.js');

// package修改
const changePackage = (packageObj, type) => {
    const _obj = packageConfig[type];
    const cycle = (parentKey) => {
        if (typeof _obj[parentKey] === 'object') {
            Object.keys(_obj[parentKey]).forEach(key => {
                if (!packageObj[parentKey]) {
                    packageObj[parentKey] = {};
                }
                packageObj[parentKey][key] = _obj[parentKey][key];
            });
        } else {
            packageObj[parentKey] = _obj[parentKey];
        }
    };
    Object.keys(_obj).forEach(key => {
        cycle(key);
    });
};

// lint 命令重写
const writeLint = (packageObj, type) => {
    // prettierrc 文件的路径解析不同，做个兼容处理
    if (nodeFile.existsSync(`${process.cwd()}/.prettierrc.js`)) {
        let fileType = '';
        if (type.includes('react')) {
            fileType = '.js,.jsx';
        } else if (type.includes('vue2') || type.includes('vue3')) {
            fileType = '.js,.vue';
        }
        if (type.includes('ts')) {
            fileType += ',.ts,.tsx';
        }
        packageObj.scripts.lint = `eslint --fix --ext ${fileType} src`;
    }
};

// 根据不同的参数对package做相应的修改
const dealPackage = (answers) => {
    const packageObj = nodeFile.jsonFile(path.resolve(__dirname, '../../../package.json'));
    if (answers.type.includes('vue2') || answers.type.includes('vue3')) {
        changePackage(packageObj, 'vue');
    }
    if (answers.type.includes('react')) {
        changePackage(packageObj, 'react');
    }
    if (answers.type.includes('ts')) {
        changePackage(packageObj, 'ts');
    }
    if (answers.type.includes('scss')) {
        changePackage(packageObj, 'scss');
    }
    if (answers.type.includes('less')) {
        changePackage(packageObj, 'less');
    }
    if (answers.type.includes('stylus')) {
        changePackage(packageObj, 'stylus');
    }

    writeLint(packageObj, answers.type);

    nodeFile.writeFileSync(path.resolve(__dirname, '../../../packageMr.json'), JSON.stringify(packageObj, null, 2));
};

module.exports = dealPackage;
