const webpack = require('webpack')
const Config = require('webpack-config').Config


module.exports = new Config().extend('./webpack.config.base.js').merge({
  devtool: 'cheap-module-source-map',
  entry: {
    vendor: [
      'webpack-hot-middleware/client?reload=true&overlay=false',
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
})
