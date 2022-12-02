const tv4 = require('tv4')
const { logger } = require('./logger')

const postBooks = require('./modules/books/schema.json')
const putBooks = require('./modules/books/put-books-schema.json')

const Validator = {}
const self = Validator

tv4.addSchema('post-books-request-body', postBooks)
tv4.addSchema('put-books-request-body', putBooks)

Validator.getErrorMessages = (result) => {
  const errors = result.errors.map((error) => {
    return `${error.dataPath ? `${error.dataPath} - ` : ''}${error.message}`
  })

  return errors
}

Validator.formatErrorMessage = (result) => {
  const errors = self.getErrorMessages(result)

  return `${errors.join('.\n')}.`
}

Validator.validate = (json, schemaId) => tv4.validateMultiple(json, schemaId)

const defaultValidation = (request, response, options, next) => {
  const result = Validator.validate(request.body, options.schema)

  if (!result.valid) {
    logger.error(options.message)

    if (options.responseBody === 'array') {
      return response.status(400).send(Validator.getErrorMessages(result))
    }

    return response.status(400).send(Validator.formatErrorMessage(result))
  }

  next()
}

Validator.postBooks = (request, response, next) => {
  defaultValidation(request, response, {
    message: postBooks.description,
    schema: postBooks.id
  }, next)
}

Validator.putBooks = (request, response, next) => {
  defaultValidation(request, response, {
    message: putBooks.description,
    schema: putBooks.id
  }, next)
}

Validator.getSchema = tv4.getSchema

module.exports = Validator
