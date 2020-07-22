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
import riskValueConverter from '../../utils/riskValueConverter';

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
import { IndoorMap } from './../../components/Maps';
import { EasyTable } from './../../components/Tables';
import { Loading } from './../../components/Loading/Loading';

import { HeaderMain } from './../components/HeaderMain';

import classes from './Dashboard.scss';

import faker from '../../utils/faker';

// constants
const now = new Date();
const URLs = [
  // assets
  '',
  // total risks
  '',
  // congestion risks
  '',
  // sanitization risks
  '',
  // disinfection risks
  '',
];
const DonutChartStyles = {
  aspect: 1.0,
  innerRadius: '80%',
  outerRadius: '100%',
  cx: '50%',
  cy: '50%',
  startAngle: 0,
  endAngle: 360,
};

const MapConfig = require('./../../data/map-config.json');
const BaseConfig = MapConfig.map.base;
const FloorMapConfig = {
  url: require('../../images/map/floormap.png'),
  ...MapConfig.map.floor,
};
const HeatMapConfig = MapConfig.map.heat;
const SliderConfig = {};

// dummy data
const SuggestionsData = {
  // headers: ['日時', '提案', '原因', '深刻度', 'エリア・従業員'],
  headers: ['Date', 'Suggestions', 'Causes', 'Severity', 'Areas/Workers'],
  data: [{
    'Date': 'Wed Jun 10 2020 20:47:39',
    'Suggestions': 'Too congested',
    'Causes': 'Type: Congestion',
    'Severity': () => (<Progress value={80} style={{height: '5px'}} color='danger' />),
    'Areas/Workers': 'Area-05',
    // '日時': '2020/6/19 金曜日 13:47:39',
    // '提案': '混雑度が一定水準を超えました。このエリアの従業員は配置移動もしくは休憩が必要です',
    // '原因': 'タイプ: 混雑度',
    // '深刻度': () => (<Progress value={80} style={{ height: '5px' }} color='danger' />),
    // 'エリア・従業員': 'エリア 05',
  }, {
    'Date': 'Wed Jun 10 2020 19:47:39',
    'Suggestions': 'Recommend to keep a social distance',
    'Causes': 'Type: Congestion',
    'Severity': () => (<Progress value={50} style={{height: '5px'}} color='yellow' />),
    'Areas/Workers': 'Area-05',
    // '日時': '2020/6/19 金曜日 13:30:39',
    // '提案': 'ソーシャルディスタンスの維持を推奨します',
    // '原因': 'タイプ: 混雑度',
    // '深刻度': () => (<Progress value={50} style={{ height: '5px' }} color='yellow' />),
    // 'エリア・従業員': 'エリア 05',
  }, {
    'Date': 'Wed Jun 10 2020 19:37:39',
    'Suggestions': 'Few people wahsed their hands',
    'Causes': 'Type: Washing Hands Detection',
    'Severity': () => (<Progress value={90} style={{height: '5px'}} color='danger' />),
    'Areas/Workers': 'Area-01',
    // '日時': '2020/6/19 金曜日 12:43:54',
    // '提案': '手洗いを実施している来訪者が一定水準を下回りました。手洗い協力の要請が必要です',
    // '原因': 'タイプ: 手洗い検知',
    // '深刻度': () => (<Progress value={90} style={{ height: '5px' }} color='danger' />),
    // 'エリア・従業員': 'エリア 01',
  }, {
    'Date': 'Wed Jun 10 2020 10:47:39',
    'Suggestions': 'Recommend to keep a social distance',
    'Causes': 'Type: Congestion',
    'Severity': () => (<Progress value={57} style={{height: '5px'}} color='yellow' />),
    'Areas/Workers': 'Area-10',
    // '日時': '2020/6/19 金曜日 10:27:19',
    // '提案': 'ソーシャルディスタンスの維持を推奨します',
    // '原因': 'タイプ: 混雑度',
    // '深刻度': () => (<Progress value={57} style={{ height: '5px' }} color='yellow' />),
    // 'エリア・従業員': 'エリア 10',
  }, {
    'Date': 'Wed Jun 10 2020 01:47:39',
    'Suggestions': 'Recommend to keep a social distance',
    'Causes': 'Type: Congestion',
    'Severity': () => (<Progress value={51} style={{height: '5px'}} color='yellow' />),
    'Areas/Workers': 'Area-14',
    // '日時': '2020/6/19 金曜日 10:00:51',
    // '提案': 'ソーシャルディスタンスの維持を推奨します',
    // '原因': 'タイプ: 混雑度',
    // '深刻度': () => (<Progress value={51} style={{ height: '5px' }} color='yellow' />),
    // 'エリア・従業員': 'エリア 14',
  }]
};


