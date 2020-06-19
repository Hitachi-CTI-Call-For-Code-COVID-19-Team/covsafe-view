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
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Media } from 'reactstrap';
import { DonutChart } from './DonutChart';

const MediaDonutChart = (props) => {
  const { data } = props;

  return (
    <Media>
      <Media left className="mr-3">
        <DonutChart {...props} />
      </Media>
      <Media body>
        {
          data.map((d) => {
            const iClass = classNames('fa', 'fa-circle', 'mr-1', `text-${d.color}`);
            return (
              <div>
                <i className={iClass}></i> 
                <span className="text-inverse">{d.value}</span> {d.name}
              </div>
            );
          })
        }
      </Media>
    </Media>
  );
};
MediaDonutChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.exact({
    name: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string,
  }))
};

export { MediaDonutChart };
