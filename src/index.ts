import { TreeNode, NodeInfo } from './types'
/**
 * @description 判断数据类型
 */
// type JudetType = 'Boolean'|'Number'|'String'|'Function'|'Array'|'Date'|'RegExp'|'Object'|'Error'| ''
export const judetType = () => {
  const utils: { [key: string]: (obj: any) => boolean } = {};
  const TYPES = 'Boolean|Number|String|Function|Array|Date|RegExp|Object|Error';
  TYPES.split('|').forEach(item => {
    utils['is' + item] = function (obj: any): boolean {
      return Object.prototype.toString.call(obj) === `[object ${item}]`;
    };
  });
  return utils;
};
/**
 * @description 四舍五入到最接近的基数
 * @param num
 * @returns {number}
 */
export const roundToNearestBase = (num: number) => {
  // 计算数字的长度
  const length = num.toString().length
  // 根据数字的长度确定基数
  let base
  if (length <= 3) {
    // 小于或等于3位数（百位）
    base = 100
  } else if (length <= 4) {
    // 千位
    base = 1000
  } else if (length <= 5) {
    // 万位
    base = 10000
  } else {
    // 十万位或以上
    base = 100000
  }
  // 四舍五入到最接近的基数
  return Math.round(num / base) * base
}
/**
 * @description 下载文件
 * @param res 后端返回的response
 * @param name 文件名：可选，不传则获取res.headers['content-disposition']中截取文件名
 */
export const downloadFile = (res:any, name: string | undefined) => {
  let blob = new Blob([res.data])
  let link: HTMLAnchorElement | null = document.createElement('a')
  const _w = window as any;
  const filename = name || decodeURI(res.headers['content-disposition'].split('=')[1]).replaceAll('"', '')
  if (_w.navigator?.msSaveOrOpenBlob) {
    // 兼容IE&EDGE
    _w.navigator.msSaveBlob(blob, filename)
  } else {
    // 兼容不同浏览器的URL对象
    const url = window.URL || window.webkitURL || _w.moxURL
    // 创建下载链接
    link.href = url.createObjectURL(blob)
    // 命名下载名称
    link.download = filename
    // 点击触发下载
    link.click()
    // 下载完成进行释放
    url.revokeObjectURL(link.href)
    // 清除对象引用 以便垃圾回收
    link = null
  }
}

/**
 * @description 将数组转为树状结构
 * @param items 一维数组
 * @param parentId 父节点id
 * @returns TreeNode[]
 * @demo const tree = arrayToTree(items);
 */
export const arrayToTree = (items: TreeNode[], parentId: number | null = null): TreeNode[] => {
  const map = new Map<number, TreeNode>();
  const roots: TreeNode[] = [];

  items.forEach(item => {
    map.set(item.id, { ...item, children: [] });
  });

  items.forEach(item => {
    const node = map.get(item.id);
    if (item.parentId === parentId) {
      roots.push(node!);
    } else {
      const parent = map.get(item.parentId!);
      parent?.children?.push(node!);
    }
  });

  return roots;
}

/**
 * @description 将树状结构数据结构为一维数组
 * @param tree 树状结构数组
 * @returns TreeNode[]
 * @demo const flatArray = treeToArray(tree);
 */
export const treeToArray = (tree: TreeNode[]): TreeNode[] => {
  const stack = [...tree];
  const result: TreeNode[] = [];
  while (stack.length) {
    const node = stack.pop()!;
    result.push(node);
    if (node.children) {
      stack.push(...node.children);
    }
  }
  return result;
}
/**
 * @description 查找树状结构中的某个节点以及父节点、子节点数据
 * @param tree 树状结构数据
 * @param key 要查找的关键字
 * @param value 要查找的关键字的值
 * @returns NodeInfo
 * @demo const nodeInfo = findNodeInTree(tree, 'id', 2);
 */
export const findNodeInTree = (tree: TreeNode[], key: keyof TreeNode, value: any): NodeInfo | null => {
  const stack: { node: TreeNode; path: TreeNode[] }[] = tree.map(node => ({ node, path: [] }));
  while (stack.length) {
    const { node, path } = stack.pop()!;
    if (node[key] === value) {
      // 找到节点后，提取其所有子节点
      const children = treeToArray(node.children || []);
      return { node, parents: path, children };
    }
    node.children?.forEach(child => {
      stack.push({ node: child, path: path.concat(node) });
    });
  }
  return null;
}
/**
 * @description 防抖函数
 * @param func 
 * @param waitFor 
 * @demo const debouncedFunction = debounce(() => console.log('Debounced!'), 500);
 * window.addEventListener('resize', debouncedFunction); 
 */
export const debounce = <F extends (...args: any[]) => any>(func: F, waitFor: number): (...args: Parameters<F>) => void => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return function(...args: Parameters<F>) {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
}
/**
 * @description 节流函数
 * @param func 
 * @param limit 
 * @returns 
 * @demo const throttledFunction = throttle(() => console.log('Throttled!'), 500);
 * window.addEventListener('scroll', throttledFunction);
 */
export const throttle = <F extends (...args: any[]) => any>(func: F, limit: number): (...args: Parameters<F>) => void => {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number | null = null;

  return function(...args: Parameters<F>) {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc!);

      lastFunc = setTimeout(() => {
        if (Date.now() - lastRan! >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
  };
}





