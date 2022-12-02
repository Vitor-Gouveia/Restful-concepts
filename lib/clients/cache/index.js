const redis = require('redis')
const { config } = require('../../common/config')

const client = redis.createClient(config.get('redis_url'))

module.exports = client
