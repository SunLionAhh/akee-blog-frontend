const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8090,
    host: 'localhost',
    allowedHosts: 'all',
    client: {
      webSocketURL: 'ws://localhost:8090/ws'
    }
  }
})
