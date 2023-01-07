const fs = require('fs');
const sizeOf = require('image-size');
const { sendMsg } = require('../notice');

// 发送信息
let sendObj = {};
// 执行 Image 检查
const dealImage = (diffImageArray, ifRemote = false, stdout) => {
    sendObj = { ...stdout };
    if (diffImageArray.length > 0) {
        let ImageSizeErrorCount = 0;
        let ImageSizeWarningCount = 0;
        // let ImageWidthErrorCount = 0;

        const ImageSizeErrorImage = [];
        const ImageSizeWarningImage = [];
        const ImageWidthErrorImage = [];

        console.log('\nImage 检测...\n');

        diffImageArray.forEach(item => {
            const stats = fs.statSync(item);
            const size = parseInt(stats.size / 1024);
            const dimensions = sizeOf(item);

            // 超过300kb
            if (size > 300 && size <= 500) {
                ImageSizeWarningCount++;
                ImageSizeWarningImage.push(item);
            } else if (size > 500) {
                ImageSizeErrorCount++;
                ImageSizeErrorImage.push(item);
            }

            // 宽度大于750px
            if (dimensions.width > 750) {
                // ImageWidthErrorCount++;
                ImageWidthErrorImage.push(item);
            }
        });

        // 超过300kb，小于500kb
        if (ImageSizeWarningCount > 0) {
            console.log('\x1b[33m', '图片大小超过300KB，小于500KB的有：');
            let imgStr = '';
            ImageSizeWarningImage.forEach(item => {
                console.log(`${item}`);
                imgStr += '  \n>  • ' + item;
            });

            console.log(`\n`);
            sendObj.title = '图片大小超过300kb';
            sendObj.message = imgStr;
            if (sendObj.project_name !== 'NoSend') {
                ifRemote && sendMsg(sendObj);
            }
        }

        // 超过500kb
        if (ImageSizeErrorCount > 0) {
            console.log('\x1b[31m', '图片大小超过500KB的有：');
            let imgStr = '';
            ImageSizeErrorImage.forEach(item => {
                console.log(`${item}`);
                imgStr += '  \n>  • ' + item;
            });
            console.log(`\n`);
            sendObj.title = '图片大小超过500kb';
            sendObj.message = imgStr;
            if (sendObj.project_name !== 'NoSend') {
                ifRemote && sendMsg(sendObj);
            }
            // return true;
        }

        // 宽度大于750px
        // if (ImageWidthErrorCount > 0) {
        //     console.log('\x1b[31m', '图片宽度大于750px的有：');

        //     ImageWidthErrorImage.forEach(item => {
        //         console.log(`${item}`);
        //     });

        //     console.log(`\n`);

        //     // ifRemote && exec(NOTICE_IMAGE_WIDTH_ERROR);
        //     return true;
        // }

        console.log('\x1b[32m', `Image 检测 passed`);
    }
};

module.exports = dealImage;
