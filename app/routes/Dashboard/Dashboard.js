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
import _ from 'lodash';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import {
  Button,
  Container,
  Row,
  Card,
  CardBody,
  Col,
  Progress,
  Table,
} from './../../components';
import { IndexCard } from './components';
import { MediaDonutChart, DonutChart, LineAreaChart, ArcChart, TinyAreaChart, BarChart } from './../../components/Charts';
import { IndoorMap } from './../../components/Maps';
import { EasyTable } from './../../components/Tables';
import { HeaderMain } from './../components/HeaderMain';
import { Loading } from './../../components/Loading/Loading';

import classes from './Dashboard.scss';

// constants
const DonutChartStyles = {
  aspect: 1.0,
  innerRadius: '80%',
  outerRadius: '100%',
  cx: '50%',
  cy: '50%',
  startAngle: 0,
  endAngle: 360,
};
const ArcChartStyles = {
  aspect: 4.0,
  innerRadius: '80%',
  outerRadius: '100%',
  cx: '50%',
  cy: '70%'
};

const TotalRisks = require('./../../data/latest-total-risks.json');
const CongestionRisks = require('./../../data/latest-congestion-risks.json');
const SanitizationRisks = require('./../../data/latest-sanitization-risks.json');
const DisinfectionRisks = require('./../../data/latest-disinfection-risks.json');
const URLs = [
  // total risks
  '',
  // congestion risks
  '',
  // sanitization risks
  '',
  // disinfection risks
  '',
];


// dummy data
const DonutData = [
  {name: 'High', value: 500, color: 'danger'},
  {name: 'Acceptable', value: 200, color: 'warning'},
  {name: 'Safe', value: 300, color: 'success'},
];

const AreaData = {
  meta: [{
    "name": "High",
    "color": "danger",
  }, {
    "name": "Acceptable",
    "color": "warning",
  }, {
    "name": "Safe",
    "color": "success",
  }],
  data: [
    {date: 'Jun 19 2020 07:25:46', "High": 40, "Acceptable": 24, "Safe": 36},
    {date: 'Jun 19 2020 08:25:46', "High": 30, "Acceptable": 13, "Safe": 57},
    {date: 'Jun 19 2020 09:25:46', "High": 20, "Acceptable": 78, "Safe": 2},
    {date: 'Jun 19 2020 10:25:46', "High": 27, "Acceptable": 39, "Safe": 34},
    {date: 'Jun 19 2020 11:25:46', "High": 18, "Acceptable": 48, "Safe": 34},
    {date: 'Jun 19 2020 12:25:46', "High": 23, "Acceptable": 38, "Safe": 39},
    {date: 'Jun 19 2020 13:25:46', "High": 34, "Acceptable": 43, "Safe": 23},
  ]
};

const SuggestionsData = {
  headers: ['日時', '提案', '原因', '深刻度', 'エリア・従業員'],
  data: [{
    // '日時': 'Wed Jun 10 2020 20:47:39',
    // '提案': 'Too congested',
    // '原因': 'Type: Congestion',
    // '深刻度': () => (<Progress value={80} style={{height: '5px'}} color='danger' />),
    // 'エリア・従業員': 'Area-05',
    '日時': '2020/6/19 金曜日 13:47:39',
    '提案': '混雑度が一定水準を超えました。このエリアの従業員は配置移動もしくは休憩が必要です',
    '原因': 'タイプ: 混雑度',
    '深刻度': () => (<Progress value={80} style={{ height: '5px' }} color='danger' />),
    'エリア・従業員': 'エリア 05',
  }, {
    // '日時': 'Wed Jun 10 2020 19:47:39',
    // '提案': 'Recommend to keep a social distance',
    // '原因': 'Type: Congestion',
    // '深刻度': () => (<Progress value={50} style={{height: '5px'}} color='yellow' />),
    // 'エリア・従業員': 'Area-05',
    '日時': '2020/6/19 金曜日 13:30:39',
    '提案': 'ソーシャルディスタンスの維持を推奨します',
    '原因': 'タイプ: 混雑度',
    '深刻度': () => (<Progress value={50} style={{ height: '5px' }} color='yellow' />),
    'エリア・従業員': 'エリア 05',
  }, {
    // '日時': 'Wed Jun 10 2020 19:37:39',
    // '提案': 'Few people wahsed their hands',
    // '原因': 'Type: Washing Hands Detection',
    // '深刻度': () => (<Progress value={90} style={{height: '5px'}} color='danger' />),
    // 'エリア・従業員': 'Area-01',
    '日時': '2020/6/19 金曜日 12:43:54',
    '提案': '手洗いを実施している来訪者が一定水準を下回りました。手洗い協力の要請が必要です',
    '原因': 'タイプ: 手洗い検知',
    '深刻度': () => (<Progress value={90} style={{ height: '5px' }} color='danger' />),
    'エリア・従業員': 'エリア 01',
  }, {
    // '日時': 'Wed Jun 10 2020 10:47:39',
    // '提案': 'Recommend to keep a social distance',
    // '原因': 'Type: Congestion',
    // '深刻度': () => (<Progress value={57} style={{height: '5px'}} color='yellow' />),
    // 'エリア・従業員': 'Area-10',
    '日時': '2020/6/19 金曜日 10:27:19',
    '提案': 'ソーシャルディスタンスの維持を推奨します',
    '原因': 'タイプ: 混雑度',
    '深刻度': () => (<Progress value={57} style={{ height: '5px' }} color='yellow' />),
    'エリア・従業員': 'エリア 10',
  }, {
    // '日時': 'Wed Jun 10 2020 01:47:39',
    // '提案': 'Recommend to keep a social distance',
    // '原因': 'Type: Congestion',
    // '深刻度': () => (<Progress value={51} style={{height: '5px'}} color='yellow' />),
    // 'エリア・従業員': 'Area-14',
    '日時': '2020/6/19 金曜日 10:00:51',
    '提案': 'ソーシャルディスタンスの維持を推奨します',
    '原因': 'タイプ: 混雑度',
    '深刻度': () => (<Progress value={51} style={{ height: '5px' }} color='yellow' />),
    'エリア・従業員': 'エリア 14',
  }]
};

