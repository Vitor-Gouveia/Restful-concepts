const redis = require('redis')
const { config } = require('../../common/config')

redis.createClient(config.get('redis_url'))

console.log('connected')
