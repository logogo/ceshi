const { shellExec } = require('./templateShell');

// 获取最近一次提交信息
const getCommitInfo = () => {
    // 最后一次提交ID
    try {
        const ID = shellExec('git rev-parse --short HEAD');
        // 最后一次提交人
        const USER = shellExec(`git log -1 --pretty=format:%an ${ID}`);
        // 最后一次更改日期
        const CHANGE_DATE = shellExec(`git log -1 --date=format:"%Y-%m-%d %H:%M:%S" --pretty=format:%ad ${ID} `);
        // 最后一次描述
        const CHANGE_DESC = shellExec(`git log -1 --pretty=format:%s ${ID}`);
        // CHANGE_DATE, CHANGE_DESC
        // console.log('USER', USER);
        return { USER, CHANGE_DATE, CHANGE_DESC };
    } catch (e) {
        console.log('error: ', e);
        return {};
    }
};

// 获取当前分支信息
const getBranch = () => {
    try {
        const BRANCH = shellExec('git symbolic-ref --short -q HEAD');
        return { BRANCH };
    } catch (e) {
        console.log('error: ', e);
        return {};
    }
};

module.exports = {
    ...getCommitInfo(),
    ...getBranch()
};