// const points = (typ, fix, min, max, freq, val) => {
//   let ary = [];
//   for (var i = min; i < max; i++) {
//     for (var j = 0.0; j < 1; j += freq) {
//       let calc = typ === 'vertical' ? [i + j, fix, val] : [fix, i + j, val];
//       ary.push(calc);
//     }
//   }
//   return ary;
// };
// const HeatData = [{
//   timestamp: '2020-06-19T14:00:00+09:00',
//   data: [
//     // 7-casher vertical line
//     ...points('vertical', 9, 12, 24, 0.5, 0.74),
//     // 9-10 holizonal line
//     ...points('holizonal', 13, 9, 20, 0.2, 1),
//     // casher-10 holizonal line
//     ...points('holizonal', 22, 12, 20, 1, 0.3),
//     // event-space vertical line
//     ...points('vertical', 42, 4, 10, 0.5, 0.74),
//     // restroom vertical line
//     ...points('vertical', 2, 25, 30, 0.5, 0.74),
//   ]
// }, {
//   timestamp: '2020-06-19T13:00:00+09:00',
//   data: [
//     // 7-casher vertical line
//     ...points('vertical', 9, 16, 24, 0.5, 0.74),
//     // 9-10 holizonal line
//     ...points('holizonal', 13, 9, 14, 0.2, 1),
//     // casher-10 holizonal line
//     ...points('holizonal', 22, 12, 20, 1, 0.3),
//     // event-space vertical line
//     ...points('vertical', 42, 4, 10, 0.5, 0.74),
//     // restroom vertical line
//     ...points('vertical', 2, 25, 30, 0.5, 0.74),
//   ]
// }, {
//   timestamp: '2020-06-19T12:00:00+09:00',
//   data: [
//     // 7-casher vertical line
//     ...points('vertical', 9, 20, 24, 0.5, 0.74),
//     // 9-10 holizonal line
//     ...points('holizonal', 13, 9, 12, 0.2, 1),
//     // casher-10 holizonal line
//     ...points('holizonal', 22, 12, 20, 1, 0.3),
//     // event-space vertical line
//     ...points('vertical', 42, 4, 15, 0.5, 0.74),
//     // restroom vertical line
//     ...points('vertical', 2, 25, 30, 0.5, 0.74),
//   ]
// }];

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
      assets: null,
      total: null,
      congestion: null,
      sanitization: null,
      disinfection: null,
      congestionMap: null,
      loading: true,
    };
  }

  componentDidMount() {
    // fetching data
    Promise.all(URLs.map(u => fetch(u)))
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(jsons => {
      this.setState({
        assets: jsons[0], 
        total: jsons[1],
        congestion: jsons[2],
        sanitization: jsons[3],
        disinfection: jsons[4],
        congestionMap: riskValueConverter.toHeat(json[1]),
        loading: false,
      });
    })
    .catch(e => {
      // FIXME: switch fallback mode and remove interval part
      this.setState({
        assets: faker.assets,
        total: faker.totalRisks(now, new Date(now.getTime() - 24 * 60 * 60000), 30 * 60000),
        congestion: riskValueConverter.mean(
          faker.risks('congestion', now, new Date(now.getTime() - 24 * 60 * 60000), 60 * 60000)
        ),
        sanitization: riskValueConverter.mean(
          faker.risks('sanitization', now, new Date(now.getTime() - 24 * 60 * 60000), 30 * 60000)
        ),
        disinfection: riskValueConverter.mean(
          faker.risks('disinfection', now, new Date(now.getTime() - 24 * 60 * 60000), 30 * 60000)
        ),
        congestionMap: riskValueConverter.toHeat(
          faker.assets,
          FloorMapConfig.bounds[1],
          faker.risks('congestion', now, new Date(now.getTime() - 24 * 60 * 60000), 60 * 60000),
        ),
        loading: false,
      });
    });
  }
  
  render() {
    const { fluid, t } = this.props;
    const { total, congestion, sanitization, disinfection, congestionMap } = this.state;

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
                    {t('dashboard:index-overview.title')}
                  </span>
                </div>
              </Col>
              <Col lg={3} md={6}>
                <IndexCard
                  title={t('dashboard:index-overview.titles.total')}
                  link={{
                    title: t(`dashboard:index-overview.comments.${total[0].risk.level}`),
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
                  title={t('dashboard:index-overview.titles.congestion')}
                  link={{
                    title: t(`dashboard:index-overview.comments.${congestion[0].risk.level}`),
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
                  title={t('dashboard:index-overview.titles.sanitization')}
                  link={{
                    title: t(`dashboard:index-overview.comments.${sanitization[0].risk.level}`),
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
                  title={t('dashboard:index-overview.titles.disinfection')}
                  link={{
                    title: t(`dashboard:index-overview.comments.${disinfection[0].risk.level}`),
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
            <Row className='mb-5'>
              <Col lg={12}>
                <div>
                  <div className='hr-text hr-text-left mt-2 mb-4 lead'>
                    <span>
                      {t('dashboard:heatmap.title')}
                    </span>
                  </div>
                  <IndoorMap
                    config={BaseConfig}
                    floorConfig={FloorMapConfig}
                    heatConfig={HeatMapConfig}
                    heatData={congestionMap}
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