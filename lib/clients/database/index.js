const { MongoClient } = require('mongodb')
const { config } = require('../../common/config')

const mongoClient = new MongoClient(config.get('mongo_uri'))

const database = mongoClient.db('minubooks')
const books = database.collection('books')

module.exports = {
  mongoClient,
  database,
  books
}
