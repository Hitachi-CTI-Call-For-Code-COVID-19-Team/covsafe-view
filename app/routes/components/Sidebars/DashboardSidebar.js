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

import React from 'react';
import { Link } from 'react-router-dom';

import {
  Sidebar,
  SidebarTrigger,
} from './../../../components';

import { SidebarTopA } from './SidebarTopA'
import { SidebarMiddleNav } from './SidebarMiddleNav';
import { SidebarBottomA } from './SidebarBottomA'
import { LogoThemed } from '../LogoThemed/LogoThemed';

export const DashboardSidebar = () => (
  <Sidebar>
    { /* START SIDEBAR-OVERLAY: Close (x) */ }
    <Sidebar.Close>
      <SidebarTrigger tag={ 'a' }>
        <i className="fa fa-times-circle fa-fw"></i>
      </SidebarTrigger>
    </Sidebar.Close>
    { /* START SIDEBAR-OVERLAY: Close (x) */ }
    
    { /* START SIDEBAR: Only for Desktop */ }
    <Sidebar.HideSlim>
      <Sidebar.Section>
        <Link to="/" className="sidebar__brand">
          <LogoThemed checkBackground />
        </Link>
      </Sidebar.Section>
    </Sidebar.HideSlim>
    { /* END SIDEBAR: Only for Desktop */ }

    { /* START SIDEBAR: Only for Mobile */ }
    <Sidebar.MobileFluid>
      <SidebarTopA />
      
      <Sidebar.Section fluid cover>
        { /* SIDEBAR: Menu */ }
        <SidebarMiddleNav />
      </Sidebar.Section>

      <SidebarBottomA />
    </Sidebar.MobileFluid>
    { /* END SIDEBAR: Only for Mobile */ }
  </Sidebar>
);
