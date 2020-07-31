/*
Copyright 2020 Hitachi Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*
MIT License

Copyright (c) 2019 Tomasz O.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CircularDependencyPlugin = require('circular-dependency-plugin');
var ExtractCssChunks = require("extract-css-chunks-webpack-plugin");

var config = require('./../config');

var BASE_PATH = process.env.BASE_PATH || '/';

module.exports = {
  name: 'client',
  devtool: 'cheap-eval-source-map',
  target: 'web',
  mode: 'development',
  entry: {
    app: [path.join(config.srcDir, 'index.js')]
  },
  output: {
    filename: '[name].bundle.js',
    chunkFilename: '[name].chunk.js',
    path: config.distDir,
    publicPath: BASE_PATH
  },
  resolve: {
    modules: [
      'node_modules',
      config.srcDir
    ]
  },
  plugins: [
    new CircularDependencyPlugin({
      exclude: /a\.js|node_modules/,
      failOnError: true,
      allowAsyncCycles: false,
      cwd: process.cwd(),
    }),
    new HtmlWebpackPlugin({
      template: config.srcHtmlLayout,
      inject: false,
      chunksSortMode: 'none',
      option: {
        leaflet: {
          css: {
            url: config.leaflet.css.url,
            integrity: config.leaflet.css.integrity,
            crossorigin: config.leaflet.css.crossorigin
          },
          js: {
            url: config.leaflet.js.url,
            integrity: config.leaflet.js.integrity,
            crossorigin: config.leaflet.js.crossorigin
          }
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.BASE_PATH': JSON.stringify(BASE_PATH),
      'process.env.PUBLIC_API_DOCS': JSON.stringify(process.env.PUBLIC_API_DOCS),
      'process.env.PUBLIC_API_FILES': JSON.stringify(process.env.PUBLIC_API_FILES),
      'process.env.PRIVATE_API_DOCS': JSON.stringify(process.env.PRIVATE_API_DOCS),
      'process.env.PRIVATE_API_FILES': JSON.stringify(process.env.PRIVATE_API_FILES),
      'process.env.PUBLIC_API_KEY': JSON.stringify(process.env.PUBLIC_API_KEY),
      'process.env.PRIVATE_API_KEY': JSON.stringify(process.env.PRIVATE_API_KEY),
      'process.env.VIEW_CONFIG_DB': JSON.stringify(process.env.VIEW_CONFIG_DB),
      'process.env.ASSETS_DB': JSON.stringify(process.env.ASSETS_DB),
      'process.env.RISK_DB': JSON.stringify(process.env.RISK_DB),
      'process.env.NOTICE_DB': JSON.stringify(process.env.NOTICE_DB),
      'process.env.NOTICE_TEMPLATE_DB': JSON.stringify(process.env.NOTICE_TEMPLATE_DB),
      'process.env.ADVERTISEMENT_DB': JSON.stringify(process.env.ADVERTISEMENT_DB),
      'process.env.SHOPS_DB': JSON.stringify(process.env.SHOPS_DB),
      'process.env.STATIC_FILES_BUCKET': JSON.stringify(process.env.STATIC_FILES_BUCKET),
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new ExtractCssChunks(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      // Leaflet requires flow support
      {
        test: /\.js$/,
        include: [path.resolve(config.srcDir, '../', 'node_modules/react-leaflet/src')],
        use: 'babel-loader'
      },
      // React Responsive Carousel requires import their css
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: [path.resolve(config.srcDir, '../', 'node_modules/react-responsive-carousel/lib/styles/')]
      },
      // Modular Styles
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { 
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            }
          },
          { loader: 'postcss-loader' }
        ],
        exclude: [path.resolve(config.srcDir, 'styles')],
        include: [config.srcDir]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true,
              importLoaders: 1,
            }
          },
          { loader: 'postcss-loader' },
          {
            loader: 'sass-loader',
            options: {
              includePaths: config.scssIncludes
            }
          }
        ],
        exclude: [path.resolve(config.srcDir, 'styles')],
        include: [config.srcDir]
      },
      // Global Styles
      {
        test: /\.css$/,
        use: [
          ExtractCssChunks.loader,
          'css-loader',
          'postcss-loader'
        ],
        include: [path.resolve(config.srcDir, 'styles')]
      },
      {
        test: /\.scss$/,
        use: [
          ExtractCssChunks.loader,
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              includePaths: config.scssIncludes
            }
          }
        ],
        include: [path.resolve(config.srcDir, 'styles')]
      },
      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        loader: "file-loader",
        options: {
          name: "fonts/[name].[ext]",
        }
      },
      // Files
      {
        test: /\.(jpg|jpeg|png|gif|svg|ico)$/,
        loader: "file-loader",
        options: {
          name: "static/[name].[ext]",
        }
      }
    ]
  },
  devServer: {
    hot: true,
    contentBase: config.serveDir,
    compress: true,
    historyApiFallback: {
      index: BASE_PATH
    },
    host: '0.0.0.0',
    port: 8080
  }
}