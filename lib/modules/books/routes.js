const { BookController } = require('./controller')
const validator = require('../../validator')

// make this scalable
const bookRoutes = (router) => {
  router.get('/books', validator.postCodes, (_, response) => {
    response.logger.log('hello world')

    return response.send('hello')
  })

  router.post('/books',
    validator.postCodes,
    BookController.createBook
  )
}

module.exports = {
  bookRoutes
}
