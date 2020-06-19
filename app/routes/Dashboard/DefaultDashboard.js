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

import {
  Container,
  FloatGrid as Grid,
  Button,
  ButtonToolbar,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardFooter,
  Media,
  Progress
} from './../../components';
import { applyColumn } from './../../components/FloatGrid';
import { MediaDonutChart, LineAreaChart } from './../../components/Charts';
import { IndoorMap } from './../../components/Maps';
import { EasyTable } from './../../components/Tables';
import { HeaderMain } from './../components/HeaderMain';

const LAYOUT = {
  'current-total-risks': { h: 6, minH: 6, maxH: 6, md: 4 },
  'time-line-total-risks': { h: 6, minH: 6, maxH: 6, md: 8 },
  'heatmap': { h: 10, minH: 10, maxH: 12, md: 12 },
  'suggestions-list': {  h: 7, minH: 7, maxH: 8, md: 12 },
}

// sample data
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
  headers: ['Date', 'Suggestions', 'Causes', 'Severity', 'Target'],
  data: [{
    // 'Date': 'Wed Jun 10 2020 20:47:39',
    // 'Suggestions': 'Too congested',
    // 'Causes': 'Type: Congestion',
    // 'Severity': () => (<Progress value={80} style={{height: '5px'}} color='danger' />),
    // 'Target': 'Area-05',
    'Date': '2020/6/19 金曜日 13:47:39',
    'Suggestions': '混雑度が一定水準を超えました',
    'Causes': 'タイプ: 混雑度',
    'Severity': () => (<Progress value={80} style={{ height: '5px' }} color='danger' />),
    'Target': 'エリア 05',
  }, {
    // 'Date': 'Wed Jun 10 2020 19:47:39',
    // 'Suggestions': 'Recommend to keep a social distance',
    // 'Causes': 'Type: Congestion',
    // 'Severity': () => (<Progress value={50} style={{height: '5px'}} color='yellow' />),
    // 'Target': 'Area-05',
    'Date': '2020/6/19 金曜日 13:30:39',
    'Suggestions': 'ソーシャルディスタンスの維持を推奨します',
    'Causes': 'タイプ: 混雑度',
    'Severity': () => (<Progress value={50} style={{ height: '5px' }} color='yellow' />),
    'Target': 'エリア 05',
  }, {
    // 'Date': 'Wed Jun 10 2020 19:37:39',
    // 'Suggestions': 'Few people wahsed their hands',
    // 'Causes': 'Type: Washing Hands Detection',
    // 'Severity': () => (<Progress value={90} style={{height: '5px'}} color='danger' />),
    // 'Target': 'Area-01',
    'Date': '2020/6/19 金曜日 12:43:54',
    'Suggestions': '手洗いを実施している来訪者が一定水準を下回りました',
    'Causes': 'タイプ: 手洗い検知',
    'Severity': () => (<Progress value={90} style={{ height: '5px' }} color='danger' />),
    'Target': 'エリア 01',
  }, {
    // 'Date': 'Wed Jun 10 2020 10:47:39',
    // 'Suggestions': 'Recommend to keep a social distance',
    // 'Causes': 'Type: Congestion',
    // 'Severity': () => (<Progress value={57} style={{height: '5px'}} color='yellow' />),
    // 'Target': 'Area-10',
    'Date': '2020/6/19 金曜日 10:27:19',
    'Suggestions': 'ソーシャルディスタンスの維持を推奨します',
    'Causes': 'タイプ: 混雑度',
    'Severity': () => (<Progress value={57} style={{ height: '5px' }} color='yellow' />),
    'Target': 'エリア 10',
  }, {
    // 'Date': 'Wed Jun 10 2020 01:47:39',
    // 'Suggestions': 'Recommend to keep a social distance',
    // 'Causes': 'Type: Congestion',
    // 'Severity': () => (<Progress value={51} style={{height: '5px'}} color='yellow' />),
    // 'Target': 'Area-14',
    'Date': '2020/6/19 金曜日 10:00:51',
    'Suggestions': 'ソーシャルディスタンスの維持を推奨します',
    'Causes': 'タイプ: 混雑度',
    'Severity': () => (<Progress value={51} style={{ height: '5px' }} color='yellow' />),
    'Target': 'エリア 14',
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
  minZoom: 4,
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

class DefaultDashboard extends React.Component {
  static propTypes = {
    fluid: PropTypes.bool,
  };

  static defaultProps = {
    fluid: false,
  }

  constructor(props) {
    super(props);

    this.state = {
      layouts: _.clone(LAYOUT),
    }
  }

  resetLayout = () => {
    this.setState({
      layouts: _.clone(LAYOUT)
    })
  }

  render() {
    const { fluid, t } = this.props;

    return (
      <React.Fragment>
        <Container fluid={ true }>
          <div className="d-flex mb-4">
            <HeaderMain title={t('menus:main.dashboard.title')} className='mb-3 mt-4' />
            <ButtonToolbar className='ml-auto'>
              <ButtonGroup className='mr-2'>
                <Button
                  color='link'
                  className='mb-2 text-decoration-none'
                  style={{'boxShadow': 'none'}}
                  onClick={this.resetLayout.bind(this)}
                >
                  {t('dashboard:toolbar.reset-layout')}
                </Button>
              </ButtonGroup>
            </ButtonToolbar>
          </div>
        </Container>
        <Grid
          className='mt-4'
          fluid={ fluid }
        >
          <Grid.Row
            onLayoutChange={ layouts => this.setState({ layouts }) }
            columnSizes={ this.state.layouts }
            rowHeight={ 55 }
          >
            <Grid.Col { ...(applyColumn('current-total-risks', this.state.layouts)) }>
              <Card>
                <CardHeader className='bb-0 pt-3 pb-0 bg-none' tag='h6'>
                  <i className='fa fa-ellipsis-v text-body mr-2'></i> <strong>{t('dashboard:current-total-risks.title')}</strong>
                </CardHeader>
                <CardBody className='pt-2'>
                  <div>
                    <p>{t('dashboard:current-total-risks.last-update')}: <strong>06-19-2020, 14:00:00 PM</strong></p>
                    <MediaDonutChart data={DonutData} />
                  </div>
                </CardBody>
                <CardFooter>
                  <Media className='small'>
                  <Media left>
                    <i className='fa fa-fw fa-info-circle mr-2'></i>
                  </Media>
                  <Media body>
                    <Link to='/analytics/areas'>
                      {t('dashboard:current-total-risks.view-details')}
                    </Link>
                  </Media>
                  </Media>
                </CardFooter>
              </Card>
            </Grid.Col>

            <Grid.Col { ...(applyColumn('time-line-total-risks', this.state.layouts)) }>
              <Card className='mb-3'>
                <CardHeader className='bb-0 pt-3 pb-0 bg-none' tag='h6'>
                  <i className='fa fa-ellipsis-v text-body mr-2'></i> <strong>{t('dashboard:time-line-total-risks.title')}</strong>
                </CardHeader>
                <CardBody className='pt-2'>
                  <div>
                    <p>{t('dashboard:time-line-total-risks.last-update')}: <strong>06-19-2020, 14:00:00 PM</strong></p>
                    <div className='d-flex justify-content-center'>
                      <LineAreaChart data={AreaData} />
                    </div>
                  </div>
                </CardBody>
                <CardFooter>
                  <Media className='small'>
                  <Media left>
                    <i className='fa fa-fw fa-info-circle mr-2'></i>
                  </Media>
                  <Media body>
                    <Link to='/analytics/areas'>
                      {t('dashboard:time-line-total-risks.view-details')}
                    </Link>
                  </Media>
                  </Media>
                </CardFooter>
              </Card>
            </Grid.Col>

            <Grid.Col {...(applyColumn('heatmap', this.state.layouts))}>
              <Card>
                <CardHeader className='bb-0 pt-3 pb-0 bg-none' tag='h6'>
                  <i className='fa fa-ellipsis-v text-body mr-2'></i> <strong>{t('dashboard:heatmap.title')}</strong>
                </CardHeader>
                <CardBody className='pt-2'>
                  <CardTitle className='mb-1 d-flex'>
                    <Button color='link' size='sm' className='pt-0 ml-auto' tag={Link} to='/analytics/areas'>
                      {t('dashboard:heatmap.view-details')} <i className='fa fa-angle-right'></i>
                    </Button>
                  </CardTitle>
                  <IndoorMap
                    config={MapConfig}
                    floorConfig={FloorMapConfig}
                    heatConfig={HeatMapConfig}
                    heatData={HeatData}
                    sliderConfig={SliderConfig}
                  />
                </CardBody>
              </Card>
            </Grid.Col>

            <Grid.Col { ...(applyColumn('suggestions-list', this.state.layouts)) }>
              <Card className="mb-3">
                <CardHeader className='bb-0 pt-3 pb-0 bg-none' tag='h6'>
                  <i className='fa fa-ellipsis-v text-body mr-2'></i> <strong>{t('dashboard:suggestions-list.title')}</strong>
                </CardHeader>
                <CardBody>
                  <CardTitle className='mb-1 d-flex'>
                    <Button color='link' size='sm' className='pt-0 ml-auto' tag={Link} to='/suggestions'>
                      {t('dashboard:suggestions-list.view-all')} <i className='fa fa-angle-right'></i>
                    </Button>
                  </CardTitle>
                  <EasyTable headers={SuggestionsData.headers} data={SuggestionsData.data} />
                </CardBody>
              </Card>
            </Grid.Col>

          </Grid.Row>
        </Grid>
      </React.Fragment>
    );
  }
}

const DefaultDashboardWithTranslation = withTranslation()(DefaultDashboard);
export { DefaultDashboardWithTranslation as DefaultDashboard };