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
import classNames from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from './../../components';

import { withTranslation } from 'react-i18next';
import { getLanguage } from './../../i18n';

class LocaleSelector extends React.Component {
  static propTypes = {
    down: PropTypes.bool,
    render: PropTypes.func,
    className: PropTypes.string,
    sidebar: PropTypes.bool
  }

  render() {
    const { down, render, className, sidebar, t, i18n } = this.props;

    return (
      <UncontrolledButtonDropdown direction={ down ? "down" : "up" } className={ className }>
        <DropdownToggle
          tag="a"
          href="#"
          className={classNames('btn-switch-version', { 'sidebar__link': sidebar })}
          onClick={e => e.preventDefault()}
        >
          {
            render ? render(i18n.language) : (
              <div>
                {t('menus:sidebar.menu.languages')}: {getLanguage(i18n.language)} <i className={`fa ${down ? "fa-angle-down" : "fa-angle-up"} ml-2`}></i>
              </div>
            )
          }
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>
            {t('menus:sidebar.menu.languages')}
          </DropdownItem>
          {
            _.map(i18n.languages, (lng, index) => (
              <DropdownItem
                key={ index }
                className="d-flex"
                active={ lng === i18n.language }
                onClick={() => i18n.changeLanguage(lng)}
              >
                <span>
                  {getLanguage(lng)}
                </span>
                {
                  (lng === i18n.language) && (
                    <i className="fa fa-fw fa-check text-success ml-auto align-self-center pl-3" />
                  )
                }
              </DropdownItem>
            ))
          }
        </DropdownMenu>
      </UncontrolledButtonDropdown>
    );
  }
}

export default withTranslation()(LocaleSelector);