const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-hot-middleware/client',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'www', 'static'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.css']
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'REINDEX_URL': JSON.stringify(process.env.REINDEX_URL),
      },
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader?optional=runtime'],
        include: [path.join(__dirname, 'src')]
      },
      {
        test: /\.(css|scss)$/,
        loaders: ['style', 'css?modules', 'postcss', 'sass']
      }
    ]
  },
  postcss: function () {
    return [autoprefixer];
  }
};
