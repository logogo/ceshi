// 输出log颜色控制：http://noyobo.com/2015/11/13/ANSI-escape-code.html
const { initInfo, dealESLint, dealStyleLint } = require('./diff');
const { sendMsg } = require('../notice');
const { getDirAllInfo, existsSync, readTextFile, parserFile } = require('../utils/nodeFile');
const {
    USER, CHANGE_DATE, CHANGE_DESC, BRANCH
} = require('../utils/getGitInfo');

// 获取传递过来的工程名字
const GIT_PROJECT_NAME = process.argv[2];
// Jenkins地址
const JENKINS_URL = process.argv[3];
// git分支
const GIT_BRANCH = process.argv[4];
// git地址
const GIT_URL = process.argv[5];
// commit用户
const COMMIT_USER = process.argv[6];
// commit提交时间
const CHANGE_TIME = process.argv[7] + process.argv[8];
// commit提交标题
const CHANGE_TITLE = process.argv[9];

// 发送信息
let sendObj = {};

// 全量数据校验
const getAllFiles = (fileName) => {
    // 获取全量数据
    const { files } = getDirAllInfo(`${process.cwd()}/${fileName}`, true);
    sendObj = {
        title: '',
        project_name: GIT_PROJECT_NAME,
        user: USER || COMMIT_USER || '',
        web_url: JENKINS_URL,
        change_date: CHANGE_DATE || CHANGE_TIME || '',
        change_desc: CHANGE_DESC || CHANGE_TITLE || '',
        branch: BRANCH || GIT_BRANCH || '',
        git_url: GIT_URL || '',
        message: ''
    };

    // 将文件拎出来
    const filesMap = {};
    files.forEach(itemFile => {
        const fileStr = readTextFile(itemFile, 'utf-8');
        // 手动检测冲突，钉钉通知
        if (fileStr.indexOf('<<<<<<< HEAD') !== -1 && itemFile.indexOf('git_diff') === -1) {
            console.error('\x1b[31m', `${itemFile} 文件有代码冲突`);
            sendObj.title = '代码冲突';
            sendObj.message = `请先解决${itemFile}文件内的冲突`;
            if (GIT_PROJECT_NAME !== 'NoSend') {
                sendMsg(sendObj);
            }
            process.exit(1);
        }
        filesMap[itemFile] = fileStr;
    });

    // 对返回结果进行处理，拿到要检查的文件列表
    const diffJSFileArray = files.filter((diffFile) => (
        /(\.js|\.jsx|\.ts|\.tsx|\.vue)(\n|$)/gi.test(diffFile)
    ));

    const diffCSSFileArray = files.filter((diffFile) => (
        /(\.css|\.less|\.scss)(\n|$)/gi.test(diffFile)
    ));

    const diffImageArray = files.filter((diffFile) => (
        /(\.png|\.jpg|\.jpeg)(\n|$)/gi.test(diffFile)
    ));
    if (GIT_PROJECT_NAME !== 'NoSend') {
        console.log('\n待检查的 js 文件：', diffJSFileArray);
        console.log('待检查的 css 文件：', diffCSSFileArray);
        console.log('待检查的图片：', diffImageArray);
    }
    initInfo({ ...sendObj });
    dealESLint(diffJSFileArray);
    dealStyleLint(diffCSSFileArray, diffImageArray);
};

// 读取本地自定义配置
const getConfig = () => {
    let config = {};
    if (existsSync('ci.config.js')) {
        const str = readTextFile('./ci.config.js');
        config = parserFile(str);
    }

    // 优先使用自定文件
    const fileName = config.fileName || 'src';
    if (typeof fileName === 'string') {
        getAllFiles(fileName);
    } else if (Array.isArray(fileName)) {
        fileName.forEach(item => {
            getAllFiles(item);
        });
    }
};

getConfig();
