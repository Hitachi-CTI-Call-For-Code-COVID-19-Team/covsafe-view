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
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Map, ImageOverlay, withLeaflet } from 'react-leaflet';
import { PingLayer } from 'react-leaflet-d3';
import Control from './CustomControl';
import Slider from 'rc-slider';
import classNames from 'classnames';
import HeatmapLayer from './HeatmapLayer';
import Fetch from '../../utils/fetch';

import classes from './IndoorMap.scss';

const WrappedPingLayer = withLeaflet(PingLayer);
const TipSlider = Slider.createSliderWithTooltip(Slider);

class IndoorMap extends React.Component {
  constructor(props) {
    super(props);

    const { style, config, floorConfig, heatConfig, pingConfig, sliderConfig, heatData } = this.props;

    // init map config
    const cnf = _.clone(config);
    cnf.width = style ? (style.width || '100%') : '100%';
    cnf.height = style ? (style.height || '100px') : '100px';
    cnf.lat = 0;
    cnf.lng = 0;
    cnf.zoom = 0;
    cnf.maxZoom = cnf.maxZoom || 10;
    cnf.minZoom = cnf.minZoom || 0;
    cnf.maxBounds = [[0, 0], [0, 0]];
    cnf.zoomControl = cnf.zoomControl === false ? false : true;
    cnf.scrollWheelZoom = cnf.scrollWheelZoom === false ? false : true;

    // initialize state
    this.state = {
      config: cnf,
      floorConfig: _.clone(floorConfig),
      heatConfig: _.clone(heatConfig),
      pingConfig: _.clone(pingConfig),
      sliderConfig: _.clone(sliderConfig),
      heatStatus: {
        current: 0,
        list: heatData.map(e => new Date(e.timestamp)),
      },
      heatData: heatData,
    };

    // set ping method
    if (pingConfig) {
      pingConfig.setMethod(this.ping.bind(this));
    }
  }

  _getCommonDivisor(a, b) {
    // FIXME: add the common divisor calculator
    if (a === 720 && b === 1280) {
      return [1, 2, 4, 5, 8, 10, 16, 20, 40, 80];
    } else if (a === 1080 && b === 1920) {
      return [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 24, 30, 40, 60, 120];
    } else if (a === 1080 && b === 1920) {
      return [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 384];
    } else if (a === 2160 && b === 3840) {
      return [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 30, 40, 48, 60, 80, 120, 240];
    } else if (a === 4320 && b === 7690) {
      return [1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 16, 20, 24, 30, 32, 40, 48, 60, 80, 96, 120, 160, 240, 480];
    } else if (a === 800 && b === 2000) {
      return [1, 2, 4, 5, 8, 10, 16, 20, 25, 40, 50, 80, 100, 200, 400];
    } else if (a === 1450 && b === 2000) {
      return [1, 2, 5, 10, 25, 50];
    }
  }

  _getDivisor(a, b, t) {
    const ary = this._getCommonDivisor(a, b);
    const min = Math.ceil(a / t);
    return ary.find(e => e > min);
  }

