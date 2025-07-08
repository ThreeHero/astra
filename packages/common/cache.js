class Cache {
  static STORAGE_TYPES = {
    LOCAL: "localStorage",
    SESSION: "sessionStorage",
  };

  constructor(storageType = Cache.STORAGE_TYPES.LOCAL) {
    if (!Object.values(Cache.STORAGE_TYPES).includes(storageType)) {
      throw new Error(`Invalid storage type: ${storageType}`);
    }

    // 选择存储引擎
    this.storage = globalThis[storageType];
    this.storageType = storageType;

    // 验证存储引擎可用性
    this._checkStorageAvailability();
  }

  /**
   * 验证存储引擎是否可用
   * @private
   */
  _checkStorageAvailability() {
    try {
      const testKey = "__cache_astra__";
      this.storage.setItem(testKey, "th_astra");
      this.storage.removeItem(testKey);
    } catch (error) {
      console.error(`Storage (${this.storageType}) is not available:`, error);
      this.storage = null;
    }
  }

  /**
   * 序列化缓存项
   * @param {any} value - 缓存值
   * @param {number} [expire] - 过期时间（秒）
   * @returns {string} 序列化后的字符串
   * @private
   */
  _serialize(value, expire = null) {
    return JSON.stringify({
      value,
      expire: expire !== null ? Date.now() + expire * 1000 : null,
    });
  }

  /**
   * 反序列化缓存项
   * @param {string} item - 序列化的字符串
   * @returns {Object} 缓存项对象
   * @private
   */
  _deserialize(item) {
    try {
      return JSON.parse(item);
    } catch (error) {
      console.error("Failed to deserialize cache item:", error);
      return null;
    }
  }

  /**
   * 检查缓存项是否过期
   * @param {Object} cacheItem - 缓存项对象
   * @returns {boolean} 是否过期
   * @private
   */
  _isExpired(cacheItem) {
    return cacheItem.expire !== null && Date.now() > cacheItem.expire;
  }

  /**
   * 设置单个或多个缓存项
   * @param {string|Array} key - 键名或键值对数组
   * @param {any} [value] - 键值（当 key 为字符串时有效）
   * @param {number} [expire] - 过期时间（秒）
   * @returns {boolean|Array} 设置结果
   */
  set(key, value, expire = null) {
    // 检查存储引擎是否可用
    if (!this.storage) return false;

    try {
      // 处理数组形式的批量设置
      if (Array.isArray(key)) {
        return key.map((item) => {
          if (typeof item === "object" && item !== null) {
            const itemKey = item.key || Object.keys(item)[0];
            const itemValue =
              item.value !== undefined ? item.value : item[itemKey];
            const itemExpire = item.expire !== undefined ? item.expire : expire;
            return this.set(itemKey, itemValue, itemExpire);
          }
          return false;
        });
      }

      // 处理单个键值对设置
      this.storage.setItem(key, this._serialize(value, expire));
      return true;
    } catch (error) {
      console.error(`Failed to set cache (${this.storageType}):`, error);
      return false;
    }
  }

  /**
   * 获取单个或多个缓存项
   * @param {string|Array} key - 键名或键名数组
   * @param {any} [defaultValue] - 默认值
   * @returns {any|Array} 缓存值或缓存值数组
   */
  get(key, defaultValue = null) {
    // 检查存储引擎是否可用
    if (!this.storage) return defaultValue;

    try {
      // 处理数组形式的批量获取
      if (Array.isArray(key)) {
        return key.map((k) => this.get(k, defaultValue));
      }

      // 处理单个键获取
      const item = this.storage.getItem(key);
      if (item === null) return defaultValue;

      const cacheItem = this._deserialize(item);

      // 检查是否过期
      if (cacheItem && this._isExpired(cacheItem)) {
        this.storage.removeItem(key);
        return defaultValue;
      }

      return cacheItem ? cacheItem.value : defaultValue;
    } catch (error) {
      console.error(`Failed to get cache (${this.storageType}):`, error);
      return defaultValue;
    }
  }

  /**
   * 移除单个或多个缓存项
   * @param {string|Array} key - 键名或键名数组
   * @returns {boolean|Array} 移除结果
   */
  remove(key) {
    // 检查存储引擎是否可用
    if (!this.storage) return false;

    try {
      // 处理数组形式的批量移除
      if (Array.isArray(key)) {
        return key.map((k) => this.remove(k));
      }

      // 处理单个键移除
      this.storage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove cache (${this.storageType}):`, error);
      return false;
    }
  }

  /**
   * 清除所有缓存
   * @returns {boolean} 清除结果
   */
  clear() {
    // 检查存储引擎是否可用
    if (!this.storage) return false;

    try {
      this.storage.clear();
      return true;
    } catch (error) {
      console.error(`Failed to clear cache (${this.storageType}):`, error);
      return false;
    }
  }

  /**
   * 检查缓存项是否存在
   * @param {string} key - 键名
   * @returns {boolean} 是否存在
   */
  has(key) {
    // 检查存储引擎是否可用
    if (!this.storage) return false;

    try {
      const item = this.storage.getItem(key);
      if (item === null) return false;

      const cacheItem = this._deserialize(item);

      // 检查是否过期
      if (cacheItem && this._isExpired(cacheItem)) {
        this.storage.removeItem(key);
        return false;
      }

      return true;
    } catch (error) {
      console.error(`Failed to check cache (${this.storageType}):`, error);
      return false;
    }
  }

  /**
   * 获取所有缓存键
   * @returns {Array} 键名数组
   */
  keys() {
    // 检查存储引擎是否可用
    if (!this.storage) return [];

    try {
      const keys = [];
      for (let i = 0; i < this.storage.length; i++) {
        keys.push(this.storage.key(i));
      }
      return keys;
    } catch (error) {
      console.error(`Failed to get cache keys (${this.storageType}):`, error);
      return [];
    }
  }

  /**
   * 获取缓存项数量
   * @returns {number} 缓存项数量
   */
  size() {
    // 检查存储引擎是否可用
    if (!this.storage) return 0;

    try {
      return this.storage.length;
    } catch (error) {
      console.error(`Failed to get cache size (${this.storageType}):`, error);
      return 0;
    }
  }
}

export default Cache;