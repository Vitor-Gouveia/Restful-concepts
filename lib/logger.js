class Logger {
  error (message) {
    console.log('LOGGER', message)
  }

  log (message) {
    console.log('LOGGER', message)
  }
}

const logger = new Logger()

module.exports = {
  logger
}
