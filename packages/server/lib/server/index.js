import express from 'express'
import helmet from 'helmet'
import compression from 'compression'

import { name, version } from '../../package.json'
import { config } from '@/common/config'

export class Server {
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
        console.log(`ATTENTION, ${env} ENVIRONMENT!`)
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
