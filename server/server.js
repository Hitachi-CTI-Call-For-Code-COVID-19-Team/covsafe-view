const path = require('path');
const fs = require('fs');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const WebAppStrategy = require('ibmcloud-appid').WebAppStrategy;

const app = express();
app.use(session({
  secret: process.env.SESSION_SECRET,
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
  successRedirect: '/',
  forceLogin: false
}));
// callback to finish the authorization process
app.get('/callback', passport.authenticate(WebAppStrategy.STRATEGY_NAME));
// logout endpoint
app.get('/logout', (req, res) => {
  WebAppStrategy.logout(req);
  res.redirect('/');
});

// front-end
// we have a plan to use IBM Cloud Cloud Functions
// so that we might not be supposed to use SSR with `ReactDOMServer.renderToNodeStream`
// because a container on the Cloud Functions might create DOM when getting every requests,
// which maybe causes performance degradation.
app.use(express.static(__dirname + '/dist'));
app.get('*', passport.authenticate(WebAppStrategy.STRATEGY_NAME),
  (req, res) => {
    let base = req.originalUrl === '/' ? 'index.html' : req.originalUrl.slice(1);
    let file = path.resolve(__dirname, '../dist', base);
    // no need to be wrapped since existsSync wraps try/catch inside of itself
    if (fs.existsSync(file)) {
      return res.sendFile(path.resolve(__dirname, '../dist', base));
    }
    return res.redirect('/');
  });

app.listen(process.env.PORT, () => console.log(`listening at http://0.0.0.0:${process.env.PORT}`));