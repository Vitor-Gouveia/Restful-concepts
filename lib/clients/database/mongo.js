const mongo = require('mongodb')
const { config } = require('../../common/config')

class Mongo {
  mongo_uri = config.get('mongo_uri')

  constructor () {
    this.mongo = mongo
  }

  start () {
    return new Promise(resolve => {
      this.mongoClient = new this.mongo.MongoClient(this.mongo_uri)

      return resolve(this.mongoClient.connect())
    })
  }

  stop () {
    return new Promise(resolve => {
      if (this.mongoClient) {
        return resolve(this.mongoClient.close())
      }

      return resolve()
    })
  }
}

module.exports = {
  Mongo
}
