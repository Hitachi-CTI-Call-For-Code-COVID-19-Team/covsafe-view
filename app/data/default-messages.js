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

import i18n from './../i18n';

export default [{
  title: i18n.t('messages:title01'),
  start: undefined,
  end: undefined,
  contents: i18n.t('messages:contents01'),
  image: {
    url: process.env.PUBLIC_API_FILES,
    options: {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: `{"bucket": "${process.env.STATIC_FILES_BUCKET}", "key": "room-in-mind.png"}`,
    }
  },
}, {
  title: i18n.t('messages:title02'),
  start: undefined,
  end: undefined,
  contents: i18n.t('messages:contents02'),
  image: {
    url: process.env.PUBLIC_API_FILES,
    options: {
      method: 'post',
      headers: {
        'content-type': 'application/json',
      },
      body: `{"bucket": "${process.env.STATIC_FILES_BUCKET}", "key": "wash-your-hands.png"}`,
    },
  },
}];
