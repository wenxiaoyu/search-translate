/**
 * MyMemory Translation API 封装
 * 支持多 API 降级：MyMemory -> 百度翻译
 */

export interface TranslationResult {
  success: boolean;
  translation?: string;
  error?: string;
  provider?: 'mymemory' | 'baidu';
}

const MYMEMORY_API_URL = 'https://api.mymemory.translated.net/get';
const BAIDU_API_URL = 'https://fanyi.baidu.com/sug';
const TIMEOUT_MS = 5000;

/**
 * 调用 MyMemory API 翻译文本
 */
async function translateWithMyMemory(
  text: string,
  from: string = 'zh',
  to: string = 'en'
): Promise<TranslationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const url = `${MYMEMORY_API_URL}?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
    
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 429) {
        return {
          success: false,
          error: 'rate_limit',
        };
      }
      return {
        success: false,
        error: 'api_error',
      };
    }

    const data = await response.json();
    
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return {
        success: true,
        translation: data.responseData.translatedText,
        provider: 'mymemory',
      };
    }

    return {
      success: false,
      error: 'invalid_response',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'timeout',
      };
    }
    return {
      success: false,
      error: 'network_error',
    };
  }
}

/**
 * 调用百度翻译 API（降级方案）
 */
async function translateWithBaidu(text: string): Promise<TranslationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const url = `${BAIDU_API_URL}?kw=${encodeURIComponent(text)}`;
    
    const response = await fetch(url, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        error: 'api_error',
      };
    }

    const data = await response.json();
    
    // 百度翻译 API 返回格式: { errno: 0, data: [{ k: "原文", v: "译文" }] }
    if (data.errno === 0 && data.data && data.data.length > 0) {
      // 取第一个翻译结果
      const translation = data.data[0].v;
      return {
        success: true,
        translation,
        provider: 'baidu',
      };
    }

    return {
      success: false,
      error: 'invalid_response',
    };
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        success: false,
        error: 'timeout',
      };
    }
    return {
      success: false,
      error: 'network_error',
    };
  }
}

/**
 * 翻译文本（带降级处理）
 * 优先使用 MyMemory，失败时降级到百度翻译
 */
export async function translateText(
  text: string,
  from: string = 'zh',
  to: string = 'en'
): Promise<TranslationResult> {
  // 首先尝试 MyMemory API
  const myMemoryResult = await translateWithMyMemory(text, from, to);
  
  if (myMemoryResult.success) {
    console.log('[Translation] MyMemory API succeeded');
    return myMemoryResult;
  }

  // MyMemory 失败，尝试百度翻译降级
  console.log('[Translation] MyMemory API failed, falling back to Baidu:', myMemoryResult.error);
  const baiduResult = await translateWithBaidu(text);
  
  if (baiduResult.success) {
    console.log('[Translation] Baidu API succeeded (fallback)');
    return baiduResult;
  }

  // 两个 API 都失败，返回最后的错误
  console.log('[Translation] All APIs failed');
  return {
    success: false,
    error: 'all_apis_failed',
  };
}
