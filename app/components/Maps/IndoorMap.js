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
import DOM from 'react-dom';
import _ from 'lodash';
import PropTypes from 'prop-types';
import L from 'leaflet';
import { Map, ImageOverlay, withLeaflet } from 'react-leaflet';
import { PingLayer } from 'react-leaflet-d3';
import Control from './CustomControl';
import Slider from 'rc-slider';
import classNames from 'classnames';
import HeatmapLayer from './HeatmapLayer';

import classes from './IndoorMap.scss';

const WrappedPingLayer = withLeaflet(PingLayer);
const TipSlider = Slider.createSliderWithTooltip(Slider);

class IndoorMap extends React.Component {
  constructor(props) {
    super(props);

    const { config, floorConfig, heatConfig, pingConfig, sliderConfig, heatData } = this.props;

    // set tentative height
    const cnf = _.clone(config);
    cnf.height = '444px';

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
    };

    // set ping method
    if (pingConfig) {
      pingConfig.setMethod(this.ping.bind(this));
    }
  }

  _getCommonDivisor(a, b) {
    // FIXME: return common divisor for 1920 x 768
    return [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 384];
  }

  _getDivisor(a, b, t) {
    const ary = this._getCommonDivisor(a, b);
    const min = Math.floor(a / t);
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
    const height = Math.ceil(this.container.container.offsetWidth * ratio);
    const devided = [
      Math.ceil(height / divisor),
      Math.ceil(this.container.container.offsetWidth / divisor)
    ];

    cnf.maxBounds = [
      [0, 0],
      _.clone(devided),
    ];
    const flr = _.clone(this.state.floorConfig);
    flr.bounds = [
      [0, 0],
      _.clone(devided),
    ];

    // window height will be adjusted by factor
    cnf.height = height * this.state.config.heightFactor;

    this.setState({
      config: cnf,
      floorConfig: flr,
    });
    console.log(`leaflet map will be drawn within [0, 0] and [${devided}]`);

    // stop propagation for preventing the parent card moved
    // if (this.state.sliderConfig && this.state.heatStatus.list.length > 1) {
    //   L.DomEvent.disableClickPropagation(DOM.findDOMNode(this));
    // }
    // L.DomEvent.disableClickPropagation(this.state.ref.current.container);
    // console.log('-=-f=d-fa=d-a=-=-=-df=ad-fa=');
    // const cntl = this.container.props.children.find(e => e && e.props && e.props.position && e.props.position == 'bottomright');
    // const clone = React.cloneElement(cntl.props.children);
    // console.log(DOM.findDOMNode(clone));
    // console.log(DOM.findDOMNode(this));
    // console.log(DOM.findDOMNode(this).querySelector('.leaflet-map-pane'));
    // console.log(DOM.findDOMNode(this).querySelector('.leaflet-control-container'));
    // L.DomEvent.disableClickPropagation(DOM.findDOMNode(this).querySelector('.leaflet-map-pane'));
    // L.DomEvent.disableClickPropagation(DOM.findDOMNode(this).querySelector('.leaflet-control-container'));
    // DOM.findDOMNode(this).addEventListener('click', (e) => {
    //   e.stopPropagation();
    // });
    // DOM.findDOMNode(this).addEventListener('mousedown', (e) => {
    //   e.stopPropagation();
    // });
    // DOM.findDOMNode(this).addEventListener('mousemove', (e) => {
    //   e.stopPropagation();
    // });
    // DOM.findDOMNode(this).addEventListener('mouseup', (e) => {
    //   e.stopPropagation();
    // });
    // L.DomEvent.on(DOM.findDOMNode(this), 'mousemove', L.DomEvent.stopPropagation);
    // L.DomEvent
    //   .disableClickPropagation(this.state.ref)
    //   .disableScrollPropagation(this.state.ref)
    // L.DomEvent.on(L.DomUtil.get(this.state.ref), 'mousedown', () => {});
  }

  componentWillUnmount() {
    // DOM.findDOMNode(this).removeEventListener('mousedown', (e) => {
    //   e.stopPropagation();
    // });
    // DOM.findDOMNode(this).removeEventListener('mousemove', (e) => {
    //   e.stopPropagation();
    // });
    // DOM.findDOMNode(this).removeEventListener('mouseup', (e) => {
    //   e.stopPropagation();
    // });
    // DOM.findDOMNode(this).removeEventListener('click', (e) => {
    //   e.stopPropagation();
    // });
    // L.DomEvent.off(L.DomUtil.get(this.state.ref.current), 'mousedown', L.DomEvent.stopPropagation);
    // L.DomEvent.off(L.DomUtil.get(this.state.ref), 'mousedown', () => {});
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

    const ll = latlng.reduce((p, e, i) => {
      p[i ^ 1] = e;
      return p;
    }, []);
    this.pingLayer.ping(ll, classNames(classes['ping']));

    // one more
    const id = setInterval((that, latlng) => {
      that.pingLayer.ping(latlng, classNames(classes['ping']));
      clearInterval(id);
    }, this.state.pingConfig.duration * 2, this, ll);
  }

  render() {
    const { heatData } = this.props;
    const { config, floorConfig, heatConfig, pingConfig, sliderConfig, heatStatus } = this.state;

    return (
      <Map
        ref={el => (this.container = el)}
        center={{ lat: config.lat, lng: config.lng }}
        zoom={config.zoom}
        maxZoom={config.maxZoom}
        minZoom={config.minZoom}
        dragging={config.dragging}
        maxBounds={config.maxBounds}
        zoomControl={config.zoomControl}
        attributionControl={false}
        style={{ width: '100%', height: config.height}}
      >
        <ImageOverlay
          url={floorConfig.url}
          bounds={floorConfig.bounds}
        />
        {
          heatConfig && (
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
                // marks={{
                //   number: {
                //     style: {
                //       marginTop: '0.5rem',
                //     },
                //     label: `${value}`
                //   },
                // }}
                min={heatStatus.list[heatStatus.list.length - 1].getTime()}
                max={heatStatus.list[0].getTime()}
                value={heatStatus.list[heatStatus.current].getTime()}
                step={heatStatus.list[0].getTime() - heatStatus.list[1].getTime()}
                dots={false}
                tipFormatter={value => (
                  `${(new Date(value)).toLocaleDateString('ja-JP')} ${(new Date(value)).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}`
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
                  backgroundColor: 'rgba(255, 11, 11, 0.64)'
                }}
                handleStyle={{
                  borderRadius: 0,
                  height: '1.5rem',
                  backgroundColor: 'rgba(218, 50, 50, 0.88)',
                  borderColor: 'rgba(218, 50, 50, 0.88)'
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
    heightFactor: PropTypes.number,
    lat: PropTypes.number.isRequired,
    lng: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
    maxZoom: PropTypes.number.isRequired,
    minZoom: PropTypes.number.isRequired,
    dragging: PropTypes.bool.isRequired,
    maxBounds: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    zoomControl: PropTypes.bool.isRequired,
  }),
  floorConfig: PropTypes.exact({
    url: PropTypes.string.isRequired,
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