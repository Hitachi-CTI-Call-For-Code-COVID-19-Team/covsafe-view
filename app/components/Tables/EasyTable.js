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
import {
  Table
} from './../index';

const EasyTable = (props) => {
  const { headers, data } = props;

  return (
    <Table responsive striped className='mb-0'>
      <thead>
        <tr>
          {
            headers.map((h, i) => (<th className='bt-0' key={i}>{h.value}</th>))
          }
        </tr>
      </thead>
      <tbody>
        <React.Fragment>
          {
            data.map((d, i) => (
              <tr key={i}>
                {
                  headers.map((h, j) => {
                    if (typeof d[h.key] === 'string') {
                      return (
                        <td className='align-middle' key={j}>
                          {d[h.key]}
                        </td>
                      );
                    } else if (typeof d[h.key] === 'function') {
                      return (
                        <td className='align-middle' key={j}>
                          {d[h.key]()}
                        </td>
                      )
                    }
                  })
                }
              </tr>
            ))
          }
        </React.Fragment>
      </tbody>
    </Table>
  );
};
EasyTable.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    value: PropTypes.string,
  })),
};

export { EasyTable };