const MapConfig = {
  // we decide the map window size by following floorMapConfig.bounds
  // but sometimes we like to get higher height. heightFactor is useful for it.
  heightFactor: 1,
  lat: 18,
  lng: 44,
  zoom: 4,
  maxZoom: 6,
  minZoom: 3,
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
  gradient: {0.3: 'green', 0.5: 'orange', 0.7: 'red'},
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
    ...points('vertical', 42, 4, 10, 0.5, 0.74),
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
    ...points('vertical', 42, 4, 10, 0.5, 0.74),
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
    ...points('vertical', 42, 4, 15, 0.5, 0.74),
    // restroom vertical line
    ...points('vertical', 2, 25, 30, 0.5, 0.74),
  ]
}];
const SliderConfig = {};

class Dashboard extends React.Component {
  static propTypes = {
    fluid: PropTypes.bool,
  };

  static defaultProps = {
    fluid: false,
  }

  constructor(props) {
    super(props);
    this.state = {
      total: null,
      congestion: null,
      sanitization: null,
      disinfection: null,
      loading: true,
    };
  }

  componentDidMount() {
    // fetching data
    Promise.all(URLs.map(u => fetch(u)))
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(jsons => {
      this.setState({
        total: jsons[0],
        congestion: jsons[1],
        sanitization: jsons[2],
        disinfection: jsons[3],
        loading: false,
      });
    })
    .catch(e => {
      // FIXME: switch fallback mode and remove interval part
      this.setState({
        total: TotalRisks,
        congestion: CongestionRisks,
        sanitization: SanitizationRisks,
        disinfection: DisinfectionRisks,
        loading: false,
      });
      console.log(this.state);
    });
  }
  
