const express = require('express')
const helmet = require('helmet')
const compression = require('compression')

const { name, version } = require('../../package.json')
const { config } = require('../common/config')
const { Logger } = require('../logger')

class Server {
  port = config.get('port')

  constructor () {
    this.app = express()
    this.router = express.Router()

    this.#middlewares()
    this.#routes()
  }

  #middlewares () {
    this.app.use(express.json())
    this.app.use(helmet())
    this.app.use(compression())
    this.app.use((_, response, next) => {
      response.logger = new Logger()

      next()
    })
  }

  #routes () {
  }

  start () {
    return new Promise((resolve) => {
      const env = config.get('env')

      this.httpServer = this.app.listen(this.port, () => {
        console.log('------------------------------------------------------------------')
        console.log(`${name} - Version: ${version}`)
        console.log('------------------------------------------------------------------')
        console.log(`attention, ${env.toUpperCase()} environment!`)
        console.log('------------------------------------------------------------------')
        console.log(`Server listening on port: ${this.port}`)
        console.log('------------------------------------------------------------------')

        return resolve(this.app)
      })
    })
  }

  stop () {
    return new Promise((resolve) => {
      if (this.httpServer) {
        return this.httpServer.close(resolve)
      }
      return resolve()
    })
  }
}

module.exports = {
  Server
}