  componentDidMount() {
    // adjust map size
    const divisor = this._getDivisor(
      this.state.floorConfig.bounds[1][0],
      this.state.floorConfig.bounds[1][1],
      90
    );

    const ratio = this.state.floorConfig.bounds[1][0] / this.state.floorConfig.bounds[1][1];
    const cnf = _.clone(this.state.config);

    // update the height to fit map size
    cnf.height = this.map.container.offsetWidth * ratio;
    // new map size to fit the window size
    const devided = [
      cnf.height / divisor,
      // don't know why, but ImageOverlay changes the map size ratio
      this.map.container.offsetWidth / divisor * 1.024
    ];
    const bounds = [
      [-devided[0] / 2, -devided[1] / 2],
      [devided[0] / 2, devided[1] / 2],
    ];

    // init all params for map
    cnf.divisor = divisor;
    cnf.devided = devided;
    cnf.maxBounds = bounds;
    const flr = _.clone(this.state.floorConfig);
    flr.bounds = bounds;

    // re-calculate heat map data
    const heatData = this.state.heatData.map(t => {
      return {
        timestamp: t.timestamp,
        data: t.data.map(d => ([
          d[0] * devided[0] - (devided[0] / 2),
          d[1] * devided[1] - (devided[1] / 2),
          d[2]
        ])),
      };
    });

    // adjust radius of heat points
    const heat = _.clone(this.state.heatConfig);
    if (this.map.container.offsetWidth < 575.98) {
      heat.radius = 30;
    } else if (this.map.container.offsetWidth < 767.98) {
      heat.radius = 40;
    } else if (this.map.container.offsetWidth < 991.98) {
      heat.radius = 60;
    } else if (this.map.container.offsetWidth < 1024.98) {
      heat.radius = 75;
    } else {
      heat.radius = 100;
    }

    // not sure but leaflet doesn't reckon the state is updated at the timing the componentDidMount is called.
    setTimeout((that) => {
      that.setState({
        config: cnf,
        floorConfig: flr,
        heatConfig: heat,
        heatData: heatData,
      });

      // fit map into bounds
      that.map.leafletElement.invalidateSize();
      that.map.leafletElement.fitBounds(bounds);
    }, 100, this);
    
    console.log(`leaflet map will be drawn within [0, 0] and [${devided}] divided by ${divisor} zoomed by ${cnf.zoom}`);

    // fetch map floor data
    new Fetch(this.state.floorConfig.link.url, {
      method: this.state.floorConfig.link.options.method,
      headers: { ...this.state.floorConfig.link.options.headers, 'x-ibm-client-id': process.env.PUBLIC_API_KEY },
      body: this.state.floorConfig.link.options.body,
    })
      .fetch()
      .then(res => res.arrayBuffer())
      .then(buf => {
        const flr = this.state.floorConfig;
        flr.url = 'data:image/png;base64,' + btoa(String.fromCharCode(...new Uint8Array(buf)));
        this.setState({
          floorConfig: flr,
        });
      })
      .catch(err => {
        console.error(`cannot fetch floormap data: ${err}`);
      });

    // stop propagation for preventing the parent card moved
    // if (this.state.sliderConfig && this.state.heatStatus.list.length > 1) {
    //   L.DomEvent.disableClickPropagation(DOM.findDOMNode(this));
    // }
  }

  componentWillUnmount() {
  }

  onChange(evt) {
    const { list } = this.state.heatStatus;
    const idx = list.findIndex(e => e.toISOString() === (new Date(evt)).toISOString());
    if (idx === -1) {
      console.error('invalid value for timestamp of heatmap: ' + e);
      return;
    }

    this.setState({
      heatStatus: {
        current: idx,
        list: list,
      },
    });
  }

  ping(latlng) {
    if (!latlng) {
      return;
    }

    // switch lat/lng
    const ll = latlng.reduce((p, e, i) => {
      let ee = e * this.state.config.devided[i] - (this.state.config.devided[i] / 2);
      p[i ^ 1] = ee;
      return p;
    }, []);
    this.pingLayer.ping(ll, classNames(classes['ping']));

    // one more
    const id = setInterval((that, latlng) => {
      that.pingLayer.ping(latlng, classNames(classes['ping']));
      clearInterval(id);
    }, this.state.pingConfig.duration, this, ll);
  }

