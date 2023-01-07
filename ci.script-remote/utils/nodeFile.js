const fs = require('fs');
const path = require('path');
const { filterNames } = require('./filterFile');
const pathParser = require('./pathParser');

// 需要默认过滤的文件
const filterFile = (file) => {
    const files = filterNames.filter(item => file.indexOf(item) > -1);
    return !files.length;
};

// 只读取当前目录，不递归更深层级的目录
const getDirInfo = (url, filter) => {
    url = pathParser(url);
    const info = fs.readdirSync(url);
    const dirs = [];
    const files = [];
    const infos = [];
    const action = (file) => {
        infos.push(path.join(pathParser(url), file));
        const stats = fs.statSync(path.join(url, file));
        if (stats.isFile()) {
            files.push(path.join(url, file));
        } else if (stats.isDirectory()) {
            dirs.push(path.join(url, file));
        }
    };

    info.forEach(file => {
        if (filter) {
            filterFile(file) && action(file);
        } else {
            action(file);
        }
    });

    return {
        infos,
        dirs,
        files
    };
};

// 递归读取所有信息
const getDirAllInfo = (url, filter) => {
    const opt = {
        info: [],
        dirs: [],
        files: []
    };

    // eslint-disable-next-line no-shadow
    const get = (_url, opt) => {
        const {
            infos,
            dirs,
            files
        } = getDirInfo(_url, filter);
        opt.info = opt.info.concat(infos);
        opt.dirs = opt.dirs.concat(dirs);
        opt.files = opt.files.concat(files);

        dirs.forEach(file => {
            get(file, opt);
        });
    };

    get(pathParser(url), opt);

    return opt;
};

// 递归读取所有CSS信息
const getDirAllCssInfo = (url) => {
    const opt = [];

    // eslint-disable-next-line no-shadow
    const get = (_url, opt) => {
        const {
            dirs,
            files
        } = getDirInfo(_url);

        files.forEach((dirsValue) => {
            if ((dirsValue.indexOf('less') !== -1) || (dirsValue.indexOf('css') !== -1)) {
                opt.push(dirsValue);
            }
        });

        dirs.forEach(file => {
            get(file, opt);
        });
    };

    get(pathParser(url), opt);

    return opt;
};

// 读取json文件
const jsonFile = (url) => {
    const json = fs.readFileSync(pathParser(url), 'utf8');

    return JSON.parse(json);
};

// 读取纯文本文件
const readTextFile = (url) => {
    const json = fs.readFileSync(pathParser(url), 'utf8');
    return json;
};

// 修改文件的权限
const setFilePermission = (url) => {
    fs.chmodSync(pathParser(url), 0o777);
};

// 文件写入
const writeFileSync = (url, data) => {
    fs.writeFileSync(pathParser(url), data, { encoding: 'utf8', mode: 0o765 });
};

// 文件目录复制
const cpFile = (fromUrl, toUrl) => {
    fs.cpSync(pathParser(fromUrl), pathParser(toUrl), { recursive: true, force: true });
    setFilePermission(pathParser(toUrl));
};
// 文件复制
const copyFileSync = (fromUrl, toUrl) => {
    fs.copyFileSync(pathParser(fromUrl), pathParser(toUrl));
};
// 移除文件
const rmFile = (url) => {
    fs.rmSync(pathParser(url), { recursive: true, force: true });
};

// 文件校验
const existsSync = (url) => {
    return fs.existsSync(pathParser(url));
};

// 文件解析
const parserFile = (file) => (new Function(`return ${file.replace('module.exports = ', '')}`))();

module.exports = {
    getDirInfo,
    getDirAllInfo,
    jsonFile,
    readTextFile,
    getDirAllCssInfo,
    cpFile,
    copyFileSync,
    rmFile,
    writeFileSync,
    existsSync,
    parserFile
};
