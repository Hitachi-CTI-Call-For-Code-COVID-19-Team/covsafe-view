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

import fakerUS from 'faker/locale/en_US';
import fakerJA from 'faker/locale/ja';
import i18n, { getLocale } from '../i18n';

const assets = require('../data/assets.json');

const mapConfig = require('../data/map-config.json');

const template = require('../data/notification-template.json');

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
    p = p.concat(assets.filter(a => a.id.startsWith(typ)).map(a => {
      let val = Math.floor(Math.random() * 100) / 100;
      if (typ === 'congestion') {
        val = Math.floor(Math.min(val + a.settings.coef, 0.99) * 100) / 100;
      }

      return {
        timestamp: d.toISOString(),
        id: a.id,
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

function messages(now, num) {
  // 2 information, and others
  const mess = [{
    title: 'Room in Mind',
    start: undefined,
    end: undefined,
    contents: 'Experts agree it’s best to avoid large crowds or crowded places for reduce the virus infection risk as well as to live with room in your mind.',
    image: require('../images/pics/crowded.jpg'),
  }, {
    title: 'Keep Clean',
    start: undefined,
    end: undefined,
    contents: 'Wash your hands, which not only lets you disinfected but also makes your mind relaxed.',
    image: require('../images/pics/disinfection.jpg'),
  }];

  const titles = [
    '50% Discount', 'Final Sales', 'Start Here', 'Dress It Up', 'Get Plus One',
    'Season Begins', 'Now On Sale', 'Buy You Want', 'Hungry?', 'Spend Your Money'
  ];
  const categories = [
    'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people',
    'nature', 'sports', 'technics', 'transport'
  ];

  const areas = assets
    .filter(e => e.id.startsWith('congestion'))
    .filter(e => e.settings.coef === 0.1)
    .filter(e => e.belongs === 'imaginary-shopping-mall-1st-floor');

  for (let i = 0; i < num - 2; i++) {
    mess.push({
      title: titles[Math.floor(Math.random() * titles.length)],
      start: now,
      end: new Date(now.getTime() + Math.floor(Math.random() * 1000 * 60 * 60 * 8)),
      contents: (i18n.language === 'en' ? fakerUS : fakerJA).lorem.sentences(),
      image: (i18n.language === 'en' ? fakerUS : fakerJA).image[
        categories[Math.floor(Math.random() * categories.length)]
      ](),
      location: (() => {
        const coor = areas[Math.floor(Math.random() * areas.length)].mapCoordinate;
        return [coor.lat, coor.lng];
      })(),
    });
  }

  return mess;
}

function shops(num) {
  const shop = [];
  const categories = [
    'abstract', 'animals', 'business', 'cats', 'city', 'food', 'nightlife', 'fashion', 'people',
    'nature', 'sports', 'technics', 'transport'
  ];
  for (let i = 0; i < num; i++) {
    shop.push({
      name: (i18n.language === 'en' ? fakerUS : fakerJA).company.companyName(),
      image: (i18n.language === 'en' ? fakerUS : fakerJA).image[
        categories[Math.floor(Math.random() * categories.length)]
      ](),
    });
  }
  return shop;
}

function notifications(num, from, to, window) {
  const dates = [];

  for (let d = from; d > to; d = new Date(d.getTime() - window)) {
    dates.push(d);
  }

  const n = num / dates.length;
  return dates.reduce((p, d) => {
    const ntf = [];
    for (let i = 0; i < n; i++) {
      let target = ['forCustomers', 'toStaff', 'toManager'][Math.floor(Math.random() * 3)];
      let kind = target === 'forCustomers' ? 'generic' : 
        target === 'toStaff' ? ['staff', 'area', 'toilet', 'garbage', 'handwash'][Math.floor(Math.random() * 5)] :
        target === 'toManager' ? ['area', 'time', 'staff'][Math.floor(Math.random() * 3)] : '';
      const numbers = Object.keys(template.language.notifications[i18n.language][target][kind]);
      let number = numbers[Math.floor(Math.random() * numbers.length)];
      let tmpl = [...template.language.notifications[i18n.language][target][kind][number].matchAll(/\{([a-zA-Z0-9]+)\}/g)];

      ntf.push({
        id: assets[Math.floor(Math.random() * assets.length)].id,
        timestamp: d.toLocaleString(getLocale(i18n.language)),
        causes: (i18n.language === 'en' ? fakerUS : fakerJA).hacker.phrase(),
        code: {
          target: target,
          kind: kind,
          number: number,
        },
        variables: (() => {
          return tmpl.reduce((pp, t) => {
            pp[t[1]] = (i18n.language === 'en' ? fakerUS : fakerJA).company.bsNoun();
            return pp;
          }, {});
        })(),
        level: ['H', 'A', 'L'][Math.floor(Math.random() * 3)],
      });
    }

    p = p.concat(ntf);
    return p;
  }, []);
}

export default { assets, mapConfig, template, totalRisks, risks, messages, shops, notifications };