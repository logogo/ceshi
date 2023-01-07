const os = require('os');
const platform = os.platform();

/**
 * 如果是window系统则重新解析路径
 * @param {*} url
 * @returns url
 */
const PathParser = (url) => {
    if (platform === 'win32') {
        return url.replace(/\//g, '\\');
    }

    return url;
};

module.exports = PathParser;
