/**
 * 将对象的键从大驼峰、短横线或下划线格式转换为小驼峰格式
 * @param {Object|Array} obj - 需要转换的对象或数组
 * @returns {Object|Array} - 转换后的新对象或数组
 */
export default function toCamelCase(obj) {
  // 处理非对象类型
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map((item) => toCamelCase(item));
  }

  // 处理普通对象
  const result = {};
  Object.keys(obj).forEach((key) => {
    // 转换键名
    const camelKey = convertToCamelCase(key);
    // 递归处理值
    result[camelKey] = toCamelCase(obj[key]);
  });

  return result;
}

/**
 * 将单个键名转换为小驼峰格式
 * @param {string} key - 需要转换的键名
 * @returns {string} - 转换后的小驼峰格式键名
 */
function convertToCamelCase(key) {
  // 处理大驼峰格式 (PascalCase)
  if (/^[A-Z]/.test(key)) {
    return key.charAt(0).toLowerCase() + key.slice(1);
  }

  // 处理短横线格式 (kebab-case)
  if (key.includes("-")) {
    return key
      .split("-")
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("");
  }

  // 处理下划线格式 (snake_case)
  if (key.includes("_")) {
    return key
      .split("_")
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)
      )
      .join("");
  }

  // 其他情况直接返回原键名
  return key;
}
