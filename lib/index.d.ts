/**
 * 判断数据类型
 */
export declare const judetType: () => {
    [key: string]: (obj: any) => boolean;
};
/**
 * 四舍五入到最接近的基数
 * @param num
 * @returns {number}
 */
export declare const roundToNearestBase: (num: number) => number;
/**
 * 下载文件
 * @param res 后端返回的response
 * @param name 文件名：可选，不传则获取res.headers['content-disposition']中截取文件名
 */
export declare const downloadFile: (res: any, name: string | undefined) => void;
