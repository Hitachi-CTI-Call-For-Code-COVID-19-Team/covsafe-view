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

function toHeat(assets, bounds, data) {
  return data.reduce((p, d) => {
    const asset = assets.find(a => a.doc.id === d.id);

    function centered() {
      return [[
        (asset.doc.mapCoordinate.lat + asset.doc.mapCoordinate.height / 2) / bounds[0],
        (asset.doc.mapCoordinate.lng + asset.doc.mapCoordinate.width / 2) / bounds[1],
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

function level(val) {
  return val > 0.7 ? 'H' : val > 0.4 ? 'A' : 'L';
}

export default { mean, toHeat };