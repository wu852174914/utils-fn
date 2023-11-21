/**
 * @description 从 URL 中提取指定键的值。
 * @param url - 完整的 URL 字符串。
 * @param key - 要查找的键。
 * @returns 对应的值，如果找不到则返回 null。
 */
export const getValueFromURL = <T extends string>(url: string, key: T): string | null => {
  // 提取 URL 的查询字符串部分
  const queryString = url.includes('?') ? url.split('?')[1] : '';
  if (!queryString) return null;
  // 解析查询字符串
  const params = new URLSearchParams(queryString);
  const value = params.get(key);
  return value ? decodeURIComponent(value) : null;
}