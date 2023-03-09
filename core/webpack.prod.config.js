const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpack = require('./webpack.base.config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const {styleLoaders, htmlPage} = require('./tools')
const ZipPlugin = require('zip-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const manifest = require('../src/manifest')

module.exports = merge(baseWebpack, {
  devtool: '#source-map',
  module: {
    rules: styleLoaders({extract: true, sourceMap: true})
  },
  plugins: [
    new GenerateJsonPlugin('manifest.json', manifest, null, 2),
    htmlPage('home', 'app', ['manifest', 'vendor', 'tab']),
    htmlPage('popup', 'popup', ['manifest', 'vendor', 'popup']),
    htmlPage('bid-wallet', 'prompt', ['manifest', 'vendor', 'prompt']),
    htmlPage('inject', 'inject', ['manifest', 'vendor', 'inject']),
    htmlPage('content', 'content', ['manifest', 'vendor', 'content']),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    }),
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash].css'
    }),
    new webpack.HashedModuleIdsPlugin(),
    new ZipPlugin({
      path: '../release',
      filename: 'bid-wallet_' + manifest.version
    })
  ]
})
