const { BookController } = require('./controller')
const validator = require('../../validator')

// make this scalable
const bookRoutes = (router) => {
  router.get('/books', BookController.listBooks)
  router.get('/books/:id', BookController.findById)

  router.post('/books', validator.postBooks, BookController.createBook)
  router.put('/books/:id', validator.putBooks, BookController.updateBook)
  router.delete('/books/:id', BookController.deleteBook)
}

module.exports = {
  bookRoutes
}
