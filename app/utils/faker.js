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

const assets = require('../data/assets.json');

function totalRisks(from, to, window) {
  const dates = [];

  for (let d = from; d > to; d = new Date(d.getTime() - window)) {
    dates.push(d);
  }

  return dates.map(d => {
    const val = Math.floor(Math.random() * 100) / 100;

    return {
      timestamp: d.toISOString(),
      risk: {
        value: val,
        cumValue: 0,
        level: level(val),
        type: 't',
      }
    };
  });
};

function risks(typ, from, to, window) {
  const dates = [];

  for (let d = from; d > to; d = new Date(d.getTime() - window)) {
    dates.push(d);
  }

  return dates.reduce((p, d) => {
    p = p.concat(assets.filter(a => a.doc.id.startsWith(typ)).map(a => {
      let val = Math.floor(Math.random() * 100) / 100;
      if (typ === 'congestion' && a.doc.settings.coef) {
        val = Math.floor(Math.min(val * (1 + a.doc.settings.coef), 0.999) * 100) / 100;
      }

      return {
        timestamp: d.toISOString(),
        id: a.doc.id,
        risk: {
          value: val,
          cumValue: 0,
          level: level(val),
          type: type(typ)
        }
      };
    }));

    return p;
  }, []);
};

function level(val) {
  return val > 0.7 ? 'H' : val > 0.4 ? 'A' : 'L';
}

function type(t) {
  return t.charAt(0);
}

export default { assets, totalRisks, risks };