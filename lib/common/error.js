class MinubizError extends Error {
  constructor ({
    statusCode, requestStatus, message, requestMessage
  }) {
    super(statusCode)

    this.statusCode = statusCode // status to be returned to the API consumer.
    this.message = message // message from application to be logged
    this.requestStatus = requestStatus // status from request to be logged
    this.requestMessage = requestMessage // message from request to be logged
  }

  static getErrorMessageForLog ({
    statusCode, message, requestStatus, requestMessage
  }) {
    let errorMessage = ''

    if (statusCode) {
      errorMessage += `\nSTATUS: ${statusCode}`
    }
    if (message) {
      errorMessage += `\nMESSAGE: ${message}`
    }

    if (requestStatus) {
      errorMessage += `\nREQUEST_STATUS: ${requestStatus}`
    }

    if (requestMessage) {
      errorMessage += `\nREQUEST_MESSAGE: ${requestMessage}`
    }
    return errorMessage
  }
}

module.exports = MinubizError
