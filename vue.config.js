const path = require('path')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  lintOnSave: false,
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    allowedHosts: 'all',
    historyApiFallback: true,
    headers: {
      'Content-Security-Policy': "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; connect-src 'self' ws://*:* http://*:* https://*:*;"
    }
  },
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        vue$: 'vue/dist/vue.esm-bundler.js' // ✅ use build with template compiler
      }
    }
  }
}