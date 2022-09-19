'use strict'

if (process.env.env_config == 'dev') {
  evglUrl = '"http://localhost:8888/#/"'
  baseUrl = '"http://localhost:9804/console/"'
}
if (process.env.env_config == 'test') {
  evglUrl = '"https://frp.creatorblue.com/evglui/#/"'
  baseUrl = '"https://ip/mgr/"'
}
if (process.env.env_config == 'prod') {
  evglUrl = '""'
  baseUrl = '"https://你的域名"'
}

module.exports = {
  NODE_ENV: '"production"',
  evglUrl: evglUrl,
  baseUrl: baseUrl
}
