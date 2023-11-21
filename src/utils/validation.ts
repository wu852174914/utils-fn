const ValidationUtils = {
  // 验证手机号是否合法
  isValidPhoneNumber(phone: string): boolean {
    if (typeof phone !== 'string') {
      throw new Error('手机号码必须是字符串类型');
    }
    const regex = /^1[3-9]\d{9}$/;
    return regex.test(phone);
  },
  // 验证eamil是否合法
  isValidEmail(email: string): boolean {
    if (typeof email !== 'string') {
      throw new Error('邮箱地址必须是字符串类型');
    }
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  },
  // 验证身份证是否合法
  isValidIDNumber(idNumber: string): boolean {
    if (typeof idNumber !== 'string') {
      throw new Error('身份证号码必须是字符串类型');
    }
    const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/;
    return regex.test(idNumber);
  }
};

type ValidationUtilsType = typeof ValidationUtils;

/**
 * @description 验证工具函数
 * @param key 验证函数名称
 */
export const validationUtilsFn = <T extends keyof ValidationUtilsType>(key: T): ValidationUtilsType[T] => {
  const validationFn = ValidationUtils[key];
  if (!validationFn) {
    throw new Error(`validationUtilsFn: ${key} 此验证函数不存在/未实现`);
  }
  return validationFn;
}