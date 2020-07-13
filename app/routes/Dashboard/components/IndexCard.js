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
import { Link } from 'react-router-dom';

import { ArcChart, TinyAreaChart } from './../../../components/Charts';
import {
  Button,
  Card,
  CardBody,
} from './../../../components';

const IndexCard = (props) => {
  const { title, link, arcData, arcStyle, areaData, areaStyle } = props;

  return (
    <Card className='mb-3 bg-none mb-lg-0'>
      <CardBody className='pb-0 px-2 pt-1'>
        <div className='d-flex mb-4 px-2 pt-2'>
          <span>
            <h4 className='my-4 fw-300'>{title}</h4>
            {
              link && (
                <Button color='link' size='sm' className='pt-0 pl-0 ml-auto' tag={Link} to={link.path}>
                  {link.title} <i className='fa fa-angle-right'></i>
                </Button>
              )
            }
          </span>
          <span className="text-right ml-auto">
            <ArcChart data={arcData} styles={arcStyle} />
          </span>
        </div>
        <TinyAreaChart data={areaData} width={areaStyle.width} aspect={areaStyle.aspect} />
      </CardBody>
    </Card>
  );
};
IndexCard.propTypes = {
  title: PropTypes.string,
  link: PropTypes.exact({
    title: PropTypes.string,
    path: PropTypes.string,
  }),
  arcData: PropTypes.shape({
    // must be b/w 0 and 1
    value: PropTypes.number,
    // must be H|A|L
    level: PropTypes.string,
  }),
  arcStyle: PropTypes.shape({
    aspect: PropTypes.number,
    innerRadius: PropTypes.string,
    outerRadius: PropTypes.string,
    cx: PropTypes.string,
    cy: PropTypes.string,
    startAngle: PropTypes.number,
    endAngle: PropTypes.number,
  }),
  areaData: PropTypes.arrayOf(PropTypes.shape({
    // must be b/w 0 and 1
    value: PropTypes.number,
    // must be H|A|L
    level: PropTypes.string,
    // must be time string that Date can interpret
    timestamp: PropTypes.string,
  })),
  areaStyle: PropTypes.shape({
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    aspect: PropTypes.number,
  }),
};

export { IndexCard };
