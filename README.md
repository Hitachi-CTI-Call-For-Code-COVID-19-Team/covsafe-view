# COVSAFE-VIEW

## How To Start

Before you kick commands shown below, please update `./build/.env` with your configurations. If you use COVSAFE/delivery/scripts, you can get App ID and bucket name from `/path/to/COVSAFE/delivery/scripts/.credentials`. Also, this requires data-proxy API service information. Please deploy it beforehand, then getting info, like API URL, and copying it to `covsafe-view/build/.env`.

### Start Locally in Debug Mode

```sh
cd /path/to/COVSAFE/covsafe-view
unset SESSION_SECRET COOKIE_SECURE CLIENT_ID TENANT_ID SECRET OAUTH_SERVER_URL REDIRECT_URI BASE_PATH
npm run start:dev
```

access to http://localhost:8080

### Start Locally in Prod Mode

```sh
cd /path/to/COVSAFE/covsafe-view
unset SESSION_SECRET COOKIE_SECURE CLIENT_ID TENANT_ID SECRET OAUTH_SERVER_URL REDIRECT_URI BASE_PATH
# set proper env values
export $(grep -v '^#' ./build/.env | xargs -0)
npm run start:prod
```

access to http://localhost:8080

## How To Build

### Debug Mode

```sh
cd /path/to/COVSAFE/covsafe-view
unset SESSION_SECRET COOKIE_SECURE CLIENT_ID TENANT_ID SECRET OAUTH_SERVER_URL REDIRECT_URI BASE_PATH
npm run build:dev

# if you run with this build with express server
# set proper env values
export $(grep -v '^#' ./build/.env | xargs -0)
unset COOKIE_SECURE BASE_PATH
npm start
```

### Prod Mode

```sh
cd /path/to/COVSAFE/covsafe-view
# set proper env values
export $(grep -v '^#' ./build/.env | xargs -0)
npm run build:prod

# if you run with this build with express server
unset COOKIE_SECURE BASE_PATH
npm start
```

## How to Deploy to IBM Cloud

after the step to prod build, do below.

```sh
# need arguments for deployment. see help message from `npm run deploy:ibm`
npm run deploy:ibm -- jp-tok c4c-covid-19 covsafe-view covsafe view create
```

## How to Dev (Tips)

- If you'd like to import CSS, please add a file linked to the target css into `app/styles/plugins/`

