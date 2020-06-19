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
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { 
  Sidebar,
  UncontrolledButtonDropdown,
  Avatar,
  AvatarAddOn,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from './../../../components';

const avatarImg = require('./../../../images/icons/user.png');

const faker = {
  name: {
    firstName() { return 'Hiroshi'; },
    lastName() { return 'Nakagoe'; },
    jobTitle() { return 'Senior Manager' }
  }
};

const SidebarTopA = ({ t, i18n }) => (
  <React.Fragment>
    { /* START: Sidebar Default */ }
    <Sidebar.HideSlim>
      <Sidebar.Section className="pt-0">
        <Link to="/user/profile-details" className="d-block">
          <Sidebar.HideSlim>
            <Avatar.Image
              size="lg"
              src={ avatarImg }
              addOns={[
                <AvatarAddOn.Icon 
                  className="fa fa-circle"
                  color="white"
                  key="avatar-icon-bg"
                />,
                <AvatarAddOn.Icon 
                  className="fa fa-circle"
                  color="success"
                  key="avatar-icon-fg"
                />
              ]}
            />
          </Sidebar.HideSlim>
        </Link>
          
        <UncontrolledButtonDropdown>
          <DropdownToggle tag='a' href="#" color="link" className="pl-0 pb-0 btn-profile sidebar__link">
            { faker.name.firstName() } { faker.name.lastName() }
            <i className="fa fa-angle-down ml-2"></i>
          </DropdownToggle>
          <DropdownMenu persist>
            <DropdownItem header>
              { faker.name.firstName() } { faker.name.lastName() }
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem tag={ Link } to="/user/profile-edit">
              {t('menus:sidebar.menu.user.profile')}
            </DropdownItem>
            <DropdownItem tag={ Link } to="/user/settings-edit">
            {t('menus:sidebar.menu.user.settings')}
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem tag={ 'a' } href="/logout">
              <i className="fa fa-fw fa-sign-out mr-2"></i>
              {t('menus:sidebar.menu.user.logout')}
            </DropdownItem>
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <div className="small sidebar__link--muted">
          { faker.name.jobTitle() }
        </div>
      </Sidebar.Section>
    </Sidebar.HideSlim>
    { /* END: Sidebar Default */ }

    { /* START: Sidebar Slim */ }
    <Sidebar.ShowSlim>
      <Sidebar.Section>
        <Avatar.Image
          size="sm"
          src={ avatarImg }
          addOns={[
            <AvatarAddOn.Icon 
              className="fa fa-circle"
              color="white"
              key="avatar-icon-bg"
            />,
            <AvatarAddOn.Icon 
              className="fa fa-circle"
              color="success"
              key="avatar-icon-fg"
            />
          ]}
        />
      </Sidebar.Section>
    </Sidebar.ShowSlim>
    { /* END: Sidebar Slim */ }
  </React.Fragment>
)

const SidebarTopAWithTranslation = withTranslation()(SidebarTopA);
export { SidebarTopAWithTranslation as SidebarTopA };
