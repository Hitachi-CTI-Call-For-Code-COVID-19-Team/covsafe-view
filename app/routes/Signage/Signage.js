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
import classNames from 'classnames';
import { Carousel } from 'react-responsive-carousel';

import { Loading } from './../../components/Loading/Loading';
import { Container, Row, Col, Media, Card, CardBody, CardImg, CardTitle } from './../../components';
import { withPageConfig } from './../../components/Layout/withPageConfig';
import { IndoorMap } from './../../components/Maps';
import i18n, { getLocale } from './../../i18n';
import Fetch from '../../utils/fetch';
import converter from '../../utils/converter';
import defaultMessages from '../../data/default-messages';

import '../../styles/components/override-carousel.scss';
import classes from './Signage.scss';

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
  // shop list
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.SHOPS_DB,
      query: {
        selector: {},
        fields: ['name', 'image'],
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
  // ads
  new Fetch(process.env.PUBLIC_API_DOCS, {
    method: 'post',
    headers: { 'content-type': 'application/json', 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
    body: JSON.stringify({
      dbname: process.env.ADVERTISEMENT_DB,
      query: {
        selector: {
          'start': {
            '$gt': new Date(now.getTime() - 1000 * 60 * 60 * 5).toISOString()
          }
        },
        fields: ['title', 'start', 'end', 'contents', 'image', 'media'],
        // sort: [{ 'start': 'asc' }],
        limit: 10,
      }
    }),
  }),
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
        shops: null,
        risks: null,
        messages: null,
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
    Promise.all(Links.map(l => l.fetch()))
      .then(responses => Promise.all(responses.map(res => res.json())))
      .then(responses => Promise.all(responses.map(res => res.docs)))
      .then(responses => {
        if (responses.slice(0, 3).some(e => e.length === 0)) {
          throw new Error('some of configuration data from back-end are empty');
        }
        return responses;
      })
      .then(jsons => {
        this.setState({
          data: {
            mapConfig: jsons[0][0],
            assets: jsons[1],
            shops: jsons[2],
            risks: converter.risk.toHeat(jsons[1], jsons[0][0].map.floor.bounds[1], jsons[3]),
            messages: !jsons[4].length ? defaultMessages : defaultMessages.concat(jsons[4]),
          },
        });

        // load static files
        const statics = this.state.data.shops.concat(this.state.data.messages);
        const fetchers = statics.map(e => new Fetch(e.image.url, {
          method: e.image.options.method,
          headers: { ...e.image.options.headers, 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
          body: e.image.options.body,
        }));
        Promise.all(fetchers.map(f => f.fetch()))
          .then(responses => Promise.all(responses.map(res => res.arrayBuffer())))
          .then(buffers => {
            statics.forEach((f, i) => {
              // FIXME: support other than png
              f.imagesrc = 'data:image/png;base64,' +
                btoa(new Uint8Array(buffers[i]).reduce((p, b) => p + String.fromCharCode(b), ''));
            });
            this.setState({
              loading: false,
            });
          })
          .catch(err => {
            console.error(`cannot fetch static files: ${err}`);
          });
      })
      .catch(e => {
        console.error(`cannot fetch backend data ${e}`);
        // this.setState({
        //   loading: false,
        //   data: {
        //     mapConfig: faker.mapConfig,
        //     assets: faker.assets,
        //     risks: converter.risk.toHeat(
        //       faker.assets,
        //       faker.mapConfig.map.floor.bounds[1],
        //       faker.risks('congestion', now, new Date(now.getTime() - 1 * 60 * 60000), 60 * 60000),
        //     ),
        //     messages: faker.messages(now, 10),
        //     shops: faker.shops(10),
        //   },
        // });
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

  mkCarouselItem(key, { title, start, end, contents, imagesrc }) {
    const isAllDate = !start || !end;
    start = isAllDate ? undefined : new Date(start);
    end = isAllDate ? undefined : new Date(end);
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
              <img className='img-fluid' src={imagesrc} />
            </Media>
          </Media>
        </CardBody>
      </Card>
    );
  }

  mkShopList(key, { name, imagesrc }) {
    return (
      <Col key={key} lg={3} md={4}>
        <Card className='mb-3'>
          <CardImg src={imagesrc} />
          <CardBody>
            <CardTitle className='h4 text-center fw-300'>
              <span className="fa-stack mr-2 mb-1" style={{ color: 'rgb(4 142 212 / 90%)'}}>
                <i className="fa fa-circle fa-stack-2x"></i>
                <i className="fa fa-inverse fa-stack-1x">{key + 1}</i>
              </span>
              <span>{name}</span>
            </CardTitle>
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
