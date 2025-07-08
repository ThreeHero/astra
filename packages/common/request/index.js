import axios from 'axios';
import { merge } from 'lodash-es'

function createSmartPromise(promise, cancel, requestId) {
  // 让 promise 自身挂上附加属性
  promise.cancel = cancel;
  promise.requestId = requestId;
  promise.promise = promise;

  // 支持数组解构
  promise[Symbol.iterator] = function* () {
    yield this; // promise
    yield this.cancel; // cancel
    yield this.requestId; // id
  };

  return promise;
}

// 合并配置
// 这里可以使用 lodash 的 merge 函数来合并配置
function _merge(obj1, obj2) {
  return merge({}, obj1, obj2);
}

// 请求配置
class HttpClient {
  // 默认配置 配置项
  config = {};

  constructor(config) {
    this.config = config || {};

    // 存储所有请求的控制器 用于取消请求
    this.controllerMap = new Map();

    // 配置项在拦截器中注入
    this.instance = axios.create();

    this._registerInterceptors();
  }

  // 注册拦截器
  _registerInterceptors() {
    this.instance.interceptors.request.use(this.requestInterceptor, Promise.reject);
    this.instance.interceptors.response.use(this.responseInterceptor, this.responseErrorInterceptor);
  }

  // 请求拦截器
  requestInterceptor(config) {
    const { baseUrl, headers, onStartRequest } = this.config;
    if (typeof onStartRequest === "function") {
      onStartRequest(config);
    }
    config.baseURL = typeof baseUrl === "function" ? baseUrl() : baseUrl;
    config.headers = typeof headers === 'function' ? headers() : headers;
    config = _merge(this.config, config);
    const requestId = this._generateRequestId(config);
    // 用于取消请求的控制器
    const controller = new AbortController();
    config.signal = controller.signal;
    this.controllerMap.set(requestId, controller);
    return config;
  }
  // 响应拦截器
  responseInterceptor(response) {
    const { transformResult, onEndRequest } = response.config || {};
    const requestId = this._generateRequestId(response.config);
    this.controllerMap.delete(requestId);
    if (typeof onEndRequest === "function") {
      onEndRequest(response);
    }
    if (typeof transformResult === 'function') {
      return transformResult(response);
    }
    return response;
  }
  // 响应失败拦截器
  responseErrorInterceptor(error) {
    const { onErrorRequest } = error.config || {};
    const requestId = this._generateRequestId(error.config);
    this.controllerMap.delete(requestId);
    
    if (typeof onErrorRequest === "function") {
      onErrorRequest(error);
    }
    // 如果请求被取消，直接返回
    if (axios.isCancel(error)) {
      return Promise.reject({ code: "CANCELLED", message: error.message });
    }
    return Promise.reject(error);
  }

  // 生成请求唯一标识
  _generateRequestId(config) {
    return `
      ${config.method}
      -${config.url}
      -${JSON.stringify(config.params)}
      -${JSON.stringify(config.data)}
    `;
  }
  
  // 取消请求
  cancelRequest(requestId, message = '') {
    const controller = this.controllerMap.get(requestId);
    if (controller) {
      controller.abort(message);
      this.controllerMap.delete(requestId);
      return true;
    }
    return false;
  }
  
  // 发送请求
  request(config) {
    const requestId = this._generateRequestId(config);
    // 先取消可能存在的重复请求
    this.cancelRequest(requestId, "Duplicated request cancelled");
    const promise = this.instance(config);
    const cancel = m => this.cancelRequest(requestId, m);
    
    return createSmartPromise(promise, cancel, requestId);
  }

  get(url, params = {}, config = {}) {
    return this.request({ ...config, method: 'GET', url, params });
  }
  
  post(url, data = {}, config = {}) {
    return this.request({ ...config, method: 'POST', url, data });
  }
  
  put(url, data = {}, config = {}) {
    return this.request({ ...config, method: 'PUT', url, data });
  }
  
  delete(url, params = {}, config = {}) {
    return this.request({ ...config, method: 'DELETE', url, params });
  }
  
  patch(url, data = {}, config = {}) {
    return this.request({ ...config, method: 'PATCH', url, data });
  }
}

// // 这里只做类型提示
// const ConfigTypes = {
//   // 基本地址
//   baseUrl: ["string", "function"],
//   // 请求头
//   headers: ["object", "function"],
//   // 用于转换请求结果 可以刷新token等
//   transformResult: ["function", "null"],

//   // 请求开始的钩子
//   onStartRequest: ["function", "null"],
//   // 请求结束的钩子
//   onEndRequest: ["function", "null"],
//   // 请求错误的钩子 返回一个错误的 Promise
//   onErrorRequest: ["function", "null"],
  
//   // 是否使用 axios 的参数
//   axiosParams: true
// };

export default HttpClient;