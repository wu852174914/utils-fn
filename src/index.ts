import  { TreeNode, NodeInfo, Utils} from './types/type'
export * from './utils/validation'
export * from './utils/about-string'

/**
 * @description 类型判断函数
 * @returns 
 */
export const judetType = (): Utils => {
  const utils: Partial<Utils> = {};
  const TYPES = ['Boolean' , 'Number', 'String', 'Function', 'Array', 'Date', 'RegExp', 'Object', 'Error']
  TYPES.forEach(item => {
    utils[('is' + item) as 'isBoolean'] = function (obj: any): boolean {
      return Object.prototype.toString.call(obj) === `[object ${item}]`;
    };
  });
  return utils as Utils;
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

/**
 * @description 深度合并两个对象。如果两个对象中的属性都是对象或数组，则分别进行深度合并或连接。
 * 否则，第二个对象中的属性将覆盖第一个对象中的属性。
 * 
 * @param obj1 - 第一个要合并的对象。
 * @param obj2 - 第二个对象，其属性将被合并到第一个对象中。
 * @returns 返回合并后的对象。
 */
export const deepMerge = <T extends Record<string, any>, U extends Record<string, any>>(obj1: T, obj2: U): T & U => {
  const result: Record<string, any> = { ...obj1 };
  for (const key in obj2) {
    if (obj2.hasOwnProperty(key)) {
      if (typeof obj2[key] === 'object' && obj2[key] !== null && !Array.isArray(obj2[key])) {
        result[key] = deepMerge(result[key] || {}, obj2[key]);
      } else if (Array.isArray(obj2[key])) {
        result[key] = Array.isArray(result[key]) ? result[key] : [result[key]].filter(val => val !== undefined);
        const maxLength = Math.max(result[key].length, obj2[key].length);
        for (let i = 0; i < maxLength; i++) {
          if (typeof obj2[key][i] === 'object' && obj2[key][i] !== null) {
            result[key][i] = deepMerge(result[key][i] || {}, obj2[key][i]);
          } else {
            result[key][i] = obj2[key][i] !== undefined ? obj2[key][i] : result[key][i];
          }
        }
      } else {
        result[key] = obj2[key];
      }
    }
  }
  return result as T & U;
};

/**
 * @description 深拷贝一个对象，包括其内部嵌套的对象、数组、Map、Set、Date、RegExp 等。
 * @param obj - 要深拷贝的对象。
 * @returns 返回深拷贝后的对象。
 */
export const deepCopy = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepCopy(item)) as unknown as T;
  }

  // 处理日期
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  // 处理正则表达式
  if (obj instanceof RegExp) {
    return new RegExp(obj) as unknown as T;
  }

  // 处理Map
  if (obj instanceof Map) {
    const map = new Map();
    obj.forEach((value, key) => {
      map.set(key, deepCopy(value));
    });
    return map as unknown as T;
  }

  // 处理Set
  if (obj instanceof Set) {
    const set = new Set();
    obj.forEach(value => {
      set.add(deepCopy(value));
    });
    return set as unknown as T;
  }

  // 处理普通对象
  const copiedObj = {} as Record<string, any>;
  Object.keys(obj).forEach(key => {
    copiedObj[key] = deepCopy((obj as Record<string, any>)[key]);
  });
  return copiedObj as T;
}






