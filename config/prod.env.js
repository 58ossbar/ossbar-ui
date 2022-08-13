'use strict'

if (process.env.env_config == 'dev') {
  domain = '"http://localhost:9804"'
  baseUrl = '"http://localhost:9804/console/"'
}
if (process.env.env_config == 'test') {
  domain = '"https://ip.com"'
  baseUrl = '"https://ip/mgr/"'
}
if (process.env.env_config == 'prod') {
  domain = '""'
  baseUrl = '"https://你的域名"'
}

module.exports = {
  NODE_ENV: '"production"',
  domain: domain,
  baseUrl: baseUrl
}
