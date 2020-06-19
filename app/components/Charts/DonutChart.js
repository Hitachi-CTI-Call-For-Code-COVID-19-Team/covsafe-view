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
  PieChart, 
  Pie,
  Cell
} from 'recharts';
import colors from './../../colors';

const DonutChart = (props) => {
  const { width, height, innerRadius, outerRadius, data } = props;

  return (
    <PieChart width={ width } height={ height }>
      <Pie
        data={data}
        dataKey={'value'}
        innerRadius={ innerRadius }
        outerRadius={ outerRadius } 
      >
        {
          data.map((e, i) => <Cell key={ i } fill={colors[e.color]} />)
        }
      </Pie>
    </PieChart>
  );
};
DonutChart.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  innerRadius: PropTypes.number,
  outerRadius: PropTypes.number,
  data: PropTypes.arrayOf(PropTypes.exact({
    name: PropTypes.string,
    value: PropTypes.number,
    color: PropTypes.string,
  }))
};
DonutChart.defaultProps = {
  width: 140,
  height: 140,
  innerRadius: 60,
  outerRadius: 70,
};

export { DonutChart };
