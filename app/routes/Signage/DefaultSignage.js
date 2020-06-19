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
import i18n from 'i18next';
import PropTypes from 'prop-types';
import BarLoader from 'react-spinners/BarLoader';
import { css } from "@emotion/core";
import { withPageConfig } from './../../components/Layout/withPageConfig';
import { Container, Row, Col } from './../../components';
import { IndoorMap } from './../../components/Maps';
import { TimelineDefault } from './../components/Timeline/TimelineDefault';
import { HeaderMain } from './../components/HeaderMain';
import VerticalCarousel from './../../components/Carousel/VerticalCarousel';

const override = css`
  display: block;
  margin: 0 auto;
`;

// dummy data
const MapConfig = {
  heightFactor: 2,
  lat: 9,
  lng: 10,
  zoom: 5,
  maxZoom: 5,
  minZoom: 5,
  dragging: true,
  maxBounds: [
    [0, 0],
    [768, 1920]
  ],
  zoomControl: false,
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
    ...points('vertical', 4, 6, 11, 0.5, 0.74),
    // 9-10 holizonal line
    ...points('holizonal', 6, 5, 10, 0.2, 1),
    // // casher-10 holizonal line
    ...points('holizonal', 11, 5, 10, 1, 0.3),
    // // event-space vertical line
    ...points('vertical', 20, 2, 5, 0.5, 0.74),
    // // restroom vertical line
    ...points('vertical', 1, 12, 15, 0.5, 0.74),
  ],
}];

const PingMapConfig = {
  duration: 1800,
  fps: 100,
  radiusRange: [3, 50]
};

const SIGNAGE_DATA = [{
  time: '2020-06-19T10:00:00+09:00',
  title: 'お買い物をより快適に',
  subtitle: 'nonowa国立からのお知らせ',
  lead: 'いつもnonowa国立をご利用いただきありがとうございます。',
  content: '現在，お客様に安心して快適にお買い物頂けるよう，モール内の混雑度を測定する機器を導入し，実証実験を実施中です。',
  color: 'primary',
  icon: 'comment',
  map: {
    location: null,
  },
}, {
  time: '2020-06-19T15:10:12+09:00',
  title: 'マルシェ からのお知らせ',
  subtitle: 'エリア 10',
  lead: '現在3番レジが比較的空いています',
  content: 'その他，ご不明点ありましたらサービスカウンターまで起こしください。',
  color: 'primary',
  icon: 'envelope',
  map: {
    location: [9, 8],
  },
}, {
  time: '2020-06-19T15:00:00+09:00',
  title: 'Event Shop 2 からのお知らせ',
  subtitle: 'エリア 23',
  lead: '期間限定の食物販催事を開催しています。',
  content: '',
  color: 'info',
  logo: require('../../images/shops/23-event-shop-2.jpg'),
  map: {
    location: [9, 17],
  },
}, {
  time: '2020-06-19T16:00:00+09:00',
  title: 'ぐぅ からのお知らせ',
  subtitle: 'エリア 6',
  lead: '今なら食べ逃したランチがお買い得です。',
  content: 'お急ぎのお客様とひと休みをしたいお客様へ『ＷＡ和』のファーストフードでご提供します。',
  color: 'info',
  logo: require('../../images/shops/06-guu.jpg'),
  map: {
    location: [9, 22],
  },
}, {
  time: '2020-06-19T17:00:00+09:00',
  title: 'とんかつ 新宿さぼてん からのお知らせ',
  subtitle: 'エリア 14',
  lead: '少し早めの夕食をいかがでしょうか？',
  content: 'とんかつ専門店のさぼてんです。ロースかつやヒレかつ、毎月登場する期間限定商品など多数取り揃えています。',
  color: 'info',
  logo: require('../../images/shops/14-tonkatsu-saboten.jpg'),
  map: {
    location: [4, 16],
  },
}, {
  time: '2020-06-19T18:00:00+09:00',
  title: 'おぼん de ごはん からのお知らせ',
  subtitle: 'エリア 3',
  lead: '少し早めの夕食をいかがでしょうか？',
  content: 'バランスの良い手作り料理をカフェスタイルで。メイン料理２０種類以上の中から選べ飽きないメニューです。',
  color: 'info',
  logo: require('../../images/shops/03-obon-de-gohan.jpg'),
  map: {
    location: [13, 13],
  },
}, {
  time: '2020-06-19T15:00:00+09:00',
  title: 'ザ・ガーデン自由が丘 からのお知らせ',
  subtitle: 'エリア 2',
  lead: 'かまくらカスターを今なら5%引きです。',
  content: '定番人気のカスタード，チョコレートをはじめとして，抹茶，白桃，焦がしキャラメルをご用意しています。',
  color: 'info',
  logo: require('../../images/shops/02-the-garden.jpg'),
  map: {
    location: [13, 8],
  },
}];

