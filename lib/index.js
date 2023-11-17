"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.roundToNearestBase = exports.judetType = void 0;
/**
 * 判断数据类型
 */
// type JudetType = 'Boolean'|'Number'|'String'|'Function'|'Array'|'Date'|'RegExp'|'Object'|'Error'| ''
const judetType = () => {
    const utils = {};
    const TYPES = 'Boolean|Number|String|Function|Array|Date|RegExp|Object|Error';
    TYPES.split('|').forEach(item => {
        utils['is' + item] = function (obj) {
            return Object.prototype.toString.call(obj) === `[object ${item}]`;
        };
    });
    return utils;
};
exports.judetType = judetType;
/**
 * 四舍五入到最接近的基数
 * @param num
 * @returns {number}
 */
const roundToNearestBase = (num) => {
    // 计算数字的长度
    const length = num.toString().length;
    // 根据数字的长度确定基数
    let base;
    if (length <= 3) {
        // 小于或等于3位数（百位）
        base = 100;
    }
    else if (length <= 4) {
        // 千位
        base = 1000;
    }
    else if (length <= 5) {
        // 万位
        base = 10000;
    }
    else {
        // 十万位或以上
        base = 100000;
    }
    // 四舍五入到最接近的基数
    return Math.round(num / base) * base;
};
exports.roundToNearestBase = roundToNearestBase;
/**
 * 下载文件
 * @param res 后端返回的response
 * @param name 文件名：可选，不传则获取res.headers['content-disposition']中截取文件名
 */
const downloadFile = (res, name) => {
    let blob = new Blob([res.data]);
    let link = document.createElement('a');
    const _w = window;
    const filename = name || decodeURI(res.headers['content-disposition'].split('=')[1]).replaceAll('"', '');
    if (_w.navigator?.msSaveOrOpenBlob) {
        // 兼容IE&EDGE
        _w.navigator.msSaveBlob(blob, filename);
    }
    else {
        // 兼容不同浏览器的URL对象
        const url = window.URL || window.webkitURL || _w.moxURL;
        // 创建下载链接
        link.href = url.createObjectURL(blob);
        // 命名下载名称
        link.download = filename;
        // 点击触发下载
        link.click();
        // 下载完成进行释放
        url.revokeObjectURL(link.href);
        // 清除对象引用 以便垃圾回收
        link = null;
    }
};
exports.downloadFile = downloadFile;
