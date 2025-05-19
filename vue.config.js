  const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    port: 8080, // 设置端口号
    open: false, // 可选：自动打开浏览器
    proxy: {
      '/op': {
        target: 'http://47.108.201.216:9031',
        changeOrigin: true,
        pathRewrite: { '^/op': '' },
        onProxyReq: function (proxyReq, req) {
          console.log('Proxy request:', req.url);
          const clientIP = req.socket.remoteAddress;
          console.log('Client IP:', clientIP);
          const existingXFF = req.headers['x-forwarded-for'] || '';
          const newXFF = existingXFF ? `${existingXFF}, ${clientIP}` : clientIP;
          proxyReq.setHeader('X-Forwarded-For', newXFF);
          proxyReq.setHeader('X-Real-IP', clientIP);
        },
        onProxyRes: function (proxyRes) {
          console.log('Proxy response:', proxyRes.statusCode);
        }
      }
    }
  }
});