class DefaultSignage extends React.Component {
  static propTypes = {
    pageConfig: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      data: null,
      slides: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { pageConfig } = this.props;
    
    pageConfig.setElementsVisibility({
      sidebarHidden: true
    });

    // fetching data
    fetch(`${process.env.API_URL || ''}/api/signage?locale=${i18n.language}`)
      .then(res => res.json())
      .then(json => {
        this.setState({
          data: json,
          loading: false,
          slides: json.map((e, i) => ({
            key: i,
            content: (
              <TimelineDefault
                asSignage={true}
                smallIconColor={e.color}
                iconCircleColor={e.color}
                iconCircle={e.icon}
                // should get data from BE
                logo={e.logo}
                time={new Date(e.time)}
                title={e.title}
                subtitle={e.subtitle}
                lead={e.lead}
                content={e.content}
              />
            )
          }))
        });
      })
      .catch(e => {
        // FIXME: switch fallback mode and remove interval part
        this.setState({
          data: SIGNAGE_DATA,
          loading: false,
          slides: SIGNAGE_DATA.map((e, i) => ({
            key: i,
            content: (
              <TimelineDefault
                asSignage={true}
                smallIconColor={e.color}
                iconCircleColor={e.color}
                iconCircle={e.icon}
                logo={e.logo}
                time={new Date(e.time)}
                title={e.title}
                subtitle={e.subtitle}
                lead={e.lead}
                content={e.content}
              />
            )
          }))
        });
      });
  }

  componentWillUnmount() {
    const { pageConfig } = this.props;

    pageConfig.setElementsVisibility({
      sidebarHidden: false
    });
  }

  goNext() {
    const current = this.state.current >= this.state.data.length - 1 ? 0 : ++this.state.current;
    this.setState({
      current,
    });
    this.pingOnMap(this.state.data[current].map.location);
  }

  render() {
    if (this.state.loading) {
      return (
        <div className='mt-5'>
          <BarLoader
            css={override}
            width={150}
            color={'#999999'}
            loading={this.state.loading}
          />
          <div className='text-center mt-4'>
            Please Wait. Loading...
          </div>
        </div>
      );
    } else {
      return (
        <Container fluid={false}>
          <Row>
            <Col lg={ 12 }>
              <HeaderMain
                title={this.state.data[this.state.current].title}
                subTitle={this.state.data[this.state.current].lead}
                className='mb-4 mb-lg-5 pb-5'
              />
            </Col>
          </Row>
          <Row>
            <Col lg={ 6 } style={{margin: 'auto'}}>
              <IndoorMap
                config={MapConfig}
                floorConfig={FloorMapConfig}
                heatConfig={HeatMapConfig}
                heatData={HeatData}
                pingConfig={{
                  ...PingMapConfig,
                  setMethod: method => this.pingOnMap = method
                }}
              />
            </Col>
            <Col lg={ 6 }>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  width: '100%',
                  height: '100%',
                  margin: '0 auto',
                }}
              >
                <VerticalCarousel
                  slides={this.state.slides}
                  autoPlay={7000}
                  autoPlayEventLisner={this.goNext.bind(this)}
                  offsetRadius={3}
                  showNavigation={false}
                  allowKeyOperation={true}
                />
              </div>
            </Col>
          </Row>
        </Container>
      );
    }
  }
}

const DefaultSignageWithConfig = withPageConfig(DefaultSignage);

export {
  DefaultSignageWithConfig as DefaultSignage
};
