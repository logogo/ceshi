const exec = require('child_process').exec;

// 发送消息通知
const sendMsg = (option) => {
    const url = 'https://oapi.dingtalk.com/robot/send?access_token=1c2fe4f46bc7aa39a9e13bd5f724064d1f9c23aeb5af0da5116dbfae004836fe';

    const title = `CI 通知：${option.project_name} ${option.title}`;
    const text = `### ${title}  \n> • 提交者：${option.user || ''}  \n> • 提交描述：${option.change_desc || ''}  \n> • 构建分支：${option.branch || ''}  \n> • 构建信息：${option.message}  \n> • [Jenkins 地址](${option.web_url})  \n> • [Git 地址](${option.git_url})`;
    const message = {
        'msgtype': 'markdown',
        'markdown': {
            'title': title,
            'text': text
        }
    };
    const curl = `curl ${url} -H 'Content-Type: application/json' -d '${JSON.stringify(message)}'`;
    exec(curl, (error, stdout) => {
        if (error) {
            console.error(error);
        } else {
            console.log(stdout);
        }
    });
};

module.exports = {
    sendMsg
};
