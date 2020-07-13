/*
Copyright 2020 Hitachi Ltd.

Licensed under the Apache License, Version 2.0 (the 'License');
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an 'AS IS' BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/*
MIT License

Copyright (c) 2019 Tomasz O.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const GeneratePackageJsonPlugin = require('generate-package-json-webpack-plugin');

const config = require('./../config');

const BASE_PATH = process.env.BASE_PATH || '/';

module.exports = {
  mode: 'development',
  entry: {
    server: path.join(config.srcServerDir, 'index.js')
  },
  output: {
    // IBM CLoud Functions requires the file name should be the module name defined in package.json.
    filename: '[name].bundle.js',
    publicPath: BASE_PATH,
    path: config.servDir,
    library: 'main',
    libraryTarget: 'this',
  },
  resolve: {
    modules: [
      'node_modules',
      config.srcDir,
    ]
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          keep_fnames: false,
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.js$/,
        loader: 'string-replace-loader',
        options: {
          multiple: [
            { search: 'process.env.TENANT_ID', replace: `'${process.env.TENANT_ID}'` },
            { search: 'process.env.CLIENT_ID', replace: `'${process.env.CLIENT_ID}'` },
            { search: 'process.env.SECRET', replace: `'${process.env.SECRET}'` },
            { search: 'process.env.OAUTH_SERVER_URL', replace: `'${process.env.OAUTH_SERVER_URL}'` },
            { search: 'process.env.REDIRECT_URI', replace: `'${process.env.REDIRECT_URI}'` },
            { search: 'process.env.BASE_PATH', replace: `'${process.env.BASE_PATH}'` },
          ]
        }
      }
    ]
  },
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  plugins: [new GeneratePackageJsonPlugin({
    name: config.siteTitle,
    version: config.siteVersion,
    main: 'serv/server.bundle.js',
  }, path.join(config.servDir, 'package.json'), {
    extraSourcePackageFilenames: [
      path.join(__dirname, '../', 'package.json'),
    ],
  })],
};
