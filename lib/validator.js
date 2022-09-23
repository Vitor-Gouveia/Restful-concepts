const tv4 = require('tv4')

const postCodes = require('./modules/books/schema.json')

const Validator = {}
const self = Validator

tv4.addSchema('post-codes-request-body', postCodes)

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
    response.logger.error(options.message)

    if (options.responseBody === 'array') {
      return response.status(400).send(Validator.getErrorMessages(result))
    }

    return response.status(400).send(Validator.formatErrorMessage(result))
  }

  next()
}

Validator.postCodes = (request, response, next) => {
  defaultValidation(request, response, {
    message: 'Validation schema error for POST /mpeweek/companies/codes',
    schema: postCodes.id
  }, next)
}

Validator.getSchema = tv4.getSchema

module.exports = Validator
