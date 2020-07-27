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
import classNames from 'classnames';
import converter from '../../utils/converter';

import {
  Container,
  Row,
  Col,
  Progress,
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
  // map config
  '',
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

// dummy data
const SuggestionsData = {
  // headers: ['日時', '提案', '原因', '深刻度', 'エリア・従業員'],
  headers: ['Date', 'Suggestions', 'Causes', 'Severity', 'Areas/Workers'],
  data: [{
    'Date': 'Wed Jun 10 2020 20:47:39',
    'Suggestions': 'Too congested',
    'Causes': 'Type: Congestion',
    'Severity': () => (<Progress value={80} slim color='danger' />),
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
    'Severity': () => (<Progress value={50} slim color='yellow' />),
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
    'Severity': () => (<Progress value={90} slim color='danger' />),
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
    'Severity': () => (<Progress value={57} slim color='yellow' />),
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
    'Severity': () => (<Progress value={51} slim color='yellow' />),
    'Areas/Workers': 'Area-14',
    // '日時': '2020/6/19 金曜日 10:00:51',
    // '提案': 'ソーシャルディスタンスの維持を推奨します',
    // '原因': 'タイプ: 混雑度',
    // '深刻度': () => (<Progress value={51} style={{ height: '5px' }} color='yellow' />),
    // 'エリア・従業員': 'エリア 14',
  }]
};

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
      mapConfig: null,
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
        mapConfig: jsons[0],
        assets: jsons[1], 
        total: jsons[2],
        congestion: jsons[3],
        sanitization: jsons[4],
        disinfection: jsons[5],
        congestionMap: converter.risk.toHeat(jsons[1], jsons[0].map.floor.bounds[1], jsons[3]),
        loading: false,
      });
    })
    .catch(e => {
      // FIXME: switch fallback mode and remove interval part
      this.setState({
        mapConfig: faker.mapConfig,
        assets: faker.assets,
        total: faker.totalRisks(now, new Date(now.getTime() - 24 * 60 * 60000), 30 * 60000),
        congestion: converter.risk.mean(
          faker.risks('congestion', now, new Date(now.getTime() - 24 * 60 * 60000), 60 * 60000)
        ),
        sanitization: converter.risk.mean(
          faker.risks('sanitization', now, new Date(now.getTime() - 24 * 60 * 60000), 30 * 60000)
        ),
        disinfection: converter.risk.mean(
          faker.risks('disinfection', now, new Date(now.getTime() - 24 * 60 * 60000), 30 * 60000)
        ),
        congestionMap: converter.risk.toHeat(
          faker.assets,
          faker.mapConfig.map.floor.bounds[1],
          faker.risks('congestion', now, new Date(now.getTime() - 24 * 60 * 60000), 60 * 60000),
        ),
        loading: false,
      });
    });
  }
  
  render() {
    const { fluid, t } = this.props;
    const { mapConfig, total, congestion, sanitization, disinfection, congestionMap } = this.state;

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
                    config={{
                      ...mapConfig.map.base,
                      maxZoom: 10,
                      minZoom: 1,
                      dragging: true,
                      zoomControl: true,
                      scrollWheelZoom: true,
                    }}
                    floorConfig={{
                      ...mapConfig.map.floor,
                    }}
                    heatConfig={{
                      ...mapConfig.map.heat,
                    }}
                    heatData={congestionMap}
                    sliderConfig={{}}
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