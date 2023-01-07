const inquirer = require('inquirer'); // 命令行交互模块
const shell = require('shelljs');

if (!shell.which('git')) {
    shell.echo('Sorry, this script requires git');
    shell.exit(1);
}

const getVersion = async() => {
    return new Promise((resolve, reject) => {
        inquirer.prompt([
            {
                type: 'list',
                name: 'version',
                choices: ['alpha', 'patch', 'minor', 'major'],
                message: '请选择你要发的参数：[alpha(用于内部交流或者测试人员测试)|patch(补丁版本号)|minor(次版本号)|major(主版本号)]'
            }
        ]).then(answer => {
            resolve(answer.version);
        }).catch(err => {
            reject(err);
        });
    });
};

const main = async() => {
    const version = await getVersion();
    shell.echo(`\nReleasing ${version} ...\n`);

    if (version === 'alpha') {
        await shell.exec(`npm run release -- --prerelease ${version}`);
    } else {
        await shell.exec(`npm run release -- --release-as ${version}`);
        // 发布'patch', 'minor', 'major'的时候打一个tag
        await shell.exec('git push --follow-tags origin master');
    }

    await shell.exec('git add -A');
    await shell.exec('git commit -m "docs(build): changelog"');
    const currentBranch = await shell.exec('git symbolic-ref --short -q HEAD');
    await shell.exec(`git push origin ${currentBranch}`);
};

main();
