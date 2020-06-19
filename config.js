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

var root = path.join(__dirname);
var leafletVersion = '1.6.0';

var config = {
  rootDir: root,
  // Targets ========================================================
  serveDir: path.join(root, '.serve'),
  distDir: path.join(root, 'dist'),
  clientManifestFile: 'manifest.webpack.json',
  clientStatsFile: 'stats.webpack.json',

  // Source Directory ===============================================
  srcDir: path.join(root, 'app'),
  srcServerDir: path.join(root, 'server'),

  // HTML Layout ====================================================
  srcHtmlLayout: path.join(root, 'app', 'index.html'),

  // Site Config ====================================================
  siteTitle: 'Work Safe Everyday Management Console',
  siteDescription: 'management console to see the risks of COVID-19 infection',
  siteCannonicalUrl: 'http://localhost:8080',
  siteKeywords: 'COVID-19 CallForCode',
  scssIncludes: [],

  // Leaflet Config =================================================
  leaflet: {
    css: {
      url: `https://unpkg.com/leaflet@${leafletVersion}/dist/leaflet.css`,
      integrity: 'sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==',
      crossorigin: ''
    },
    js: {
      url: `https://unpkg.com/leaflet@${leafletVersion}/dist/leaflet.js`,
      integrity: 'sha512-gZwIG9x3wUXg2hdXF6+rVkLF/0Vi9U8D2Ntg4Ga5I5BZpVkVxlJWbSQtXPSiUTtC0TjtGOmxa1AJPuV0CPthew==',
      crossorigin: ''
    }
  }
}

module.exports = config;