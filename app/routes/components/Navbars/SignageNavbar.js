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
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';

import {
  Navbar,
  Nav,
  NavbarBrand,
} from '../../../components';

import { LogoThemed } from './../LogoThemed/LogoThemed';
import classes from './Navbar.scss';

const SignageNavbar = ({ history }) => (
  <Navbar light expand='xs' fluid>
    <NavbarBrand
      className='mb-0 btn'
      tag='div'
      onClick={() => history.goBack()} >
      <LogoThemed checkBackground className={classNames(classes['logo'], 'd-inline-block align-top')} />
    </NavbarBrand>
    <Nav navbar className='mr-auto'>
      <h1 className={classNames(classes['subtitle'], 'fw-100', 'mt-2')}>
        Less Congested, More Comfy and Lively Shopping
      </h1>
    </Nav>
  </Navbar>
);

const SignageNavbarWithRouter = withRouter(SignageNavbar);
export { SignageNavbarWithRouter as SignageNavbar };