/* VUE CONFIG FOR DEVELOPMENT SERVER */
module.exports = {  
  publicPath: process.env.FRONTEND_BASEPATH || '',
  devServer: {
    host: '0.0.0.0',
    port: process.env.FRONTEND_PORT || 8089,
    hot: true,
    https: false,
    allowedHosts: 'all',
    client: {
        webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  },
  configureWebpack: config => {
    config.watchOptions = {
        poll: 3000, // Check for changes every second
        aggregateTimeout: 500,
        ignored: ['files/**/*.js', 'node_modules/**']
    };
  },
  css: {
    loaderOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/custom.scss";`
      },
      sass: {
        additionalData: `@import "@/assets/scss/custom.scss";`
      }
    }
  }
}