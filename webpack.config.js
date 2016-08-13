const WebpackConfig = require('webpack-config')
const Config = WebpackConfig.Config
const ConfigEnvironment = WebpackConfig.environment

ConfigEnvironment.setAll({
  env: () => process.env.NODE_ENV === "production" ? 'production' : 'development'
})

module.exports = new Config().extend('./webpack.config.[env].js')
