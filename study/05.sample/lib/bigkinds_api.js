const dotenv = require('dotenv');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

dotenv.config({path: path.join(__dirname, '../.env')})

const BIGKINDS_APIKEY = process.env.BIGKINDS_APIKEY

console.log(BIGKINDS_APIKEY);