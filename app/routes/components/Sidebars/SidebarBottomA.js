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
  Button,
  Sidebar,
  UncontrolledPopover,
  PopoverBody
} from '../../../components';

import { FooterAuth } from '../Pages/FooterAuth';
import { FooterText } from '../FooterText';
import LocaleSelector from '../LocaleSelector';

const SidebarBottomA = () => (
  <React.Fragment>
    { /* START Desktop */ }
    <Sidebar.HideSlim>
      <Sidebar.Section className="pb-0">
        <LocaleSelector sidebar />
      </Sidebar.Section>
      <Sidebar.Section>
        <FooterAuth className="text-muted" />
      </Sidebar.Section>
    </Sidebar.HideSlim>
    { /* END Desktop */ }

    { /* START Slim Only */ }
    <Sidebar.ShowSlim>
      <Sidebar.Section className="text-center">
        { /* Slim Version Selector */ }
        <LocaleSelector
          sidebar
          render={() => (
            <i className="fa fa-fw fa-toggle-on"></i>
          )}
        />

        { /* Footer Text as Tooltip */ }
        <Button
          id="UncontrolledSidebarPopoverFooter"
          color="link"
          className="sidebar__link p-0 mt-3"
        >
          <i className="fa fa-fw fa-copyright"></i>
        </Button>
        <UncontrolledPopover placement="left-end" target="UncontrolledSidebarPopoverFooter">
          <PopoverBody>
            <FooterText />
          </PopoverBody>
        </UncontrolledPopover>
      </Sidebar.Section>
    </Sidebar.ShowSlim>
    { /* END Slim Only */ }
  </React.Fragment>
)

export { SidebarBottomA };