  render() {
    const { fluid, t } = this.props;
    const { total, congestion, sanitization, disinfection } = this.state;

    if (this.state.loading) {
      return (
        <Loading loading={this.state.loading}/>
      );
    } else {
      return (
        <React.Fragment>
          <Container fluid={false}>
            <Row className='mt-1'>
              <Col lg={12}>
                <div className='d-flex'>
                  <HeaderMain title={t('menus:main.dashboard.title')} />
                  <div className={classNames(classes['flex-vertical-center'], 'ml-auto', 'd-flex')}>
                    {t('dashboard:time-line-total-risks.last-update') + ': ' +
                    (new Date(total[0].timestamp)).toLocaleString()}
                  </div>
                </div>
              </Col>
            </Row>
            <Row className='mt-3 mb-5'>
              <Col lg={12}>
                <div className='hr-text hr-text-left mt-2 mb-4 lead'>
                  <span>
                    ANSHIN Index Overview
                  </span>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <IndexCard
                  title='Total'
                  link={{
                    title: 'What\'s needed?',
                    path: 'suggestions',
                  }}
                  arcData={{ ...total[0].risk }}
                  arcStyle={DonutChartStyles}
                  areaData={total.map(e => ({ ...e.risk, timestamp: e.timestamp }))}
                  areaStyle={{
                    width: '100%',
                    aspect: 2.6,
                  }} />
              </Col>
              <Col lg={3} md={6}>
                <IndexCard
                  title='Congestion'
                  link={{
                    title: 'What\'s needed?',
                    path: 'suggestions',
                  }}
                  arcData={{ ...congestion[0].risk }}
                  arcStyle={DonutChartStyles}
                  areaData={congestion.map(e => ({ ...e.risk, timestamp: e.timestamp }))}
                  areaStyle={{
                    width: '100%',
                    aspect: 2.6,
                  }} />
              </Col>
              <Col lg={3} md={6}>
                <IndexCard
                  title='Sanitization'
                  link={{
                    title: 'What\'s needed?',
                    path: 'suggestions',
                  }}
                  arcData={{ ...sanitization[0].risk }}
                  arcStyle={DonutChartStyles}
                  areaData={sanitization.map(e => ({ ...e.risk, timestamp: e.timestamp }))}
                  areaStyle={{
                    width: '100%',
                    aspect: 2.6,
                  }} />
              </Col>
              <Col lg={3} md={6}>
                <IndexCard
                  title='Disinfection'
                  link={{
                    title: 'What\'s needed?',
                    path: 'suggestions',
                  }}
                  arcData={{ ...disinfection[0].risk }}
                  arcStyle={DonutChartStyles}
                  areaData={disinfection.map(e => ({ ...e.risk, timestamp: e.timestamp }))}
                  areaStyle={{
                    width: '100%',
                    aspect: 2.6,
                  }} />
              </Col>
            </Row>



{/* 
            <Row className='my-3'>
              <Col lg={1}></Col>
              <Col lg={10}>
                <Table responsive>
                  <thead>
                    <tr>
                      <th>ANSHIN Index Types</th>
                      <th>Current</th>
                      <th>Timelines</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ width: '20%', verticalAlign: 'middle' }} className='font-weight-bold lead'>
                        Total Index
                        </td>
                      <td style={{ width: '30%', verticalAlign: 'middle' }}>
                        <ArcChart data={{ ...total[0].risk, dataKey: 'value' }} styles={ArcChartStyles} />
                      </td>
                      <td style={{ width: '50%', verticalAlign: 'middle' }}>
                        <TinyAreaChart data={total.map(e => ({ ...e.risk, timestamp: e.timestamp }))} height={40} />
                      </td>
                    </tr>

                    <tr>
                      <td style={{ width: '20%', verticalAlign: 'middle' }} className='font-weight-bold'>
                        Congestion Index
                        </td>
                      <td style={{ width: '30%', verticalAlign: 'middle' }}>
                        <ArcChart
                          data={congestion[0].risk}
                          styles={ArcChartStyles}
                        />
                      </td>
                      <td style={{ width: '50%', verticalAlign: 'middle' }}>
                        <TinyAreaChart data={congestion.map(e => ({ ...e.risk, timestamp: e.timestamp }))} height={40} />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: '20%', verticalAlign: 'middle' }} className='font-weight-bold'>
                        Sanitization Index
                        </td>
                      <td style={{ width: '30%', verticalAlign: 'middle' }}>
                        <ArcChart
                          data={sanitization[0].risk}
                          styles={ArcChartStyles}
                        />
                      </td>
                      <td style={{ width: '50%', verticalAlign: 'middle' }}>
                        <TinyAreaChart data={sanitization.map(e => ({ ...e.risk, timestamp: e.timestamp }))} height={40} />
                      </td>
                    </tr>
                    <tr>
                      <td style={{ width: '20%', verticalAlign: 'middle' }} className='font-weight-bold'>
                        Disinfection Index
                        </td>
                      <td style={{ width: '30%', verticalAlign: 'middle' }}>
                        <ArcChart
                          data={disinfection[0].risk}
                          styles={ArcChartStyles}
                        />
                      </td>
                      <td style={{ width: '50%', verticalAlign: 'middle' }}>
                        <TinyAreaChart data={disinfection.map(e => ({ ...e.risk, timestamp: e.timestamp }))} height={40} />
                      </td>
                    </tr>

                  </tbody>
                </Table>
              </Col>
              <Col lg={1}></Col>
            </Row> */}
            <Row className='mb-5'>
              <Col lg={12}>
                <div>
                  <div className='hr-text hr-text-left mt-2 mb-4 lead'>
                    <span>
                      {t('dashboard:heatmap.title')}
                    </span>
                  </div>
                  <IndoorMap
                    config={MapConfig}
                    floorConfig={FloorMapConfig}
                    heatConfig={HeatMapConfig}
                    heatData={HeatData}
                    sliderConfig={SliderConfig}
                  />
                </div>
              </Col>
            </Row>

            <Row className='mb-5'>
              <Col lg={12}>
                <div>
                  <div className='hr-text hr-text-left mt-4 mb-4 lead'>
                    <span>
                      {t('dashboard:suggestions-list.title')}
                    </span>
                  </div>
                  <EasyTable headers={SuggestionsData.headers} data={SuggestionsData.data} />
                </div>
              </Col>
            </Row>
          </Container>
        </React.Fragment>
      );
    }
  }
}

const DashboardWithTranslation = withTranslation()(Dashboard);
export { DashboardWithTranslation as Dashboard };