/// ////////////////////////////////////////////////////
//
// This file contans utility functions to initiate RestAPI Calls
//
/// //////////////////////////////////////////////////

const btoa = require('btoa');
const https = require('https');
require('dotenv').config();
const log = require('../util/logger/logger').logger;

const logger = log.getLogger('AppApi');
const vcxutil = {};

// Function: To create basic authentication header using APP ID and APP KEY
vcxutil.getBasicAuthToken = function getBasicAuthToken() {
  const { ENABLEX_APP_ID } = process.env;
  const { ENABLEX_APP_KEY } = process.env;
  const authorizationBasic = btoa(`${ENABLEX_APP_ID}:${ENABLEX_APP_KEY}`);
  return authorizationBasic;
};

// Function: To connect to Enablex Server API Service
vcxutil.connectServer = function connectServer(options, data, callback) {
  logger.info(`REQ URI:- ${options.method} ${options.host}:${options.port}${options.path}`);
  logger.info(`REQ PARAM:- ${data}`);
  const request = https.request(options, (res) => {
    res.on('data', (chunk) => {
      logger.info(`RESPONSE DATA:- ${chunk}`);
      if (chunk.result === 0) {
        callback('success', JSON.parse(chunk));
      } else {
        callback('error', JSON.parse(chunk));
      }
    });
  });
  request.on('error', (err) => {
    logger.info(`RESPONSE ERROR:- ${JSON.stringify(err)}`);
  });
  if (data == null) {
    request.end();
  } else {
    request.end(data);
  }
};
vcxutil.validAuthInvite = function validAuthInvite(data, basic) {
  const file = basic.options.users;
  let ret = false;
  if (data && data.name && data.pass) {
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < file.length; i++) {
      if (data.name === file[i].username && basic.validate(file[i].hash, data.pass)) {
        ret = true;
      }
    }
  }
  return ret;
};

module.exports = vcxutil;
