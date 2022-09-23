const BookController = {
  createBook (_, response) {
    return response.json('book created')
  }
}

module.exports = {
  BookController
}
