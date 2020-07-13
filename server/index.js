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

// we are under assumption that server-app is created from server.js.
// in the generated file, the environement variables are replaced with actual values
// since the IBM Cloud Functions doesn't allow us to put our own environment variables.
// as well, they proposes to use the default parameters instead of env vars,
// for us, it doesn't work because we want to use env vars before getting the client requests.
const app = require('./server');
const forward = require('./expressjs-openwhisk')(app);

function main(request) {
  return forward(request);
}

module.exports = main;