const webpack = require('webpack')
const Config = require('webpack-config').Config

module.exports = new Config().extend('./webpack.config.base.js').merge({
  devtool: false,
  stats: {
    modules: false,
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
    }),
  ],
})

