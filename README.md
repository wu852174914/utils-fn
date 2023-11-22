### 1. 简介

本项目是js常用工具函数 集合，包含了常用的工具函数，如：

- 类型判断函数
- 数值格式化取整函数
- 防抖函数
- 节流函数
- 文件下载函数
- 数组转为树状数据函数
- 查找树状数据中的节点函数
- 树状结构扁平化函数
- 对象合并函数
- 深拷贝函数
- url中获取参数函数
- 正则验证函数
  - 手机号码验证
  - 邮箱验证
  - 身份证验证




### 2. 项目结构

```
├── README.md
├── src
│   ├── types
│   │   ├── type.ts
│   ├── index.ts
│   ├── utils
│   │   ├── about-string.ts
│   │   ├── validation.ts
```

### 3. 安装

```
npm i fan-utils-fn
```

### 4. 使用

```javascript

import { judetType, validationUtilsFn } from 'fan-utils-fn'
const utils = judetType()
utils.isBoolean(123) // false
utils.isObject([]) // false
utils.isArray(123) // false
utils.isBoolean(true) // true
utils.isObject({name: 'utils'}) // true
utils.isArray([]) // true

validationUtilsFn('isValidPhoneNumber')('123') // false
validationUtilsFn('isValidPhoneNumber')('15300000000') // true
```
