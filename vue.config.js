const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api': {
        target: "http://47.108.201.216:9031",
        changeOrigin: true, // 允许跨域
        ws: true, // 支持 WebSocket
        pathRewrite: {
          '^/api': '' // 如果需要重写路径，可以在这里配置
        }
      }
    }
  }
})