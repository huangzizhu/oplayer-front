const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  devServer: {
    proxy: {
      '/op': {  // 匹配 /api 开头的请求
        target: 'http://47.108.201.216:9031',
        changeOrigin: true,
        pathRewrite: { '^/op': '' }
      },
      '/uapi': {  // 匹配 /uapis 开头的请求
        target: 'https://uapis.cn',
        changeOrigin: true,
        pathRewrite: { '^/uapi': '' },
        // 关键配置：传递真实 IP
        onProxyReq(proxyReq, req) {
          // 添加 X-Forwarded-For 头（客户端 IP）
          proxyReq.setHeader('X-Forwarded-For', req.ip || req.connection.remoteAddress);
          // 可选：添加 X-Real-IP 头
          proxyReq.setHeader('X-Real-IP', req.ip || req.connection.remoteAddress);
        }
      }
    }
  }
});
