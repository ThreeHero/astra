import net from 'net'
/**
 * 检查指定端口是否被占用，如果占用则向后查找可用端口
 * @param {number} port - 起始检查的端口号
 * @param {number} [maxPort=65535] - 最大检查的端口号
 * @returns {Promise<number>} - 返回可用的端口号
 */
export function findAvailablePort(port, maxPort = 65535) {
  return new Promise((resolve, reject) => {
    // 如果超过最大端口，返回错误
    if (port > maxPort) {
      reject(new Error(`没有找到可用端口，已超过最大端口 ${maxPort}`));
      return;
    }

    const server = net.createServer();

    // 尝试监听端口
    server.once("error", (err) => {
      if (err.code === "EADDRINUSE") {
        // 端口被占用，递归检查下一个端口
        server.close();
        resolve(findAvailablePort(port + 1, maxPort));
      } else {
        // 其他错误
        reject(err);
      }
    });

    // 端口可用
    server.once("listening", () => {
      server.close(() => {
        resolve(port);
      });
    });

    // 开始监听
    server.listen(port, "0.0.0.0");
  });
}
