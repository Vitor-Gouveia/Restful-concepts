const redis = require('redis')
const { config } = require('../../common/config')

class Redis {
  redis_url = config.get('redis_url')

  constructor () {
    this.redis = redis
  }

  start () {
    return new Promise(resolve => {
      this.redisClient = redis.createClient(this.redis_url)

      return resolve(this.redisClient)
    })
  }

  stop () {
    return new Promise(resolve => {
      if (this.redisClient && this.redisClient.isOpen) {
        return this.redisClient.QUIT()
      }

      return resolve()
    })
  }
}

module.exports = {
  Redis
}
