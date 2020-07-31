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

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import menusEN from './locales/menus.en.json';
import menusJP from './locales/menus.jp.json';
import dashboardEN from './locales/dashboard.en.json';
import dashboardJP from './locales/dashboard.jp.json';
import analyticsEN from './locales/analytics.en.json';
import analyticsJP from './locales/analytics.jp.json';
import advUploaderEN from './locales/adv-uploader.en.json';
import advUploaderJP from './locales/adv-uploader.jp.json';
import defaultMessagesEN from './locales/default-messages.en.json';
import defaultMessagesJP from './locales/default-messages.jp.json';

const resources = {
  en: {
    menus: menusEN, dashboard: dashboardEN, analytics: analyticsEN, uploader: advUploaderEN,
    messages: defaultMessagesEN
  },
  jp: {
    menus: menusJP, dashboard: dashboardJP, analytics: analyticsJP, uploader: advUploaderJP,
    messages: defaultMessagesJP
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: ['en', 'jp'],
    // using translation files with deep structure
    keySeparator: '.',
    interpolation: {
      // react already safes from xss
      escapeValue: false
    },
    // lazy loading: yes
    react: {
      wait: true
    }
  });

export default i18n;

export function getLanguage(lng) {
  return lng === 'en' ? 'English' : lng === 'jp' ? '日本語' : 'Unknown';
}

export function getLocale(lng) {
  return lng === 'en' ? 'en-US' : lng === 'jp' ? 'ja-JP' : 'Unknown';
}