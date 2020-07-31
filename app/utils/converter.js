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
import { Progress } from './../components';
import i18n from './../i18n';

// calculate mean from data with the same timestamp
// @data {Array} is array containing risk values which the backend pushes
function mean(data) {
  const average = data.reduce((p, d) => {
    if (!p.length) {
      p.push({
        timestamp: d.timestamp,
        value: d.risk.value,
        count: 1,
      });
    } else {
      const last = p[p.length - 1];

      if (last.timestamp === d.timestamp) {
        last.value = (last.value * last.count + d.risk.value) / (last.count + 1);
        last.count++;
      } else if (last.timestamp !== d.timestamp) {
        p.push({
          timestamp: d.timestamp,
          value: d.risk.value,
          count: 1,
        });
      }
    }
    return p;
  }, []);

  return average.map(a => ({
    timestamp: a.timestamp,
    risk: {
      value: Math.floor(a.value * 100) / 100,
      cumValue: 0,
      level: level(a.value),
      type: data[0].risk.type,
    }
  }));
}

// convert data to one that the heatmap can understand.
// @data {Array} is array containing risk values which the backend pushes
function toHeat(assets, bounds, data) {
  return data.reduce((p, d) => {
    const asset = assets.find(a => a.id === d.id);

    function centered() {
      return [[
        (asset.mapCoordinate.lat + asset.mapCoordinate.height / 2) / bounds[0],
        (asset.mapCoordinate.lng + asset.mapCoordinate.width / 2) / bounds[1],
        d.risk.value
      ]];
    }

    if (!p.length) {
      p.push({
        timestamp: d.timestamp,
        data: centered(),
      });
    } else {
      const last = p[p.length - 1];

      if (last.timestamp === d.timestamp) {
        last.data = last.data.concat(centered());
      } else if (last.timestamp !== d.timestamp) {
        p.push({
          timestamp: d.timestamp,
          data: centered(),
        });
      }
    }
    return p;
  }, []);
}

function toPing(latlng, bounds) {
  return [latlng[0] / bounds[0], latlng[1] / bounds[1]];
}

function toSuggestion(template, data) {
  return data.map(d => {
    const tmpl = template.language.notifications[i18n.language][d.code.target][d.code.kind][d.code.number];

    return {
      timestamp: d.timestamp,
      suggestion: Object.keys(d.variables).reduce((p, v) => {
        p = p.replace(new RegExp('\{(' + v + ')\}'), d.variables[v]);
        return p;
      }, tmpl),
      causes: d.causes,
      severity: () => (
        <Progress
          value={d.level === 'H' ? 80 : d.level === 'A' ? 50 : 20}
          slim
          color={d.level === 'H' ? 'danger' : d.level === 'A' ? 'yellow' : 'green'} />),
      target: d.id,
    };
  });
}

function level(val) {
  return val > 0.7 ? 'H' : val > 0.4 ? 'A' : 'L';
}

// data converter from backend data format to frontend format
const risk = {
  mean,
  toHeat,
  toPing,
  toSuggestion,
};

export default { risk };