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
import colors from './../../colors';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from './../../components/recharts';

const ArcChart = (props) => {
  const { data, styles } = props;

  const list = Array.isArray(data) ? data.map(e => ({
    value: e.value * 100,
    color: colors[e.level === 'H' ? 'danger' : e.level === 'A' ? 'warning' : 'success'],
  })) : [{
    value: data.value * 100,
    color: colors[data.level === 'H' ? 'danger' : data.level === 'A' ? 'warning' : 'success'],
  }];

  const sum = list.reduce((p, v) => {
    p += v.value;
    return p;
  }, 0);

  if (sum < 100) {
    list.push({
      value: 100 - sum,
      color: colors['secondary-01'],
    })
  }

  return (
    <ResponsiveContainer width='100%' aspect={styles.aspect}>
      <PieChart>
        <Pie
          data={list}
          dataKey='value'
          stroke='no'
          innerRadius={styles.innerRadius || '85%'}
          outerRadius={styles.outerRadius || '100%'}
          startAngle={styles.startAngle}
          endAngle={styles.endAngle}
          cx={styles.cx || '50%'}
          cy={styles.cy || '70%'}
        >
          {
            list.map((e, i) => <Cell key={i} fill={e.color} />)
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
};
ArcChart.propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({
      // must be b/w 0 and 1
      value: PropTypes.number,
      // must be H|A|L
      level: PropTypes.string,
    })),
    PropTypes.shape({
      // must be b/w 0 and 1
      value: PropTypes.number,
      // must be H|A|L
      level: PropTypes.string,
    }),
  ]),
  styles: PropTypes.shape({
    aspect: PropTypes.number,
    innerRadius: PropTypes.string,
    outerRadius: PropTypes.string,
    cx: PropTypes.string,
    cy: PropTypes.string,
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
  }),
};

export { ArcChart };