  render() {
    const { style, className } = this.props;
    const { config, floorConfig, heatConfig, pingConfig, sliderConfig, heatStatus, heatData } = this.state;

    return (
      <Map
        className={classNames(className)}
        ref={el => (this.map = el)}
        center={{ lat: config.lat, lng: config.lng }}
        zoom={config.zoom}
        maxZoom={config.maxZoom}
        minZoom={config.minZoom}
        dragging={config.dragging}
        maxBounds={config.maxBounds}
        zoomControl={config.zoomControl}
        scrollWheelZoom={config.scrollWheelZoom}
        style={{ width: config.width, height: config.height, ...(style || {})}}
        zoomSnap={0}
      >
        {
          floorConfig && floorConfig.url && (
            <ImageOverlay
              url={floorConfig.url}
              bounds={floorConfig.bounds}
            />
          )
        }
        {
          heatConfig && heatData.length && (
            <HeatmapLayer
              fitBoundsOnLoad={heatConfig.fitBoundsOnLoad}
              fitBoundsOnUpdate={heatConfig.fitBoundsOnUpdate}
              max={heatConfig.maxBounds}
              radius={heatConfig.radius}
              gradient={heatConfig.gradient}
              latitudeExtractor={ary => ary[0]}
              longitudeExtractor={ary => ary[1]}
              intensityExtractor={ary => parseFloat(ary[2])}
              points={heatData[heatStatus.current].data}
            />
          )
        }
        {
          pingConfig && (
            <WrappedPingLayer
              ref={el => (this.pingLayer = el)}
              duration={pingConfig.duration}
              fps={pingConfig.fps}
              radiusRange={pingConfig.radiusRange}
            />
          )
        }
        {
          (sliderConfig && heatData.length > 1) && (
            <Control position='bottomright'>
              <TipSlider
                className={classNames(classes['slider-area'])}
                min={heatStatus.list[heatStatus.list.length - 1].getTime()}
                max={heatStatus.list[0].getTime()}
                value={heatStatus.list[heatStatus.current].getTime()}
                step={heatStatus.list[0].getTime() - heatStatus.list[1].getTime()}
                dots={false}
                tipFormatter={value => (
                  `${(new Date(value)).toLocaleDateString('en-US')} ${(new Date(value)).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
                )}
                tipProps={{
                  placement: "top",
                  visible: true,
                  prefixCls: classNames(classes['slider-tooltip'], 'rc-slider-tooltip'),
                }}
                railStyle={{
                  height: '1rem',
                  borderRadius: 0,
                  backgroundColor: 'rgba(53, 53, 53, 0.29)'
                }}
                trackStyle={{
                  height: '1rem',
                  borderRadius: 0,
                  backgroundColor: 'rgb(38 147 241 / 91%)'
                }}
                handleStyle={{
                  borderRadius: 0,
                  height: '1.5rem',
                  backgroundColor: 'rgb(38 147 241 / 91%)',
                  borderColor: 'rgb(38 147 241 / 91%)'
                }}
                dotStyle={{ display: 'none' }}
                onChange={this.onChange.bind(this)}
                style={{
                  marginBottom: '3rem',
                  marginRight: '3rem'
                }}
              />
            </Control>
          )
        }
      </Map>
    )
  }
}

IndoorMap.propTypes = {
  config: PropTypes.exact({
    maxZoom: PropTypes.number,
    minZoom: PropTypes.number,
    dragging: PropTypes.bool,
    zoomControl: PropTypes.bool,
    scrollWheelZoom: PropTypes.bool,
  }),
  floorConfig: PropTypes.exact({
    link: PropTypes.shape({
      url: PropTypes.string.isRequired,
      method: PropTypes.string,
      body: PropTypes.string,
      headers: PropTypes.object,
    }),
    bounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  }),
  heatConfig: PropTypes.exact({
    fitBoundsOnLoad: PropTypes.bool,
    fitBoundsOnUpdate: PropTypes.bool,
    max: PropTypes.number,
    radius: PropTypes.number,
    gradient: PropTypes.object,
  }),
  heatData: PropTypes.arrayOf(PropTypes.exact({
    timestamp: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
  })).isRequired,
  pingConfig: PropTypes.exact({
    setMethod: PropTypes.func.isRequired,
    duration: PropTypes.number,
    fps: PropTypes.number,
    radiusRange: PropTypes.arrayOf(PropTypes.number),
  }),
  sliderConfig: PropTypes.exact({}),
};

export { IndoorMap };