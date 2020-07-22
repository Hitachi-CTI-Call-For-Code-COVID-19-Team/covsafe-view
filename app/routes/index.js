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
import {
    Route,
    Switch,
    Redirect
} from 'react-router';

// ----------- Pages Imports ---------------
import { Dashboard } from './Dashboard';
import Signage from './Signage';
import { AreaAnlytics, IndividualAnlytics } from './Analytics';
import { AdvertisementForm } from './Form';

import Error404 from './Error404';

// ----------- Layout Imports ---------------
import { DashboardNavbar } from './../layout/components/DashboardNavbar';
import { SignageNavbar } from './../layout/components/SignageNavbar';
import { DashboardSidebar } from './../layout/components/DashboardSidebar';

//------ Route Definitions --------
export const RoutedContent = () => {
  return (
    <Switch>
      <Redirect from='/' to='/dashboard' exact />
      
      <Route path='/dashboard' exact component={Dashboard} />

      <Route path='/analytics/areas' exact component={AreaAnlytics} />
      <Route path='/analytics/individuals' exact component={IndividualAnlytics} />

      <Route path='/uploader' exact component={AdvertisementForm} />
      <Route path='/signage-mode' exact component={Signage} />

      <Route component={Error404} path='/error-404' />

      { /* default page: 404 */ }
      <Redirect to='/error-404' />
    </Switch>
  );
};

export const RoutedNavbars  = () => (
  <Switch>
    { /* Other Navbars: */}
    <Route component={ SignageNavbar } path='/signage-mode' />
    { /* Default Navbar: */}
    <Route component={ DashboardNavbar } />
  </Switch>  
);

export const RoutedSidebars = () => (
  <Switch>
    { /* Other Sidebars: */}
    { /* Default Sidebar: */}
    <Route component={ DashboardSidebar } />
  </Switch>
);
