const config = require('./config')
const IDatabaseResult = require('./response')
const cacheConfig = require('./cacheConfig')
module.exports = { ...config, IDatabaseResult, ...cacheConfig }
