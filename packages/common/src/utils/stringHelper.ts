export function convertGPTStringToJson(input: string): any {
  // 使用正则表达式提取 JSON 部分
  const jsonMatch = input.match(/```json\n([\s\S]*?)\n```/);

  try {
    if (jsonMatch && jsonMatch[1]) {
      // 将提取的 JSON 字符串解析为对象
      const jsonObject = JSON.parse(jsonMatch[1]);
      return jsonObject;
    } else {
      return JSON.parse(input);
    }
  } catch (error: any) {
    // throw error;
    return null;
  }
}

export function hasValidWords(text: string, wordCount = 2): boolean {
  // 定义正则表达式匹配有效单词
  const wordRegex = /\b[a-zA-Z]+(?:['-][a-zA-Z]+)*\b/g;

  // 提取所有有效单词
  const words = text.match(wordRegex) || [];

  // 判断有效单词数量是否大于等于 2
  return words.length >= wordCount;
}
