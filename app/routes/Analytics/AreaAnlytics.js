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
import { withTranslation } from 'react-i18next';
import {
  Container,
  Row,
  Col,
} from './../../components';
import { setupPage } from './../../components/Layout/setupPage';
import { HeaderMain } from "../components/HeaderMain";
import { IndoorMap } from './../../components/Maps';

const TrColors = [
  {
    fill: "primary-02",
    stroke: "primary"
  },
  {
    fill: "purple-02",
    stroke: "purple"
  },
  {
    fill: "success-02",
    stroke: "success"
  },
  {
    fill: "yellow-02",
    stroke: "yellow"
  }
];

const MapConfig = {
  // we decide the map window size by following floorMapConfig.bounds
  // but sometimes we like to get higher height. heightFactor is useful for it.
  heightFactor: 1,
  lat: 18,
  lng: 44,
  zoom: 4,
  maxZoom: 10,
  minZoom: 1,
  dragging: true,
  maxBounds: [
    [0, 0],
    [768, 1920]
  ],
  zoomControl: true,
};
const FloorMapConfig = {
  url: require('../../images/map/floor.png'),
  bounds: [
    [0, 0],
    [768, 1920]
  ]
};
const HeatMapConfig = {
  fitBoundsOnLoad: false,
  fitBoundsOnUpdate: false,
  max: 1,
  radius: 20,
  gradient: { 0.3: 'green', 0.5: 'orange', 0.7: 'red' },
};
const points = (typ, fix, min, max, freq, val) => {
  let ary = [];
  for (var i = min; i < max; i++) {
    for (var j = 0.0; j < 1; j += freq) {
      let calc = typ === 'vertical' ? [i + j, fix, val] : [fix, i + j, val];
      ary.push(calc);
    }
  }
  return ary;
};

const HeatData = [{
  timestamp: '2020-06-19T14:00:00+09:00',
  data: [
    // 7-casher vertical line
    ...points('vertical', 9, 12, 24, 0.5, 0.74),
    // 9-10 holizonal line
    ...points('holizonal', 13, 9, 20, 0.2, 1),
    // casher-10 holizonal line
    ...points('holizonal', 22, 12, 20, 1, 0.3),
    // event-space vertical line
    ...points('vertical', 40, 4, 10, 0.5, 0.74),
    // restroom vertical line
    ...points('vertical', 2, 25, 30, 0.5, 0.74),
  ]
}, {
  timestamp: '2020-06-19T13:00:00+09:00',
  data: [
    // 7-casher vertical line
    ...points('vertical', 9, 16, 24, 0.5, 0.74),
    // 9-10 holizonal line
    ...points('holizonal', 13, 9, 14, 0.2, 1),
    // casher-10 holizonal line
    ...points('holizonal', 22, 12, 20, 1, 0.3),
    // event-space vertical line
    ...points('vertical', 40, 4, 10, 0.5, 0.74),
    // restroom vertical line
    ...points('vertical', 2, 25, 30, 0.5, 0.74),
  ]
}, {
  timestamp: '2020-06-19T12:00:00+09:00',
  data: [
    // 7-casher vertical line
    ...points('vertical', 9, 20, 24, 0.5, 0.74),
    // 9-10 holizonal line
    ...points('holizonal', 13, 9, 12, 0.2, 1),
    // casher-10 holizonal line
    ...points('holizonal', 22, 12, 20, 1, 0.3),
    // event-space vertical line
    ...points('vertical', 40, 4, 15, 0.5, 0.74),
    // restroom vertical line
    ...points('vertical', 2, 25, 30, 0.5, 0.74),
  ]
}];
const SliderConfig = {};

class AreaAnlytics extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <Container>
        <Row className="mb-2">
          <Col lg={12}>
            <HeaderMain
              title={t('menus:main.analytics.areas.title')}
              className="mb-4 mb-lg-5"
            />
          </Col>
        </Row>
        <Row>
          <Col lg={12}>
            <div className="hr-text hr-text-left mt-2 mb-4 lead">
              <span>{t('analytics:areas.list.title')}</span>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

const withPageSettings = setupPage({ pageTitle: 'Area Anlytics' })(AreaAnlytics);
const AreaAnlyticsWithTranslation = withTranslation()(withPageSettings);
export { AreaAnlyticsWithTranslation as AreaAnlytics };
