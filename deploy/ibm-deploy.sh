#!/bin/sh

set -eu

if [ $# -lt 5 ]; then
  echo "usage:"
  echo "./ibm-deploy.sh REGION RESOURCE_GROUP NAMESPACE PACKAGE ACTION CREATE_IF_WANT_TO_CREATE"
  exit 1
fi

if [ -z "${APIKEY}" ]; then
  echo "To login IBM Cloud, Please put your APIKEY into your environment variables"
  exit 1
fi

REGION=$1
RESOURCE_GROUP=$2
NAMESPACE=$3
PACKAGE=$4
ACTION=$5
CREATE=${6:-undef}

# create a zip file
SCRIPT_DIR=$(cd $(dirname $0); pwd)
WORK_DIR=${SCRIPT_DIR}/../
PACKAGE_DIR=pack

pushd .
cd ${WORK_DIR}
rm -rf ${PACKAGE_DIR}
mkdir ${PACKAGE_DIR}
cp -r dist serv ${PACKAGE_DIR}
cd ${PACKAGE_DIR}
mv serv/package.json .
npm install
zip -r app.zip .

# deploy a zip file
ibmcloud login --apikey ${APIKEY}
ibmcloud target -r ${REGION} -g ${RESOURCE_GROUP}
ibmcloud fn property set --namespace ${NAMESPACE}

if [ "${CREATE}" = "undef" ]; then
  ibmcloud fn action update ${PACKAGE}/${ACTION} app.zip --kind nodejs:10 --web raw
else
  ibmcloud fn package create ${PACKAGE}
  ibmcloud fn action create ${PACKAGE}/${ACTION} app.zip --kind nodejs:10 --web raw
fi

echo "Please access to:"
ibmcloud fn action get covsafe/view -r

popd
rm -rf ${PACKAGE_DIR}
