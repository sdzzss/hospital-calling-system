const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  //配置反向代理
  devServer:{
    host: '0.0.0.0',
    port: 8081,
    proxy:{
      "/adminApi":{
        target:"http://127.0.0.1:3001",
        changeOrigin:true
      }
    }
  }
})
