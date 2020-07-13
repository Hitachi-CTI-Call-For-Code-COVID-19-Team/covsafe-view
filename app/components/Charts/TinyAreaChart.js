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
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  XAxis
} from './../recharts';
import colors from './../../colors';

const TinyAreaChart = (props) => {
  const { data, width, aspect } = props;
  const list = data.map(e => ({ value: e.value, date: (new Date(e.timestamp)).toLocaleString() })).reverse();
  const scolor = colors[data[0].level === 'H' ? 'danger' : data[0].level === 'A' ? 'warning' : 'success'];
  const fcolor = colors[data[0].level === 'H' ? 'danger-02' : data[0].level === 'A' ? 'warning-02' : 'success-02'];

  return (
    <ResponsiveContainer width={width} aspect={aspect}>
      <AreaChart data={list}>
        <XAxis hide={true} dataKey='date' />
        <Tooltip payload={data.map(e => ({ name: 'time', value: (new Date(e.timestamp)).toLocaleString()})).reverse()} />
        <Area dataKey='value' stroke={scolor} fill={fcolor} />
      </AreaChart>
    </ResponsiveContainer>
  )
};

TinyAreaChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.shape({
    // must be b/w 0 and 1
    value: PropTypes.number,
    // must be H|A|L
    level: PropTypes.string,
    // must be time string that Date can interpret
    timestamp: PropTypes.string,
  })),
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  aspect: PropTypes.number,
};
TinyAreaChart.defaultProps = {
  width: '100%',
  aspect: 1.0,
};

export { TinyAreaChart };
