const { ObjectId } = require('mongodb')
const cache = require('../../clients/cache')
const { books } = require('../../clients/database')

const MinubooksError = require('../../common/error')

const { getBooksFromCache, getBooksFromDatabase, createCacheTimeInSeconds } = require('./services/list-books')

const BookController = {
  async findById (request, response) {
    try {
      const { id: _id } = request.params

      const book = await books.findOne({
        _id: ObjectId(_id)
      })

      if (!book) {
        return response.status(400).json({
          ok: false,
          message: 'Não existe um livro com esse ID'
        })
      }

      return response.status(200).json(book)
    } catch (error) {
      console.log(error)
    }
  },
  async listBooks (_, response) {
    try {
      const cachedBooks = await getBooksFromCache()

      if (!cachedBooks) {
        const { books, expiresInDate } = await getBooksFromDatabase()

        await cache.set('cached-books', JSON.stringify({
          expiresInDate, // expire time date in milliseconds
          books
        }))

        response.setHeader('X-Total-Count', books.length)

        return response.status(200).json({
          expiresInDate,
          books
        })
      }

      // if cache expire date is in the past cache has expired and needs to be updated
      const cacheHasExpired = new Date().getTime() > cachedBooks.expiresInDate
      if (cacheHasExpired) {
        await cache.del('cached-books')
      }

      response.setHeader('X-Total-Count', cachedBooks.books.length)

      const { books, expiresInDate } = cachedBooks

      return response.status(200).json({
        expiresInDate,
        books
      })
    } catch (error) {
      console.log(error.message)
    }
  },
  async createBook (request, response) {
    const { title, pages, author } = request.body

    try {
      const bookAlreadyExists = await books.findOne({
        title
      })

      if (bookAlreadyExists) {
        return response.status(400).json({
          message: 'Livro com esse título já existe'
        })
      }

      await books.insertOne({
        title,
        pages,
        author
      })
    } catch (error) {
      if (error instanceof MinubooksError) throw error

      throw new MinubooksError({
        message: 'Internal Server Error',
        statusCode: 500
      })
    }

    return response.json(true)
  },
  async updateBook (request, response) {
    const { id } = request.params

    try {
      const book = await books.findOne({
        _id: ObjectId(id)
      })

      if (!book) {
        return response.status(400).json({
          ok: false,
          message: 'Não existe um livro com esse ID'
        })
      }

      const bookUpdateBody = request.body

      await books.findOneAndUpdate({
        _id: ObjectId(id)
      }, bookUpdateBody)

      return response.status(200).json({
        ok: true,
        message: 'Livro atualizado!'
      })
    } catch (error) {
      console.log(error)
    }
  },
  async deleteBook (request, response) {
    try {
      const { id: _id } = request.params

      const book = await books.findOne({
        _id: ObjectId(_id)
      })

      if (!book) {
        return response.status(400).json({
          ok: false,
          message: 'Não existe um livro com esse ID'
        })
      }

      await books.findOneAndDelete({
        _id: ObjectId(_id)
      })

      return response.status(200).json({
        ok: true
      })
    } catch (error) {
      console.log(error)
    }
  }
}

module.exports = {
  BookController,
  createCacheTimeInSeconds
}
