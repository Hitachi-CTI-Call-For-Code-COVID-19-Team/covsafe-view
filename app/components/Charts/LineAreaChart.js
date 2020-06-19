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
  AreaChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Area
} from './../recharts';

import colors from '../../colors';

const LineAreaChart = (props) => {
  const { data, dataKey, dot, activeDot, isStack } = props;

  return (
    // FIXME: need modify the size for mobile, which might require dynamic aspect
    <ResponsiveContainer width='100%' aspect={4}>
      <AreaChart data={data.data} margin={{top: 10, right: 30, left: 0, bottom: 0}}>
        <CartesianGrid strokeDasharray="3 3"/>
        <XAxis dataKey={dataKey}/>
        <YAxis/>
        <Tooltip/>
        {
          data.meta.map((e, i) => {
            return (
              <Area
                dataKey={e.name}
                stroke={ colors[e.color] }
                fill={ colors[e.color + '-05'] }
                dot={dot}
                activeDot={activeDot}
                stackId={isStack ? 1 : i}
              />
            );
          })
        }
      </AreaChart>
    </ResponsiveContainer>
  );
};

LineAreaChart.propTypes = {
  dataKey: PropTypes.string,
  dot: PropTypes.bool,
  activeDot: PropTypes.bool,
  isStack: PropTypes.bool,
  data: PropTypes.exact({
    meta: PropTypes.arrayOf(PropTypes.exact({
      name: PropTypes.string,
      color: PropTypes.string,
    })),
    data: PropTypes.array,
  })
};
LineAreaChart.defaultProps = {
  dataKey: "date",
  dot: false,
  activeDot: true,
  isStack: true,
};

export { LineAreaChart };
