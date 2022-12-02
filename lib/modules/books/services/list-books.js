const cache = require('../../../clients/cache')
const { books } = require('../../../clients/database')

const createCacheTimeInSeconds = (arrayLength = 5) => {
  const cacheTimeInSeconds = 60 * arrayLength
  const currentDate = new Date()

  currentDate.setSeconds(currentDate.getSeconds() + cacheTimeInSeconds)

  return currentDate.getTime()
}

const getBooksFromCache = async () => {
  const cachedBooksString = await cache.get('cached-books')

  if (!cachedBooksString) {
    return null
  }

  const { expiresInDate, books } = JSON.parse(cachedBooksString)

  return {
    expiresInDate,
    books
  }
}

const getBooksFromDatabase = async () => {
  const allBooks = await books.find({}).toArray()
  const expiresInDate = createCacheTimeInSeconds(allBooks.length)

  return {
    books: allBooks,
    expiresInDate
  }
}

module.exports = {
  getBooksFromDatabase,
  getBooksFromCache,
  createCacheTimeInSeconds
}
