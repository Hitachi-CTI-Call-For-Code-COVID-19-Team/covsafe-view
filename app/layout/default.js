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

import React from 'react';
import PropTypes from 'prop-types';

import {
  Layout,
  ThemeProvider,
} from './../components';

import './../styles/bootstrap.scss';
import './../styles/main.scss';
import './../styles/plugins/plugins.scss';
import './../styles/plugins/plugins.css';

import {
  RoutedNavbars,
  RoutedSidebars,
} from './../routes';

const favIcons = [
  { rel: 'icon', type: 'image/x-icon', href: require('./../images/favicons/favicon.ico') },

  { rel: 'apple-touch-icon', sizes: '180x180', href: require('./../images/favicons/apple-touch-icon.png') },

  { rel: 'icon', type: 'image/png', sizes: '32x32', href: require('./../images/favicons/favicon-32x32.png') },
  { rel: 'icon', type: 'image/png', sizes: '16x16', href: require('./../images/favicons/favicon-16x16.png') }
];

class AppLayout extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired
  }

  render() {
    const { children } = this.props;
    
    return (
      <ThemeProvider initialStyle="light" initialColor="primary">
        <Layout sidebarSlim favIcons={ favIcons }>
          { /* --------- Navbar ----------- */ }
          <Layout.Navbar>
            <RoutedNavbars />
          </Layout.Navbar>
          { /* -------- Sidebar ------------*/ }
          <Layout.Sidebar>
            <RoutedSidebars />
          </Layout.Sidebar>

          { /* -------- Content ------------*/ }
          <Layout.Content>
            { children }
          </Layout.Content>
        </Layout>
      </ThemeProvider>
    );
  }
}

export default AppLayout;
