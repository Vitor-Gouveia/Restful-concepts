const express = require('express')
const helmet = require('helmet')
const compression = require('compression')

const { name, version } = require('../../package.json')
const { config } = require('../common/config')

const { bookRoutes } = require('../modules/books/routes')
const { healthCheckRoutes } = require('../modules/heath-check/routes')

class Server {
  port = config.get('port')

  constructor () {
    this.app = express()
    this.router = express.Router()

    this.#middlewares()
    this.app.use(this.#routes())
  }

  #middlewares () {
    this.app.use(express.json())
    this.app.use(helmet())
    this.app.use(compression())
  }

  #routes () {
    const routes = new express.Router()

    bookRoutes(routes)
    healthCheckRoutes(routes)

    return routes
  }

  async start () {
    const env = config.get('node_env')

    this.httpServer = this.app.listen(this.port, () => {
      if (env === 'test') {
        return
      }

      console.log('------------------------------------------------------------------')
      console.log(`${name} - Version: ${version}`)
      console.log('------------------------------------------------------------------')
      console.log(`attention, ${env.toUpperCase()} environment!`)
      console.log('------------------------------------------------------------------')
      console.log(`Server listening on port: ${this.port}`)
      console.log('------------------------------------------------------------------')
    })

    return this.app
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
  server: new Server()
}
