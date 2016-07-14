const path = require('path')
const Config = require('webpack-config').Config
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')

const PATHS = {
  src: path.join(__dirname, 'src'),
  build: path.join(__dirname, 'www'),
}

module.exports = new Config().merge({
  devtool: 'source-map',
  entry: {
    vendor: [
      'axios',
      'classnames',
      'd3',
      'history',
      'lodash',
      'moment',
      'rc-progress',
      'react',
      'react-bootstrap-datetimepicker',
      'react-dom',
      'react-ga',
      'react-helmet',
      'react-redux',
      'react-router',
      'react-side-effect',
      'react-tooltip',
      'redux',
      'redux-logger',
      'redux-simple-router',
    ],
    bundle: [
      'index.js',
    ],
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js', '.jsx'],
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?/,
        loaders: ['babel'],
        include: PATHS.src,
      },
      {
        test: /\.(css|sass|scss)$/,
        loader: ExtractTextPlugin.extract(
          "style",
          "css!postcss!sass")
        // loaders: ['style', 'css', 'postcss', 'sass'],
      },
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&importLoaders=2&localIdentName=[name]__[local]___[hash:base64:5]&sourceMap' +
          '!postcss-loader?sourceMap' +
          '!less-loader?sourceMap'
        ),
      },
    ],
  },
  stats: {
    modules: true,
    progress: true,
  },
  plugins: [

    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

    new webpack.ProvidePlugin({
      React: 'react',
    }),

    // extract all vendor libs to separate file
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.js',
      minChunks: Infinity,
    }),

    // extract inline css into separate file
    new ExtractTextPlugin('assets/css/components.css'),
  ],
  postcss() {
    return [autoprefixer]
  },
})
