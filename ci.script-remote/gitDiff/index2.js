// 输出log颜色控制：http://noyobo.com/2015/11/13/ANSI-escape-code.html
const exec = require('child_process').exec;
const path = require('path');
const { initInfo, dealESLint, dealStyleLint } = require('./diff');
const { sendMsg } = require('../notice');

// 获取传递过来的工程名字
const GIT_PROJECT_NAME = process.argv[2];

// 变动列表
let changesList = [];
// 变动的文件
const changesFiles = [];

// 生成对应的URL
const ReqUrl = (options) => {
    const { methods, url } = options || {};
    const token = 'Dm6Y55UFHhndpC5wvx7p';
    const apiUrl = 'http://git.lanjinrong.com/api/v4/projects/';
    return `curl --request ${methods || 'GET'} --header "PRIVATE-TOKEN: ${token}" ${apiUrl + (url || '')}`;
};

// 关闭merge
const closeMerge = (stdout) => {
    // 关闭 MR
    const CLOSE_MR = ReqUrl({ methods: 'PUT', url: `${stdout.project_id}/merge_requests/${stdout.iid}?state_event=close` });
    exec(CLOSE_MR);
};

// 发送信息
let sendObj = {};
// 获取当前的合并变动信息
const getMergeChange = (item) => {
    // 获取merge的变化
    const MR_CHANGE = ReqUrl({ url: `${item.project_id}/merge_requests/${item.iid}/changes` });
    exec(
        MR_CHANGE,
        (error, stdout) => {
            if (error) {
                console.error(`exec error: ${error}`);
            }
            // 拿到的数据是 string 类型
            stdout = JSON.parse(stdout);

            sendObj = {
                title: '',
                iid: stdout.iid,
                project_name: GIT_PROJECT_NAME,
                user: stdout.author.name,
                target_branch: stdout.target_branch,
                source_branch: stdout.source_branch,
                web_url: stdout.web_url,
                message: ''
            };

            // 有冲突
            if (stdout.merge_status === 'cannot_be_merged') {
                console.error('\x1b[31m', '代码冲突');
                sendObj.title = '代码冲突';
                sendObj.message = '代码有冲突';
                sendMsg(sendObj);
                process.exit(1);
            }

            // 不被允许合并的分支
            const NO_PERMISSION_BRANCH = ['master', 'test', 'dev', 'develop'];
            if (NO_PERMISSION_BRANCH.indexOf(stdout.source_branch) > -1) {
                sendObj.title = '分支错误';
                sendObj.message = `不允许直接从 ${stdout.source_branch} 合并到 ${stdout.target_branch}`;
                sendMsg(sendObj);
                closeMerge();
                console.error('\x1b[31m', `分支：${stdout.source_branch}，不允许直接合并到其他分支`);
                process.exit(1);
            }

            // 兼容API返回内容有变化的情况
            if (typeof stdout['changes'] !== 'undefined') {
                changesList = stdout['changes'];
            } else {
                changesList = stdout;
            }

            // 将文件拎出来
            changesList.forEach(itemFile => {
                // 手动检测冲突，钉钉通知
                if (itemFile.diff && itemFile.diff.indexOf('<<<<<<< HEAD') !== -1) {
                    console.error('\x1b[31m', `${itemFile.new_path} 文件有代码冲突`);
                    sendObj.title = '代码冲突';
                    sendObj.message = `请先解决${itemFile.new_path}文件内的冲突`;
                    sendMsg(sendObj);
                    process.exit(1);
                }

                // 过滤掉删除的文件
                if (!itemFile.deleted_file && itemFile.new_path) {
                    changesFiles.push(path.resolve(__dirname, '../../' + itemFile.new_path));
                }
            });

            // 对返回结果进行处理，拿到要检查的文件列表
            const diffJSFileArray = changesFiles.filter((diffFile) => (
                /(\.js|\.jsx|\.ts)(\n|$)/gi.test(diffFile)
            ));

            const diffCSSFileArray = changesFiles.filter((diffFile) => (
                /(\.css|\.less|\.scss)(\n|$)/gi.test(diffFile)
            ));

            const diffImageArray = changesFiles.filter((diffFile) => (
                /(\.png|\.jpg|\.jpeg)(\n|$)/gi.test(diffFile)
            ));

            console.log('\n待检查的 js 文件：', diffJSFileArray);
            console.log('待检查的 css 文件：', diffCSSFileArray);
            console.log('待检查的图片：', diffImageArray);
            initInfo({ ...item, project_name: GIT_PROJECT_NAME });
            dealESLint(diffJSFileArray);
            dealStyleLint(diffCSSFileArray, diffImageArray);
        }
    );
};

// 获取当前的merge信息
const getCurrentMergeInfo = (info) => {
    // 拿到对应项目工程下的merge信息
    const CURRENT_MERGE_PROJECT = ReqUrl({ url: `${info.id}/merge_requests?state=opened` });
    exec(
        CURRENT_MERGE_PROJECT,
        (error, stdout) => {
            if (error) {
                console.error(`exec error: ${error}`);
            }
            // 拿到的数据是 string 类型
            stdout = JSON.parse(stdout);

            // 校验有没有待合并信息
            if (!stdout.length) {
                console.log('没有检测到合并信息');
                return;
            }

            // console.log('-----', stdout)

            stdout.forEach(item => {
                getMergeChange(item);
            });
        }
    );
};

// 获取所有的打开merge项目
const ALL_OPEN_MERGE_PROJECT = ReqUrl();
// console.log(ALL_OPEN_MERGE_PROJECT)
exec(
    ALL_OPEN_MERGE_PROJECT,
    (error, stdout) => {
        if (error) {
            console.error(`exec error: ${error}`);
        }
        // 拿到的数据是 string 类型
        stdout = JSON.parse(stdout);

        // console.log('----', stdout)

        // 当前的merge信息
        let CURRENT_MERGE_INFO = null;
        stdout.forEach(item => {
            if (item.name === GIT_PROJECT_NAME && !CURRENT_MERGE_INFO) {
                CURRENT_MERGE_INFO = item;
            }
        });

        if (CURRENT_MERGE_INFO) {
            getCurrentMergeInfo(CURRENT_MERGE_INFO);
        }
    }
);
