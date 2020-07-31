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
import Fetch from '../../utils/fetch';

import {
  Container,
  Row,
  Col,
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
const Links = [
  // map config
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.VIEW_CONFIG_DB,
      query: {
        selector: {
          '_id': { '$gt': '0' }
        },
        fields: [],
        sort: [{ '_id': 'asc' }]
      }
    }),
  }),
  // assets
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.ASSETS_DB,
      query: {
        selector: {
          '_id': { '$gt': '0' }
        },
        fields: [],
        sort: [{ '_id': 'asc' }]
      }
    }),
  }),
  // notification teamplate
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.NOTICE_TEMPLATE_DB,
      query: {
        selector: {},
        fields: ['notifications']
      }
    }),
  }),
  // total risks
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.RISK_DB,
      query: {
        selector: {
          'risk.type': 't',
          'timestamp': {
            '$gt': new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString()
          }
        },
        fields: ['timestamp', 'id', 'risk'],
        sort: [{ 'timestamp': 'desc' }]
      }
    }),
  }),
  // congestion risks
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.RISK_DB,
      query: {
        selector: {
          'risk.type': 'c',
          'timestamp': {
            '$gt': new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString()
          }
        },
        fields: ['timestamp', 'id', 'risk'],
        sort: [{ 'timestamp': 'desc' }]
      }
    }),
  }),
  // sanitization risks
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.RISK_DB,
      query: {
        selector: {
          'risk.type': 's',
          'timestamp': {
            '$gt': new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString()
          }
        },
        fields: ['timestamp', 'id', 'risk'],
        sort: [{ 'timestamp': 'desc' }]
      }
    }),
  }),
  // disinfection risks
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.RISK_DB,
      query: {
        selector: {
          'risk.type': 'd',
          'timestamp': {
            '$gt': new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString()
          }
        },
        fields: ['timestamp', 'id', 'risk'],
        sort: [{ 'timestamp': 'desc' }]
      }
    }),
  }),
  // notification
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.NOTICE_DB,
      query: {
        selector: {
          'timestamp': {
            '$gt': new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString()
          }
        },
        fields: ['id', 'timestamp', 'causes', 'code', 'variables'],
        sort: [{ 'timestamp': 'desc' }],
        limit: 10,
      }
    }),
  }),
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
      template: null,
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
    Promise.all(Links.map(l => l.fetch()))
    .then(responses => Promise.all(responses.map(res => res.json())))
    .then(responses => Promise.all(responses.map(res => res.docs)))
    .then(responses => {
      console.log(responses)
      if (responses.slice(0, 4).some(e => e.length === 0)) {
        throw new Error('there are sort of data from back-end that are empty');
      }
      return responses;
    })
    .then(jsons => {
      this.setState({
        mapConfig: jsons[0][0],
        assets: jsons[1],
        template: jsons[2][0],
        total: jsons[3],
        congestion: jsons[4],
        sanitization: jsons[5],
        disinfection: jsons[6],
        notification: converter.risk.toSuggestion(jsons[2][0], jsons[7]),
        congestionMap: converter.risk.toHeat(jsons[1], jsons[0][0].map.floor.bounds[1], jsons[4]),
        loading: false,
      });
    })
    .catch(e => {
      console.log('-=-=-=fsd-f=a-dfa=d-fa=f- why is here?');
      // FIXME: switch fallback mode and remove interval part
      this.setState({
        mapConfig: faker.mapConfig,
        assets: faker.assets,
        template: faker.template,
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
        notification: converter.risk.toSuggestion(
          faker.template,
          faker.notifications(10, now, new Date(now.getTime() - 10 * 60 * 60000), 30 * 60000).slice(0, 10)
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
    const { mapConfig, total, congestion, sanitization, disinfection, congestionMap, notification } = this.state;
    const suggestionHeaders = [
      { key: 'timestamp', value: t('dashboard:suggestions-list.headers.timestamp') },
      { key: 'suggestion', value: t('dashboard:suggestions-list.headers.suggestion') },
      { key: 'causes', value: t('dashboard:suggestions-list.headers.causes') },
      { key: 'severity', value: t('dashboard:suggestions-list.headers.severity') },
      { key: 'target', value: t('dashboard:suggestions-list.headers.target') },
    ];

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
                    path: '#suggestions',
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
                    path: '#suggestions',
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
                    path: '#suggestions',
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
                    path: '#suggestions',
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
                <div id='suggestions'>
                  <div className='hr-text hr-text-left mt-4 mb-4 lead'>
                    <span>
                      {t('dashboard:suggestions-list.title')}
                    </span>
                  </div>
                  <EasyTable headers={suggestionHeaders} data={notification} />
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