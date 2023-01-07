const { ESLint } = require('eslint');
const StyleLint = require('stylelint');
const dealImage = require('../imageDiff/index');
const { sendMsg } = require('../notice');
const cli = new ESLint();

// 发送信息
let sendObj = {};

const initInfo = (stdout) => {
    sendObj = { ...stdout };
};

// 对检查结果进行处理，提取报错数和警告数
const dealOutput = (errorName, lintResults) => {
    let errorCount = 0;
    let warningCount = 0;

    lintResults.forEach((item) => {
        errorCount += item.errorCount;
        warningCount += item.warningCount;

        if (item.messages && item.messages.length) {
            if (item.errorCount) {
                console.log('\x1b[31m', `${errorName} has found problems in file: ${item.filePath}`);
            } else if (item.warningCount) {
                console.log('\x1b[33m', `${errorName} has found problems in file: ${item.filePath}`);
            }

            item.messages.forEach((msg) => {
                if (msg.severity === 2) {
                    console.log('\x1b[31m', `Error : ${msg.message} in Line ${msg.line} Column ${msg.column}`);
                } else {
                    console.log('\x1b[33m', `Warning : ${msg.message} in Line ${msg.line} Column ${msg.column}`);
                }
            });
        }
    });
    // console.log(lintResults[0])
    if (errorCount >= 1) {
        console.log('\x1b[31m', `${errorName} failed`);
        console.log('\x1b[31m', `✖ ${errorCount + warningCount} problems(${errorCount} error, ${warningCount} warning)`);
        sendObj.title = 'Lint校验不通过';
        sendObj.message = `${errorCount + warningCount} problems(${errorCount} error, ${warningCount} warning)`;
        if (sendObj.project_name !== 'NoSend') {
            sendMsg(sendObj);
        }
        process.exit(1);
    } else if (warningCount >= 1) {
        console.log('\x1b[33m', `${errorName} passed, but need to be improved.`);
        sendObj.title = 'Lint校验不通过警告';
        sendObj.message = `${errorCount + warningCount} problems(${errorCount} error, ${warningCount} warning)`;
        if (sendObj.project_name !== 'NoSend') {
            sendMsg(sendObj);
        }
    } else {
        console.log('\x1b[32m', `${errorName} passed`);
    }
};
// 执行 ESLint 代码检查
const dealESLint = (diffJSFileArray) => {
    if (diffJSFileArray.length > 0) {
        console.log('\x1b[32m', '\nESLint 检测...');

        cli.lintFiles(diffJSFileArray).then(results => {
            dealOutput('ESLint', results);
        });
    }
};

// 执行 StyleLint 代码检查
const dealStyleLint = (diffCSSFileArray, diffImageArray) => {
    if (diffCSSFileArray.length > 0) {
        console.log('\nStyleLint 检测...');

        StyleLint.lint({
            files: diffCSSFileArray
        }).then((data) => {
            const StyleLintResults = data.results;
            dealOutput('StyleLint', StyleLintResults);

            // 图片检查
            const result = dealImage(diffImageArray, true, sendObj);
            result && process.exit(1);
        });

        return;
    }

    // 图片检查
    const result = dealImage(diffImageArray, true, sendObj);
    result && process.exit(1);
};

module.exports = {
    initInfo,
    dealESLint,
    dealStyleLint,
    dealOutput
};
