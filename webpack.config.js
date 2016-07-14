const WebpackConfig = require('webpack-config')
const Config = WebpackConfig.Config
const ConfigEnvironment = WebpackConfig.ConfigEnvironment

ConfigEnvironment.INSTANCE.setAll({
  env() {
    return process.env.NODE_ENV === 'production' ? 'prod' : 'dev'
  },
})

module.exports = new Config().extend('./webpack.config.[env].js')
