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

import fetch from 'node-fetch';

class Fetch {
  constructor(url, {method, headers, body}) {
    this.url = url;
    this.method = method || 'get';
    this.headers = headers || {};
    this.body = body || undefined;
  }

  fetch() {
    return fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body,
    })
    .then(res => {
      // res.status >= 200 && res.status < 300
      if (res.ok) {
        return res;
      } else {
        throw new Error(res.statusText);
      }
    });
  }
}

export default Fetch;