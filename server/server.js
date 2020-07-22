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

const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;

const ROOT_PATH = process.env.BASE_PATH || '/';
const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET || '3e6d423e-bcc9-4af4-adc8-945c2d56585f',
  resave: false,
  // when using HTTPS (API Gateway), should be true
  cookie: { secure: process.env.COOKIE_SECURE }
}));

// add passport with App ID into express pipeline
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((user, cb) => cb(null, user));
passport.use(new WebAppStrategy({ 
  tenantId: process.env.TENANT_ID,
  clientId: process.env.CLIENT_ID,
  secret: process.env.SECRET,
  oauthServerUrl: process.env.OAUTH_SERVER_URL,
  redirectUri: process.env.REDIRECT_URI
}));

// login endpoint
app.get('/login', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
  forceLogin: false
}));
// callback to finish the authorization process
app.get('/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME, {
  successRedirect: ROOT_PATH
}));
// logout endpoint
app.get('/logout', (req, res) => {
  WebAppStrategy.logout(req);
  res.redirect(ROOT_PATH);
});

// front-end
// we have a plan to use IBM Cloud Cloud Functions
// so that we might not be supposed to use SSR with `ReactDOMServer.renderToNodeStream`
// because a container on the Cloud Functions might create DOM when getting every requests,
// which maybe causes performance degradation.
app.use(express.static(__dirname + '/dist'));

const getContents = (req, res) => {
  let base = req.originalUrl === '/' ? 'index.html' : req.originalUrl.slice(1);
  let file = path.resolve(__dirname, '../dist', base);

  // no need to be wrapped since existsSync wraps try/catch inside of itself
  if (fs.existsSync(file)) {
    return res.sendFile(file);
  }
  // if existing files are not, send index
  return res.sendFile(path.resolve(__dirname, '../dist/', 'index.html'));
};

// manager contents requires authentication
app.get(/\/((dashboard|analytics|suggestions|user|uploader)(\/.*)*)*$/,
  passport.authenticate(WebAppStrategy.STRATEGY_NAME), getContents);

// not need authentication on signage mode
app.get('/*', getContents);


// as well, because of using the Cloud Functions,
// only when this is called directly, listen the port. in another case, export an express app
if (require.main === module) {
  app.listen(process.env.PORT, () => console.log(`listening at http://0.0.0.0:${process.env.PORT}`));
} else {
  module.exports = app;
}
