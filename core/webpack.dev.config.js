const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base.config')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const {styleLoaders, htmlPage} = require('./tools')

module.exports = merge(baseWebpack, {
  watch: true,
  module: {
    rules: styleLoaders({ sourceMap: false })
  },
  devtool: 'source-map',
  plugins: [
    htmlPage('home', 'app', ['tab']),
    htmlPage('-', 'popup', ['popup']),
    htmlPage('BidPrompt', 'prompt', ['prompt']),
    // htmlPage('background', 'background', ['background']),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"development"'
    }),
    new FriendlyErrorsPlugin()
  ]

})
