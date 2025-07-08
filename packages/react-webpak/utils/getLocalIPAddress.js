import os from "os";
/**
 * 获取当前设备的局域网IP地址
 * @returns {string} - 返回局域网IP地址，如果未找到则返回空字符串
 */
export function getLocalIPAddress() {
  const interfaces = os.networkInterfaces();

  // 遍历所有网络接口
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // 跳过IPv6和回环地址
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }

  // 未找到有效IP地址
  return "";
}
