/**
 * 语言检测工具
 */

const CHINESE_REGEX = /[\u4e00-\u9fa5]/;
const MIN_LENGTH = 2;

/**
 * 检测文本是否包含中文字符
 */
export function hasChinese(text: string): boolean {
  return CHINESE_REGEX.test(text);
}

/**
 * 检测文本是否满足翻译条件
 * - 至少 2 个字符
 * - 包含中文字符
 */
export function shouldTranslate(text: string): boolean {
  if (!text || text.trim().length < MIN_LENGTH) {
    return false;
  }

  return hasChinese(text);
}
