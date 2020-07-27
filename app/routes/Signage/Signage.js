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
import fetch from 'node-fetch';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Carousel } from 'react-responsive-carousel';

import { Loading } from './../../components/Loading/Loading';
import { Container, Row, Col, Media, Card, CardBody, CardImg, CardTitle } from './../../components';
import { withPageConfig } from './../../components/Layout/withPageConfig';
import { IndoorMap } from './../../components/Maps';
import i18n, { getLocale } from './../../i18n';
import converter from '../../utils/converter';

import '../../styles/components/override-carousel.scss';
import classes from './Signage.scss';
import faker from '../../utils/faker';

// constants
const now = new Date();
const DataURLs = [
  // map config
  '',
  // assets
  '',
  // congestion risks
  '',
  // messages
  '',
  // shop list
  '',
];

class Signage extends React.Component {
  static propTypes = {
    pageConfig: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      data: {
        mapConfig: null,
        assets: null,
        risks: null,
        messages: null,
        shops: null,
      },
    };
  }

  componentDidMount() {
    const { pageConfig } = this.props;
    
    pageConfig.setElementsVisibility({
      sidebarHidden: true,
      footerHidden: true,
    });

    // fetching data
    Promise.all(DataURLs.map(u => fetch(u)))
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(jsons => {
        this.setState({
          loading: false,
          data: {
            mapConfig: jsons[0],
            assets: jsons[1],
            risks: converter.risk.toHeat(jsons[1], jsons[0].map.floor.bounds[1], jsons[2]),
            messages: jsons[3],
            shops: jsons[4],
          },
        });
      })
      .catch(e => {
        // FIXME: switch fallback mode and remove interval part
        this.setState({
          loading: false,
          data: {
            mapConfig: faker.mapConfig,
            assets: faker.assets,
            risks: converter.risk.toHeat(
              faker.assets,
              faker.mapConfig.map.floor.bounds[1],
              faker.risks('congestion', now, new Date(now.getTime() - 1 * 60 * 60000), 60 * 60000),
            ),
            messages: faker.messages(now, 10),
            shops: faker.shops(10),
          },
        });
      });
  }

  componentWillUnmount() {
    const { pageConfig } = this.props;

    pageConfig.setElementsVisibility({
      sidebarHidden: false,
      footerHidden: false,
    });
  }

  goNext(idx) {
    if (this.state.data.messages[idx].location) {
      this.pingOnMap(converter.risk.toPing(
        this.state.data.messages[idx].location,
        this.state.data.mapConfig.map.floor.bounds[1],
      ));
    }
  }

  mkCarouselItem(key, { title, start, end, contents, image }) {
    const isAllDate = !start;
    const isSameDate = start && end && start.toLocaleDateString() === end.toLocaleDateString();
    const locale = getLocale(i18n.language);
    const startDate = isAllDate ? undefined : start.toLocaleDateString(locale);
    const startTime = isAllDate ? undefined : start.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    const endDate = isAllDate ? undefined : isSameDate ? '' : (end.toLocaleDateString(locale) + ' ');
    const endTime = isAllDate ? undefined : end.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    const date = isAllDate? 'All Day': `${startDate} ${startTime} - ${endDate}${endTime}`;
    return (
      <Card key={key} className="mb-3 bg-none" style={{ boxShadow: 'unset', border: '0px' }}>
        <CardBody>
          <Media>
            <Media body style={{ maxWidth: '60%' }}>
              <h1
                className="mt-3 d-flex fw-900 mb-2 text-white text-left"
                style={{ fontSize: '7vw' }}>
                {title}
              </h1>
              <h3
                className="d-flex fw-600 mb-2 text-white text-left"
                style={{ fontSize: '3vw' }} >
                {date}
              </h3>
              <h3
                className="fw-300 text-white text-justify text-left"
                style={{ fontSize: '2vw' }}>
                {contents}
              </h3>
            </Media>
            <Media right style={{ margin: 'auto', maxWidth: '40%' }}>
              <img className='img-fluid' src={image} />
            </Media>
          </Media>
        </CardBody>
      </Card>
    );
  }

  mkShopList(key, { name, image }) {
    return (
      <Col key={key} lg={3} md={4}>
        <Card className='mb-3'>
          <CardImg src={image} />
          <CardBody>
            <CardTitle className='h4 text-center fw-300'>{name}</CardTitle>
          </CardBody>
        </Card>
      </Col>
    );
  }

  render() {
    const { mapConfig, risks, messages, shops } = this.state.data;
    const interval = 10000;

    if (this.state.loading) {
      return (
        <Loading loading={this.state.loading} />
      );
    } else {
      return (
        <React.Fragment>
          <IndoorMap
            className={classNames(classes['full-container'])}
            config={{
              ...mapConfig.map.base,
              maxZoom: 10,
              minZoom: 1,
              dragging: false,
              zoomControl: false,
              scrollWheelZoom: false,
            }}
            floorConfig={{
              ...mapConfig.map.floor,
            }}
            heatConfig={{
              ...mapConfig.map.heat,
              radius: 100,
            }}
            heatData={risks}
            pingConfig={{
              ...mapConfig.map.ping,
              duration: interval / 2,
              setMethod: method => this.pingOnMap = method
            }}
            sliderConfig={{}}
            style={{ width: '100vw' }}
          />
          <Carousel
            className={classNames(classes['full-container-carousel'], 'mt-2 mb-5')}
            showThumbs={false}
            showStatus={false}
            infiniteLoop={true}
            autoPlay={true}
            interval={interval}
            onChange={this.goNext.bind(this)} >
              {
                messages.map((e, i) => (this.mkCarouselItem(i, e)))
              }
          </Carousel>
          <Container fluid={true}>
            <Row>
              <Col lg={12}>
                <div className='hr-text hr-text-center mt-2 mb-4 h1 fw-300'>
                  <span className={classNames(classes['subtitle'])}>Shop List</span>
                </div>
              </Col>
            </Row>
            <Row>
              {
                shops.map((e, i) => (this.mkShopList(i, e)))
              }
            </Row>
          </Container>
        </React.Fragment>
      );
    }
  }
}

const SignageWithConfig = withPageConfig(Signage);

export {
  SignageWithConfig as Signage
};
